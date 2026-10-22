"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { shouldSkipHeavyVisuals } from "@/lib/lab-environment";

const CloudAtlas = dynamic(
  () => import("@/components/marketing/cloud-atlas").then((mod) => mod.CloudAtlas),
  { ssr: false },
);

/** Pale wash of slash, close enough to paper that the rest of the page still meets it. */
const SKY = "#E7ECFB";

/**
 * Mobile-only hero field. The flat sky paints immediately; the cloud shader
 * loads after idle, and never on desktop, lab, or reduced-motion visits.
 */
export function MobileHeroSky() {
  const [live, setLive] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    if (desktop.matches || shouldSkipHeavyVisuals()) return;

    let cancelled = false;
    const start = () => {
      if (!cancelled && !desktop.matches) setLive(true);
    };

    const requestIdle = window.requestIdleCallback;
    if (typeof requestIdle === "function") {
      const id = requestIdle(start, { timeout: 1200 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }

    const timer = window.setTimeout(start, 700);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 lg:hidden" aria-hidden="true">
      <div className="absolute inset-0" style={{ backgroundColor: SKY }} />
      {live ? (
        <CloudAtlas
          className="h-full w-full"
          backgroundColor={SKY}
          colors={["#FFFFFF", "#C9D4FB"]}
          opacity={0.9}
          height={0.82}
          coverage={0.55}
          density={0.42}
          wind={0.35}
          billow={0.75}
          speed={0.6}
          resolution={0.4}
          interactive={false}
          anchor="bottom"
        />
      ) : null}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-paper" />
    </div>
  );
}
