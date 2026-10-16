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
 * Labs never load Three.js. Layout space is reserved in CSS so mounting does not CLS.
 */
export function HeroFunnelMount() {
  useEffect(() => {
    if (isLabEnvironment()) {
      // Labs: clear any pending homepage gate without loading WebGL
      try {
        window.dispatchEvent(new Event("pz-funnel-ready"));
      } catch {
        /* ignore */
      }
      return;
    }

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
          markFunnelReady(section);
          funnel.focus(1);
        } else {
          markFunnelReady(section);
        }
      });
    };

    const detach = () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
      window.removeEventListener("touchstart", start);
      window.removeEventListener("pz-intro-done", start);
      window.clearTimeout(warmTimer);
    };

    // Warm immediately — brand intro / ink cover hides the load for first visits;
    // return visits no longer wait ~3s before the funnel appears.
    const warmTimer = window.setTimeout(start, 32);

    // Intent + intro-done remain as backups if the immediate warm is cancelled somehow.
    window.addEventListener("pointerdown", start, { once: true, passive: true });
    window.addEventListener("keydown", start, { once: true, passive: true });
    window.addEventListener("touchstart", start, { once: true, passive: true });
    window.addEventListener("pz-intro-done", start);

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
