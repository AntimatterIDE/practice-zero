"use client";

import { useEffect, useState } from "react";

/**
 * Hide a sticky chrome bar after scrolling down; show it again on scroll up.
 * Disabled while `locked` (e.g. a full-screen menu is open).
 */
export function useHideOnScroll(locked = false) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (locked) {
      setHidden(false);
      return;
    }

    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = Math.max(0, window.scrollY);
        const delta = y - lastY;

        if (y < 48) {
          setHidden(false);
        } else if (delta > 4) {
          setHidden(true);
        } else if (delta < -4) {
          setHidden(false);
        }

        lastY = y;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [locked]);

  return hidden;
}
