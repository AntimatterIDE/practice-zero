"use client";

import { useEffect, useRef } from "react";
import { getAnalyticsConfig, hasAnyAnalytics } from "@/lib/analytics/config";
import { AnalyticsEvents, captureAttributionFromLocation, trackEvent } from "@/lib/analytics/events";

/**
 * Lightweight conversion beacon for /try — no session replay.
 * Loads gtag only long enough to record demo_open once per session.
 */
export function DemoOpenTracker() {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    const config = getAnalyticsConfig();
    if (!hasAnyAnalytics(config)) return;

    fired.current = true;
    captureAttributionFromLocation();

    const send = () => {
      trackEvent(AnalyticsEvents.demoOpen, { page_path: "/try" });
    };

    if (config.gaMeasurementId && typeof window.gtag !== "function") {
      const existing = document.querySelector<HTMLScriptElement>("script[data-pz-ga4]");
      if (!existing) {
        const script = document.createElement("script");
        script.src = `https://www.googletagmanager.com/gtag/js?id=${config.gaMeasurementId}`;
        script.async = true;
        script.dataset.pzGa4 = "1";
        script.onload = () => {
          window.dataLayer = window.dataLayer ?? [];
          // Match gtag.js bootstrap: push Arguments object, not a rest array.
          window.gtag = function gtag() {
            // eslint-disable-next-line prefer-rest-params
            window.dataLayer?.push(arguments as unknown as Record<string, unknown>);
          };
          window.gtag("js", new Date());
          window.gtag("config", config.gaMeasurementId, { send_page_view: false });
          send();
        };
        document.head.appendChild(script);
        return;
      }
    }

    if (config.posthogKey && !window.__pzPosthog) {
      void import("posthog-js").then(({ default: posthog }) => {
        if (!window.__pzPosthog) {
          posthog.init(config.posthogKey!, {
            api_host: config.posthogHost,
            capture_pageview: false,
            autocapture: false,
            disable_session_recording: true,
          });
        }
        window.__pzPosthog = posthog;
        send();
      });
      return;
    }

    send();
  }, []);

  return null;
}
