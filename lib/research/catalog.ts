import type { ResearchArticle } from "@/lib/research/types";
import { slugify } from "@/lib/research/types";

type SourceKind = "Brief" | "Survey" | "Report";
type SourceYear = "2024" | "2025" | "2026";

type CatalogSource = {
  kind: SourceKind;
  year: SourceYear;
  title: string;
  url?: string;
};

type SectionBodies = [
  problem: string[],
  field: string[],
  practice: string[],
  approach: string[],
  demo: string[],
];

type CatalogSpec = {
  key: string;
  headline: string;
  publishedAt: string;
  photo: string;
  excerpt: string;
  searchTitle: string;
  searchDescription: string;
  keywords: string[];
  topic: string;
  readMinutes: number;
  bodies: SectionBodies;
  sources: CatalogSource[];
};

const SECTION_TITLES = [
  "Practice Zero and this problem",
  "What the field is learning",
  "What that means for a practice",
  "How Practice Zero approaches this",
  "What a demo can clarify",
] as const;

const AUTHOR_NAME = "practice zero";
const COVER_CREDIT = "Photo · Unsplash";

function cover(photo: string) {
  return `https://images.unsplash.com/${photo}?w=1600&h=900&fit=crop`;
}

function buildArticle(spec: CatalogSpec): ResearchArticle {
  const title = `${spec.headline}: Insights from Practice Zero`;
  return {
    id: `demo-${spec.key}`,
    created_at: spec.publishedAt,
    updated_at: spec.publishedAt,
    published_at: spec.publishedAt,
    status: "published",
    title,
    slug: slugify(title),
    excerpt: spec.excerpt,
    cover_image_url: cover(spec.photo),
    cover_credit: COVER_CREDIT,
    search_title: spec.searchTitle,
    search_description: spec.searchDescription,
    keywords: spec.keywords,
    topic: spec.topic,
    body_markdown: "",
    sections: SECTION_TITLES.map((sectionTitle, index) => ({
      id: slugify(sectionTitle),
      title: sectionTitle,
      body: spec.bodies[index].join("\n\n"),
    })),
    sources: spec.sources,
    read_minutes: spec.readMinutes,
    author_name: AUTHOR_NAME,
  };
}

