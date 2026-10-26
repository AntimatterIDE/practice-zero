export type ComplianceLink = {
  label: string;
  href: string;
};

export type ComplianceStep = {
  id: string;
  title: string;
  detail: string;
  /** Rough effort: minutes or “quote” for sales-led items */
  effort?: string;
  /** Approximate cost hint shown in UI */
  cost?: string;
  links?: ComplianceLink[];
  docs?: string[];
};

export type ComplianceTrack = {
  id: string;
  number: number;
  /** Maps to marketing badge / claim */
  badge: string;
  title: string;
  summary: string;
  /** Why this track exists for Practice Zero */
  why: string;
  steps: ComplianceStep[];
};

export function complianceStepKey(trackId: string, stepId: string) {
  return `${trackId}::${stepId}`;
}

export function countComplianceSteps(tracks: ComplianceTrack[] = COMPLIANCE_TRACKS) {
  return tracks.reduce((n, t) => n + t.steps.length, 0);
}

/**
 * Ordered compliance program for Practice Zero admin.
 * Tracks map to marketing badges + an immediate quick-wins track.
 */
export const COMPLIANCE_TRACKS: ComplianceTrack[] = [
  {
    id: "quick-wins",
    number: 1,
    badge: "This week",
    title: "Quick wins enable now",
    summary:
      "MFA, BAAs you can click/email today, uptime monitors, and secret hygiene. Highest impact before big spend.",
    why: "Practice Zero is still marketing + demo-first. Collect evidence and vendor BAAs before claiming certifications on the site.",
    steps: [
      {
        id: "qw-mfa",
        title: "Enable MFA on every production account",
        detail:
          "GitHub, Vercel, Supabase, OpenAI, Resend, PostHog, Google Workspace. Required for SOC 2 access controls.",
        effort: "~30 min",
        cost: "$0",
        links: [
          { label: "GitHub 2FA", href: "https://github.com/settings/security" },
          { label: "Vercel account", href: "https://vercel.com/account" },
          { label: "Supabase dashboard", href: "https://supabase.com/dashboard" },
        ],
      },
      {
        id: "qw-github-security",
        title: "Turn on Dependabot, secret scanning, branch protection",
        detail:
          "Protect main: require PR reviews, enable Dependabot alerts/updates and push protection for secrets. Never commit PHI.",
        effort: "~20 min",
        cost: "$0",
        links: [
          {
            label: "GitHub security overview",
            href: "https://docs.github.com/en/code-security",
          },
        ],
        docs: ["tests/secrets.test.ts"],
      },
      {
        id: "qw-openai-baa",
        title: "Request OpenAI API BAA + Modified Retention / ZDR",
        detail:
          "Email baa@openai.com with company + use case. No published BAA fee. Required before any clinical/scribe AI touches PHI. Keep site chat free of PHI until approved.",
        effort: "1–5 days (review)",
        cost: "$0 BAA fee",
        links: [
          {
            label: "Request BAA",
            href: "mailto:baa@openai.com?subject=Practice%20Zero%20API%20BAA%20request",
          },
          {
            label: "HIPAA-eligible products",
            href: "https://help.openai.com/en/articles/20001069-hipaa-eligible-products-and-functionality",
          },
          {
            label: "How to get a BAA",
            href: "https://help.openai.com/en/articles/8660679-how-can-i-get-a-business-associate-agreement-baa-with-openai-for-the-api-services",
          },
        ],
        docs: ["lib/openai.ts", "app/api/chat/route.ts"],
      },
      {
        id: "qw-vercel-baa",
        title: "Enable Vercel HIPAA BAA add-on",
        detail:
          "Pro team → Settings → Billing → Add-ons → HIPAA BAA ($350/mo). Self-serve. Covers hosting as a business associate.",
        effort: "~10 min",
        cost: "$350/mo",
        links: [
          { label: "Vercel pricing (HIPAA)", href: "https://vercel.com/docs/pricing" },
          {
            label: "HIPAA on Vercel guide",
            href: "https://vercel.com/kb/guide/hipaa-compliance-guide-vercel",
          },
          { label: "Compliance overview", href: "https://vercel.com/docs/security/compliance" },
        ],
      },
      {
        id: "qw-workspace-baa",
        title: "Accept Google Workspace BAA",
        detail:
          "Paid Workspace only. Super admin → Admin console → Account → Legal and compliance → accept BAA. No free Gmail for PHI.",
        effort: "~15 min",
        cost: "$0 (paid Workspace)",
        links: [
          {
            label: "Workspace HIPAA help",
            href: "https://knowledge.workspace.google.com/admin/compliance/hipaa-compliance-with-google-workspace-and-cloud-identity",
          },
        ],
      },
      {
        id: "qw-uptime",
        title: "Create Better Stack (or UptimeRobot) monitors + status page",
        detail:
          "Monitor https://www.practicezero.com, /api/contact, and admin login. Publish status.practicezero.com. Start collecting uptime history for 99.9% claims.",
        effort: "~45 min",
        cost: "$0–34/mo",
        links: [
          { label: "Better Stack", href: "https://betterstack.com/" },
          { label: "Better Stack pricing", href: "https://betterstack.com/pricing" },
          { label: "UptimeRobot", href: "https://uptimerobot.com/" },
        ],
      },
      {
        id: "qw-secrets",
        title: "Move secrets into 1Password / team vault and rotate admin keys",
        detail:
          "ADMIN_PASSWORD, ADMIN_SESSION_SECRET, Supabase service role, OpenAI, Resend, Instantly webhook. Rotate anything that lived in chat or email.",
        effort: "~1 hr",
        cost: "~$9/user/mo",
        links: [
          { label: "1Password Business", href: "https://1password.com/pricing/business" },
        ],
        docs: [".env.example", "lib/admin-auth.ts"],
      },
      {
        id: "qw-vendor-reports",
        title: "Download vendor SOC 2 / security packs",
        detail:
          "Collect Vercel, Supabase, Resend, PostHog SOC 2 reports under NDA for a sales trust pack. Store in a private Drive folder covered by Workspace BAA.",
        effort: "~1 hr",
        cost: "$0",
        links: [
          { label: "Supabase security", href: "https://supabase.com/security" },
          { label: "Vercel compliance", href: "https://vercel.com/docs/security/compliance" },
          { label: "Resend SOC 2", href: "https://resend.com/blog/soc-2" },
        ],
      },
      {
        id: "qw-posthog-boundary",
        title: "Confirm PostHog AI off + analytics away from portal/admin",
        detail:
          "Marketing paths only. Disable PostHog AI features. Do not buy PostHog Boost BAA until clinical events would contain PHI.",
        effort: "~20 min",
        cost: "$0",
        links: [
          {
            label: "PostHog HIPAA docs",
            href: "https://posthog.com/docs/privacy/hipaa-compliance",
          },
          { label: "PostHog packages", href: "https://posthog.com/platform-packages" },
        ],
        docs: [
          "lib/analytics/paths.ts",
          "components/analytics/marketing-analytics.tsx",
        ],
      },
      {
        id: "qw-marketing-honesty",
        title: "Align site badges with chat knowledge (no invented certs)",
        detail:
          "Compliance badges on marketing must match signed BAAs / evidence. Site assistant already forbids inventing HIPAA/SOC 2 keep that rule until Type II + program exist.",
        effort: "~30 min",
        cost: "$0",
        docs: [
          "components/marketing/compliance-badges.tsx",
          "lib/chat/knowledge.ts",
        ],
      },
    ],
  },
  {
    id: "aes-256",
    number: 2,
    badge: "AES-256",
    title: "AES-256 encryption (at rest + transit)",
    summary:
      "Document vendor encryption, enforce TLS, optionally add app-level crypto for high-sensitivity fields later.",
    why: "AES-256 is not a certificate it is how data is encrypted. Vercel and Supabase already encrypt at rest with AES-256; claim it only with a security page that cites sources.",
    steps: [
      {
        id: "aes-vercel",
        title: "Confirm Vercel at-rest AES-256 + TLS 1.3",
        detail: "Cite Vercel compliance docs in your security/trust page.",
        cost: "Included",
        links: [
          { label: "Vercel compliance", href: "https://vercel.com/docs/security/compliance" },
        ],
        docs: ["next.config.ts"],
      },
      {
        id: "aes-supabase",
        title: "Confirm Supabase AES-256 at rest + TLS",
        detail: "Enable SSL enforcement on the project. Document in trust pack.",
        cost: "Included",
        links: [
          { label: "Supabase security", href: "https://supabase.com/security" },
          {
            label: "HIPAA projects",
            href: "https://supabase.com/docs/guides/platform/hipaa-projects",
          },
        ],
      },
      {
        id: "aes-security-page",
        title: "Publish Security / Trust page language",
        detail:
          "State: data encrypted at rest (AES-256) and in transit (TLS); demo RCM stays in-browser; leads are PII not clinical PHI.",
        effort: "~2 hrs",
        cost: "$0",
        docs: ["components/marketing/compliance-badges.tsx"],
      },
      {
        id: "aes-app-level",
        title: "(Later) App-level encrypt SSN/MRN with KMS",
        detail:
          "When real EHR persists PHI, envelope-encrypt highest-sensitivity columns (AWS KMS / GCP KMS / Supabase Vault) before insert.",
        effort: "Eng sprint",
        cost: "KMS usage",
        links: [
          {
            label: "Supabase Vault",
            href: "https://supabase.com/docs/guides/database/vault",
          },
        ],
      },
    ],
  },
  {
    id: "baa",
    number: 3,
    badge: "BAA available",
    title: "Business Associate Agreements",
    summary:
      "Sign BAAs with subprocessors, then offer a customer BAA to practices. Badge is only true when both exist.",
    why: "You are a business associate to covered-entity practices. Subprocessors that see PHI need BAAs; customers need your BAA.",
    steps: [
      {
        id: "baa-vercel",
        title: "Vercel BAA signed (Pro add-on)",
        detail: "Same as quick win keep executed PDF/screenshot in trust folder.",
        cost: "$350/mo",
        links: [
          {
            label: "HIPAA BAAs on Pro",
            href: "https://vercel.com/changelog/hipaa-baas-are-now-available-to-pro-teams",
          },
        ],
      },
      {
        id: "baa-openai",
        title: "OpenAI API BAA executed + retention provisioned",
        detail: "Wait for org provisioning email before sending PHI to eligible endpoints.",
        cost: "$0 fee",
        links: [
          {
            label: "OpenAI BAA help",
            href: "https://help.openai.com/en/articles/8660679-how-can-i-get-a-business-associate-agreement-baa-with-openai-for-the-api-services",
          },
        ],
      },
      {
        id: "baa-supabase",
        title: "Supabase Team + HIPAA add-on + BAA (when PHI live)",
        detail:
          "Team plan from $599/mo + HIPAA add-on (quote; historically ~$350/mo) + PITR from $100/mo. Enable High Compliance project settings.",
        cost: "~$1,050+/mo",
        links: [
          { label: "Supabase pricing", href: "https://supabase.com/pricing" },
          {
            label: "Supabase HIPAA",
            href: "https://supabase.com/docs/guides/security/hipaa-compliance",
          },
          {
            label: "HIPAA projects",
            href: "https://supabase.com/docs/guides/platform/hipaa-projects",
          },
          { label: "Request BAA", href: "https://supabase.com/dashboard" },
        ],
        docs: ["lib/supabase/admin.ts", "supabase/migrations/"],
      },
      {
        id: "baa-email",
        title: "Replace Resend for PHI email (Paubox or Twilio HIPAA-eligible)",
        detail:
          "Resend is SOC 2 Type II but has no public HIPAA BAA. Keep Resend for consult leads (non-PHI). Use Paubox (BAA on free tier) or Twilio HIPAA-eligible products for clinical email/SMS not SendGrid.",
        cost: "Paubox $0–paid",
        links: [
          { label: "Paubox", href: "https://www.paubox.com/" },
          { label: "Twilio HIPAA", href: "https://www.twilio.com/en-us/hipaa" },
          { label: "Resend SOC 2", href: "https://resend.com/blog/soc-2" },
        ],
        docs: ["app/api/contact/route.ts"],
      },
      {
        id: "baa-posthog",
        title: "PostHog BAA only if analytics may see PHI",
        detail:
          "Boost $250/mo+, Scale, or Enterprise. Prefer keeping analytics PHI-free (current marketing-only split).",
        cost: "$250+/mo or $0",
        links: [
          {
            label: "PostHog HIPAA",
            href: "https://posthog.com/docs/privacy/hipaa-compliance",
          },
        ],
      },
      {
        id: "baa-customer",
        title: "Draft + counsel-approve customer BAA",
        detail:
          "Healthcare counsel reviews template. Version it, store executed copies, link from onboarding/contracts. This is what “BAA available” means to practices.",
        effort: "Legal",
        cost: "Counsel fees",
      },
      {
        id: "baa-inventory",
        title: "Maintain subprocessor / BAA inventory",
        detail:
          "Spreadsheet or GRC vendor module: vendor, data type, BAA date, SOC 2 report date, owner.",
        effort: "Ongoing",
        cost: "$0–GRC",
      },
    ],
  },
  {
    id: "uptime",
    number: 4,
    badge: "99.9% uptime",
    title: "99.9% uptime SLA & Availability",
    summary:
      "~8.76 hours downtime/year. Needs monitoring history, on-call, incident process, and usually SOC 2 Availability.",
    why: "Marketing and onboarding already promise uptime. Auditors compare claims to measured uptime start collecting evidence now.",
    steps: [
      {
        id: "up-define-sla",
        title: "Write SLA scope (what counts / exclusions)",
        detail:
          "Example: 99.9% for production app + critical APIs in US region; exclude customer-caused and scheduled maintenance. Put it in MSA/onboarding.",
        effort: "~2 hrs",
        cost: "$0",
        docs: ["components/marketing/onboarding/onboarding-landing.tsx"],
      },
      {
        id: "up-monitors",
        title: "External monitors every 30–60s with alerts",
        detail: "Slack/SMS to on-call. Retain history ≥12 months for Type II.",
        cost: "$0–34/mo",
        links: [{ label: "Better Stack", href: "https://betterstack.com/" }],
      },
      {
        id: "up-status",
        title: "Public status page",
        detail: "status.practicezero.com with component health and incident history.",
        cost: "Included on Better Stack free+",
      },
      {
        id: "up-oncall",
        title: "On-call rotation + escalation policy",
        detail: "Document who responds nights/weekends. Better Stack Responder, PagerDuty, or Incident.io.",
        cost: "~$34+/mo",
        links: [
          { label: "Incident.io", href: "https://incident.io/" },
          { label: "PagerDuty", href: "https://www.pagerduty.com/" },
        ],
      },
      {
        id: "up-sentry",
        title: "Error monitoring with PII scrubbing",
        detail:
          "Sentry Team+. Scrub emails/phones. BAA only on Business+ if errors could contain PHI prefer scrubbing so free/Team stays safe.",
        cost: "~$26/mo",
        links: [{ label: "Sentry pricing", href: "https://sentry.io/pricing/" }],
      },
      {
        id: "up-backups",
        title: "Document backups + quarterly restore drill",
        detail:
          "Supabase PITR when HIPAA project. Record RTO/RPO and restore evidence for Availability criteria.",
        cost: "PITR from $100/mo",
        links: [
          {
            label: "Supabase PITR",
            href: "https://supabase.com/docs/guides/platform/backups",
          },
        ],
      },
      {
        id: "up-monthly-report",
        title: "Export monthly uptime % vs 99.9%",
        detail: "Save PDF/CSV each month. Required evidence for SOC 2 Availability.",
        effort: "Monthly 15 min",
        cost: "$0",
      },
    ],
  },
  {
    id: "hipaa",
    number: 5,
    badge: "HIPAA",
    title: "HIPAA program (Business Associate)",
    summary:
      "Not an HHS certificate. BAAs + Security Rule safeguards + risk analysis + training + breach process. Continuous.",
    why: "Required once you create, receive, maintain, or transmit ePHI for practices. Demo localStorage data is not enough to claim compliance.",
    steps: [
      {
        id: "hipaa-classify",
        title: "Data classification: PHI vs PII vs marketing",
        detail:
          "consultation_leads = sales PII. Research = content. /try RCM = demo only (localStorage). Real charts/claims/messages = ePHI when server-persisted.",
        docs: [
          "supabase/migrations/001_consultation_leads.sql",
          "components/admin/rcm/store.tsx",
          "lib/chat/knowledge.ts",
        ],
      },
      {
        id: "hipaa-risk",
        title: "Complete formal Security Risk Analysis",
        detail:
          "Required under HIPAA Security Rule. Use GRC templates (Vanta/Drata/Sprinto) + counsel/consultant sign-off. Revisit annually.",
        cost: "GRC + consultant",
        links: [
          {
            label: "HHS Security Rule guidance",
            href: "https://www.hhs.gov/hipaa/for-professionals/security/index.html",
          },
        ],
      },
      {
        id: "hipaa-policies",
        title: "Adopt security / privacy / incident / access policies",
        detail: "GRC tools ship templates. Assign owners, version, train workforce.",
        cost: "Included in GRC",
      },
      {
        id: "hipaa-access",
        title: "Replace shared ADMIN_PASSWORD with RBAC + MFA",
        detail:
          "Production EHR needs Supabase Auth / WorkOS / IdP, RLS per practice, audit logs for PHI access. Service-role-only is not multi-tenant HIPAA.",
        docs: ["lib/admin-auth.ts", "lib/supabase/admin.ts"],
        links: [
          {
            label: "Supabase Auth",
            href: "https://supabase.com/docs/guides/auth",
          },
        ],
      },
      {
        id: "hipaa-audit",
        title: "Enable audit logging for PHI access",
        detail: "Supabase logs + app audit trail for who viewed/changed patient data.",
        links: [
          {
            label: "Supabase logs",
            href: "https://supabase.com/docs/guides/platform/logs",
          },
        ],
      },
      {
        id: "hipaa-training",
        title: "Workforce HIPAA training + attestations",
        detail: "Annual training for anyone with PHI access. Store completion records.",
        cost: "$0–training vendor",
      },
      {
        id: "hipaa-breach",
        title: "Incident / breach notification playbook",
        detail: "Detect → contain → assess → notify customers/HHS per timelines. Tabletop once/year.",
      },
      {
        id: "hipaa-pentest",
        title: "Penetration test before first PHI customer",
        detail: "Independent firm; remediate critical/high before go-live.",
        cost: "$5–15k",
      },
    ],
  },
  {
    id: "soc2",
    number: 6,
    badge: "SOC 2 Type II",
    title: "SOC 2 Type II attestation",
    summary:
      "Independent CPA report that Security (+ Availability) controls operated over 6–12 months. Tooling prepares you; auditor attests.",
    why: "Procurement for practices and health systems expects Type II. Scope Security + Availability because you market 99.9% uptime.",
    steps: [
      {
        id: "soc2-pick-grc",
        title: "Choose GRC platform and start trial/demo",
        detail:
          "Secureframe (~$15k list), Sprinto (~$9.5k AWS), Vanta (~$14k+), or Drata (higher). Ask for startup discounts.",
        cost: "$10–25k/yr",
        links: [
          { label: "Vanta pricing", href: "https://www.vanta.com/pricing" },
          { label: "Secureframe", href: "https://secureframe.com/" },
          { label: "Sprinto", href: "https://sprinto.com/" },
          { label: "Drata", href: "https://drata.com/" },
        ],
      },
      {
        id: "soc2-scope",
        title: "Scope Trust Services Criteria",
        detail: "Minimum: Security. Add Availability for uptime SLA. Consider Confidentiality for PHI.",
      },
      {
        id: "soc2-integrations",
        title: "Connect GitHub, Vercel, Google Workspace, IdP",
        detail: "Auto-collect evidence: MFA, access reviews, deploy logs.",
      },
      {
        id: "soc2-type1",
        title: "(Optional) Complete Type I for early sales",
        detail: "Point-in-time design attestation. Faster than Type II; still needs real controls.",
        cost: "Auditor $8–15k",
      },
      {
        id: "soc2-observation",
        title: "Start Type II observation window",
        detail: "Typically 6–12 months of consistent control operation. Do not break MFA / logging mid-window.",
        cost: "Time",
      },
      {
        id: "soc2-auditor",
        title: "Engage CPA firm and complete Type II exam",
        detail: "A-LIGN, Schellman, Johanson, Advantage Partners, etc. Budget $15–30k.",
        cost: "$15–30k",
      },
      {
        id: "soc2-trust-center",
        title: "Publish Trust Center (NDA-gated report)",
        detail: "Vanta Trust Center, SafeBase, or Conveyor. Share SOC 2 + BAAs with prospects.",
        cost: "$6k+/yr module or included",
        links: [
          { label: "Vanta Trust Center", href: "https://www.vanta.com/" },
          { label: "SafeBase", href: "https://safe.base/" },
        ],
      },
    ],
  },
  {
    id: "budget",
    number: 7,
    badge: "Budget",
    title: "Vendor cost bands (reference)",
    summary: "Use as a buying guide confirm quotes. Mark steps done when budget approved / purchased.",
    why: "Founders need a single place for what to buy now vs later for Practice Zero’s stack.",
    steps: [
      {
        id: "bud-week",
        title: "Approve this-week cart (~$350–400/mo)",
        detail:
          "Vercel HIPAA BAA $350 + Better Stack free/Responder + Sentry ~$26 + OpenAI/Workspace BAAs $0.",
        cost: "~$400/mo",
      },
      {
        id: "bud-grc",
        title: "Approve GRC + auditor for year 1",
        detail: "Platform $10–25k + Type II auditor $15–30k + pen test $5–15k. All-in often $50–120k with eng time.",
        cost: "$50–120k yr1",
      },
      {
        id: "bud-phi",
        title: "Approve PHI infra when EHR persists ePHI",
        detail:
          "Supabase Team+HIPAA+PITR ~$1k+/mo, Paubox/Twilio, optional PostHog Boost. Defer until real charts leave the browser.",
        cost: "~$1.5–2.5k/mo",
      },
      {
        id: "bud-defer",
        title: "Explicitly defer: Drata list, Secure Compute, Resend-as-HIPAA",
        detail:
          "Do not force Resend into HIPAA. Secure Compute is Enterprise. Prefer Secureframe/Sprinto/Vanta over highest list prices until observation starts.",
        cost: "N/A",
      },
    ],
  },
];
