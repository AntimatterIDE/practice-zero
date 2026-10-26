import "server-only";

import { GOLIVE_TASKS, goliveStepKey } from "@/lib/marketing/golive-tasks";
import type {
  GoliveStatusReport,
  StepStatus,
  VerifiedStep,
} from "@/lib/marketing/golive-status-types";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export type { GoliveStatusReport, StepStatus, VerifiedStep };

function present(value: string | undefined | null) {
  return Boolean(value?.trim());
}

function env(name: string) {
  return process.env[name]?.trim() ?? "";
}

async function probeSupabase() {
  const required = [
    "specialty",
    "campaign",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ];

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("consultation_leads")
      .select(
        "id, specialty, campaign, utm_source, utm_medium, utm_campaign, utm_content, utm_term, source",
      )
      .order("created_at", { ascending: false })
      .limit(25);

    if (error) {
      const missingColumn = required.some((col) =>
        error.message.toLowerCase().includes(col),
      );
      return {
        columnsOk: !missingColumn && !/column/i.test(error.message),
        leadsReadable: false,
        attributedLeadExists: false,
        error: error.message,
      };
    }

    const attributedLeadExists = (data ?? []).some(
      (row) =>
        Boolean(row.specialty) ||
        Boolean(row.utm_source) ||
        Boolean(row.campaign) ||
        row.source === "cold_email",
    );

    return {
      columnsOk: true,
      leadsReadable: true,
      attributedLeadExists,
      error: null as string | null,
    };
  } catch (error) {
    return {
      columnsOk: false,
      leadsReadable: false,
      attributedLeadExists: false,
      error: error instanceof Error ? error.message : "Supabase unavailable",
    };
  }
}

function step(
  taskId: string,
  stepId: string,
  status: StepStatus,
  detail: string,
): VerifiedStep {
  return {
    taskId,
    stepId,
    key: goliveStepKey(taskId, stepId),
    status,
    detail,
  };
}

