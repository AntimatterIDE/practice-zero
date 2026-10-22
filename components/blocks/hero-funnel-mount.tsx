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

function clearInlineStepPositions(section: HTMLElement) {
  section.querySelectorAll<HTMLElement>("[data-funnel-step]").forEach((row) => {
    row.style.left = "";
    row.style.top = "";
    row.style.right = "";
  });
}

/** Right-rail layout so steps never pile at (0,0) before the funnel places them. */
function enableStaticSteps(section: HTMLElement) {
  clearInlineStepPositions(section);
  section.dataset.funnelStatic = "1";
  section.dataset.funnelPlaced = "1";
  markFunnelReady(section);
}

function enableFunnelSteps(section: HTMLElement) {
  delete section.dataset.funnelStatic;
  section.dataset.funnelPlaced = "1";
  markFunnelReady(section);
}

/**
 * Paint a static step rail immediately. Load Three.js only after real
 * pointer/key intent — never on a timer or intro-exit.
 */
export function HeroFunnelMount() {
  useEffect(() => {
    const section = document.getElementById("pz-home-hero");
    if (!section) return;

    // Always start static — avoids the top-left garble while WebGL is deferred.
    enableStaticSteps(section);

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
    const mobile = window.matchMedia("(max-width: 1023px)");

    const start = () => {
      if (cancelled || started || shouldSkipHeavyVisuals()) return;
      // Phones use the cloud field. The funnel stays the desktop hero.
      if (mobile.matches) return;
      started = true;
      detachEngagement();

      const quality = window.matchMedia("(pointer: coarse)").matches ? "low" : "high";

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
        if (funnel) {
          enableFunnelSteps(section);
          funnel.focus(pendingFocus);
        } else {
          enableStaticSteps(section);
        }
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

    const onViewport = () => {
      if (!mobile.matches) start();
    };
    mobile.addEventListener("change", onViewport);

    detachEngagement = onUserEngagement(start);

    return () => {
      cancelled = true;
      detachEngagement();
      mobile.removeEventListener("change", onViewport);
      window.removeEventListener("pz-funnel-select", onSelect);
      funnel?.destroy();
      funnel = null;
      delete section.dataset.funnelReady;
      delete section.dataset.funnelPlaced;
      delete section.dataset.funnelStatic;
      clearInlineStepPositions(section);
    };
  }, []);

  return null;
}
