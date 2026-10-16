"use client";

import { useEffect, useState, type ComponentType } from "react";
import { INTRO_SESSION_KEY, shouldSkipHeavyVisuals } from "@/lib/lab-environment";

function clearIntroGate() {
  try {
    document.documentElement.removeAttribute("data-pz-intro");
  } catch {
    /* ignore */
  }
}

function markIntroSeen() {
  try {
    window.sessionStorage.setItem(INTRO_SESSION_KEY, "1");
  } catch {
    /* ignore */
  }
}

/**
 * Homepage brand intro — plays on first home load in a session (except labs /
 * reduced-motion / save-data). The WebGL funnel warms as the intro exits.
 */
export function BrandIntro() {
  const [Animation, setAnimation] = useState<ComponentType<{ onReady?: () => void }> | null>(null);

  useEffect(() => {
    if (shouldSkipHeavyVisuals()) {
      clearIntroGate();
      markIntroSeen();
      try {
        window.dispatchEvent(new Event("pz-funnel-ready"));
      } catch {
        /* ignore */
      }
      return;
    }

    try {
      if (window.sessionStorage.getItem(INTRO_SESSION_KEY) === "1") {
        clearIntroGate();
        return;
      }
    } catch {
      /* ignore */
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
  return (
    <Animation
      onReady={() => {
        clearIntroGate();
        markIntroSeen();
      }}
    />
  );
}
