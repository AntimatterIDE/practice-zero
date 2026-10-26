import { NextResponse } from "next/server";
import { z } from "zod";
import { formatCtaMarker } from "@/lib/chat/cta";
import { PRACTICE_ZERO_KNOWLEDGE } from "@/lib/chat/knowledge";
import { chatCompletion, getOpenAIApiKey } from "@/lib/openai";

export const runtime = "nodejs";
export const maxDuration = 30;

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
});

const SYSTEM = `You are the Practice Zero site assistant a concise, helpful guide on the marketing site.
Answer only from the product brief below. Prefer short paragraphs (2–4 sentences) or tight bullets.

CTAs (required format):
- Never write raw paths like /contact or /try inside sentences.
- Do not say "visit /contact", "use /try", or similar.
- When suggesting a next step, append one or more markers on their own lines at the end:
  [[cta:Label|/path]]
- Allowed paths only: /contact, /try, /portal, /pricing, /onboarding, /ai, /research, /ehr, /billing
- Example: [[cta:Request a consultation|/contact]]
- Example: [[cta:Try the demo|/try]]

Never collect PHI. If someone starts sharing clinical or insurance details, redirect them to contact the practice and append a consultation CTA do not store or repeat sensitive identifiers.
If the question is outside Practice Zero, say so briefly and offer a consultation CTA.

PRODUCT BRIEF:
${PRACTICE_ZERO_KNOWLEDGE}`;

function fallbackAnswer(lastUser: string) {
  const q = lastUser.toLowerCase();
  const contact = formatCtaMarker("Request a consultation", "/contact");
  const demo = formatCtaMarker("Try the demo", "/try");
  const portal = formatCtaMarker("See patient experience", "/portal");
  const ai = formatCtaMarker("Learn about agents", "/ai");

  if (q.includes("price") || q.includes("cost") || q.includes("fee")) {
    return `EHR, billing, and marketing are included at no additional license fee when you route collections through Practice Zero under a one-year billing agreement. Optional ad spend is separate. Request a consultation to size it for your practice.\n${contact}`;
  }
  if (q.includes("demo") || q.includes("try")) {
    return `Open the interactive morning board, or see the patient experience. For a live walkthrough of agents on your workflows, request a consultation.\n${demo}\n${portal}\n${contact}`;
  }
  if (q.includes("office manager") || q.includes("hardware") || q.includes("agent")) {
    return `Practice Zero is an agentic EHR: agents can own scheduling, follow-ups, claims, and payment tracking under your rules. You can run with space and optional room hardware that records visits without staffing every clerical loop.\n${ai}`;
  }
  return `Practice Zero is an agentic EHR for independent practices chart, billing, and outreach on one morning board.\n${demo}\n${contact}`;
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid messages." }, { status: 400 });
  }

  const messages = parsed.data.messages;
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

  if (!getOpenAIApiKey()) {
    return NextResponse.json({
      reply: fallbackAnswer(lastUser),
      usedModel: false,
    });
  }

  try {
    const result = await chatCompletion({
      system: SYSTEM,
      messages,
      temperature: 0.35,
      max_tokens: 500,
    });

    if (!result.ok || !result.content) {
      return NextResponse.json({
        reply: fallbackAnswer(lastUser),
        usedModel: false,
      });
    }

    return NextResponse.json({ reply: result.content, usedModel: true });
  } catch (error) {
    console.error("chat route", error);
    return NextResponse.json({
      reply: fallbackAnswer(lastUser),
      usedModel: false,
    });
  }
}
