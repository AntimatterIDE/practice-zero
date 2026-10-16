import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { MARKETING_GOLIVE_KNOWLEDGE } from "@/lib/marketing/golive-knowledge";
import { GOLIVE_TASKS } from "@/lib/marketing/golive-tasks";
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
      nextTaskNumber: z.number().int().min(1).optional(),
      nextTaskTitle: z.string().max(200).optional(),
      nextStepTitle: z.string().max(200).optional(),
    })
    .optional(),
});

function taskCatalog() {
  return GOLIVE_TASKS.map((task) => {
    const steps = task.steps
      .map((step, i) => `  ${task.number}.${i + 1} [${step.id}] ${step.title} — ${step.detail}`)
      .join("\n");
    return `Task ${task.number} [${task.id}] ${task.title}\n${task.summary}${
      task.docs ? `\nDocs: ${task.docs}` : ""
    }\nSteps:\n${steps}`;
  }).join("\n\n");
}

const SYSTEM = `You are the Practice Zero marketing go-live assistant inside the admin panel.
Your only job: help the operator complete the numbered tasks and their separate steps so acquisition is live.

Rules:
- Refer to tasks by number and title (e.g. Task 3 — GA4, GTM & Search Console) and steps as N.M (e.g. 3.2).
- Give the next concrete action for the incomplete step they ask about; one decision at a time when blocked.
- Never invent secrets, Measurement IDs, or spend numbers.
- Never request PHI or patient lists with clinical fields.
- Cold email guidance must include CAN-SPAM basics when relevant.
- Paths like /admin/leads or /specialties/orthopedics are fine.
- When they say "what's next", use the progress snapshot if provided.

GO-LIVE BRIEF:
${MARKETING_GOLIVE_KNOWLEDGE}

TASK CATALOG (source of truth for steps):
${taskCatalog()}`;

function fallbackAnswer(lastUser: string, progress?: z.infer<typeof bodySchema>["progress"]) {
  const q = lastUser.toLowerCase();
  if (q.includes("next") || q.includes("what’s next") || q.includes("whats next")) {
    if (progress?.nextTaskNumber && progress.nextStepTitle) {
      return [
        `Next up: Task ${progress.nextTaskNumber} — ${progress.nextTaskTitle}.`,
        `Step: ${progress.nextStepTitle}`,
        `You're ${progress.completedSteps}/${progress.totalSteps} steps done. Open that task on the left, or ask for a walkthrough of that step.`,
      ].join("\n");
    }
    return "All tracked steps look complete. Re-check Task 10 QA if anything still feels unverified.";
  }
  if (q.includes("supabase") || q.includes("migration") || q.includes("column")) {
    return [
      "Task 1 — Supabase attribution migration:",
      "1.1 Open Supabase SQL editor",
      "1.2 Run supabase/migrations/002_consultation_leads_attribution.sql",
      "1.3 Confirm specialty / campaign / utm_* columns",
      "1.4 Reload /admin/leads",
    ].join("\n");
  }
  if (q.includes("ga4") || q.includes("analytics") || q.includes("posthog") || q.includes("gtm")) {
    return [
      "Tasks 2–4 cover measurement:",
      "Task 2: set NEXT_PUBLIC_GA_MEASUREMENT_ID, GTM, PostHog, Search Console token, Instantly secret → redeploy",
      "Task 3: create GA4/GTM, verify Search Console, submit sitemap, mark contact_submit + demo_open",
      "Task 4: PostHog funnel page_view → demo_open → contact_submit",
    ].join("\n");
  }
  if (q.includes("instantly") || q.includes("cold") || q.includes("email") || q.includes("domain")) {
    return [
      "Tasks 7–9 — cold email:",
      "7: sending domains, DNS, Instantly warmup 14–21 days",
      "8: verify list, load sequence.md + specialty variants, UTMs, ramp",
      "9: webhook POST /api/webhooks/instantly with Bearer INSTANTLY_WEBHOOK_SECRET",
    ].join("\n");
  }
  if (q.includes("ads") || q.includes("google")) {
    return [
      "Task 5 — Google Ads Wave 1:",
      "5.1 Account ready",
      "5.2 Link GA4; import contact_submit + demo_open",
      "5.3 Brand Search",
      "5.4 Category Search",
      "5.5 Hold specialty keywords until ~30 consultations",
      "See marketing/google-ads/campaigns.md",
    ].join("\n");
  }
  return [
    "Ask about a task number (1–10), tap Help on a step, or say “what’s next”.",
    "1 Supabase · 2 Env · 3 GA4/GSC · 4 PostHog · 5 Ads · 6 Semrush · 7 Domains · 8 List/sequence · 9 Webhook · 10 QA",
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
        progress.nextTaskNumber
          ? `Task ${progress.nextTaskNumber} — ${progress.nextTaskTitle} / step “${progress.nextStepTitle}”`
          : "all steps marked complete"
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
    console.error("admin marketing chat", error);
    return NextResponse.json({
      reply: fallbackAnswer(lastUser, progress),
      usedModel: false,
    });
  }
}
