# Semrush keyword map — Wave 1

Use Semrush for competitor organic gaps (Tebra, athenahealth, Kareo/PatientPop legacy queries) and to brief Research + specialty pages. Do not dual-pay Ahrefs unless Semrush is insufficient.

## Seed themes

### Category / commercial

| Intent | Seed keywords | Primary URL |
| --- | --- | --- |
| Platform | agentic EHR, EHR for independent practice, autonomous practice software | `/`, `/ai` |
| RCM | medical billing software small practice, eligibility verification software, denial management independent practice | `/billing` |
| Pricing | EHR no license fee, percentage of collections EHR alternative | `/pricing` |
| Competitor | athenahealth alternative, tebra alternative, kareo alternative | `/pricing` (until a dedicated compare page exists) |

### Specialty modifiers

| Specialty | Seeds | URL |
| --- | --- | --- |
| Ophthalmology | ophthalmology EHR, ophthalmology practice management software | `/specialties/ophthalmology` |
| Orthopedics | orthopedic EHR, orthopedic practice management, orthopedic billing software | `/specialties/orthopedics` |
| Primary care | family medicine EHR, primary care EHR independent, internal medicine practice software | `/specialties/primary-care` |
| Dermatology | dermatology EHR, dermatology practice management software | `/specialties/dermatology` |
| OB-GYN | OB-GYN EHR, OBGYN practice management, women's health EHR independent | `/specialties/ob-gyn` |

## Semrush workflow (weekly)

1. Domain overview: `practicezero.com` vs `tebra.com` / `athenahealth.com` (organic keywords intersection).
2. Keyword magic on each specialty seed → export volume + KD + intent.
3. Prioritize **commercial / transactional** queries for Ads + landers; **informational** for Research.
4. Track positions for Wave 1 specialty URLs in Position Tracking.
5. Brief 1 Research note per week from the informational cluster (see Research briefs below).

## Research content briefs (ship in catalog)

These three notes target category + competitor-adjacent SEO while staying on-brand:

1. **athenahealth percentage-of-collections vs billing agreements** — educate buyers comparing commercial models; CTA `/pricing` + `/contact`.
2. **Leaving per-seat EHR stacks (Tebra/Kareo-shaped buying)** — morning board narrative; CTA `/try`.
3. **Specialty mornings: why horizontal EHR still needs specialty pages** — supports `/specialties/*` internal links.

Implemented as Research catalog entries: `collections-pricing-models`, `beyond-per-seat-ehr`, `specialty-mornings-horizontal-ehr`.

## On-page checklist (specialty pages)

- Unique title + meta (already in `lib/marketing/specialties.ts`)
- H1 specialty-framed; one supporting paragraph
- Internal links to `/ehr`, `/billing`, `/marketing`, `/try`, `/contact`
- Sitemap includes `/specialties` and each slug
- Search Console: inspect URL after deploy
