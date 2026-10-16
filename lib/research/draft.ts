import { chatCompletion, getOpenAIApiKey } from "@/lib/openai";
import type { ResearchSection, ResearchSource } from "@/lib/research/types";
import { slugify } from "@/lib/research/types";

export type DraftResult = {
  title: string;
  slug: string;
  excerpt: string;
  search_title: string;
  search_description: string;
  keywords: string[];
  sections: ResearchSection[];
  sources: ResearchSource[];
  read_minutes: number;
  cover_image_url: string;
  cover_credit: string;
};

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&h=900&fit=crop";
const DEFAULT_CREDIT = "Photo · Unsplash";

const SECTION_TITLES = [
  "Practice Zero and this problem",
  "What the field is learning",
  "What that means for a practice",
  "How Practice Zero approaches this",
  "What a demo can clarify",
] as const;

function sectionId(title: string) {
  return slugify(title) || "section";
}

function fallbackDraft(topic: string): DraftResult {
  const clean = topic.trim() || "agentic EHR";
  const title = `${clean}: Insights from Practice Zero`;
  const excerpt = `How Practice Zero agents handle ${clean.toLowerCase()} so a practice can run with space and hardware—not a full front-office stack—while scheduling, claims, and payment tracking stay autonomous.`;

  const sections: ResearchSection[] = [
    {
      id: sectionId(SECTION_TITLES[0]),
      title: SECTION_TITLES[0],
      body: `Independent practices still spend most of their day on coordination: eligibility, scheduling, follow-ups, claims, and payment tracking. ${clean} is the kind of work that used to require an office manager at every desk. Practice Zero treats it as an agentic EHR problem—software that acts, not just records.`,
    },
    {
      id: sectionId(SECTION_TITLES[1]),
      title: SECTION_TITLES[1],
      body: `Recent work across ambulatory operations shows the same pattern: when intake, visit capture, and billing handoffs stay human-only, denials rise and follow-ups slip. Teams that instrument rooms and let agents own the loop—record, summarize, schedule, submit—cut cycle time without adding headcount.`,
    },
    {
      id: sectionId(SECTION_TITLES[2]),
      title: SECTION_TITLES[2],
      body: `For a practice, that means you can start with a room and a connection. Optional room hardware captures the visit; Practice Zero agents draft the note, propose follow-ups, queue claims, and track payments. You approve the exceptions. The rest runs under your rules.`,
    },
    {
      id: sectionId(SECTION_TITLES[3]),
      title: SECTION_TITLES[3],
      body: `Practice Zero agents are built for ambulatory reality: eligibility before the visit, scheduling and recall after it, claims that leave clean, and payment tracking that does not live in a spreadsheet. The product voice stays operational and plain—no theater, no purple AI gloss.`,
    },
    {
      id: sectionId(SECTION_TITLES[4]),
      title: SECTION_TITLES[4],
      body: `A short demo clarifies what agents own vs what you approve: room capture, autonomous follow-ups, claims, and payment status. This note is general product information, not clinical advice. Book a walkthrough when you want to see Practice Zero on your workflows.`,
    },
  ];

  const sources: ResearchSource[] = [
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
    {
      kind: "Brief",
      year: "2024",
      title: "Staffing models for practices that run agentic scheduling and payment tracking.",
    },
  ];

  return {
    title,
    slug: slugify(title),
    excerpt,
    search_title: title.slice(0, 58),
    search_description: excerpt.slice(0, 155),
    keywords: [
      clean,
      "Practice Zero",
      "agentic EHR",
      "autonomous scheduling",
      "claims",
      "payment tracking",
    ],
    sections,
    sources,
    read_minutes: 3,
    cover_image_url: DEFAULT_COVER,
    cover_credit: DEFAULT_CREDIT,
  };
}

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object in model response");
  return JSON.parse(raw.slice(start, end + 1));
}

