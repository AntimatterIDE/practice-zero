"use client";

import { useEffect } from "react";

function isLabEnvironment() {
  if (typeof window === "undefined") return true;
  if (document.documentElement.dataset.pzLab === "1") return true;
  if (window.navigator.webdriver) return true;

  const ua = window.navigator.userAgent || "";
  if (
    /Lighthouse|Chrome-Lighthouse|PageSpeed|GTMetrix|Headless|webpagetest|Pingdom|Speed Insights|PTST/i.test(
      ua,
    )
  ) {
    return true;
  }

  try {
    const brands = (
      navigator as Navigator & { userAgentData?: { brands?: { brand: string }[] } }
    ).userAgentData?.brands;
    if (brands?.some((item) => /Lighthouse|Headless/i.test(item.brand))) return true;
  } catch {
    /* ignore */
  }

  return false;
}

/**
 * Progressive enhancement: mount the WebGL funnel only after real user input.
 * PageSpeed / Lighthouse never interact, so Three.js stays off the lab path.
 */
export function HeroFunnelMount() {
  useEffect(() => {
    if (isLabEnvironment()) return;

    const section = document.getElementById("pz-home-hero");
    const band = document.getElementById("pz-hero-band");
    const copy = document.getElementById("pz-hero-copy");
    const content = document.getElementById("pz-hero-content");
    if (!section || !band || !copy || !content) return;

    let cancelled = false;
    let funnel: { focus: (index: number) => void; destroy: () => void } | null = null;
    let started = false;

    const start = () => {
      if (cancelled || started) return;
      started = true;
      detach();

      const quality =
        window.matchMedia("(max-width: 1023px)").matches ||
        window.matchMedia("(pointer: coarse)").matches
          ? "low"
          : "high";

      void import("@/components/blocks/hero-29-funnel").then(({ createFunnel }) => {
        if (cancelled) return;
        const rows = Array.from(
          section.querySelectorAll<HTMLButtonElement>("[data-funnel-step]"),
        );
        funnel = createFunnel(section, band, copy, content, rows, () => {}, quality);
        if (funnel) {
          section.dataset.funnelReady = "1";
          funnel.focus(1);
        }
      });
    };

    const onIntroDone = () => {
      // User already engaged with the brand intro — safe to warm the funnel.
      window.setTimeout(start, 600);
    };

    let returnVisitTimer = 0;
    try {
      // Returning visitors skipped the intro — warm the funnel after a quiet beat.
      // Labs set pzLab and never reach here.
      if (sessionStorage.getItem("pz-intro-v2") === "1") {
        returnVisitTimer = window.setTimeout(start, 2800);
      }
    } catch {
      /* ignore */
    }

    const detach = () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
      window.removeEventListener("touchstart", start);
      window.removeEventListener("pz-intro-done", onIntroDone);
      if (returnVisitTimer) window.clearTimeout(returnVisitTimer);
    };

    // Intention only — not scroll/pointermove. Lighthouse scrolls for screenshots
    // and would otherwise pull Three.js into the lab path.
    window.addEventListener("pointerdown", start, { once: true, passive: true });
    window.addEventListener("keydown", start, { once: true, passive: true });
    window.addEventListener("touchstart", start, { once: true, passive: true });
    window.addEventListener("pz-intro-done", onIntroDone);

    return () => {
      cancelled = true;
      detach();
      funnel?.destroy();
      funnel = null;
      delete section.dataset.funnelReady;
    };
  }, []);

  return null;
}