const specs: CatalogSpec[] = [
  // 1
  {
    key: "agentic-ehr",
    headline: "Agentic EHR without an office manager",
    publishedAt: "2026-03-01T12:00:00.000Z",
    photo: "photo-1576091160399-112ba8d25d1d",
    excerpt:
      "A practice can run on space, room hardware, and Practice Zero agents. Scheduling, follow-up, claims, and payment tracking stay autonomous under your rules.",
    searchTitle: "Agentic EHR without an office manager",
    searchDescription:
      "How Practice Zero agents handle scheduling, follow-up, claims, and payment tracking under your rules, with humans approving exceptions.",
    keywords: ["agentic EHR", "Practice Zero", "office manager", "autonomous agents", "independent practice"],
    topic: "agentic EHR",
    readMinutes: 6,
    bodies: [
      [
        "Independent practices spend much of the day on coordination: eligibility checks, scheduling, reminders, claims, and payment follow-up. For years the answer was an office manager at the center of it all, holding the rules in their head.",
        "Practice Zero treats this as an agentic EHR problem. The software does not just record what happened. It acts on it, under rules your practice sets.",
      ],
      [
        "Administrative burden is one of the most consistent themes in ambulatory care research. Physician surveys and policy analyses keep pointing to the same pattern: clinical time gets crowded out by work that repeats every day and rarely needs a clinician.",
        "Ambient AI scribes are also becoming native to major EHR platforms, including Epic and athenahealth. Capture is becoming a standard feature. The open question is what happens after the note exists.",
        "Practices that connect the note to the next action, whether that is a recall, a claim, or a payment check, see the most benefit.",
      ],
      [
        "A practice no longer has to assume that growth means another desk of administrative hires. Routine loops can be owned by agents: schedule the follow-up, prepare the claim, watch the payment.",
        "Your team keeps the judgment calls. Exceptions go to a person, and everything inside your rules runs without a queue of reminders.",
      ],
      [
        "Practice Zero agents schedule, follow up, prepare claims, and track payments under your practice rules. Humans approve exceptions, such as unusual coverage, a disputed balance, or a visit that does not fit the standard path.",
        "Optional room hardware captures visits so agents start from what actually happened. EHR, billing, and marketing come as one platform with no additional license fee when collections route through Practice Zero under a one-year billing agreement.",
      ],
      [
        "A short demo at /try shows the division of labor clearly. You see what agents own, what lands on the morning board for approval, and how a visit becomes a follow-up and a claim.",
        "This note is general product information, not clinical advice.",
      ],
    ],
    sources: [
      {
        kind: "Survey",
        year: "2025",
        title: "AMA physician survey themes on administrative burden and prior authorization workload",
        url: "https://www.ama-assn.org/practice-management/prior-authorization",
      },
      {
        kind: "Brief",
        year: "2025",
        title: "Industry coverage of ambient AI scribes becoming native to Epic and athenahealth workflows",
      },
      {
        kind: "Report",
        year: "2024",
        title: "Commonwealth Fund research on administrative burden in U.S. health care",
      },
    ],
  },
  // 2
  {
    key: "room-hardware",
    headline: "Room hardware that schedules the follow-up",
    publishedAt: "2026-03-16T12:00:00.000Z",
    photo: "photo-1516549655169-df83a0774514",
    excerpt:
      "Install capture in the room once. Practice Zero agents turn the visit into notes, follow-ups, and the next open slot without another clipboard.",
    searchTitle: "Room hardware that schedules the follow-up",
    searchDescription:
      "How optional Practice Zero room hardware feeds agents that schedule follow-ups and keep claims and payments moving.",
    keywords: ["room hardware", "visit capture", "follow-up scheduling", "Practice Zero", "ambient capture"],
    topic: "room hardware",
    readMinutes: 5,
    bodies: [
      [
        "Visit detail often fades between the exam room and the front desk. The plan said to return in six weeks, but the schedule never hears about it. A handwritten note or a verbal handoff becomes a missed recall.",
        "Optional room hardware closes that gap. It captures the visit in the room, and Practice Zero agents carry the result into scheduling and billing.",
      ],
      [
        "Ambient scribes have moved quickly from pilots to standard features, and major EHR vendors now offer them natively. That is good news for documentation time.",
        "The practices getting the most from capture are the ones where something acts on the transcript. A note that sits in a chart helps the chart. A note that triggers the next appointment helps the patient and the schedule.",
      ],
      [
        "Hardware is optional, and it pays off when the follow-up is the point. Once a room is equipped, the visit itself can propose the next appointment, the lab reminder, and the claim path.",
        "Your clinicians stay focused on the patient in front of them. The clerical afterthought stops being theirs.",
      ],
      [
        "Practice Zero connects room capture to the same agent stack that runs scheduling, claims, and payment tracking. There is no separate scribe product to reconcile with a separate billing tool.",
        "Agents propose the follow-up using your practice rules, such as visit types, provider availability, and preferred intervals. Exceptions surface for a person to approve.",
      ],
      [
        "A demo at /try can show a captured visit becoming a scheduled follow-up and a draft claim in one pass. You can see what the agent proposes and what waits for approval.",
        "This note is general product information, not clinical advice.",
      ],
    ],
    sources: [
      {
        kind: "Brief",
        year: "2025",
        title: "Industry reporting on ambient AI scribes shipping inside EHR platforms",
      },
      {
        kind: "Report",
        year: "2024",
        title: "Research on after-hours EHR documentation work among ambulatory physicians",
      },
    ],
  },
  // 3
  {
    key: "scribe-to-claim",
    headline: "From ambient scribe to claim draft in one pass",
    publishedAt: "2026-04-01T12:00:00.000Z",
    photo: "photo-1559757148-5c350d0d3c56",
    excerpt:
      "A note is only the middle of the workflow. Practice Zero carries the visit from capture to a claim draft so it leaves the room ready to review.",
    searchTitle: "From ambient scribe to claim draft in one pass",
    searchDescription:
      "How Practice Zero connects visit capture to a claim draft in one pass, so documentation and billing stop living in separate tools.",
    keywords: ["ambient scribe", "claim draft", "documentation to billing", "Practice Zero", "revenue cycle"],
    topic: "scribe to claim",
    readMinutes: 6,
    bodies: [
      [
        "In many practices the note and the claim live in different worlds. The clinician finishes documentation, and later someone else interprets it into codes, modifiers, and attachments.",
        "Every handoff adds delay and a chance for the claim to drift from the visit. Practice Zero treats documentation and billing as one continuous workflow.",
      ],
      [
        "Ambient AI scribes are becoming a standard part of EHR platforms, which has made capture widely available. The next question practices ask is how much of the downstream work that capture can start.",
        "Revenue cycle reporting continues to describe denials and rework as a staffing issue. Claims that start from complete, well-structured documentation tend to need less of it.",
      ],
      [
        "For a practice, the practical gain is time to claim. When the draft exists as the visit closes, billing review becomes a short check instead of a reconstruction.",
        "Clinicians still own what the note says. The agent organizes it into a claim-ready form, and your rules decide when a person reviews it.",
      ],
      [
        "Practice Zero agents move from capture to note to claim draft inside one product. They use your practice rules for visit types, payer preferences, and what needs a second look.",
        "Because EHR and billing are the same platform, there is no export step to forget. Eligibility results, visit details, and the claim draft stay linked.",
      ],
      [
        "A demo at /try can show a single visit travelling from room capture to a claim draft. It makes the handoffs visible and shows where a person stays in control.",
        "This note is general product information, not clinical advice.",
      ],
    ],
    sources: [
      {
        kind: "Brief",
        year: "2025",
        title: "Industry coverage of ambient AI scribes becoming EHR-native at Epic and athenahealth",
      },
      {
        kind: "Brief",
        year: "2025",
        title: "Industry reporting on claim denial rates and revenue cycle staffing pressure",
      },
      {
        kind: "Report",
        year: "2024",
        title: "Research on after-hours EHR work and documentation burden",
      },
    ],
  },
  // 4
  {
    key: "eligibility-denials",
    headline: "Eligibility before checkout and denial prevention",
    publishedAt: "2026-04-16T12:00:00.000Z",
    photo: "photo-1519494026892-80bbd2d6fd0d",
    excerpt:
      "Most avoidable denials begin before the visit. Practice Zero agents verify eligibility early, so coverage questions are answered while the patient can still act on them.",
    searchTitle: "Eligibility before checkout and denial prevention",
    searchDescription:
      "How Practice Zero agents verify eligibility ahead of the visit and flag coverage issues early to prevent avoidable denials.",
    keywords: ["eligibility verification", "denial prevention", "front desk", "Practice Zero", "revenue cycle"],
    topic: "eligibility and denials",
    readMinutes: 5,
    bodies: [
      [
        "A claim denied for inactive coverage is a problem that existed days before the claim. Someone could have caught it at scheduling, but the front desk was busy and the check slipped.",
        "Practice Zero moves eligibility to the start of the workflow, where it can change what happens next.",
      ],
      [
        "Denial management is one of the largest sources of administrative cost in ambulatory billing. Industry reporting regularly highlights revenue cycle staffing shortages alongside rising denial rates.",
        "The common lesson is to fix problems upstream. A correction made before the visit is cheaper than an appeal made after it.",
      ],
      [
        "Practices benefit from a rhythm in which eligibility is checked as the visit is scheduled and again as the day approaches. Coverage changes get caught while the patient can update their information.",
        "Staff spend their time on the true exceptions, such as a patient with no active plan, rather than running the same lookup repeatedly.",
      ],
      [
        "Practice Zero agents run eligibility checks ahead of the visit and again before checkout, following your rules for timing and payer types. Results flow into the claim draft, so what was verified is what gets submitted.",
        "When something looks wrong, the issue lands on the morning board with context. A person approves the exception instead of hunting for it.",
      ],
      [
        "A demo at /try can walk through an eligibility result changing the day. You see which items resolve on their own and which wait for a person.",
        "This note is general product information, not clinical advice.",
      ],
    ],
    sources: [
      {
        kind: "Brief",
        year: "2025",
        title: "Industry reporting on claim denials and revenue cycle staffing in ambulatory practices",
      },
      {
        kind: "Report",
        year: "2024",
        title: "Commonwealth Fund analysis of administrative complexity and billing costs",
      },
    ],
  },
  // 5
  {
    key: "morning-board",
    headline: "The morning board at zero open tasks",
    publishedAt: "2026-05-01T12:00:00.000Z",
    photo: "photo-1538108149393-fbbd81895907",
    excerpt:
      "Practice Zero turns the day's admin work into a single morning board. The goal is simple: agents clear what they can, and you approve only what needs you.",
    searchTitle: "The morning board at zero open tasks",
    searchDescription:
      "How the Practice Zero morning board shows what agents finished and what needs your approval, with zero open tasks as the goal.",
    keywords: ["morning board", "zero open tasks", "practice operations", "Practice Zero", "exception approval"],
    topic: "morning board",
    readMinutes: 5,
    bodies: [
      [
        "Most practice managers start the day by reconstructing it. Which claims are stuck, who has not confirmed, and which balances are outstanding. The picture lives in several tabs and a few memories.",
        "Practice Zero replaces that reconstruction with a morning board. It is one view of what the agents completed overnight and what is waiting on you.",
      ],
      [
        "Research on administrative burden keeps returning to fragmentation. Tasks scattered across inboxes, portals, and spreadsheets are harder to prioritize, and they are easier to drop.",
        "A single working list changes the posture of the day. Instead of searching for work, the team reviews a short queue of decisions.",
      ],
      [
        "For a practice, zero open tasks is a useful operating target. It means every item has either been handled by an agent or has been put in front of a person with the context to decide.",
        "Some mornings the board has a handful of approvals. Other mornings it is empty. Both are good outcomes.",
      ],
      [
        "Practice Zero agents work through scheduling, follow-up, claims, and payment tracking under your rules. Whatever falls outside those rules becomes an exception on the board.",
        "Each exception carries what the agent already tried and what it recommends. Approving takes a moment, and the agent finishes the job.",
      ],
      [
        "A demo at /try shows the morning board in action. You see which tasks cleared themselves, which need approval, and how the list shrinks as you work.",
        "This note is general product information, not clinical advice.",
      ],
    ],
    sources: [
      {
        kind: "Report",
        year: "2024",
        title: "Commonwealth Fund research on administrative burden and workflow fragmentation",
      },
      {
        kind: "Survey",
        year: "2025",
        title: "AMA physician survey themes on practice workload and administrative time",
      },
    ],
  },
  // 6
  {
    key: "clean-claims",
    headline: "Claims that leave the room clean",
    publishedAt: "2026-05-16T12:00:00.000Z",
    photo: "photo-1551076805-e1869033e561",
    excerpt:
      "Clean claims are built during the visit, not repaired after it. Practice Zero prepares the claim from the encounter so fewer need rework.",
    searchTitle: "Claims that leave the room clean",
    searchDescription:
      "How Practice Zero builds claims from the encounter itself so they leave the room complete and need less rework later.",
    keywords: ["clean claims", "claim preparation", "encounter capture", "Practice Zero", "billing"],
    topic: "clean claims",
    readMinutes: 5,
    bodies: [
      [
        "A claim that goes out incomplete comes back as work. Missing details, mismatched codes, or absent attachments each create a cycle of review and resubmission.",
        "Practice Zero aims to build the claim while the visit is still fresh, so it leaves the room already assembled.",
      ],
      [
        "Revenue cycle teams consistently report that rework is a major driver of staffing demand. Each avoidable correction takes time that could go to higher-value follow-up.",
        "Documentation quality and claim quality are closely linked. Practices that capture complete encounter detail at the source tend to see fewer downstream corrections.",
      ],
      [
        "For a practice, the aim is first-pass completeness. Eligibility is already verified, the visit detail is already structured, and the claim draft is ready for a quick review.",
        "Your billing staff, whether in-house or not, spend less time repairing and more time on genuine exceptions.",
      ],
      [
        "Practice Zero agents assemble the claim from verified eligibility, captured visit detail, and your payer rules. Checks run before submission, and anything unusual is flagged for a person.",
        "Since the platform includes EHR and billing, the data does not need to move between systems. What the agent prepared is what the payer sees.",
      ],
      [
        "A demo at /try follows one encounter from the room to a submitted claim. You see the checks the agent runs and the points where a person can step in.",
        "This note is general product information, not clinical advice.",
      ],
    ],
    sources: [
      {
        kind: "Brief",
        year: "2025",
        title: "Industry reporting on claim rework and revenue cycle staffing demands",
      },
      {
        kind: "Brief",
        year: "2025",
        title: "Coverage of ambient AI documentation feeding downstream coding and billing workflows",
      },
    ],
  },
  // 7
  {
    key: "denial-followup",
    headline: "Denial follow-up as agent work",
    publishedAt: "2026-06-01T12:00:00.000Z",
    photo: "photo-1579684385127-1ef15d508118",
    excerpt:
      "Denials are predictable work: read the reason, gather what is missing, resubmit or appeal. Practice Zero agents take the routine path and route exceptions to you.",
    searchTitle: "Denial follow-up as agent work",
    searchDescription:
      "How Practice Zero agents handle routine denial follow-up, resubmitting where rules allow and escalating exceptions for approval.",
    keywords: ["denial follow-up", "appeals", "resubmission", "Practice Zero", "revenue cycle management"],
    topic: "denial management",
    readMinutes: 6,
    bodies: [
      [
        "When a denial arrives, the clock starts. Someone has to read the reason, find the missing piece, and decide whether to resubmit or appeal. In a small practice that someone is usually already busy.",
        "Practice Zero treats denial follow-up as steady, repeatable work that agents can own.",
      ],
      [
        "Industry reporting describes denial volume and revenue cycle staffing strain as linked problems. Hiring specialists is difficult, and denials do not wait for open roles.",
        "Many denials follow recognizable patterns, such as missing information, coding mismatches, or coverage questions. Recognizable patterns are what agents handle well.",
      ],
      [
        "A practice gains the most when routine denials move without a person starting each one. The common cases get worked, and the unusual ones get your attention.",
        "That changes the shape of the work. Staff spend their time on appeals that benefit from judgment, not on retyping the same correction.",
      ],
      [
        "Practice Zero agents read denial reasons, gather the supporting detail from the visit record, and prepare the resubmission under your rules. Where an appeal or a patient conversation is needed, the case goes to the morning board.",
        "Each case keeps its history, so you can see what was tried and what happened. Payment tracking picks up where follow-up leaves off.",
      ],
      [
        "A demo at /try can show a denial moving from receipt to resubmission. You see what the agent handles alone and what it escalates.",
        "This note is general product information, not clinical advice.",
      ],
    ],
    sources: [
      {
        kind: "Brief",
        year: "2025",
        title: "Industry reporting on rising claim denials and revenue cycle staffing shortages",
      },
      {
        kind: "Report",
        year: "2024",
        title: "Commonwealth Fund research on administrative costs tied to billing and payment",
      },
      {
        kind: "Brief",
        year: "2026",
        title: "Healthcare finance coverage of automation in denial management",
      },
    ],
  },
  // 8
  {
    key: "payment-tracking",
    headline: "Payment tracking without a spreadsheet owner",
    publishedAt: "2026-06-17T12:00:00.000Z",
    photo: "photo-1666214280557-f1b5022eb634",
    excerpt:
      "When payment tracking depends on one person's spreadsheet, it depends on one person. Practice Zero agents keep every claim and balance visible and moving.",
    searchTitle: "Payment tracking without a spreadsheet owner",
    searchDescription:
      "How Practice Zero agents track claims and payments continuously, so collections no longer depend on one person's spreadsheet.",
    keywords: ["payment tracking", "collections", "accounts receivable", "Practice Zero", "billing automation"],
    topic: "payment tracking",
    readMinutes: 5,
    bodies: [
      [
        "Many practices track what is owed in a spreadsheet maintained by one capable person. It works until that person is out, busy, or gone. Then the aging claims quietly age further.",
        "Practice Zero replaces the owner of the spreadsheet with agents that follow every claim and balance from submission to payment.",
      ],
      [
        "Revenue cycle research and reporting emphasize that unattended receivables lose value over time. Timely follow-up is one of the simplest ways to protect collections.",
        "The difficulty is consistency. Manual tracking depends on someone remembering, and small practices rarely have slack for that.",
      ],
      [
        "A practice benefits from a tracking system that never takes a day off. Each claim has a status, each status has a next step, and stalled items surface on their own.",
        "Owners and managers can see where cash stands without building a report first.",
      ],
      [
        "Practice Zero agents monitor claim status, match payments, and trigger the next action under your rules, whether that is a status check, a resubmission, or a patient balance reminder. Exceptions land on the morning board.",
        "Because collections route through Practice Zero under a one-year billing agreement, the same platform that prepares the claim also tracks its payment.",
      ],
      [
        "A demo at /try can show a set of claims at different stages and what the agents do with each. You can see how stalled items rise to the board without a manual review.",
        "This note is general product information, not clinical advice.",
      ],
    ],
    sources: [
      {
        kind: "Brief",
        year: "2025",
        title: "Industry reporting on accounts receivable follow-up and revenue cycle staffing",
      },
      {
        kind: "Report",
        year: "2024",
        title: "Commonwealth Fund research on administrative complexity in billing and payment",
      },
    ],
  },
  // 9
  {
    key: "prior-auth-uploads",
    headline: "Prior authorization and patient document uploads",
    publishedAt: "2026-07-02T12:00:00.000Z",
    photo: "photo-1584982751601-97dcc096659c",
    excerpt:
      "Prior authorization stalls on missing documents. Practice Zero gives patients a simple way to upload what is needed and gives agents a way to move the request along.",
    searchTitle: "Prior authorization and patient document uploads",
    searchDescription:
      "How Practice Zero helps practices move prior authorization forward by collecting patient documents and tracking each request.",
    keywords: ["prior authorization", "document upload", "patient portal", "Practice Zero", "administrative burden"],
    topic: "prior authorization",
    readMinutes: 6,
    bodies: [
      [
        "Prior authorization is a documentation chase. A payer asks for a record, an insurance card, or a referral, and the request waits while staff track it down. The patient is often the one holding the missing piece.",
        "Practice Zero shortens that chase by giving patients a direct place to provide documents and giving agents the job of tracking the request.",
      ],
      [
        "AMA physician survey work has repeatedly documented the weekly time practices spend on prior authorization, along with the delays and frustration it creates for patients. KFF Health News has also reported on how these requirements affect access and costs.",
        "The common thread is that much of the time goes to coordination, not clinical judgment. That coordination can be organized.",
      ],
      [
        "A practice gets the most from a repeatable path: identify the need early, request the documents, track the submission, and follow up on the status. Each step has an owner, even when the owner is an agent.",
        "Staff attention is reserved for the cases where a clinician needs to weigh in or a payer needs a conversation.",
      ],
      [
        "Practice Zero agents track authorization requests and prompt patients to upload what is missing through the portal at /portal. Uploaded documents attach to the request, and status changes move the case forward.",
        "When a request needs clinical input or a peer conversation, it goes to the morning board with the full file ready.",
      ],
      [
        "A demo at /try can show an authorization request moving from first need to submitted. You see the patient upload step and what the agent does once documents arrive.",
        "This note is general product information, not clinical advice.",
      ],
    ],
    sources: [
      {
        kind: "Survey",
        year: "2025",
        title: "AMA prior authorization physician survey on weekly burden and patient care delays",
        url: "https://www.ama-assn.org/practice-management/prior-authorization",
      },
      {
        kind: "Brief",
        year: "2025",
        title: "KFF Health News reporting on prior authorization and access to care",
      },
      {
        kind: "Report",
        year: "2024",
        title: "Commonwealth Fund research on administrative burden in the U.S. health system",
      },
    ],
  },
  // 10
  {
    key: "intake-night-before",
    headline: "Intake the night before the visit",
    publishedAt: "2026-07-18T12:00:00.000Z",
    photo: "photo-1582750433449-648ed127bb54",
    excerpt:
      "Patients can finish intake at home, on their own time. Practice Zero collects it the night before so the visit starts with the work already done.",
    searchTitle: "Intake the night before the visit",
    searchDescription:
      "How Practice Zero moves patient intake to the night before the visit, so check-in is quick and agents have what they need.",
    keywords: ["patient intake", "digital intake", "pre-visit", "Practice Zero", "check-in"],
    topic: "patient intake",
    readMinutes: 4,
    bodies: [
      [
        "The waiting room clipboard is a bottleneck. Patients fill in forms under time pressure, and staff retype them afterward. Errors and missing fields turn into problems later in the workflow.",
        "Practice Zero moves intake to the night before. Patients complete it at their own pace, with their cards and details at hand.",
      ],
      [
        "Practices have long found that information collected before arrival is more complete than information collected at the desk. Insurance details, medication lists, and contact preferences are easier to get right in a calm setting.",
        "Early intake also feeds everything that follows, from eligibility checks to claim preparation.",
      ],
      [
        "For a practice, pre-visit intake shortens check-in and improves the quality of what the agents work from. The front desk greets patients instead of transcribing for them.",
        "Patients who have not finished can be nudged before the visit, so gaps are handled early.",
      ],
      [
        "Practice Zero agents send the intake request, follow up with patients who have not completed it, and carry the results into eligibility and the visit record. Patients can use the portal at /portal to return to their information.",
        "Incomplete intake that matters shows up on the morning board, so a person can decide how to handle it.",
      ],
      [
        "A demo at /try can show intake completed the night before and what changes at check-in. You see how the information flows into the rest of the visit.",
        "This note is general product information, not clinical advice.",
      ],
    ],
    sources: [
      {
        kind: "Brief",
        year: "2025",
        title: "Industry reporting on digital intake and pre-visit workflows in ambulatory practices",
      },
      {
        kind: "Report",
        year: "2024",
        title: "Commonwealth Fund research on administrative burden and patient paperwork",
      },
    ],
  },
  // 11
  {
    key: "esign-consent",
    headline: "E-sign consent on the critical path",
    publishedAt: "2026-08-02T12:00:00.000Z",
    photo: "photo-1530026405186-ed1f139313f8",
    excerpt:
      "Consent should not wait for the waiting room. Practice Zero puts e-sign forms on the critical path, so they are finished before the visit needs them.",
    searchTitle: "E-sign consent on the critical path",
    searchDescription:
      "How Practice Zero places e-sign consent ahead of the visit so required forms are complete and agents can keep the day on schedule.",
    keywords: ["e-sign consent", "digital forms", "patient consent", "Practice Zero", "visit readiness"],
    topic: "e-sign consent",
    readMinutes: 4,
    bodies: [
      [
        "Consent forms are small tasks with large consequences for the schedule. When a signature is missing at check-in, the visit stalls or runs late while someone scrambles for paper.",
        "Practice Zero treats consent as part of the critical path to a ready visit, not a last-minute add-on.",
      ],
      [
        "Digital forms have become a normal expectation for patients, who sign everything else on a phone. Practices that adopt them tend to reduce paper handling and repeated data entry.",
        "The benefit depends on timing. A digital form still sent at the desk is only a better clipboard.",
      ],
      [
        "A practice can make visit readiness a checklist: eligibility verified, intake complete, consent signed. When all three are in place before arrival, the visit starts on time.",
        "Items that remain open can be followed up while the patient still has time to respond.",
      ],
      [
        "Practice Zero agents send e-sign consent requests with the pre-visit workflow, track completion, and remind patients who have not signed. Signed forms attach to the record, so staff do not search for them later.",
        "Anything unresolved by the day of the visit appears on the morning board, with the patient and the missing item clearly named.",
      ],
      [
        "A demo at /try can show consent moving from request to signature and into the record. You see how readiness is tracked across the schedule.",
        "This note is general product information, not clinical advice. Consent requirements vary, so your practice should confirm its own forms and policies.",
      ],
    ],
    sources: [
      {
        kind: "Brief",
        year: "2025",
        title: "Industry guidance on digital consent and intake in ambulatory care",
      },
      {
        kind: "Report",
        year: "2024",
        title: "Commonwealth Fund research on administrative burden and patient-facing paperwork",
      },
    ],
  },
  // 12
  {
    key: "unconfirmed-mornings",
    headline: "Unconfirmed mornings and scheduling agents",
    publishedAt: "2026-08-18T12:00:00.000Z",
    photo: "photo-1631217868264-e5b90bb7e133",
    excerpt:
      "An unconfirmed appointment is an open question on the schedule. Practice Zero scheduling agents ask it early and fill the gap when the answer is no.",
    searchTitle: "Unconfirmed mornings and scheduling agents",
    searchDescription:
      "How Practice Zero scheduling agents confirm appointments, handle unconfirmed slots, and fill openings before the day begins.",
    keywords: ["appointment confirmation", "scheduling agents", "no-shows", "Practice Zero", "schedule management"],
    topic: "scheduling",
    readMinutes: 5,
    bodies: [
      [
        "The morning starts with a schedule full of maybes. Some patients have confirmed, some have not, and the front desk begins calling. Each unanswered call is a slot that may go unused.",
        "Practice Zero scheduling agents work the question earlier, so the morning begins with answers.",
      ],
      [
        "No-shows and last-minute cancellations are a recurring operational cost for ambulatory practices. Industry reporting consistently points to timely, convenient reminders as one of the most practical responses.",
        "Reminders work best when they connect to action. A cancellation that triggers an offer to another patient is worth more than a cancellation that only leaves a hole.",
      ],
      [
        "A practice benefits from a confirmation rhythm that runs without staff prompting. Patients get reminders in their preferred way, and responses update the schedule right away.",
        "Open slots become opportunities. Waitlisted patients can be offered the time, and recalls can fill what remains.",
      ],
      [
        "Practice Zero agents handle confirmations, reschedules, and waitlist offers under your rules, such as how far ahead to remind, how to prioritize waitlists, and which visit types need a person. Patients can manage their appointments through /portal.",
        "On the morning board you see what is confirmed, what changed overnight, and what still needs a decision.",
      ],
      [
        "A demo at /try can show an unconfirmed schedule becoming a confirmed one. You see how agents respond to a cancellation and how the board reflects the change.",
        "This note is general product information, not clinical advice.",
      ],
    ],
    sources: [
      {
        kind: "Brief",
        year: "2024",
        title: "Industry reporting on no-show rates and appointment reminder strategies in ambulatory care",
      },
      {
        kind: "Report",
        year: "2024",
        title: "Commonwealth Fund research on administrative workload in outpatient practices",
      },
    ],
  },
  // 13
  {
    key: "balance-texts-rcm",
    headline: "Balance texts and patient outreach tied to RCM",
    publishedAt: "2026-09-03T12:00:00.000Z",
    photo: "photo-1504813184591-01572f98c85f",
    excerpt:
      "Patient balances get collected when outreach is timely, clear, and connected to the claim. Practice Zero ties texts and reminders to revenue cycle status.",
    searchTitle: "Balance texts and patient outreach tied to RCM",
    searchDescription:
      "How Practice Zero connects patient balance texts and outreach to claim and payment status, so reminders reflect what is actually owed.",
    keywords: ["patient balances", "text outreach", "patient payments", "Practice Zero", "revenue cycle management"],
    topic: "patient outreach and RCM",
    readMinutes: 5,
    bodies: [
      [
        "Patient responsibility is a growing share of practice revenue, and collecting it takes a clear message at the right time. Too early and the amount may change. Too late and the visit is forgotten.",
        "Practice Zero ties patient outreach to the state of the claim, so a balance text goes out when the balance is real.",
      ],
      [
        "Industry reporting notes that patient-owed balances have become a larger part of collections for independent practices. Patients tend to respond better to clear, convenient communication than to paper statements.",
        "Outreach disconnected from billing status creates confusion. A reminder about an amount that insurance later adjusts erodes trust.",
      ],
      [
        "For a practice, the aim is accuracy and timing. Wait for the payer to finalize, then send a plain message with the amount, the reason, and a simple way to pay.",
        "Staff can focus on the patients who need a conversation, such as a question about a charge or a request for a plan.",
      ],
      [
        "Practice Zero agents watch claim status and send balance texts and reminders when the amount is settled, following your rules for cadence and tone. Patients can review and manage their account through /portal.",
        "Replies that need a person, like a dispute or a payment arrangement, go to the morning board with the account history attached.",
      ],
      [
        "A demo at /try can show a claim resolving and a patient message following it. You see how the amount, the timing, and the escalation rules fit together.",
        "This note is general product information, not clinical advice.",
      ],
    ],
    sources: [
      {
        kind: "Brief",
        year: "2025",
        title: "Industry reporting on patient responsibility and collections in independent practices",
      },
      {
        kind: "Report",
        year: "2024",
        title: "Commonwealth Fund research on administrative costs of billing and collections",
      },
    ],
  },
  // 14
  {
    key: "one-platform-pricing",
    headline: "One platform pricing: EHR billing marketing bundled",
    publishedAt: "2026-09-19T12:00:00.000Z",
    photo: "photo-1586773860418-d37222d8fce3",
    excerpt:
      "EHR, billing, and marketing come together with no additional license fee when collections route through Practice Zero under a one-year billing agreement.",
    searchTitle: "One platform pricing: EHR, billing, and marketing",
    searchDescription:
      "How Practice Zero bundles EHR, billing, and marketing with no additional license fee under a one-year billing agreement.",
    keywords: ["practice pricing", "EHR billing marketing", "bundled platform", "Practice Zero", "billing agreement"],
    topic: "platform pricing",
    readMinutes: 5,
    bodies: [
      [
        "Many practices pay separately for an EHR, a billing service, and a marketing vendor. Each has its own contract, its own login, and its own idea of the patient. The total is hard to see, and the tools rarely talk to each other.",
        "Practice Zero offers one platform and one relationship, designed so the pieces share data and incentives.",
      ],
      [
        "Industry reporting describes vendor sprawl as a quiet cost for independent practices, in both fees and staff time spent reconciling systems.",
        "Aligned incentives matter too. When the platform succeeds as the practice collects, planning for growth and planning for cost can happen in the same conversation.",
      ],
      [
        "For a practice, bundling simplifies budgeting. The EHR, billing, and marketing tools are included, and the cost is tied to collections rather than to a stack of licenses.",
        "Optional ad spend remains separate, so marketing investment stays a decision you make deliberately.",
      ],
      [
        "Practice Zero includes EHR, billing, and marketing at no additional license fee when collections route through Practice Zero under a one-year billing agreement. Optional ad spend is separate and under your control.",
        "Agents run across all of it, from scheduling and follow-up to claims and payment tracking, so the bundle behaves like a single system instead of three products side by side.",
      ],
      [
        "A demo at /try is a good time to review how the pieces fit and what the agreement covers for your practice. You can ask about terms directly and see the platform at work.",
        "This note is general product information, not clinical advice.",
      ],
    ],
    sources: [
      {
        kind: "Brief",
        year: "2026",
        title: "Industry reporting on vendor sprawl and technology costs in independent practices",
      },
      {
        kind: "Report",
        year: "2024",
        title: "Commonwealth Fund research on administrative spending in U.S. health care",
      },
    ],
  },
  // 15
  {
    key: "white-glove-onboarding",
    headline: "White-glove onboarding for independent practices",
    publishedAt: "2026-10-03T12:00:00.000Z",
    photo: "photo-1505751172876-fa1923c5c528",
    excerpt:
      "Switching systems should not slow the practice down. Practice Zero provides unlimited white-glove onboarding, a custom website, and 24/7 support after go-live.",
    searchTitle: "White-glove onboarding for independent practices",
    searchDescription:
      "How Practice Zero supports independent practices with unlimited white-glove onboarding, a custom website, and 24/7 support after go-live.",
    keywords: ["onboarding", "white-glove", "custom website", "24/7 support", "Practice Zero"],
    topic: "onboarding",
    readMinutes: 5,
    bodies: [
      [
        "Many independent practices stay with systems they have outgrown because switching feels risky. Data, workflows, and staff habits all have to move, and the practice cannot pause to do it.",
        "Practice Zero treats onboarding as part of the product, with a hands-on team that carries the work.",
      ],
      [
        "Industry reporting regularly highlights implementation burden as a barrier for small practices considering new technology. The concern is rarely the software itself. It is the weeks of disruption around it.",
        "Practices that succeed with change tend to have a partner who learns their workflows first and configures to match.",
      ],
      [
        "For a practice, good onboarding means your rules become the system's rules. Visit types, scheduling preferences, payer handling, and exception thresholds are set up with you.",
        "It also means support does not end at launch. Questions at odd hours still have someone to answer them.",
      ],
      [
        "Practice Zero provides unlimited white-glove onboarding, so the team works with you until the platform fits your practice. A custom website is included, and 24/7 support continues after go-live.",
        "Agents are configured under your practice rules from the start. Your team learns the morning board with real work in front of them.",
      ],
      [
        "A demo at /try is a good first step toward onboarding. You see the platform, ask about your specific workflows, and learn what the transition would look like.",
        "This note is general product information, not clinical advice.",
      ],
    ],
    sources: [
      {
        kind: "Brief",
        year: "2025",
        title: "Industry reporting on EHR implementation burden for small and independent practices",
      },
      {
        kind: "Report",
        year: "2024",
        title: "Commonwealth Fund research on administrative burden and practice capacity",
      },
    ],
  },
  // 16
  {
    key: "portal-other-side",
    headline: "Patient portal: the other side of the morning board",
    publishedAt: "2026-10-14T12:00:00.000Z",
    photo: "photo-1612349317150-e413f6a5b16d",
    excerpt:
      "The morning board shows the practice's side of the day. The Practice Zero portal at /portal shows the patient's side, and both stay in sync.",
    searchTitle: "Patient portal: the other side of the morning board",
    searchDescription:
      "How the Practice Zero patient portal at /portal mirrors the morning board, giving patients a clear view of forms, visits, and balances.",
    keywords: ["patient portal", "morning board", "patient experience", "Practice Zero", "self-service"],
    topic: "patient portal",
    readMinutes: 5,
    bodies: [
      [
        "A practice's work and a patient's work are two halves of the same task. The practice needs a signed form, and the patient wonders whether anything is due. Without a shared view, both sides spend time asking.",
        "The Practice Zero portal at /portal is the patient's side of the morning board.",
      ],
      [
        "Industry reporting on patient portals shows steady adoption and steady message volume. Portals work best when they let patients complete tasks, not just read results.",
        "Inbox-style portals create a different kind of burden for staff. Each message becomes another item for someone to triage.",
      ],
      [
        "For a practice, a task-oriented portal reduces inbound calls and messages. Patients see their upcoming visits, outstanding forms, document requests, and balances in one place.",
        "What patients complete there reaches the practice automatically, so there is no re-entry and no waiting on staff to update a record.",
      ],
      [
        "Practice Zero agents use the portal to close loops with patients. Intake, e-sign consent, prior authorization documents, appointment confirmations, and balances all show up as simple actions.",
        "Each completed action clears an item from the morning board. Open items on one side match open items on the other, so the practice and the patient work from the same list.",
      ],
      [
        "A demo at /try pairs with the portal at /portal, so you can see both sides of one visit. You watch a patient finish a task and see the matching item clear on the board.",
        "This note is general product information, not clinical advice.",
      ],
    ],
    sources: [
      {
        kind: "Report",
        year: "2025",
        title: "Industry reporting on patient portal adoption and message volume in ambulatory practices",
      },
      {
        kind: "Brief",
        year: "2025",
        title: "Coverage of EHR-native patient engagement features at Epic and athenahealth",
      },
      {
        kind: "Report",
        year: "2024",
        title: "Commonwealth Fund research on administrative burden for patients and practices",
      },
    ],
  },
  // 17 — SEO brief: commercial model comparison
  {
    key: "collections-pricing-models",
    headline: "Collections pricing vs per-seat EHR: what independents actually buy",
    publishedAt: "2026-10-16T12:00:00.000Z",
    photo: "photo-1554224155-6726b3ff858f",
    excerpt:
      "athenahealth-shaped percentage-of-collections buying and per-seat stacks answer different fears. Practice Zero’s one-year billing agreement is a third path: platform included when collections route through us.",
    searchTitle: "Collections pricing vs per-seat EHR for independent practices",
    searchDescription:
      "How percentage-of-collections EHR pricing compares to per-seat licenses — and how Practice Zero’s one-year billing agreement bundles EHR, billing, and outreach.",
    keywords: [
      "percentage of collections EHR",
      "athenahealth alternative",
      "EHR pricing independent practice",
      "billing agreement EHR",
      "per seat EHR cost",
    ],
    topic: "pricing",
    readMinutes: 6,
    bodies: [
      [
        "Independent practices evaluating a new EHR are rarely deciding on features alone. They are deciding how software gets paid for — and whether the vendor’s incentives line up with collections.",
        "Practice Zero publishes a clear commercial frame: EHR, billing, and marketing at no additional license fee under a one-year billing agreement, with optional advertising spend on the practice’s terms.",
      ],
      [
        "Percentage-of-collections models, popularized in market conversation by platforms such as athenahealth, align vendor revenue with cash posted. Per-seat subscriptions, common in stacks shaped like Tebra/Kareo, keep software cost predictable as revenue grows.",
        "Industry reviews in 2025–2026 keep returning to the same tradeoff: variable cost that scales with collections versus fixed seats that can feel cheaper once the practice is already clean on RCM.",
      ],
      [
        "For a small independent practice, the wrong commercial model shows up as either surprise spend when collections rise or a pile of add-on fees for scribe, marketing, and clearinghouse pieces that were never really optional.",
        "Buyers should ask what is included, what happens at renewal, and who owns the claim work when a denial lands on a Tuesday morning.",
      ],
      [
        "Practice Zero bundles the agentic EHR, RCM, and outreach on one morning board under the billing agreement. Agents clear documentation, eligibility, claims, and follow-up under practice rules; humans approve exceptions.",
        "The consultation is where sizing happens — not a public rate card — because practice mix and payer mix change the economics.",
      ],
      [
        "Compare the model on /pricing, then open /try to see chart → claim → collect on one surface. Request a consultation when you want the agreement walked against your specialty.",
        "This note is general product information, not financial or legal advice.",
      ],
    ],
    sources: [
      {
        kind: "Brief",
        year: "2026",
        title: "athenahealth public positioning on pricing aligned with collections",
        url: "https://www.athenahealth.com/why-choose-us/cost-value",
      },
      {
        kind: "Brief",
        year: "2026",
        title: "Tebra public positioning on subscription pricing vs percentage of collections",
        url: "https://www.tebra.com/pricing/overview",
      },
      {
        kind: "Report",
        year: "2025",
        title: "Industry comparisons of EHR commercial models for independent ambulatory practices",
      },
    ],
  },
  // 18 — SEO brief: leaving per-seat stacks
  {
    key: "beyond-per-seat-ehr",
    headline: "Beyond per-seat EHR: one morning board instead of a bolt-on stack",
    publishedAt: "2026-10-16T15:00:00.000Z",
    photo: "photo-1576091160550-2173dba07efd",
    excerpt:
      "Per-seat EHRs often grow a second stack for marketing and engagement. Practice Zero keeps chart, billing, and outreach on one agentic morning board.",
    searchTitle: "Beyond per-seat EHR stacks for independent practices",
    searchDescription:
      "Why independent practices outgrow per-seat EHR plus bolt-on marketing — and how an agentic morning board collapses chart, claim, and outreach.",
    keywords: [
      "tebra alternative",
      "kareo alternative",
      "patientpop alternative",
      "EHR patient marketing",
      "practice management all in one",
    ],
    topic: "platform",
    readMinutes: 5,
    bodies: [
      [
        "Many independents did not choose fragmentation. They bought an EHR, then a marketing layer, then another tool for reviews or reminders — because the chart never owned the outbox.",
        "Practice Zero starts from a different premise: clinical, financial, and operational work belong on one morning board.",
      ],
      [
        "All-in-one vendors that merged practice management with patient acquisition tools made the category clearer. Tebra’s lineage (Kareo + PatientPop) is the usual reference point in buying conversations.",
        "The open question is whether ‘all-in-one’ still means humans stitching portals together, or agents that clear loops from visit to remittance.",
      ],
      [
        "Bolt-on stacks create handoff failure: the note is done, the claim is late, the recall never sent. Staff time fills the gaps the software left between products.",
        "Practices feel this as after-hours charting, missed eligibility, and phone tag with payers — the work that should not own the day.",
      ],
      [
        "Practice Zero agents draft documentation and coding, keep eligibility and claims moving, and queue outreach from the same surface. Optional room hardware can capture the visit so agents start from what happened.",
        "There is no additional license fee when collections route through Practice Zero under a one-year billing agreement.",
      ],
      [
        "Open the demo at /try and watch a visit become a queued claim and an outbox item. Then use /contact for a consultation mapped to your practice size.",
        "This note is general product information, not clinical advice.",
      ],
    ],
    sources: [
      {
        kind: "Brief",
        year: "2026",
        title: "Market coverage of Tebra as the Kareo and PatientPop combined platform",
      },
      {
        kind: "Survey",
        year: "2025",
        title: "AMA themes on administrative burden in ambulatory practice",
        url: "https://www.ama-assn.org/practice-management/prior-authorization",
      },
      {
        kind: "Report",
        year: "2025",
        title: "Industry reviews of all-in-one practice management and patient engagement suites",
      },
    ],
  },
  // 19 — SEO brief: specialty mornings
  {
    key: "specialty-mornings-horizontal-ehr",
    headline: "Specialty mornings on a horizontal agentic EHR",
    publishedAt: "2026-10-16T18:00:00.000Z",
    photo: "photo-1631217868264-e5b90bb7e629",
    excerpt:
      "Independent ophthalmology, ortho, primary care, derm, and OB-GYN practices share the same admin loops — with different accents. Specialty pages frame the morning; the platform stays one board.",
    searchTitle: "Specialty mornings on a horizontal agentic EHR",
    searchDescription:
      "Why Practice Zero stays specialty-agnostic as a platform while publishing specialty pages for ophthalmology, orthopedics, primary care, dermatology, and OB-GYN.",
    keywords: [
      "ophthalmology EHR",
      "orthopedic practice management",
      "dermatology EHR",
      "primary care EHR independent",
      "OB-GYN EHR",
    ],
    topic: "specialties",
    readMinutes: 5,
    bodies: [
      [
        "A horizontal EHR fails when every specialty is forced into the same marketing sentence. It also fails when the product forks into five disconnected apps.",
        "Practice Zero keeps one agentic platform and publishes specialty pages so buyers see their morning — prior auth in ortho, chair turnover in ophthalmology, panel volume in primary care.",
      ],
      [
        "AMA practice-ownership data shows independence is uneven across specialties. Ophthalmology and orthopedics retain higher private-practice shares than many hospital-leaning fields, while primary care remains a large absolute base of independents.",
        "Those ownership patterns matter for go-to-market: the buyers who can still choose software are concentrated in ambulatory specialties that feel admin load every morning.",
      ],
      [
        "Specialty teams do not need a different definition of ‘done.’ They need the same loops cleared with the right forms, agreements, and payer reality: eligibility before the room, claims after the note, outreach before the schedule collapses.",
        "Onboarding is where specialty forms and custom components enter — not a separate product SKU for each vertical.",
      ],
      [
        "Wave 1 specialty pages cover ophthalmology, orthopedics, primary care, dermatology, and OB-GYN. Each page frames what goes to zero, then points to the same demo and consultation path.",
        "Dental, veterinary, and pure med-spa ecosystems stay out of Wave 1 because buying centers and PMS lock-in differ.",
      ],
      [
        "Browse /specialties, open your lander, then try /try. Request a consultation with the specialty query already attached so the walkthrough starts in the right frame.",
        "This note is general product information, not clinical advice.",
      ],
    ],
    sources: [
      {
        kind: "Report",
        year: "2024",
        title: "AMA Physician Practice Benchmark Report — private practice shares by specialty",
        url: "https://www.ama-assn.org/system/files/2024-prp-pp-characteristics.pdf",
      },
      {
        kind: "Brief",
        year: "2025",
        title: "Becker’s ASC coverage of where physicians stay independent by specialty",
        url: "https://www.beckersasc.com/asc-news/where-physicians-stay-independent-a-specialty-breakdown/",
      },
      {
        kind: "Brief",
        year: "2025",
        title: "AAMC key findings on largest active physician specialties",
        url: "https://www.aamc.org/data-reports/data/2025-key-findings",
      },
    ],
  },
];

/** Published Practice Zero research notes, ordered by topic and staggered by publish date. */
export const publishedResearchCatalog: ResearchArticle[] = specs.map(buildArticle);
