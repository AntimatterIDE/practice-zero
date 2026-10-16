# Practice Zero marketing ops

Implementation companion to the Marketing Architecture plan.

**In-product guide:** after deploy, open [`/admin/marketing`](https://www.practicezero.com/admin/marketing) — interactive checklist + OpenAI go-live assistant (same `OPENAI_API_KEY`).

| Folder | Purpose |
| --- | --- |
| [`cold-email/`](./cold-email/) | Instantly domains, warmup, 4-touch sequence, specialty variants |
| [`google-ads/`](./google-ads/) | Search campaign structure + GA4 conversion mapping |
| [`seo/`](./seo/) | Semrush keyword map + Research briefs |

## Env vars to set in production

See [`.env.example`](../.env.example):

- `NEXT_PUBLIC_GA_MEASUREMENT_ID` / `NEXT_PUBLIC_GTM_ID` / `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (Search Console HTML tag token)
- `INSTANTLY_WEBHOOK_SECRET` for `POST /api/webhooks/instantly`

## Database

Run [`supabase/migrations/002_consultation_leads_attribution.sql`](../supabase/migrations/002_consultation_leads_attribution.sql) in Supabase so specialty / UTM columns exist before cold email or Ads traffic hits `/contact`.
