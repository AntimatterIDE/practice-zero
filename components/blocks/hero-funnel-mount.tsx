"use client";

import { useEffect } from "react";
import { shouldSkipHeavyVisuals } from "@/lib/lab-environment";

function markFunnelReady(section: HTMLElement) {
  section.dataset.funnelReady = "1";
  try {
    window.dispatchEvent(new Event("pz-funnel-ready"));
  } catch {
    /* ignore */
  }
}

/**
 * Mount the WebGL funnel ASAP for real users (intro cover hides warm-up).
 * Labs and reduced-motion / save-data never load Three.js, but still mark the
 * hero ready so step chrome paints (otherwise desktop steps stay opacity 0).
 */
export function HeroFunnelMount() {
  useEffect(() => {
    const section = document.getElementById("pz-home-hero");
    if (!section) return;

    if (shouldSkipHeavyVisuals()) {
      markFunnelReady(section);
      return;
    }

    const band = document.getElementById("pz-hero-band");
    const copy = document.getElementById("pz-hero-copy");
    const content = document.getElementById("pz-hero-content");
    if (!band || !copy || !content) {
      markFunnelReady(section);
      return;
    }

    let cancelled = false;
    let funnel: { focus: (index: number) => void; destroy: () => void } | null = null;
    let started = false;

    const start = () => {
      if (cancelled || started) return;
      started = true;
      detachWarm();

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
        markFunnelReady(section);
        if (funnel) funnel.focus(1);
      });
    };

    const onSelect = (event: Event) => {
      const index = (event as CustomEvent<number>).detail;
      if (typeof index === "number") funnel?.focus(index);
    };
    window.addEventListener("pz-funnel-select", onSelect);

    const detachWarm = () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
      window.removeEventListener("touchstart", start);
      window.removeEventListener("pz-intro-exit", start);
      window.removeEventListener("pz-intro-done", start);
      window.clearTimeout(warmTimer);
    };

    // Wait for the intro to start exiting before loading Three.js so the
    // countdown stays smooth. Intent + timeouts remain as backups.
    const warmTimer = window.setTimeout(start, 4500);

    window.addEventListener("pointerdown", start, { once: true, passive: true });
    window.addEventListener("keydown", start, { once: true, passive: true });
    window.addEventListener("touchstart", start, { once: true, passive: true });
    window.addEventListener("pz-intro-exit", start, { once: true });
    window.addEventListener("pz-intro-done", start, { once: true });

    return () => {
      cancelled = true;
      detachWarm();
      window.removeEventListener("pz-funnel-select", onSelect);
      funnel?.destroy();
      funnel = null;
      delete section.dataset.funnelReady;
    };
  }, []);

  return null;
}
