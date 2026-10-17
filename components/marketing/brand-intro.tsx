"use client";

import { useEffect, useState, type ComponentType } from "react";
import {
  INTRO_SESSION_KEY,
  isLabEnvironment,
  shouldSkipHeavyVisuals,
} from "@/lib/lab-environment";

function clearIntroGate() {
  try {
    document.documentElement.removeAttribute("data-pz-intro");
  } catch {
    /* ignore */
  }
}

/** Wait until the React overlay has painted before dropping the CSS cover. */
function clearIntroGateAfterPaint() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      clearIntroGate();
    });
  });
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
 * reduced-motion / save-data). WebGL stays engagement-gated separately.
 */
export function BrandIntro() {
  const [Animation, setAnimation] = useState<ComponentType<{ onReady?: () => void }> | null>(null);

  useEffect(() => {
    const skip = () => {
      clearIntroGate();
      markIntroSeen();
      try {
        window.dispatchEvent(new Event("pz-funnel-ready"));
      } catch {
        /* ignore */
      }
    };

    if (shouldSkipHeavyVisuals() || isLabEnvironment()) {
      skip();
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
      // Re-check after the chunk arrives — labs must never mount motion.
      if (cancelled || shouldSkipHeavyVisuals() || isLabEnvironment()) {
        skip();
        return;
      }
      setAnimation(() => mod.BrandIntroAnimation);
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
        markIntroSeen();
        clearIntroGateAfterPaint();
      }}
    />
  );
}
