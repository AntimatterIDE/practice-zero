export type GoliveStep = {
  id: string;
  title: string;
  detail: string;
};

export type GoliveTask = {
  id: string;
  number: number;
  title: string;
  summary: string;
  docs?: string;
  steps: GoliveStep[];
};

/** Ordered marketing go-live tasks — each with discrete checkable steps. */
export const GOLIVE_TASKS: GoliveTask[] = [
  {
    id: "supabase",
    number: 1,
    title: "Supabase attribution migration",
    summary: "Add specialty, campaign, and UTM columns to consultation_leads.",
    docs: "supabase/migrations/002_consultation_leads_attribution.sql",
    steps: [
      {
        id: "supabase-open",
        title: "Open Supabase SQL editor",
        detail: "In your Practice Zero Supabase project, open the SQL editor.",
      },
      {
        id: "supabase-run",
        title: "Run migration 002",
        detail:
          "Paste and run supabase/migrations/002_consultation_leads_attribution.sql (specialty, campaign, utm_* columns + indexes).",
      },
      {
        id: "supabase-verify",
        title: "Confirm columns exist",
        detail:
          "Table editor → consultation_leads should show specialty, campaign, utm_source, utm_medium, utm_campaign, utm_content, utm_term.",
      },
      {
        id: "supabase-admin",
        title: "Reload /admin/leads",
        detail: "Page should load without errors. New leads will show specialty/campaign after contact submits.",
      },
    ],
  },
  {
    id: "env",
    number: 2,
    title: "Production environment & redeploy",
    summary: "Set analytics, Instantly, OpenAI, and Resend vars on the host, then redeploy.",
    docs: ".env.example",
    steps: [
      {
        id: "env-ga",
        title: "Add GA4 measurement ID",
        detail: "Set NEXT_PUBLIC_GA_MEASUREMENT_ID to your G-… ID (create the property in task 3 if needed).",
      },
      {
        id: "env-gtm",
        title: "Add GTM container ID (recommended)",
        detail: "Set NEXT_PUBLIC_GTM_ID to GTM-… when the container exists.",
      },
      {
        id: "env-posthog",
        title: "Add PostHog project key",
        detail: "Set NEXT_PUBLIC_POSTHOG_KEY (optional NEXT_PUBLIC_POSTHOG_HOST, default US cloud).",
      },
      {
        id: "env-gsc",
        title: "Add Search Console verification token",
        detail: "Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION to the HTML-tag token from Search Console.",
      },
      {
        id: "env-instantly",
        title: "Generate Instantly webhook secret",
        detail: "Set INSTANTLY_WEBHOOK_SECRET to a long random string; reuse it when configuring Instantly.",
      },
      {
        id: "env-openai-resend",
        title: "Confirm OpenAI + Resend",
        detail:
          "OPENAI_API_KEY (assistant + research + site chat), RESEND_API_KEY, CONTACT_FROM_EMAIL on a verified domain.",
      },
      {
        id: "env-site",
        title: "Confirm site indexing env",
        detail: "CANONICAL_ORIGIN=https://www.practicezero.com and INDEXING_ENABLED=true in production.",
      },
      {
        id: "env-redeploy",
        title: "Redeploy production",
        detail: "Trigger a Vercel (or host) redeploy so public NEXT_PUBLIC_* values ship to the client.",
      },
    ],
  },
  {
    id: "ga4",
    number: 3,
    title: "GA4, GTM & Search Console",
    summary: "Wire acquisition measurement and verify the production host.",
    steps: [
      {
        id: "ga4-property",
        title: "Create GA4 property",
        detail: "Google Analytics → Admin → Create property for practicezero.com. Copy G-… into env (task 2).",
      },
      {
        id: "ga4-gtm",
        title: "Create GTM container (optional)",
        detail: "Tag Manager web container for www.practicezero.com; paste GTM-… into env.",
      },
      {
        id: "ga4-gsc-verify",
        title: "Verify Search Console",
        detail:
          "Add https://www.practicezero.com → HTML tag method → token into NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION → redeploy → Verify.",
      },
      {
        id: "ga4-sitemap",
        title: "Submit sitemap",
        detail: "Search Console → Sitemaps → submit https://www.practicezero.com/sitemap.xml",
      },
      {
        id: "ga4-conversions",
        title: "Mark key events as conversions",
        detail:
          "In GA4 (or via Ads later): contact_submit (primary) and demo_open (secondary). Also expect page_view, cta_click, chat_open.",
      },
      {
        id: "ga4-scope",
        title: "Confirm marketing-only scope",
        detail: "DebugView: events on / and /specialties/*; /portal should not load the marketing analytics suite.",
      },
    ],
  },
  {
    id: "posthog",
    number: 4,
    title: "PostHog funnels",
    summary: "Product analytics + replay on marketing pages for funnel diagnosis.",
    steps: [
      {
        id: "posthog-project",
        title: "Create PostHog project",
        detail: "New project → copy project API key → NEXT_PUBLIC_POSTHOG_KEY → redeploy if not done.",
      },
      {
        id: "posthog-funnel",
        title: "Build conversion funnel",
        detail: "Funnel: specialty or home page_view → demo_open → contact_submit.",
      },
      {
        id: "posthog-replay",
        title: "Enable session replay on marketing only",
        detail: "Replay is fine on marketing; do not instrument /portal or PHI surfaces.",
      },
    ],
  },
  {
    id: "ads",
    number: 5,
    title: "Google Ads Wave 1",
    summary: "Search campaigns linked to GA4 conversions.",
    docs: "marketing/google-ads/campaigns.md",
    steps: [
      {
        id: "ads-account",
        title: "Create / open Google Ads account",
        detail: "Ensure billing is ready and the account is for practice zero marketing.",
      },
      {
        id: "ads-link-ga4",
        title: "Link Ads ↔ GA4",
        detail: "Enable auto-tagging. Import contact_submit (primary) and demo_open (secondary).",
      },
      {
        id: "ads-brand",
        title: "Launch Brand Search campaign",
        detail: "Exact/phrase: practice zero, practicezero. Land / or /pricing. Low budget, protect brand.",
      },
      {
        id: "ads-category",
        title: "Launch Category Search campaign",
        detail:
          "Themes: EHR for independent practice, medical billing for small practice, AI scribe + billing. Land /billing, /pricing, or /ai.",
      },
      {
        id: "ads-hold-specialty",
        title: "Hold specialty keywords until CPA stabilizes",
        detail:
          "After ~30 contact_submit conversions, expand specialty Search to /specialties/* (see campaigns.md).",
      },
    ],
  },
  {
    id: "semrush",
    number: 6,
    title: "Semrush tracking",
    summary: "Competitive + specialty keyword coverage.",
    docs: "marketing/seo/semrush-keyword-map.md",
    steps: [
      {
        id: "semrush-project",
        title: "Add practicezero.com project",
        detail: "Position tracking for Wave 1 specialty URLs and category terms.",
      },
      {
        id: "semrush-competitors",
        title: "Add competitor domains",
        detail: "Compare organic overlap vs tebra.com and athenahealth.com.",
      },
      {
        id: "semrush-seeds",
        title: "Seed specialty + competitor keywords",
        detail: "Use marketing/seo/semrush-keyword-map.md; export commercial intent for Ads + Research.",
      },
    ],
  },
  {
    id: "domains",
    number: 7,
    title: "Cold email domains & Instantly warmup",
    summary: "Protect practicezero.com reputation; warm sending infra.",
    docs: "marketing/cold-email/README.md",
    steps: [
      {
        id: "domains-buy",
        title: "Buy 2–3 sending domains",
        detail: "Examples: getpracticezero.com, trypracticezero.com. Do not blast from @practicezero.com.",
      },
      {
        id: "domains-mailboxes",
        title: "Create 3–5 Workspace mailboxes per domain",
        detail: "Google Workspace (or equivalent) inboxes for Instantly to rotate.",
      },
      {
        id: "domains-dns",
        title: "Set SPF, DKIM, and DMARC",
        detail: "Complete DNS before connecting Instantly. Confirm authentication passes.",
      },
      {
        id: "domains-instantly",
        title: "Connect Instantly + enable warmup",
        detail: "Add all mailboxes; turn on warmup for each.",
      },
      {
        id: "domains-warmup",
        title: "Warm up 14–21 days",
        detail: "Keep campaign volume off until warmup looks healthy and placement is good.",
      },
    ],
  },
  {
    id: "list",
    number: 8,
    title: "Verify list & load 4-touch sequence",
    summary: "Clean data, then Instantly campaign copy with UTMs.",
    docs: "marketing/cold-email/sequence.md",
    steps: [
      {
        id: "list-verify",
        title: "Verify the full email list",
        detail: "NeverBounce or MillionVerifier. Drop invalids; target ≥95% deliverable.",
      },
      {
        id: "list-segment",
        title: "Segment by specialty + role when possible",
        detail: "Owner / practice manager / billing. Unknown specialty → /specialties horizontal link.",
      },
      {
        id: "list-sequence",
        title: "Load the 4-touch sequence",
        detail: "Copy from marketing/cold-email/sequence.md (days 0 / 3 / 6 / 10).",
      },
      {
        id: "list-variants",
        title: "Apply specialty opening variants",
        detail: "Use marketing/cold-email/templates/specialty-variants.md for Email 1 color lines.",
      },
      {
        id: "list-utms",
        title: "Add UTMs + CAN-SPAM footer",
        detail:
          "utm_source=cold&utm_medium=email&utm_campaign=…&utm_content=e1–e4. Physical address + working unsubscribe on every send.",
      },
      {
        id: "list-ramp",
        title: "Soft-launch volume ramp",
        detail: "Start ~20–30/mailbox/day after warmup; scale to ~40 only if bounce stays under 2%.",
      },
    ],
  },
  {
    id: "webhook",
    number: 9,
    title: "Instantly → leads webhook",
    summary: "Positive replies become consultation_leads with source=cold_email.",
    steps: [
      {
        id: "webhook-secret",
        title: "Confirm INSTANTLY_WEBHOOK_SECRET in production",
        detail: "Same secret you will paste into Instantly authorization.",
      },
      {
        id: "webhook-url",
        title: "Configure Instantly webhook URL",
        detail: "POST https://www.practicezero.com/api/webhooks/instantly on interested / positive reply.",
      },
      {
        id: "webhook-auth",
        title: "Set Authorization header",
        detail: "Authorization: Bearer <INSTANTLY_WEBHOOK_SECRET>",
      },
      {
        id: "webhook-test",
        title: "Send a test payload",
        detail: "Confirm a new lead appears in /admin/leads with source cold_email and campaign set.",
      },
    ],
  },
  {
    id: "qa",
    number: 10,
    title: "End-to-end QA",
    summary: "Prove attribution, demo conversion, and portal isolation.",
    steps: [
      {
        id: "qa-specialty-utm",
        title: "Specialty lander with UTMs",
        detail:
          "Open /specialties/orthopedics?utm_source=test&utm_medium=qa&utm_campaign=golive Request consultation.",
      },
      {
        id: "qa-lead",
        title: "Confirm lead attribution in admin",
        detail: "/admin/leads shows specialty, source/campaign, and UTM fields for the test submit.",
      },
      {
        id: "qa-demo",
        title: "Confirm demo_open",
        detail: "Open /try; see demo_open in GA4 DebugView and/or PostHog live events.",
      },
      {
        id: "qa-portal",
        title: "Confirm /portal is clean",
        detail: "Patient portal must not load the full marketing GA/PostHog suite.",
      },
    ],
  },
];

export function goliveStepKey(taskId: string, stepId: string) {
  return `${taskId}::${stepId}`;
}

export function countGoliveSteps(tasks: GoliveTask[] = GOLIVE_TASKS) {
  return tasks.reduce((sum, task) => sum + task.steps.length, 0);
}
