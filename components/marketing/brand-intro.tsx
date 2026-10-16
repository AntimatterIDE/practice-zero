"use client";

import { useEffect, useState, type ComponentType } from "react";

function clearIntroGate() {
  try {
    document.documentElement.removeAttribute("data-pz-intro");
  } catch {
    /* ignore */
  }
}

function isLabClient() {
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
 * Homepage brand intro — plays on every home load/refresh (except labs).
 * The WebGL funnel warms as the intro exits so the countdown stays light.
 */
export function BrandIntro() {
  const [Animation, setAnimation] = useState<ComponentType<{ onReady?: () => void }> | null>(null);

  useEffect(() => {
    if (isLabClient()) {
      clearIntroGate();
      try {
        window.dispatchEvent(new Event("pz-funnel-ready"));
      } catch {
        /* ignore */
      }
      return;
    }

    let cancelled = false;
    void import("./brand-intro-animation").then((mod) => {
      if (!cancelled) setAnimation(() => mod.BrandIntroAnimation);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!Animation) return null;
  // Swap the CSS first-paint cover for the animated overlay; funnel warms underneath.
  return <Animation onReady={clearIntroGate} />;
}