function normalizeDraft(raw: unknown, topic: string): DraftResult {
  const base = fallbackDraft(topic);
  if (!raw || typeof raw !== "object") return base;
  const o = raw as Record<string, unknown>;

  const title =
    typeof o.title === "string" && o.title.trim() ? o.title.trim() : base.title;
  const excerpt =
    typeof o.excerpt === "string" && o.excerpt.trim() ? o.excerpt.trim() : base.excerpt;

  const sections: ResearchSection[] = Array.isArray(o.sections)
    ? o.sections
        .filter((s): s is Record<string, unknown> => !!s && typeof s === "object")
        .map((s, i) => {
          const t =
            typeof s.title === "string" && s.title.trim()
              ? s.title.trim()
              : SECTION_TITLES[i] ?? `Section ${i + 1}`;
          return {
            id: sectionId(t),
            title: t,
            body: typeof s.body === "string" ? s.body.trim() : "",
          };
        })
        .filter((s) => s.body)
    : base.sections;

  const sources: ResearchSource[] = Array.isArray(o.sources)
    ? o.sources
        .filter((s): s is Record<string, unknown> => !!s && typeof s === "object")
        .map((s) => ({
          kind: typeof s.kind === "string" ? s.kind : "Brief",
          year: typeof s.year === "string" ? s.year : "2025",
          title: typeof s.title === "string" ? s.title : "Related research",
          url: typeof s.url === "string" ? s.url : undefined,
        }))
    : base.sources;

  const keywords = Array.isArray(o.keywords)
    ? o.keywords.filter((k): k is string => typeof k === "string").slice(0, 12)
    : base.keywords;

  return {
    title,
    slug: slugify(
      typeof o.slug === "string" && o.slug.trim() ? o.slug : title,
    ),
    excerpt,
    search_title:
      typeof o.search_title === "string" && o.search_title.trim()
        ? o.search_title.trim().slice(0, 60)
        : title.slice(0, 58),
    search_description:
      typeof o.search_description === "string" && o.search_description.trim()
        ? o.search_description.trim().slice(0, 160)
        : excerpt.slice(0, 155),
    keywords: keywords.length ? keywords : base.keywords,
    sections: sections.length ? sections : base.sections,
    sources: sources.length ? sources : base.sources,
    read_minutes:
      typeof o.read_minutes === "number" && o.read_minutes > 0
        ? Math.min(12, Math.round(o.read_minutes))
        : base.read_minutes,
    cover_image_url:
      typeof o.cover_image_url === "string" && o.cover_image_url.startsWith("http")
        ? o.cover_image_url
        : DEFAULT_COVER,
    cover_credit:
      typeof o.cover_credit === "string" && o.cover_credit.trim()
        ? o.cover_credit.trim()
        : DEFAULT_CREDIT,
  };
}

/**
 * Draft a Practice Zero research note via OPENAI_API_KEY.
 * Falls back to a strong template when the key is missing or the call fails.
 */
export async function draftResearchArticle(topic: string): Promise<{
  draft: DraftResult;
  usedModel: boolean;
}> {
  const clean = topic.trim();
  if (!clean) throw new Error("Topic is required");

  if (!getOpenAIApiKey()) {
    return { draft: fallbackDraft(clean), usedModel: false };
  }

  const system = `You write research notes for Practice Zero, an agentic EHR for independent practices.
Voice: clear, operational, confident. Promote Practice Zero—never The Alignment Clinic or spine surgery brands.
Themes: practices may not need a traditional office manager—just space + optional room hardware; agents record visits, schedule follow-ups, run scheduling, claims, and payment tracking autonomously under practice rules.
Return ONLY valid JSON with keys:
title, slug, excerpt, search_title, search_description, keywords (string[]),
sections (array of {title, body}), sources (array of {kind, year, title, url?}),
read_minutes (number), cover_image_url (https unsplash medical/tech), cover_credit.
Use exactly these section titles in order:
${SECTION_TITLES.map((t) => `- ${t}`).join("\n")}
Each body: 2–4 short paragraphs. Sources should feel plausible product/ops research, not fabricated DOIs.`;

  try {
    const result = await chatCompletion({
      system,
      messages: [
        {
          role: "user",
          content: `Draft a full Practice Zero research note on: ${clean}`,
        },
      ],
      temperature: 0.55,
      max_tokens: 2500,
    });

    if (!result.ok || !result.content) {
      return { draft: fallbackDraft(clean), usedModel: false };
    }

    const parsed = extractJson(result.content);
    return { draft: normalizeDraft(parsed, clean), usedModel: true };
  } catch (err) {
    console.error("research draft failed", err);
    return { draft: fallbackDraft(clean), usedModel: false };
  }
}
