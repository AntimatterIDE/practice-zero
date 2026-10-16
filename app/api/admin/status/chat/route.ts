import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { describeLanes } from "@/lib/status/brief";
import { chatCompletion, getOpenAIApiKey } from "@/lib/openai";

export const runtime = "nodejs";
export const maxDuration = 30;

const checkSchema = z.object({
  label: z.string().max(200),
  detail: z.string().max(500),
  state: z.enum(["done", "open", "later"]),
});

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(4000),
      }),
    )
    .min(1)
    .max(24),
  snapshot: z.object({
    sentence: z.string().max(800),
    lanes: z
      .array(
        z.object({
          id: z.enum(["marketing", "compliance", "funding"]),
          title: z.string().max(40),
          href: z.string().max(80),
          headline: z.string().max(400),
          checks: z.array(checkSchema).max(8),
        }),
      )
      .max(3),
  }),
});

const SYSTEM = `You are the Practice Zero status assistant on the admin Status page.
An executive will look for a few seconds. Answer in short sentences. Lead with the answer.

Rules:
- Use only the snapshot. Never invent signed BAAs, SOC 2 dates, uptime percentages, signed practices, or revenue that is not in the snapshot.
- "done" means the underlying desk already shows it. "later" means deferred on purpose. "open" means it still needs work.
- Point to /admin/marketing, /admin/compliance, or /admin/funding when they should go deeper.
- Never request PHI or patient lists.
- The funding numbers are a planning model, not booked revenue.
- The product today is a marketing site plus a browser-local demo. Real charts are not on the server yet.`;

function fallbackAnswer(lastUser: string, snapshot: z.infer<typeof bodySchema>["snapshot"]) {
  const q = lastUser.toLowerCase();
  const lane = (id: "marketing" | "compliance" | "funding") =>
    snapshot.lanes.find((item) => item.id === id);

  if (q.includes("money") || q.includes("fund") || q.includes("cash") || q.includes("runway")) {
    const funding = lane("funding");
    return funding
      ? `${funding.headline} Open /admin/funding to change the raise, the take rate, or the sign curve.`
      : snapshot.sentence;
  }
  if (q.includes("hipaa") || q.includes("soc") || q.includes("compliance") || q.includes("baa") || q.includes("claim")) {
    const compliance = lane("compliance");
    return compliance
      ? `${compliance.headline} Badges on the site wait until those checks are done. Open /admin/compliance.`
      : snapshot.sentence;
  }
  if (q.includes("market") || q.includes("ads") || q.includes("email") || q.includes("lead")) {
    const marketing = lane("marketing");
    return marketing
      ? `${marketing.headline} Open /admin/marketing for the step list.`
      : snapshot.sentence;
  }
  return [
    snapshot.sentence,
    ...snapshot.lanes.map((item) => `${item.title}: ${item.headline}`),
    "Open Marketing, Compliance, or Funding for the full list.",
  ].join("\n");
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid message." }, { status: 400 });
  }

  const { messages, snapshot } = parsed.data;
  const lastUser = [...messages].reverse().find((message) => message.role === "user")?.content ?? "";
  const snapshotBlock = `\n\nPAGE SNAPSHOT:\n${snapshot.sentence}\n\n${describeLanes(snapshot.lanes)}`;

  if (!getOpenAIApiKey()) {
    return NextResponse.json({
      reply: fallbackAnswer(lastUser, snapshot),
      usedModel: false,
    });
  }

  try {
    const result = await chatCompletion({
      system: SYSTEM + snapshotBlock,
      messages,
      temperature: 0.3,
      max_tokens: 500,
    });
    if (!result.ok || !result.content) {
      return NextResponse.json({
        reply: fallbackAnswer(lastUser, snapshot),
        usedModel: false,
      });
    }
    return NextResponse.json({ reply: result.content, usedModel: true });
  } catch (error) {
    console.error("admin status chat", error);
    return NextResponse.json({
      reply: fallbackAnswer(lastUser, snapshot),
      usedModel: false,
    });
  }
}
