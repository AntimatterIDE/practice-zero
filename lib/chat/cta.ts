export type ChatCta = { label: string; href: string };

export const CHAT_CTA_HREFS = [
  "/contact",
  "/try",
  "/portal",
  "/pricing",
  "/onboarding",
  "/ai",
  "/research",
  "/ehr",
  "/billing",
] as const;

export type ChatCtaHref = (typeof CHAT_CTA_HREFS)[number];

const ALLOWED = new Set<string>(CHAT_CTA_HREFS);

/** `[[cta:Request a consultation|/contact]]` */
const CTA_MARKER = /\[\[cta:([^\]|]+)\|(\/[a-z0-9/-]+)\]\]/gi;

const DEFAULT_LABELS: Record<string, string> = {
  "/contact": "Request a consultation",
  "/try": "Try the demo",
  "/portal": "See patient experience",
  "/pricing": "View pricing",
  "/onboarding": "See onboarding",
  "/ai": "Learn about agents",
  "/research": "Read research",
  "/ehr": "Explore EHR",
  "/billing": "Explore billing",
};

/** Phrases that wrap a bare path in prose — strip when converting to buttons. */
const PATH_PROSE =
  /\b(?:please\s+)?(?:visit|use|open|see|try|browse|request\s+a\s+consultation\s+at|request\s+a\s+consultation\s+via)\s+(\/(?:contact|try|portal|pricing|onboarding|ai|research|ehr|billing))\b/gi;

const BARE_PATH = /(?:^|[\s(,])(\/(?:contact|try|portal|pricing|onboarding|ai|research|ehr|billing))(?=[\s.,;:!?)]|$)/g;

export function formatCtaMarker(label: string, href: ChatCtaHref): string {
  return `[[cta:${label}|${href}]]`;
}

export function parseChatCtas(content: string): { text: string; ctas: ChatCta[] } {
  const ctas: ChatCta[] = [];
  const seen = new Set<string>();

  const push = (label: string, href: string) => {
    if (!ALLOWED.has(href) || seen.has(href)) return;
    seen.add(href);
    ctas.push({ label: label.trim() || DEFAULT_LABELS[href] || href, href });
  };

  let text = content.replace(CTA_MARKER, (_, label: string, href: string) => {
    push(label, href);
    return "";
  });

  text = text.replace(PATH_PROSE, (_, href: string) => {
    push(DEFAULT_LABELS[href] || href, href);
    return "";
  });

  text = text.replace(BARE_PATH, (match, href: string) => {
    push(DEFAULT_LABELS[href] || href, href);
    // Keep leading whitespace / punctuation from the match, drop the path
    return match.slice(0, match.length - href.length);
  });

  // Clean leftover “at .” / “via .” / double spaces from stripping
  text = text
    .replace(/\b(?:at|via|to)\s*([.,;:!?])/gi, "$1")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\s+([.,;:!?])/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Prefer contact first when present
  ctas.sort((a, b) => {
    if (a.href === "/contact") return -1;
    if (b.href === "/contact") return 1;
    return 0;
  });

  return { text, ctas };
}
