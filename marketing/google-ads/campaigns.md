# Google Ads — Wave 1 Search plan

Link **GA4** to Google Ads. Import conversions:

| Conversion | Event | Priority |
| --- | --- | --- |
| Consultation request | `contact_submit` | Primary |
| Demo open | `demo_open` | Secondary |
| CTA click (optional) | `cta_click` | Observe only |

Verify site in **Google Search Console** for `https://www.practicezero.com` before scaling spend.

## Account setup checklist

1. Create GA4 property → Measurement ID → `NEXT_PUBLIC_GA_MEASUREMENT_ID`
2. Create GTM container (optional but recommended) → `NEXT_PUBLIC_GTM_ID`
3. Create Google Ads account → link GA4 → import conversions above
4. Enable auto-tagging
5. Brand + category campaigns first; specialty modifiers after CPA stabilizes

## Campaign structure

### 1) Brand Search

- **Land:** `/` or `/pricing`
- **Keywords (exact/phrase):** `practice zero`, `practicezero`, `practice zero ehr`
- **Budget:** low; protect branded queries

### 2) Category Search

- **Land:** `/billing`, `/pricing`, or `/ai` by intent
- **Themes:**
  - `EHR for independent practice`
  - `medical billing software for small practice`
  - `AI medical scribe billing`
  - `agentic EHR`
  - `practice management software independent`
- **Match:** phrase + exact; tight negatives (jobs, salary, epic training, etc.)

### 3) Competitor conquest (careful copy)

- **Land:** `/pricing` or specialty pages — never claim false feature parity
- **Keywords:** `athenahealth alternative`, `tebra alternative`, `kareo alternative`, `patientpop alternative`
- **Ad copy rules:** factual contrast only (billing agreement / morning board / no extra license fee). No trademark in Display URL path if policy-sensitive; follow Google trademark rules.

### 4) Specialty Search (after brand + category prove CPA)

| Specialty | Example keywords | Landing page |
| --- | --- | --- |
| Ophthalmology | `ophthalmology EHR`, `ophthalmology practice management` | `/specialties/ophthalmology` |
| Orthopedics | `orthopedic EHR`, `orthopedic practice billing` | `/specialties/orthopedics` |
| Primary care | `family medicine EHR`, `primary care billing software` | `/specialties/primary-care` |
| Dermatology | `dermatology EHR`, `derm practice management` | `/specialties/dermatology` |
| OB-GYN | `OB-GYN EHR`, `OBGYN practice management` | `/specialties/ob-gyn` |

## Ad copy scaffolds

**Headline ideas:**

- less administration. more care.
- chart, claim, collect — one board
- EHR + billing, no extra license fee
- agentic EHR for independent practices

**Description ideas:**

- Agents clear documentation, eligibility, claims, and outreach. You run the rooms.
- One-year billing agreement. Optional ad spend on your terms. Try the demo.

## Budget guidance

1. Start concentrated on **Brand + Category** until ~30 `contact_submit` conversions.
2. Expand specialty keywords only when CPA on consultations is acceptable.
3. Pause search terms that attract students, job seekers, or hospital IT RFPs outside ICP.

## UTM conventions

- `utm_source=google`
- `utm_medium=cpc`
- `utm_campaign=brand|category|competitor|specialty_{slug}`
- `utm_content={ad_group}`
