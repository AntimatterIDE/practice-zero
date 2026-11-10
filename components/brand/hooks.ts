"use client";
import * as React from "react";

/** True once the element has scrolled into view (fires once). Returns a callback ref, so it works with React 18 and 19. */
export function useInViewOnce<T extends Element>(threshold = 0.35): [(node: T | null) => void, boolean] {
  const [node, setNode] = React.useState<T | null>(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    if (!node || seen) return;
    if (typeof IntersectionObserver === "undefined") { setSeen(true); return; }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { threshold });
    io.observe(node);
    return () => io.disconnect();
  }, [node, seen, threshold]);
  return [setNode, seen];
}

/** Mirrors the OS "reduce motion" setting. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}
