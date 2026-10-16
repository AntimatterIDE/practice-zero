# Cold email ops runbook (Instantly)

Practice Zero outbound is **cold email to practice contacts** under CAN-SPAM. Never include PHI, patient names, or clinical details.

## Week 0 — infrastructure

1. Buy **2–3 sending domains** (examples: `getpracticezero.com`, `trypracticezero.com`, `hello-practicezero.com`).
2. Do **not** send volume from `@practicezero.com` (protect primary domain reputation).
3. Create **3–5 Google Workspace mailboxes** per sending domain.
4. Set **SPF, DKIM, DMARC** for each domain before connecting Instantly.
5. Connect mailboxes to **Instantly**; enable warmup on every inbox.
6. Warm up **14–21 days** before scaling (keep daily sends low during warmup).

## List hygiene

1. Verify the full list with **NeverBounce** or **MillionVerifier**.
2. Drop invalids, role-only traps when bounce risk is high, and obvious spam traps.
3. Target **≥95%** deliverable before first campaign.
4. Segment when possible: `specialty` + `role` (owner / practice manager / billing).
5. If specialty is unknown, use the horizontal sequence and link to `/specialties`.

## Volume ramp

| Phase | Per mailbox / day | Gate |
| --- | --- | --- |
| Warmup | Instantly warmup only | Placement looks healthy |
| Soft launch | 20–30 | Bounce &lt; 2% |
| Scale | 30–40 | Complaints negligible, replies tracked |

Pause a mailbox if bounce spikes or spam placement worsens.

## Instantly campaign settings

- Sequence: see [`sequence.md`](./sequence.md) and specialty variants in [`templates/`](./templates/).
- Unsubscribe + physical mailing address in every footer.
- UTM on every link:
  - `utm_source=cold`
  - `utm_medium=email`
  - `utm_campaign={{campaign_id}}`
  - `utm_content={{email_number}}` (e1–e4)
- Landing: specialty page when known, else `/pricing` or `/` with clear CTA to `/try` and `/contact`.

## Lead sync

1. Set Instantly webhook (interested / positive reply) → `POST https://www.practicezero.com/api/webhooks/instantly`
2. Header: `Authorization: Bearer <INSTANTLY_WEBHOOK_SECRET>`
3. Body fields: `email`, `firstName`, `lastName`, `company` or `practiceName`, `specialty`, `campaign`, `event`, `reply`
4. Leads land in Supabase `consultation_leads` with `source=cold_email` and appear in `/admin/leads`.

## Weekly review

Track in Instantly + GA4/PostHog:

- Delivered, bounce, reply, positive reply
- Specialty lander → `/try` → `contact_submit`
- Cost is mostly list + tool time; optimize copy by specialty with highest positive rate
