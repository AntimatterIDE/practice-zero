export type SpecialtySlug =
  | "ophthalmology"
  | "orthopedics"
  | "primary-care"
  | "dermatology"
  | "ob-gyn";

export type SpecialtyBlock = {
  title: string;
  body: string;
};

export type SpecialtyContent = {
  slug: SpecialtySlug;
  label: string;
  kicker: string;
  headline: string;
  support: string;
  /** What the specialty’s day actually feels like. */
  reality: SpecialtyBlock;
  /** Concrete ways Practice Zero maps to that specialty. */
  howWeHelp: SpecialtyBlock[];
  /** What the morning board surfaces for this specialty. */
  board: SpecialtyBlock[];
  zeroOut: SpecialtyBlock[];
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
    headline: "procedure mornings and medical visits. one board.",
    support:
      "independent ophthalmology practices run high-throughput clinics where injections, lasers, cataract workups, and medical visits share the same day. practice zero keeps chart, eligibility, claims, and outreach on one morning board so the front desk isn’t rebuilding the schedule while the back office chases remits.",
    reality: {
      title: "the ophthalmology day is already full before the first dilation.",
      body: "you’re balancing procedure lanes with medical follow-ups, same-day add-ons, and payer rules that differ by site of service. notes need to support both clinical care and clean claims. eligibility misses show up as chair-time waste. unpaid claims and denial follow-up steal evenings from people who already worked a full clinic. growth outreach for recalls and overdue visits usually lives in a separate tool that never matches the chart.",
    },
    howWeHelp: [
      {
        title: "chart and code while the visit is still open",
        body: "agents help settle documentation and coding in the room so procedure and medical visits don’t pile into after-hours catch-up.",
      },
      {
        title: "eligibility before the patient is dilated",
        body: "coverage and prior auth status land early enough to protect injections, lasers, and workups — not after the claim comes back unpaid.",
      },
      {
        title: "claims attached to the visit",
        body: "documentation, claim drafts, patient pay, and remittance status stay connected so denial rework doesn’t restart from a fax pile.",
      },
      {
        title: "recall and confirm without a second stack",
        body: "outreach for overdue exams, postop checks, and open slots runs from the same practice surface as chart and billing — including reputation and reviews.",
      },
      {
        title: "specialty forms in onboarding",
        body: "consent, procedure agreements, and practice-specific intake come in during white-glove build — not as a generic template you fight later.",
      },
    ],
    board: [
      {
        title: "today’s rooms",
        body: "confirmed visits, open chairs, and same-day adds in one view before first light.",
      },
      {
        title: "eligibility & authorizations",
        body: "coverage and auth status tied to the visit so the desk isn’t guessing at check-in.",
      },
      {
        title: "out-of-network claims",
        body: "the visit fee is collected at the practice, and the claim is filed out of network.",
      },
      {
        title: "claims in motion",
        body: "submitted, action-needed, and remitted work prioritized instead of buried in a payer portal.",
      },
      {
        title: "outreach queue",
        body: "recalls, confirms, and balance follow-ups waiting in the outbox under your rules.",
      },
    ],
    zeroOut: [
      {
        title: "after-hours charting",
        body: "notes and codes settle while the visit is still open, so the clinic isn’t catching up at night after a full injection and procedure day.",
      },
      {
        title: "missed eligibility",
        body: "coverage checks land before the patient is in the chair — not after a high-cost visit becomes a denial.",
      },
      {
        title: "payer phone tag",
        body: "agents keep claims and remittances moving so your team isn’t stuck on hold for routine follow-up.",
      },
      {
        title: "split growth tools",
        body: "recall and schedule outreach stop living in a bolted-on marketing stack that never agrees with the chart.",
      },
      {
        title: "generic onboarding",
        body: "your specialty forms and workflows are built into the practice during go-live, not left as homework for the staff.",
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
        q: "Do you understand procedure-heavy ophthalmology days?",
        a: "That’s the point of this lander. The morning board is built for clinics where medical visits and procedures share the same schedule — eligibility, chart, claim, and outreach in one place.",
      },
      {
        q: "Can we try it before a consultation?",
        a: "Open the live demo at /try — then request a consultation when you want a walkthrough framed for your practice.",
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
    headline: "prior auth, high-dollar visits, and remits. still one morning.",
    support:
      "independent ortho practices live in prior auth loops, imaging coordination, and claims that matter when they stall. practice zero keeps documentation, authorizations, claims, and outreach on one morning board so your team spends mornings on rooms — not payer inboxes.",
    reality: {
      title: "ortho admin isn’t paperwork. it’s blocked care and delayed cash.",
      body: "surgeries and injections wait on authorizations. imaging and therapy orders need follow-through. high-dollar claims get stuck when documentation and coding drift apart. the front desk confirms a schedule that the OR and clinic both depend on. unpaid remits and denial work often sit with one burned-out person while providers keep seeing volume. none of that should require three softwares and a shared spreadsheet.",
    },
    howWeHelp: [
      {
        title: "prior auth attached to the visit",
        body: "uploads, status, and next steps stay with the patient and visit so auth doesn’t live in a separate email thread.",
      },
      {
        title: "documentation that survives the claim",
        body: "notes, coding support, and claim drafts stay connected from the room to the remittance — less leakage on high-dollar work.",
      },
      {
        title: "mornings that start confirmed",
        body: "outreach confirms the schedule before first light so no-shows and last-minute chaos don’t own the board.",
      },
      {
        title: "denials and unpaid claims prioritized",
        body: "action-needed work surfaces on the board instead of disappearing into a payer portal bookmark.",
      },
      {
        title: "agreements and consents in the build",
        body: "white-glove onboarding brings orthopedic agreements and intake into the practice so go-live matches how you already operate.",
      },
    ],
    board: [
      {
        title: "schedule integrity",
        body: "confirms, open slots, and high-stakes visits visible before the day starts.",
      },
      {
        title: "auth pipeline",
        body: "pending, submitted, and approved authorizations tied to the visits that need them.",
      },
      {
        title: "out-of-network claims",
        body: "the visit fee is collected at the practice, and the claim is filed out of network.",
      },
      {
        title: "claim & remit status",
        body: "high-dollar claims and unpaid balances ranked by what needs a human today.",
      },
      {
        title: "patient follow-up",
        body: "recalls, postop checks, and balance outreach in one outbox.",
      },
    ],
    zeroOut: [
      {
        title: "prior auth chasing",
        body: "uploads and status stay attached to the visit so authorizations don’t live in a separate inbox while surgery dates slip.",
      },
      {
        title: "claim leakage",
        body: "documentation, coding, and claim drafts stay connected from the room to the remittance on visits that can’t afford rework.",
      },
      {
        title: "unconfirmed mornings",
        body: "outreach confirms the schedule before first light so the board starts closer to zero.",
      },
      {
        title: "orphan denial piles",
        body: "denials and unpaid claims stay prioritized on the board instead of a sticky-note stack owned by one person.",
      },
      {
        title: "bolt-on scheduling tools",
        body: "confirmations and recalls run from the same surface as clinical and billing work.",
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
        q: "Can prior auth stay with the visit?",
        a: "That’s the design. Auth status and uploads stay attached to the visit on the morning board so the desk isn’t hunting email threads.",
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
    headline: "panel volume without the evening charting tax.",
    support:
      "family and internal medicine mornings are eligibility, chronic care, same-day sick visits, and a phone that never stops. practice zero agents clear the admin loops — chart, coverage, claims, and follow-up — so independent primary care teams can run the rooms.",
    reality: {
      title: "primary care fails quietly when admin outruns the panel.",
      body: "you’re managing volume, not one blockbuster procedure. missed eligibility becomes walkouts and write-offs. notes spill into evenings because the visit never had room to finish them. denials and unpaid claims cluster until someone has a “billing day.” outreach for annuals, labs, and gaps in care usually sits in a portal or spreadsheet nobody trusts. independent practices feel this harder because there isn’t a hospital army behind the desk.",
    },
    howWeHelp: [
      {
        title: "notes drafted in the visit",
        body: "documentation support keeps panels from spilling into nights — the note, e-prescribe, and labs move while the patient is still in the room.",
      },
      {
        title: "eligibility before the waiting room fills",
        body: "batch and real-time checks protect the schedule so coverage surprises don’t become mid-morning chaos.",
      },
      {
        title: "claims and denials on the same board",
        body: "unpaid work and patient pay stay prioritized instead of becoming a Friday catch-up project for whoever has time.",
      },
      {
        title: "outreach that matches the chart",
        body: "recalls, confirms, and follow-ups run from the practice surface — not a separate growth product that invents its own patient list.",
      },
      {
        title: "built for independents",
        body: "solo through multi-provider primary care. white-glove onboarding, no hospital IT department required.",
      },
    ],
    board: [
      {
        title: "today’s panel flow",
        body: "confirmed visits, openings, and same-day demand in one morning view.",
      },
      {
        title: "coverage checks",
        body: "eligibility and prior auth status before check-in so the desk isn’t troubleshooting at the window.",
      },
      {
        title: "revenue follow-through",
        body: "claims needing action and unpaid balances ranked for the day.",
      },
      {
        title: "care gaps & outreach",
        body: "recalls and follow-ups queued under your rules, tied to real patients.",
      },
    ],
    zeroOut: [
      {
        title: "after-hours charting",
        body: "the note is drafted in the visit so panels don’t spill into evenings after a full day of volume.",
      },
      {
        title: "missed eligibility checks",
        body: "batch and real-time checks protect the schedule before the patient arrives.",
      },
      {
        title: "phone tag with payers",
        body: "denials and unpaid claims stay prioritized on the board instead of a sticky-note pile.",
      },
      {
        title: "orphan recall lists",
        body: "outreach for annuals and follow-ups stops living in a spreadsheet that drifts from the chart.",
      },
      {
        title: "enterprise-only software",
        body: "practice zero is built for independent primary care — not a hospital rollout you can’t staff.",
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
      {
        q: "How is this different from another EHR seat tax?",
        a: "There is no additional license fee when collections route through Practice Zero under a one-year billing agreement. EHR, billing, and marketing sit on one surface.",
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
    headline: "medical visits and cash-pay days. same practice surface.",
    support:
      "independent derm practices mix medical dermatology with procedure and cash-pay days — and usually end up with three tools that never agree. practice zero puts chart, claim, and outreach on one morning board so clinical, billing, and follow-up share the same patient.",
    reality: {
      title: "derm admin breaks when medical and cash-pay don’t share a brain.",
      body: "you’re coding medical visits next to procedure days, managing biopsies and pathology follow-up, and trying to keep recall full without a marketing stack that invents its own CRM. claim rework starts when documentation and coding drift. no-shows and unfinished balances eat margin. staff bounce between EHR, billing software, and a growth tool that doesn’t know what happened in the room.",
    },
    howWeHelp: [
      {
        title: "one patient across clinical and billing",
        body: "chart, e-prescribe, claim, and patient pay stay attached so medical and cash-pay workflows don’t fork into conflicting systems.",
      },
      {
        title: "claims that restart less often",
        body: "codes and claim drafts stay with the visit — including pathology follow-up — so denials don’t send someone back to square one.",
      },
      {
        title: "recall without a bolt-on CRM",
        body: "follow-ups, recalls, and open-slot outreach wait in the outbox — tied to the chart, not a spreadsheet export.",
      },
      {
        title: "optional ads, included platform",
        body: "advertising spend stays optional and on your terms. reputation and reviews sit with the same growth surface. the platform itself has no extra license fee under the billing agreement.",
      },
      {
        title: "forms and flows tailored in onboarding",
        body: "intake, consents, and practice-specific paths get built during white-glove go-live for how your derm clinic actually runs.",
      },
    ],
    board: [
      {
        title: "today’s mix",
        body: "medical, procedure, and follow-up visits confirmed before the doors open.",
      },
      {
        title: "eligibility & balances",
        body: "the fee is collected at the visit, and the claim is filed out of network.",
      },
      {
        title: "claims & remits",
        body: "submitted and action-needed claims ranked so rework doesn’t wait for “billing day.”",
      },
      {
        title: "recall & outreach",
        body: "overdue visits, reviews, and open chairs filled from the same surface as care.",
      },
    ],
    zeroOut: [
      {
        title: "split stacks",
        body: "clinical, billing, and outreach stop living in three tools that never agree on the patient.",
      },
      {
        title: "missed follow-ups",
        body: "recall and balance outreach wait in the outbox instead of a spreadsheet nobody updates.",
      },
      {
        title: "claim rework",
        body: "codes and claims stay attached to the visit so denials don’t restart from scratch.",
      },
      {
        title: "checkout surprises",
        body: "eligibility and responsibility surface earlier so the desk isn’t negotiating coverage after the visit.",
      },
      {
        title: "growth tools that invent patients",
        body: "outreach uses the real practice list — not a bolted-on CRM that drifts from the chart.",
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
        q: "Will this replace our separate marketing tool?",
        a: "Outreach and recall sit on the same morning board as chart and billing — so you aren’t maintaining a second patient universe for growth.",
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
    headline: "scheduling intensity, coverage, and follow-up. cleared by morning.",
    support:
      "independent OB-GYN practices run dense schedules, sensitive intake, and payer complexity that doesn’t forgive a sloppy front desk. practice zero clears confirmations, eligibility, charting, claims, and outreach on one morning board so the day stays on care — not coordination.",
    reality: {
      title: "OB-GYN mornings are coordination under time pressure.",
      body: "the schedule is dense. confirmations and no-shows reshape the day before first light. eligibility surprises at check-in waste chair time and trust. specialty intake and consents have to be right. claims and unpaid balances stack while the phone keeps ringing. after-hours admin becomes normal because the visit never had a clean place to finish documentation and claim prep. independent practices feel every miss because there isn’t a hospital buffer.",
    },
    howWeHelp: [
      {
        title: "confirmations before first light",
        body: "outreach runs early so the schedule isn’t rebuilt at the desk while patients are already walking in.",
      },
      {
        title: "eligibility before check-in",
        body: "coverage and prior auth status are checked early enough to protect the visit — not turned into a waiting-room negotiation.",
      },
      {
        title: "specialty intake in the build",
        body: "white-glove onboarding brings your specialty forms, e-prescribing, labs, and agreements into the practice so go-live matches how you work.",
      },
      {
        title: "chart and claim prep that don’t wait for night",
        body: "agents keep documentation, e-prescribe, labs, and claim work moving so evenings aren’t the default admin shift.",
      },
      {
        title: "follow-up without a second system",
        body: "recalls, reminders, patient pay, and balance outreach stay on the same board as clinical and billing work.",
      },
    ],
    board: [
      {
        title: "schedule truth",
        body: "confirmed visits and openings visible before the phones start.",
      },
      {
        title: "coverage early",
        body: "eligibility and prior auth status tied to today’s visits so check-in stays calm.",
      },
      {
        title: "claims & balances",
        body: "action-needed revenue work and patient pay prioritized for the people who can clear it.",
      },
      {
        title: "patient outreach",
        body: "reminders, recalls, and follow-ups queued under practice rules.",
      },
    ],
    zeroOut: [
      {
        title: "unconfirmed mornings",
        body: "confirmations and reminders run before first light so the schedule isn’t rebuilt at the desk.",
      },
      {
        title: "eligibility surprises",
        body: "coverage is checked early so visits aren’t turned away — or argued over — at check-in.",
      },
      {
        title: "after-hours admin",
        body: "agents keep charting and claim prep moving so evenings stay off the clock.",
      },
      {
        title: "intake chaos",
        body: "specialty forms and agreements are built into the practice during onboarding, not improvised at the window.",
      },
      {
        title: "orphaned follow-ups",
        body: "recalls and balance outreach stop living in side lists that never match the chart.",
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
      {
        q: "Will this help with no-shows and dense schedules?",
        a: "Confirmations and reminders run before first light from the morning board so the schedule starts closer to true — not rebuilt after patients arrive.",
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
