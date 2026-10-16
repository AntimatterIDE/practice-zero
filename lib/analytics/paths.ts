/** Paths where full marketing analytics (GA4/GTM/PostHog) must not load. */
const BLOCKED_PREFIXES = [
  "/admin",
  "/portal",
  "/sign",
  "/intake",
  "/api",
  "/og",
] as const;

/** Demo desk: no session replay / full suite — only a one-shot demo_open beacon. */
export function isDemoDeskPath(pathname: string): boolean {
  return pathname === "/try" || pathname.startsWith("/try/");
}

export function isMarketingAnalyticsPath(pathname: string): boolean {
  if (isDemoDeskPath(pathname)) return false;
  return !BLOCKED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
