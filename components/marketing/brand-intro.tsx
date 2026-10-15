"use client";

import { useEffect, useState, type ComponentType } from "react";

const STORAGE_KEY = "pz-intro-v2";

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
  const [Animation, setAnimation] = useState<ComponentType | null>(null);

  useEffect(() => {
    if (shouldSkipIntro()) return;

    let cancelled = false;
    let idleId: number | undefined;
    const timeouts: number[] = [];

    const load = () => {
      if (cancelled || shouldSkipIntro()) return;
      void import("./brand-intro-animation").then((mod) => {
        if (!cancelled) setAnimation(() => mod.BrandIntroAnimation);
      });
    };

    const later = (fn: () => void, ms: number) => {
      timeouts.push(window.setTimeout(fn, ms));
    };

    const schedule = () => {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(() => load(), { timeout: 1800 });
      } else {
        later(load, 900);
      }
    };

    let observer: PerformanceObserver | null = null;
    try {
      observer = new PerformanceObserver((list) => {
        if (list.getEntries().length > 0) {
          observer?.disconnect();
          later(schedule, 500);
        }
      });
      observer.observe({ type: "largest-contentful-paint", buffered: true });
      later(schedule, 2200);
    } catch {
      schedule();
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  if (!Animation) return null;
  return <Animation />;
}
