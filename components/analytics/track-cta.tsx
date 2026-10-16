"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics/events";

type Props = ComponentProps<typeof Link> & {
  ctaName: string;
  ctaLocation?: string;
};

/** Link that emits cta_click (and demo_open intent when href is /try). */
export function TrackCtaLink({
  ctaName,
  ctaLocation,
  href,
  onClick,
  ...rest
}: Props) {
  return (
    <Link
      {...rest}
      href={href}
      onClick={(event) => {
        const path = typeof href === "string" ? href : href.pathname ?? "";
        trackEvent(AnalyticsEvents.ctaClick, {
          cta_name: ctaName,
          cta_location: ctaLocation ?? null,
          href: path,
        });
        if (path === "/try" || path.startsWith("/try")) {
          trackEvent(AnalyticsEvents.ctaClick, {
            cta_name: "demo_intent",
            href: path,
          });
        }
        onClick?.(event);
      }}
    />
  );
}
