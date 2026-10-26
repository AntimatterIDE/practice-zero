import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { COMPLIANCE_KNOWLEDGE } from "@/lib/compliance/knowledge";
import { COMPLIANCE_TRACKS } from "@/lib/compliance/tasks";
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
  progress: z
    .object({
      completedSteps: z.number().int().min(0),
      totalSteps: z.number().int().min(0),
      nextTrackNumber: z.number().int().min(1).optional(),
      nextTrackTitle: z.string().max(200).optional(),
      nextStepTitle: z.string().max(200).optional(),
      incompleteKeys: z.array(z.string().max(120)).max(40).optional(),
    })
    .optional(),
});

function taskCatalog() {
  return COMPLIANCE_TRACKS.map((track) => {
    const steps = track.steps
      .map((step, i) => {
        const links =
          step.links?.map((l) => `${l.label}<${l.href}>`).join("; ") ?? "";
        return `  ${track.number}.${i + 1} [${step.id}] ${step.title} ${step.detail}${
          step.cost ? ` Cost: ${step.cost}.` : ""
        }${links ? ` Links: ${links}` : ""}`;
      })
      .join("\n");
    return `Track ${track.number} [${track.id}] ${track.badge} ${track.title}\n${track.summary}\nSteps:\n${steps}`;
  }).join("\n\n");
}

const SYSTEM = `You are the Practice Zero compliance assistant inside the admin panel.
Your only job: help the operator complete the numbered compliance tracks and steps so marketing claims (HIPAA, SOC 2 Type II, AES-256, BAA available, 99.9% uptime) are backed by real evidence.

Rules:
- Refer to tracks by number and title (e.g. Track 1 Quick wins) and steps as N.M (e.g. 1.4).
- Give the next concrete action for the incomplete step they ask about; one decision at a time when blocked.
- Never invent BAA signatures, SOC 2 report dates, uptime %, or certifications.
- Never request PHI or patient lists.
- Prefer free / this-week steps before expensive Supabase HIPAA spend while the product is still demo-first.
- Paths like /admin/compliance are fine.
- When they say "what's next", use the progress snapshot if provided.
- Include the most relevant vendor URL when telling them where to click.

COMPLIANCE BRIEF:
${COMPLIANCE_KNOWLEDGE}

TRACK CATALOG (source of truth for steps):
${taskCatalog()}`;

function fallbackAnswer(
  lastUser: string,
  progress?: z.infer<typeof bodySchema>["progress"],
) {
  const q = lastUser.toLowerCase();
  if (q.includes("next") || q.includes("what’s next") || q.includes("whats next")) {
    if (progress?.nextTrackNumber && progress.nextStepTitle) {
      return [
        `Next up: Track ${progress.nextTrackNumber} ${progress.nextTrackTitle}.`,
        `Step: ${progress.nextStepTitle}`,
        `You're ${progress.completedSteps}/${progress.totalSteps} steps checked. Open that track on the left, or ask for a walkthrough.`,
      ].join("\n");
    }
    return "All checklist steps are marked done. Re-review Track 5 (HIPAA) and Track 6 (SOC 2) before putting unqualified badges on the marketing site.";
  }
  if (q.includes("vercel") || q.includes("host")) {
    return [
      "Track 1 step 1.4 / Track 3 Vercel HIPAA BAA:",
      "Pro team → Settings → Billing → Add-ons → HIPAA BAA ($350/mo).",
      "Docs: https://vercel.com/kb/guide/hipaa-compliance-guide-vercel",
    ].join("\n");
  }
  if (q.includes("openai") || q.includes("baa") && q.includes("ai")) {
    return [
      "Track 1 OpenAI API BAA:",
      "Email baa@openai.com with company + use case.",
      "Request Modified Retention / ZDR before any PHI in models.",
      "https://help.openai.com/en/articles/8660679",
    ].join("\n");
  }
  if (q.includes("supabase") || q.includes("hipaa")) {
    return [
      "HIPAA on Supabase is Track 3 + Track 5:",
      "Defer Team+HIPAA (~$1k+/mo) until real ePHI is server-persisted.",
      "Today: leads are PII; /try charts are localStorage demo.",
      "https://supabase.com/docs/guides/security/hipaa-compliance",
    ].join("\n");
  }
  if (q.includes("uptime") || q.includes("99.9") || q.includes("sla")) {
    return [
      "Track 4 99.9% uptime:",
      "1) Define SLA scope",
      "2) Better Stack monitors + status page (start history now)",
      "3) On-call + monthly uptime export",
      "4) Include Availability in SOC 2 scope",
    ].join("\n");
  }
  if (q.includes("soc") || q.includes("vanta") || q.includes("drata") || q.includes("sprinto")) {
    return [
      "Track 6 SOC 2 Type II:",
      "Pick GRC (Secureframe / Sprinto / Vanta), connect GitHub+Vercel+Workspace,",
      "run controls 6–12 months, then CPA Type II ($15–30k typical).",
      "Tooling ≠ the certificate the auditor issues the report.",
    ].join("\n");
  }
  if (q.includes("aes") || q.includes("encrypt")) {
    return [
      "Track 2 AES-256:",
      "Cite Vercel + Supabase at-rest encryption on a Security page.",
      "TLS in transit via HTTPS/HSTS already.",
      "App-level KMS only when real PHI columns exist.",
    ].join("\n");
  }
  return [
    "Ask about a track number (1–7), tap Help on a step, or say “what’s next”.",
    "1 Quick wins · 2 AES-256 · 3 BAA · 4 Uptime · 5 HIPAA · 6 SOC 2 · 7 Budget",
  ].join("\n");
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid messages." }, { status: 400 });
  }

  const { messages, progress } = parsed.data;
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

  const progressBlock = progress
    ? `\n\nOPERATOR PROGRESS SNAPSHOT:\n- Steps done: ${progress.completedSteps}/${progress.totalSteps}\n- Next: ${
        progress.nextTrackNumber
          ? `Track ${progress.nextTrackNumber} ${progress.nextTrackTitle} / step “${progress.nextStepTitle}”`
          : "all steps marked complete"
      }${
        progress.incompleteKeys?.length
          ? `\n- Incomplete keys (sample): ${progress.incompleteKeys.slice(0, 12).join(", ")}`
          : ""
      }`
    : "";

  if (!getOpenAIApiKey()) {
    return NextResponse.json({
      reply: fallbackAnswer(lastUser, progress),
      usedModel: false,
    });
  }

  try {
    const result = await chatCompletion({
      system: SYSTEM + progressBlock,
      messages,
      temperature: 0.3,
      max_tokens: 700,
    });

    if (!result.ok || !result.content) {
      return NextResponse.json({
        reply: fallbackAnswer(lastUser, progress),
        usedModel: false,
      });
    }

    return NextResponse.json({ reply: result.content, usedModel: true });
  } catch (error) {
    console.error("admin compliance chat", error);
    return NextResponse.json({
      reply: fallbackAnswer(lastUser, progress),
      usedModel: false,
    });
  }
}
