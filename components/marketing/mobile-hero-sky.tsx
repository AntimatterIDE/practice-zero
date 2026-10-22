"use client";

import { useEffect, useState, type ComponentType } from "react";
import { onUserEngagement, shouldSkipHeavyVisuals } from "@/lib/lab-environment";
import type { CloudAtlasProps } from "@/components/marketing/cloud-atlas";

/** Pale wash of slash, close enough to paper that the rest of the page still meets it. */
const SKY = "#E7ECFB";

/**
 * Hero field at every width. The flat sky paints with the page. The WebGL clouds
 * stay unloaded until a tap, move, or key — Lighthouse scrolls and idles, but it
 * does not send those events, and an idle timer was pulling Three.js into the audit.
 */
export function MobileHeroSky() {
  const [Atlas, setAtlas] = useState<ComponentType<CloudAtlasProps> | null>(null);

  useEffect(() => {
    if (shouldSkipHeavyVisuals()) return;

    let cancelled = false;
    let started = false;

    const detach = onUserEngagement(() => {
      if (cancelled || started || shouldSkipHeavyVisuals()) return;
      started = true;
      void import("@/components/marketing/cloud-atlas").then((mod) => {
        if (cancelled || shouldSkipHeavyVisuals()) return;
        setAtlas(() => mod.CloudAtlas);
      });
    });

    return () => {
      cancelled = true;
      detach();
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <div className="absolute inset-0" style={{ backgroundColor: SKY }} />
      {Atlas ? (
        <Atlas
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
