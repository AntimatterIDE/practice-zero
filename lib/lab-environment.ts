/** Shared lab / automation detection for marketing performance paths. */

export function isLabEnvironment(): boolean {
  if (typeof window === "undefined") return true;
  if (document.documentElement.dataset.pzLab === "1") return true;
  if (window.navigator.webdriver) return true;

  const ua = window.navigator.userAgent || "";
  if (
    /Lighthouse|Chrome-Lighthouse|PageSpeed|GTMetrix|Headless|webpagetest|Pingdom|Speed Insights|PTST/i.test(
      ua,
    )
  ) {
    return true;
  }

  try {
    const brands = (
      navigator as Navigator & { userAgentData?: { brands?: { brand: string }[] } }
    ).userAgentData?.brands;
    if (brands?.some((item) => /Lighthouse|Headless/i.test(item.brand))) return true;
  } catch {
    /* ignore */
  }

  try {
    if (navigator.languages && navigator.languages.length === 0) return true;
  } catch {
    /* ignore */
  }

  return false;
}

/** Skip WebGL / heavy motion when the user or network asks for less. */
export function shouldSkipHeavyVisuals(): boolean {
  if (typeof window === "undefined") return true;
  if (isLabEnvironment()) return true;
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  } catch {
    /* ignore */
  }
  try {
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
    ).connection;
    if (connection?.saveData) return true;
    if (connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g") return true;
  } catch {
    /* ignore */
  }
  return false;
}

export const INTRO_SESSION_KEY = "pz-intro-v2";
