# 4-touch cold sequence (~10 days)

Tone: lowercase brand voice, plain, no AI gloss. CTA: specialty lander → demo → consultation.

Shared footer on every send:

```
— {{sender_first}}
practice zero · practicezero.com
{{physical_address}}
Unsubscribe: {{unsubscribe_link}}
```

---

## Email 1 — Day 0 (pain + lander)

**Subjects (A/B):**

- `less administration for {{practice_name}}`
- `{{specialty_label}} mornings that start at zero`
- `chart → claim → collect — one board`

**Body:**

```
{{first_name}} —

most {{specialty_label}} teams we talk to don’t need another portal. they need the chart, the claim, and the follow-up on one morning board so the office isn’t still catching up at 7pm.

practice zero is an agentic EHR for independent practices: agents clear documentation, eligibility, claims, and outreach — you run the rooms.

90 seconds for {{specialty_label}}:
{{specialty_url}}?utm_source=cold&utm_medium=email&utm_campaign={{campaign}}&utm_content=e1

if collections already run clean, ignore this. if admin still owns the day, reply “board” and we’ll walk the live demo.
```

---

## Email 2 — Day 3 (what goes to zero + demo)

**Subjects:**

- `what should go to zero tomorrow morning`
- `eligibility, charting, payer tag — closed`

**Body:**

```
{{first_name}} —

the work that should not own the day:

ø after-hours charting
ø missed eligibility checks
ø phone tag with payers
ø unconfirmed mornings

open the live morning board (no login):
https://www.practicezero.com/try?utm_source=cold&utm_medium=email&utm_campaign={{campaign}}&utm_content=e2

if useful, reply with your practice size and we’ll map it to your specialty.
```

---

## Email 3 — Day 6 (commercial)

**Subjects:**

- `no extra license fee — one billing agreement`
- `EHR + billing + outreach, bundled`

**Body:**

```
{{first_name}} —

practice zero is not another per-seat EHR tax.

EHR, billing, and marketing are included at no additional license fee when collections route through practice zero under a one-year billing agreement. optional advertising spend stays on your terms.

pricing overview:
https://www.practicezero.com/pricing?utm_source=cold&utm_medium=email&utm_campaign={{campaign}}&utm_content=e3

{{specialty_label}} page if you want the specialty frame:
{{specialty_url}}?utm_source=cold&utm_medium=email&utm_campaign={{campaign}}&utm_content=e3b
```

---

## Email 4 — Day 10 (break-up)

**Subjects:**

- `close the loop?`
- `should I stop emailing {{practice_name}}?`

**Body:**

```
{{first_name}} —

I’ll close your file unless a walkthrough would help.

request a consultation:
https://www.practicezero.com/contact?specialty={{specialty_slug}}&utm_source=cold&utm_medium=email&utm_campaign={{campaign}}&utm_content=e4&source=cold_email

or reply “later” and I’ll check back next quarter.
```

---

## Merge fields

| Field | Example |
| --- | --- |
| `{{specialty_slug}}` | `orthopedics` |
| `{{specialty_label}}` | `Orthopedics` |
| `{{specialty_url}}` | `https://www.practicezero.com/specialties/orthopedics` |
| Horizontal fallback URL | `https://www.practicezero.com/specialties` |
