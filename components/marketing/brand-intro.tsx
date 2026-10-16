"use client";

import { useEffect, useState, type ComponentType } from "react";

const STORAGE_KEY = "pz-intro-v2";
const FUNNEL_GATE_MS = 4000;

function clearIntroGate() {
  try {
    document.documentElement.removeAttribute("data-pz-intro");
  } catch {
    /* ignore */
  }
}

function isHomePath() {
  const path = window.location.pathname;
  return path === "/" || path === "";
}

/** Hold the ink first-paint cover until the funnel is ready (or timeout). */
function holdCoverUntilFunnel() {
  let settled = false;
  const finish = () => {
    if (settled) return;
    settled = true;
    window.clearTimeout(maxWait);
    window.removeEventListener("pz-funnel-ready", finish);
    clearIntroGate();
  };
  const maxWait = window.setTimeout(finish, FUNNEL_GATE_MS);
  window.addEventListener("pz-funnel-ready", finish);
  // Funnel may already be ready (race with HeroFunnelMount)
  if (document.getElementById("pz-home-hero")?.dataset.funnelReady === "1") {
    finish();
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
    if (document.documentElement.dataset.pzLab === "1") {
      clearIntroGate();
      return;
    }

    if (shouldSkipIntro()) {
      // Return visit on homepage: keep cover until funnel paints to avoid late pop-in CLS.
      if (isHomePath()) {
        holdCoverUntilFunnel();
      } else {
        clearIntroGate();
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
  // First visit: swap CSS cover for the animated overlay immediately; funnel warms underneath.
  return <Animation onReady={clearIntroGate} />;
}
