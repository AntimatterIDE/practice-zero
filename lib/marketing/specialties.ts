export type SpecialtySlug =
  | "ophthalmology"
  | "orthopedics"
  | "primary-care"
  | "dermatology"
  | "ob-gyn";

export type SpecialtyContent = {
  slug: SpecialtySlug;
  label: string;
  kicker: string;
  headline: string;
  support: string;
  zeroOut: { title: string; body: string }[];
  faq: { q: string; a: string }[];
  searchTitle: string;
  searchDescription: string;
  keywords: string[];
};

export const specialties: SpecialtyContent[] = [
  {
    slug: "ophthalmology",
    label: "Ophthalmology",
    kicker: "Ophthalmology",
    headline: "less administration. more clinic time.",
    support:
      "practice zero puts chart, eligibility, claims, and outreach on one morning board — built for independent ophthalmology practices where procedure and medical billing share the same day.",
    zeroOut: [
      {
        title: "after-hours charting",
        body: "Notes and codes settle while the visit is still open, so the front and back office aren’t catching up at night.",
      },
      {
        title: "missed eligibility",
        body: "Coverage checks land before the patient is in the chair — not after the claim is denied.",
      },
      {
        title: "payer phone tag",
        body: "Agents keep claims and remittances moving so your team isn’t stuck on hold for routine follow-up.",
      },
    ],
    faq: [
      {
        q: "Will this fit our specialty forms and consent?",
        a: "Yes. Onboarding includes practice-specific components and specialty forms. We stay through go-live under the one-year billing agreement.",
      },
      {
        q: "How does pricing work?",
        a: "EHR, billing, and marketing are included at no additional license fee when collections route through Practice Zero under a one-year billing agreement. Optional advertising spend is separate.",
      },
      {
        q: "Can we try it before a consultation?",
        a: "Open the live demo at /try — then request a consultation when you want a walkthrough for your practice.",
      },
    ],
    searchTitle: "Ophthalmology EHR & billing for independent practices",
    searchDescription:
      "Agentic EHR for ophthalmology: chart, eligibility, claims, and outreach on one morning board. No extra license fee under a one-year billing agreement.",
    keywords: [
      "ophthalmology EHR",
      "ophthalmology practice management",
      "ophthalmology billing software",
      "independent ophthalmology practice",
    ],
  },
  {
    slug: "orthopedics",
    label: "Orthopedics",
    kicker: "Orthopedics",
    headline: "less administration. more care.",
    support:
      "high-dollar visits, prior auth, and remittances stay on one morning board — so independent ortho practices spend mornings on rooms, not payer loops.",
    zeroOut: [
      {
        title: "prior auth chasing",
        body: "Uploads and status stay attached to the visit so authorizations don’t live in a separate inbox.",
      },
      {
        title: "claim leakage",
        body: "Documentation, coding, and claim drafts stay connected from the room to the remittance.",
      },
      {
        title: "unconfirmed mornings",
        body: "Outreach confirms the schedule before first light so the board starts closer to zero.",
      },
    ],
    faq: [
      {
        q: "Do you handle orthopedic agreements and consents?",
        a: "Yes. We customize intake and agreements for your practice during white-glove onboarding.",
      },
      {
        q: "Is there a per-provider software fee?",
        a: "No additional license fee when you route collections through Practice Zero under a one-year billing agreement.",
      },
      {
        q: "How fast can we go live?",
        a: "Onboarding is unlimited hours through go-live: discovery, build, and 24/7 support for the life of the agreement.",
      },
    ],
    searchTitle: "Orthopedic practice EHR, RCM & prior auth",
    searchDescription:
      "Agentic EHR for independent orthopedics — prior auth, claims, and outreach on one morning board with a one-year billing agreement.",
    keywords: [
      "orthopedic EHR",
      "orthopedic practice management",
      "orthopedic billing",
      "prior authorization orthopedic",
    ],
  },
  {
    slug: "primary-care",
    label: "Primary care",
    kicker: "Primary care",
    headline: "less administration. more care.",
    support:
      "volume mornings need eligibility, charting, claims, and follow-up in one place. practice zero agents clear the loops so family and internal medicine teams run the rooms.",
    zeroOut: [
      {
        title: "after-hours charting",
        body: "The note is drafted in the visit so panels don’t spill into evenings.",
      },
      {
        title: "missed eligibility checks",
        body: "Batch and real-time checks protect the schedule before the patient arrives.",
      },
      {
        title: "phone tag with payers",
        body: "Denials and unpaid claims stay prioritized on the board instead of a sticky-note pile.",
      },
    ],
    faq: [
      {
        q: "Is this only for large groups?",
        a: "No. Practice Zero is built for independent practices — solo through multi-provider primary care.",
      },
      {
        q: "What about our existing billing company?",
        a: "Collections route through Practice Zero under a one-year billing agreement. We walk the model live on a consultation.",
      },
      {
        q: "Can patients still use a portal?",
        a: "Yes. The patient experience sits beside the morning board — forms, messages, and balances stay in sync.",
      },
    ],
    searchTitle: "Primary care EHR & billing for independent practices",
    searchDescription:
      "Agentic EHR for family and internal medicine: eligibility, charting, claims, and outreach on one morning board.",
    keywords: [
      "primary care EHR",
      "family medicine EHR",
      "independent practice EHR",
      "medical billing for small practice",
    ],
  },
  {
    slug: "dermatology",
    label: "Dermatology",
    kicker: "Dermatology",
    headline: "less administration. more care.",
    support:
      "medical and cash-pay days share one board — chart, claim, and outreach without a separate growth stack bolted on.",
    zeroOut: [
      {
        title: "split stacks",
        body: "Clinical, billing, and outreach stop living in three tools that never agree on the patient.",
      },
      {
        title: "missed follow-ups",
        body: "Recall and balance outreach wait in the outbox instead of a spreadsheet.",
      },
      {
        title: "claim rework",
        body: "Codes and claims stay attached to the visit so denials don’t restart from scratch.",
      },
    ],
    faq: [
      {
        q: "Do you support medical and cosmetic workflows?",
        a: "The platform covers clinical documentation, billing, and outreach for independent derm practices. We tailor forms and flows in onboarding.",
      },
      {
        q: "Is advertising included?",
        a: "Optional advertising spend is separate and on your terms. The platform itself has no extra license fee under the billing agreement.",
      },
      {
        q: "Where do we start?",
        a: "Try the demo, then request a consultation — or come straight from a specialty email to this page.",
      },
    ],
    searchTitle: "Dermatology EHR, billing & patient outreach",
    searchDescription:
      "Agentic EHR for independent dermatology practices — chart, claims, and outreach on one morning board.",
    keywords: [
      "dermatology EHR",
      "dermatology practice management",
      "dermatology billing software",
      "derm practice software",
    ],
  },
  {
    slug: "ob-gyn",
    label: "OB-GYN",
    kicker: "OB-GYN",
    headline: "less administration. more care.",
    support:
      "scheduling intensity, claims, and patient follow-up clear on one morning board — so independent OB-GYN teams spend the day on care, not coordination.",
    zeroOut: [
      {
        title: "unconfirmed mornings",
        body: "Confirmations and reminders run before first light so the schedule isn’t rebuilt at the desk.",
      },
      {
        title: "eligibility surprises",
        body: "Coverage is checked early so visits aren’t turned away at check-in.",
      },
      {
        title: "after-hours admin",
        body: "Agents keep charting and claim prep moving so evenings stay off the clock.",
      },
    ],
    faq: [
      {
        q: "Can you match our specialty intake?",
        a: "Yes. White-glove onboarding brings your specialty forms and agreements into the practice build.",
      },
      {
        q: "How is this different from per-seat EHR pricing?",
        a: "There is no additional license fee when collections route through Practice Zero under a one-year billing agreement.",
      },
      {
        q: "Is support available after go-live?",
        a: "Support stays 24/7 for the life of the contract — not only during onboarding.",
      },
    ],
    searchTitle: "OB-GYN EHR & practice billing for independents",
    searchDescription:
      "Agentic EHR for independent OB-GYN practices: scheduling, eligibility, claims, and outreach on one morning board.",
    keywords: [
      "OB-GYN EHR",
      "OBGYN practice management",
      "women's health EHR",
      "OB-GYN billing software",
    ],
  },
];

export function getSpecialty(slug: string): SpecialtyContent | undefined {
  return specialties.find((item) => item.slug === slug);
}

export function specialtyPath(slug: SpecialtySlug) {
  return `/specialties/${slug}`;
}

export function specialtyContactHref(slug: SpecialtySlug) {
  return `/contact?specialty=${slug}`;
}
