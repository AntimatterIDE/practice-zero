"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { getAnalyticsConfig, hasAnyAnalytics } from "@/lib/analytics/config";
import {
  AnalyticsEvents,
  captureAttributionFromLocation,
  trackEvent,
} from "@/lib/analytics/events";
import { isMarketingAnalyticsPath } from "@/lib/analytics/paths";

function GtmBoot({ gtmId }: { gtmId: string }) {
  return (
    <>
      <Script id="pz-gtm" strategy="afterInteractive">{`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');
      `}</Script>
      <noscript>
        <iframe
          title="Google Tag Manager"
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    </>
  );
}

function Ga4Boot({ measurementId }: { measurementId: string }) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="pz-ga4" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${measurementId}', { send_page_view: false });
      `}</Script>
    </>
  );
}

function usePosthog(key: string | null, host: string, enabled: boolean) {
  const booted = useRef(false);

  useEffect(() => {
    if (!enabled || !key || booted.current) return;
    let cancelled = false;

    void import("posthog-js").then(({ default: posthog }) => {
      if (cancelled) return;
      if (!window.__pzPosthog) {
        posthog.init(key, {
          api_host: host,
          capture_pageview: false,
          capture_pageleave: true,
          persistence: "localStorage+cookie",
          autocapture: true,
          disable_session_recording: false,
        });
      }
      window.__pzPosthog = posthog;
      booted.current = true;
    });

    return () => {
      cancelled = true;
    };
  }, [enabled, key, host]);
}

function AnalyticsPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const config = getAnalyticsConfig();
  const enabled = isMarketingAnalyticsPath(pathname) && hasAnyAnalytics(config);

  usePosthog(config.posthogKey, config.posthogHost, enabled);

  useEffect(() => {
    if (!enabled) return;
    captureAttributionFromLocation();
    const search = searchParams?.toString();
    trackEvent(AnalyticsEvents.pageView, {
      page_path: pathname,
      page_location:
        typeof window !== "undefined"
          ? `${window.location.origin}${pathname}${search ? `?${search}` : ""}`
          : pathname,
    });
  }, [enabled, pathname, searchParams]);

  if (!enabled) return null;

  return (
    <>
      {config.gtmId ? <GtmBoot gtmId={config.gtmId} /> : null}
      {config.gaMeasurementId ? <Ga4Boot measurementId={config.gaMeasurementId} /> : null}
    </>
  );
}

/** Marketing-only GA4 / GTM / PostHog. No-ops when env IDs are unset. */
export function MarketingAnalytics() {
  return (
    <Suspense fallback={null}>
      <AnalyticsPageTracker />
    </Suspense>
  );
}
