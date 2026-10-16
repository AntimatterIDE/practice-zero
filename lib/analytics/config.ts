export type AnalyticsConfig = {
  gaMeasurementId: string | null;
  gtmId: string | null;
  posthogKey: string | null;
  posthogHost: string;
};

function trim(value: string | undefined) {
  const next = value?.trim();
  return next ? next : null;
}

/** Client-safe public analytics IDs. Empty when unset — components no-op. */
export function getAnalyticsConfig(): AnalyticsConfig {
  return {
    gaMeasurementId: trim(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
    gtmId: trim(process.env.NEXT_PUBLIC_GTM_ID),
    posthogKey: trim(process.env.NEXT_PUBLIC_POSTHOG_KEY),
    posthogHost:
      trim(process.env.NEXT_PUBLIC_POSTHOG_HOST) ?? "https://us.i.posthog.com",
  };
}

export function hasAnyAnalytics(config: AnalyticsConfig = getAnalyticsConfig()) {
  return Boolean(config.gaMeasurementId || config.gtmId || config.posthogKey);
}
