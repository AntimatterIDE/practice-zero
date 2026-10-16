import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { MARKETING_GOLIVE_KNOWLEDGE } from "@/lib/marketing/golive-knowledge";
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

const SYSTEM = `You are the Practice Zero marketing go-live assistant inside the admin panel.
Your only job: help the operator complete analytics, Google Ads, Semrush, Instantly cold email, Supabase attribution, and env setup so acquisition is live.

Rules:
- Answer from the go-live brief below. Be concrete and ordered.
- Never invent secrets, Measurement IDs, or spend numbers.
- Never request PHI or patient lists with clinical fields.
- Cold email guidance must include CAN-SPAM basics when relevant.
- When pointing at site pages, you may write paths like /admin/leads or /specialties/orthopedics.
- If OPENAI is down, the API may return a fallback — still be useful.

GO-LIVE BRIEF:
${MARKETING_GOLIVE_KNOWLEDGE}`;

function fallbackAnswer(lastUser: string) {
  const q = lastUser.toLowerCase();
  if (q.includes("supabase") || q.includes("migration") || q.includes("column")) {
    return [
      "Run the attribution migration first:",
      "1. Open Supabase → SQL editor",
      "2. Paste and run supabase/migrations/002_consultation_leads_attribution.sql",
      "3. Reload /admin/leads and confirm specialty / campaign show on new submissions",
    ].join("\n");
  }
  if (q.includes("ga4") || q.includes("analytics") || q.includes("posthog") || q.includes("gtm")) {
    return [
      "Analytics go-live:",
      "1. Create GA4 → set NEXT_PUBLIC_GA_MEASUREMENT_ID",
      "2. Optional GTM → NEXT_PUBLIC_GTM_ID",
      "3. PostHog project key → NEXT_PUBLIC_POSTHOG_KEY",
      "4. Search Console HTML tag → NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION",
      "5. Redeploy, then mark contact_submit and demo_open as conversions",
    ].join("\n");
  }
  if (q.includes("instantly") || q.includes("cold") || q.includes("email") || q.includes("domain")) {
    return [
      "Cold email go-live:",
      "1. Buy 2–3 sending domains (not practicezero.com for blasts)",
      "2. Workspace mailboxes + SPF/DKIM/DMARC → Instantly warmup 2–3 weeks",
      "3. Verify list ≥95% deliverable",
      "4. Load marketing/cold-email/sequence.md",
      "5. Webhook → /api/webhooks/instantly with INSTANTLY_WEBHOOK_SECRET",
    ].join("\n");
  }
  if (q.includes("ads") || q.includes("google")) {
    return [
      "Google Ads go-live:",
      "1. Link Ads ↔ GA4; import contact_submit (primary) and demo_open",
      "2. Start Brand + Category Search only",
      "3. Land on specialty or /pricing — see marketing/google-ads/campaigns.md",
      "4. Expand specialty keywords after ~30 consultations",
    ].join("\n");
  }
  return [
    "I can walk you through making marketing live. Pick a lane:",
    "A) Supabase migration",
    "B) Env vars / analytics (GA4, GTM, PostHog, Search Console)",
    "C) Google Ads",
    "D) Instantly cold email",
    "E) Semrush / SEO",
    "Or say “what’s next” and I’ll start from A.",
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
      temperature: 0.3,
      max_tokens: 700,
    });

    if (!result.ok || !result.content) {
      return NextResponse.json({
        reply: fallbackAnswer(lastUser),
        usedModel: false,
      });
    }

    return NextResponse.json({ reply: result.content, usedModel: true });
  } catch (error) {
    console.error("admin marketing chat", error);
    return NextResponse.json({
      reply: fallbackAnswer(lastUser),
      usedModel: false,
    });
  }
}
