export const AnalyticsEvents = {
  pageView: "page_view",
  ctaClick: "cta_click",
  demoOpen: "demo_open",
  contactSubmit: "contact_submit",
  chatOpen: "chat_open",
  chatQualified: "chat_qualified",
} as const;

export type AnalyticsEvent = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

export type AnalyticsProps = Record<string, string | number | boolean | null | undefined>;

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export type UtmBag = Partial<Record<(typeof UTM_KEYS)[number], string>>;

const UTM_STORAGE_KEY = "pz_utm";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    __pzPosthog?: {
      capture: (event: string, properties?: Record<string, unknown>) => void;
    };
  }
}

export function readUtmsFromSearch(search: string): UtmBag {
  const params = new URLSearchParams(search.startsWith("?") ? search : `?${search}`);
  const utms: UtmBag = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) utms[key] = value;
  }
  return utms;
}

export function persistUtms(utms: UtmBag) {
  if (typeof window === "undefined") return;
  if (Object.keys(utms).length === 0) return;
  try {
    const existing = loadPersistedUtms();
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify({ ...existing, ...utms }));
  } catch {
    // private mode / blocked storage
  }
}

export function loadPersistedUtms(): UtmBag {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as UtmBag;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function captureAttributionFromLocation() {
  if (typeof window === "undefined") return loadPersistedUtms();
  const fromUrl = readUtmsFromSearch(window.location.search);
  persistUtms(fromUrl);
  return { ...loadPersistedUtms(), ...fromUrl };
}

/** Fire a conversion/event to GA4 (gtag), GTM dataLayer, and PostHog when present. */
export function trackEvent(event: AnalyticsEvent | string, props: AnalyticsProps = {}) {
  if (typeof window === "undefined") return;

  const utms = loadPersistedUtms();
  const payload: Record<string, unknown> = { ...utms };
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null || value === "") continue;
    payload[key] = value;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...payload });

  if (typeof window.gtag === "function") {
    window.gtag("event", event, payload);
  }

  window.__pzPosthog?.capture(event, payload);
}
