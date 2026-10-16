import type { ResearchArticle } from "@/lib/research/types";

/** Shown on /research when Supabase has no published notes yet. */
export const demoPublishedArticles: ResearchArticle[] = [
  {
    id: "demo-agentic-ehr",
    created_at: "2026-10-01T12:00:00.000Z",
    updated_at: "2026-10-01T12:00:00.000Z",
    published_at: "2026-10-01T12:00:00.000Z",
    status: "published",
    title: "Agentic EHR without an office manager: Insights from Practice Zero",
    slug: "agentic-ehr-without-an-office-manager-insights-from-practice-zero",
    excerpt:
      "A practice can run on space, room hardware, and Practice Zero agents—scheduling, claims, and payment tracking stay autonomous under your rules.",
    cover_image_url:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&h=900&fit=crop",
    cover_credit: "Photo · Unsplash",
    search_title: "Agentic EHR without an office manager",
    search_description:
      "How Practice Zero agents replace front-office drag with autonomous scheduling, claims, and payment tracking.",
    keywords: ["agentic EHR", "Practice Zero", "office manager", "autonomous agents"],
    topic: "agentic EHR",
    body_markdown: "",
    sections: [
      {
        id: "practice-zero-and-this-problem",
        title: "Practice Zero and this problem",
        body: "Independent practices still spend most of their day on coordination: eligibility, scheduling, follow-ups, claims, and payment tracking. That used to mean an office manager at every desk. Practice Zero treats it as an agentic EHR problem—software that acts, not just records.",
      },
      {
        id: "what-the-field-is-learning",
        title: "What the field is learning",
        body: "When intake, visit capture, and billing handoffs stay human-only, denials rise and follow-ups slip. Teams that instrument rooms and let agents own the loop—record, summarize, schedule, submit—cut cycle time without adding headcount.",
      },
      {
        id: "what-that-means-for-a-practice",
        title: "What that means for a practice",
        body: "You can start with a room and a connection. Optional room hardware captures the visit; Practice Zero agents draft the note, propose follow-ups, queue claims, and track payments. You approve the exceptions. The rest runs under your rules.",
      },
      {
        id: "how-practice-zero-approaches-this",
        title: "How Practice Zero approaches this",
        body: "Practice Zero agents are built for ambulatory reality: eligibility before the visit, scheduling and recall after it, claims that leave clean, and payment tracking that does not live in a spreadsheet.",
      },
      {
        id: "what-a-demo-can-clarify",
        title: "What a demo can clarify",
        body: "A short demo clarifies what agents own vs what you approve: room capture, autonomous follow-ups, claims, and payment status. This note is general product information, not clinical advice.",
      },
    ],
    sources: [
      {
        kind: "Brief",
        year: "2025",
        title: "Ambient visit capture and ambulatory follow-up automation in independent practices.",
      },
      {
        kind: "Brief",
        year: "2024",
        title: "Denial reduction when eligibility and claim prep run before checkout.",
      },
    ],
    read_minutes: 3,
    author_name: "practice zero",
  },
  {
    id: "demo-room-hardware",
    created_at: "2026-09-20T12:00:00.000Z",
    updated_at: "2026-09-20T12:00:00.000Z",
    published_at: "2026-09-20T12:00:00.000Z",
    status: "published",
    title: "Room hardware that schedules the follow-up: Insights from Practice Zero",
    slug: "room-hardware-that-schedules-the-follow-up-insights-from-practice-zero",
    excerpt:
      "Install capture in the room once. Practice Zero agents turn the visit into notes, follow-ups, and the next open slot—without another clipboard.",
    cover_image_url:
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1600&h=900&fit=crop",
    cover_credit: "Photo · Unsplash",
    search_title: "Room hardware that schedules the follow-up",
    search_description:
      "How Practice Zero room hardware feeds agents that schedule follow-ups and keep claims moving.",
    keywords: ["room hardware", "visit capture", "scheduling", "Practice Zero"],
    topic: "room hardware",
    body_markdown: "",
    sections: [
      {
        id: "practice-zero-and-this-problem",
        title: "Practice Zero and this problem",
        body: "Visit detail still dies between the room and the schedule. Room hardware plus Practice Zero agents close that gap: capture in the room, then autonomous follow-up and billing work.",
      },
      {
        id: "what-the-field-is-learning",
        title: "What the field is learning",
        body: "Ambient capture only helps when something acts on the transcript. Practices that pair hardware with agents see fewer missed recalls and cleaner claim timing.",
      },
      {
        id: "what-that-means-for-a-practice",
        title: "What that means for a practice",
        body: "Hardware is optional but powerful. Once installed, agents propose the next visit, queue the claim path, and keep payment status visible—so the room stays clinical, not clerical.",
      },
      {
        id: "how-practice-zero-approaches-this",
        title: "How Practice Zero approaches this",
        body: "Practice Zero wires capture into the same agent stack that runs scheduling, claims, and payment tracking. One product voice across the desk.",
      },
      {
        id: "what-a-demo-can-clarify",
        title: "What a demo can clarify",
        body: "See a room capture become a scheduled follow-up and a claim draft in one pass. Book a walkthrough when you want it on your workflows.",
      },
    ],
    sources: [
      {
        kind: "Brief",
        year: "2025",
        title: "Visit-room capture linked to ambulatory recall and claim prep.",
      },
    ],
    read_minutes: 3,
    author_name: "practice zero",
  },
];

export function findDemoArticle(slug: string) {
  return demoPublishedArticles.find((a) => a.slug === slug) ?? null;
}
