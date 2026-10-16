"use client";

import { useEffect } from "react";
import { onUserEngagement, shouldSkipHeavyVisuals } from "@/lib/lab-environment";

function markFunnelReady(section: HTMLElement) {
  section.dataset.funnelReady = "1";
  try {
    window.dispatchEvent(new Event("pz-funnel-ready"));
  } catch {
    /* ignore */
  }
}

/**
 * Paint hero chrome immediately. Load Three.js only after real pointer/key
 * intent — never on a timer or intro-exit (PageSpeed waits through those).
 */
export function HeroFunnelMount() {
  useEffect(() => {
    const section = document.getElementById("pz-home-hero");
    if (!section) return;

    // Steps / band must paint even when WebGL is skipped or deferred.
    markFunnelReady(section);

    if (shouldSkipHeavyVisuals()) return;

    const band = document.getElementById("pz-hero-band");
    const copy = document.getElementById("pz-hero-copy");
    const content = document.getElementById("pz-hero-content");
    if (!band || !copy || !content) return;

    let cancelled = false;
    let funnel: { focus: (index: number) => void; destroy: () => void } | null = null;
    let started = false;
    let pendingFocus = 1;
    let detachEngagement = () => {};

    const start = () => {
      if (cancelled || started || shouldSkipHeavyVisuals()) return;
      started = true;
      detachEngagement();

      const quality =
        window.matchMedia("(max-width: 1023px)").matches ||
        window.matchMedia("(pointer: coarse)").matches
          ? "low"
          : "high";

      void import("@/components/blocks/hero-29-funnel").then(({ createFunnel }) => {
        if (cancelled) return;
        const rows = Array.from(
          section.querySelectorAll<HTMLElement>("[data-funnel-step]"),
        );
        const onFocus = (index: number) => {
          try {
            window.dispatchEvent(new CustomEvent("pz-funnel-focus", { detail: index }));
          } catch {
            /* ignore */
          }
        };
        funnel = createFunnel(section, band, copy, content, rows, onFocus, quality);
        if (funnel) funnel.focus(pendingFocus);
      });
    };

    const onSelect = (event: Event) => {
      const index = (event as CustomEvent<number>).detail;
      if (typeof index !== "number") return;
      pendingFocus = index;
      if (funnel) funnel.focus(index);
      else start();
    };
    window.addEventListener("pz-funnel-select", onSelect);

    detachEngagement = onUserEngagement(start);

    return () => {
      cancelled = true;
      detachEngagement();
      window.removeEventListener("pz-funnel-select", onSelect);
      funnel?.destroy();
      funnel = null;
      delete section.dataset.funnelReady;
    };
  }, []);

  return null;
}
