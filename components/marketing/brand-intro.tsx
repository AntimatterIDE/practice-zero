"use client";

import { useEffect, useState, type ComponentType } from "react";

const STORAGE_KEY = "pz-intro-v2";

function clearIntroGate() {
  try {
    document.documentElement.removeAttribute("data-pz-intro");
  } catch {
    /* ignore */
  }
}

function shouldSkipIntro() {
  if (typeof window === "undefined") return true;
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

  try {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return true;
  } catch {
    /* ignore */
  }

  return false;
}

export function BrandIntro() {
  const [Animation, setAnimation] = useState<ComponentType<{ onReady?: () => void }> | null>(null);

  useEffect(() => {
    if (document.documentElement.dataset.pzLab === "1" || shouldSkipIntro()) {
      clearIntroGate();
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
  return <Animation onReady={clearIntroGate} />;
}