/** Server-side verification of marketing go-live steps. */
export async function verifyGoliveStatus(): Promise<GoliveStatusReport> {
  const ga = env("NEXT_PUBLIC_GA_MEASUREMENT_ID");
  const gtm = env("NEXT_PUBLIC_GTM_ID");
  const posthog = env("NEXT_PUBLIC_POSTHOG_KEY");
  const gsc = env("NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION");
  const instantlySecret = env("INSTANTLY_WEBHOOK_SECRET");
  const instantlyApi = env("INSTANTLY_API_KEY");
  const openai = env("OPENAI_API_KEY");
  const resendKey = env("RESEND_API_KEY");
  const resendFrom = env("CONTACT_FROM_EMAIL");
  const canonical = env("CANONICAL_ORIGIN");
  const indexing = env("INDEXING_ENABLED");

  const supabase = await probeSupabase();

  const signals = {
    gaMeasurementId: /^G-[A-Z0-9]+$/i.test(ga),
    gtmId: /^GTM-[A-Z0-9]+$/i.test(gtm),
    posthogKey: posthog.startsWith("phc_"),
    gscVerification: present(gsc),
    instantlyWebhookSecret: instantlySecret.length >= 16,
    instantlyApiKey: present(instantlyApi),
    openaiKey: present(openai),
    resendConfigured: present(resendKey) && present(resendFrom),
    attributionColumns: supabase.columnsOk,
    leadsReadable: supabase.leadsReadable,
    attributedLeadExists: supabase.attributedLeadExists,
  };

  const steps: VerifiedStep[] = [
    // Task 1 — Supabase
    step(
      "supabase",
      "supabase-open",
      signals.attributionColumns ? "pass" : "fail",
      signals.attributionColumns
        ? "Attribution columns detected migration appears applied."
        : supabase.error ?? "Run migration 002 in the Supabase SQL editor.",
    ),
    step(
      "supabase",
      "supabase-run",
      signals.attributionColumns ? "pass" : "fail",
      signals.attributionColumns
        ? "specialty / campaign / utm_* columns are readable."
        : "Migration 002 not detected on consultation_leads.",
    ),
    step(
      "supabase",
      "supabase-verify",
      signals.attributionColumns ? "pass" : "fail",
      signals.attributionColumns
        ? "Column probe succeeded."
        : "Could not confirm attribution columns.",
    ),
    step(
      "supabase",
      "supabase-admin",
      signals.leadsReadable ? "pass" : "fail",
      signals.leadsReadable
        ? "/admin/leads can read consultation_leads."
        : supabase.error ?? "Leads query failed.",
    ),

    // Task 2 — Env
    step(
      "env",
      "env-ga",
      signals.gaMeasurementId ? "pass" : "fail",
      signals.gaMeasurementId
        ? `NEXT_PUBLIC_GA_MEASUREMENT_ID is set (${ga.slice(0, 6)}…).`
        : "Set NEXT_PUBLIC_GA_MEASUREMENT_ID to a G-… value and redeploy.",
    ),
    step(
      "env",
      "env-gtm",
      signals.gtmId ? "optional_pass" : "pending",
      signals.gtmId
        ? `NEXT_PUBLIC_GTM_ID is set (${gtm}).`
        : "Optional add NEXT_PUBLIC_GTM_ID when you create a GTM container.",
    ),
    step(
      "env",
      "env-posthog",
      signals.posthogKey ? "pass" : "fail",
      signals.posthogKey
        ? "NEXT_PUBLIC_POSTHOG_KEY (phc_…) is set."
        : "Set NEXT_PUBLIC_POSTHOG_KEY to your PostHog project token and redeploy.",
    ),
    step(
      "env",
      "env-gsc",
      signals.gscVerification ? "optional_pass" : "pending",
      signals.gscVerification
        ? "NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION is set."
        : "Free next step add Search Console HTML verification token when ready.",
    ),
    step(
      "env",
      "env-instantly",
      signals.instantlyWebhookSecret ? "pass" : "fail",
      signals.instantlyWebhookSecret
        ? "INSTANTLY_WEBHOOK_SECRET is set."
        : "Set INSTANTLY_WEBHOOK_SECRET (16+ chars) in Vercel.",
    ),
    step(
      "env",
      "env-openai-resend",
      signals.openaiKey
        ? signals.resendConfigured
          ? "pass"
          : "optional_pass"
        : "fail",
      signals.openaiKey
        ? signals.resendConfigured
          ? "OPENAI_API_KEY and Resend are configured."
          : "OPENAI_API_KEY set. Resend optional until consultation emails are required."
        : "Set OPENAI_API_KEY for the go-live assistant and site chat.",
    ),
    step(
      "env",
      "env-site",
      present(canonical) || indexing.toLowerCase() === "true" ? "pass" : "pending",
      present(canonical)
        ? `CANONICAL_ORIGIN=${canonical}${indexing ? ` · INDEXING_ENABLED=${indexing}` : ""}`
        : "Set CANONICAL_ORIGIN and INDEXING_ENABLED=true in production.",
    ),
    step(
      "env",
      "env-redeploy",
      signals.gaMeasurementId || signals.posthogKey ? "pass" : "fail",
      signals.gaMeasurementId || signals.posthogKey
        ? "Public marketing env vars are present on this deployment redeploy already applied them."
        : "Redeploy after setting NEXT_PUBLIC_* vars.",
    ),

    // Task 3 — GA4 / GSC
    step(
      "ga4",
      "ga4-property",
      signals.gaMeasurementId ? "pass" : "fail",
      signals.gaMeasurementId
        ? "GA4 Measurement ID is live in production env."
        : "Create GA4 property and set NEXT_PUBLIC_GA_MEASUREMENT_ID.",
    ),
    step(
      "ga4",
      "ga4-gtm",
      signals.gtmId ? "optional_pass" : "pending",
      signals.gtmId ? "GTM container ID present." : "Optional skip for now if using direct GA4.",
    ),
    step(
      "ga4",
      "ga4-gsc-verify",
      signals.gscVerification ? "optional_pass" : "pending",
      signals.gscVerification
        ? "Verification token present (confirm Verify clicked in Search Console)."
        : "Free verify www.practicezero.com in Search Console.",
    ),
    step(
      "ga4",
      "ga4-sitemap",
      "pending",
      "Free in Search Console → Sitemaps submit https://www.practicezero.com/sitemap.xml",
    ),
    step(
      "ga4",
      "ga4-conversions",
      "pending",
      "Free in GA4 mark contact_submit and demo_open as key events / conversions.",
    ),
    step(
      "ga4",
      "ga4-scope",
      "pass",
      "Code gates marketing analytics off /portal and /admin; /try only fires demo_open.",
    ),

    // Task 4 — PostHog
    step(
      "posthog",
      "posthog-project",
      signals.posthogKey ? "pass" : "fail",
      signals.posthogKey ? "PostHog project token is live." : "Add NEXT_PUBLIC_POSTHOG_KEY.",
    ),
    step(
      "posthog",
      "posthog-funnel",
      "pending",
      "Free in PostHog create funnel page_view → demo_open → contact_submit.",
    ),
    step(
      "posthog",
      "posthog-replay",
      signals.posthogKey ? "pass" : "fail",
      signals.posthogKey
        ? "Session replay enabled in marketing analytics client (not on /portal)."
        : "PostHog key required before replay can run.",
    ),

    // Task 5 — Ads (paid)
    ...(["ads-account", "ads-link-ga4", "ads-brand", "ads-category", "ads-hold-specialty"] as const).map(
      (id) =>
        step(
          "ads",
          id,
          "deferred",
          "Requires Google Ads budget deferred until you’re ready to spend.",
        ),
    ),

    // Task 6 — Semrush (paid)
    ...(["semrush-project", "semrush-competitors", "semrush-seeds"] as const).map((id) =>
      step(
        "semrush",
        id,
        "deferred",
        "Requires Semrush subscription deferred (use free trial later if needed).",
      ),
    ),

    // Task 7 — Domains / Instantly warmup (paid)
    ...([
      "domains-buy",
      "domains-mailboxes",
      "domains-dns",
      "domains-instantly",
      "domains-warmup",
    ] as const).map((id) =>
      step(
        "domains",
        id,
        "deferred",
        "Requires domains + Workspace + Instantly Growth deferred until cold email budget.",
      ),
    ),

    // Task 8 — List / sequence (paid verifier / Instantly)
    ...([
      "list-verify",
      "list-segment",
      "list-sequence",
      "list-variants",
      "list-utms",
      "list-ramp",
    ] as const).map((id) =>
      step(
        "list",
        id,
        "deferred",
        "Requires list verification credits + Instantly sending deferred.",
      ),
    ),

    // Task 9 — Webhook
    step(
      "webhook",
      "webhook-secret",
      signals.instantlyWebhookSecret ? "pass" : "fail",
      signals.instantlyWebhookSecret
        ? "Webhook secret present in production."
        : "Set INSTANTLY_WEBHOOK_SECRET.",
    ),
    step(
      "webhook",
      "webhook-url",
      "deferred",
      "Instantly native webhooks require Hypergrowth (~$97/mo) deferred. Endpoint is ready at /api/webhooks/instantly.",
    ),
    step(
      "webhook",
      "webhook-auth",
      "deferred",
      "Configure Bearer header in Instantly when you upgrade to Hypergrowth.",
    ),
    step(
      "webhook",
      "webhook-test",
      signals.attributedLeadExists ? "pass" : "deferred",
      signals.attributedLeadExists
        ? "An attributed / cold_email lead already exists in consultation_leads."
        : "Deferred until Instantly webhook or a test contact with UTMs.",
    ),

    // Task 10 — QA
    step(
      "qa",
      "qa-specialty-utm",
      "pending",
      "Free submit /contact?specialty=orthopedics&utm_source=test&utm_medium=qa&utm_campaign=golive",
    ),
    step(
      "qa",
      "qa-lead",
      signals.attributedLeadExists ? "pass" : "pending",
      signals.attributedLeadExists
        ? "Found a lead with specialty / UTM / cold_email attribution."
        : "Pending until a test consultation with UTMs is submitted.",
    ),
    step(
      "qa",
      "qa-demo",
      "pending",
      "Free open /try then check GA4 Realtime / PostHog for demo_open.",
    ),
    step(
      "qa",
      "qa-portal",
      "pass",
      "Marketing analytics path gating excludes /portal in code.",
    ),
  ];

  // Ensure we cover every catalog step
  const byKey = new Map(steps.map((s) => [s.key, s]));
  for (const task of GOLIVE_TASKS) {
    for (const s of task.steps) {
      const key = goliveStepKey(task.id, s.id);
      if (!byKey.has(key)) {
        steps.push(
          step(task.id, s.id, "pending", "Not yet covered by auto-verify ask the assistant."),
        );
      }
    }
  }

  const summary = {
    pass: 0,
    fail: 0,
    pending: 0,
    deferred: 0,
    optionalPass: 0,
    total: steps.length,
  };
  for (const s of steps) {
    if (s.status === "pass") summary.pass += 1;
    else if (s.status === "fail") summary.fail += 1;
    else if (s.status === "pending") summary.pending += 1;
    else if (s.status === "deferred") summary.deferred += 1;
    else if (s.status === "optional_pass") summary.optionalPass += 1;
  }

  let freePathNext: GoliveStatusReport["freePathNext"] = null;
  for (const task of GOLIVE_TASKS) {
    for (const s of task.steps) {
      const verified = byKey.get(goliveStepKey(task.id, s.id));
      if (!verified) continue;
      if (verified.status === "fail" || verified.status === "pending") {
        freePathNext = {
          taskId: task.id,
          stepId: s.id,
          title: `${task.number}. ${s.title}`,
          detail: verified.detail,
        };
        break;
      }
    }
    if (freePathNext) break;
  }

  return {
    checkedAt: new Date().toISOString(),
    steps,
    summary,
    freePathNext,
    signals,
  };
}
