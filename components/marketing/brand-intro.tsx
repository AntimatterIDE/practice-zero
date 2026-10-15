"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const tasks = [
  "after-hours charting",
  "missed eligibility checks",
  "phone tag with payers",
  "unconfirmed mornings",
];

const STORAGE_KEY = "pz-intro-seen";

export function BrandIntro() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<"boot" | "count" | "open" | "done">("boot");
  const [count, setCount] = useState(23);
  const [cleared, setCleared] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (reduce || window.navigator.webdriver) {
      setPhase("done");
      return;
    }
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") {
        setPhase("done");
        return;
      }
    } catch {
      /* ignore */
    }
    setActive(true);
    setPhase("count");
  }, [reduce]);

  useEffect(() => {
    if (phase !== "count" || !active) return;

    const start = performance.now();
    const duration = 3200;
    let frame = 0;

    const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

    const tick = (now: number) => {
      const raw = Math.min(1, (now - start) / duration);
      const t = easeOutCubic(raw);
      const next = Math.round(23 * (1 - t));
      setCount(next);
      setCleared(Math.min(tasks.length, Math.floor(t * (tasks.length + 0.15))));
      if (raw < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setCount(0);
        setCleared(tasks.length);
        setPhase("open");
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, active]);

  useEffect(() => {
    if (phase !== "open") return;
    const timer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
      setPhase("done");
    }, 1100);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === "boot" || phase === "done") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [phase]);

  if (phase === "boot") return null;

  return (
    <AnimatePresence>
      {phase !== "done" ? (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-ink text-paper"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        >
          <motion.div
            className="absolute inset-0 bg-ink"
            animate={
              phase === "open"
                ? { clipPath: "circle(150% at 50% 50%)", opacity: 0 }
                : { clipPath: "circle(100% at 50% 50%)", opacity: 1 }
            }
            transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
          />

          <div className="relative z-10 flex w-full max-w-lg flex-col items-center px-6 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale: phase === "open" ? 1.28 : 1,
                opacity: phase === "open" ? 0 : 1,
              }}
              transition={{ duration: phase === "open" ? 0.9 : 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <span className="font-mono text-[5.5rem] leading-none text-slash sm:text-[7rem]">Ø</span>
              <motion.span
                className="absolute left-1/2 top-1/2 h-[3px] w-[120%] -translate-x-1/2 -translate-y-1/2 origin-left bg-slash"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: cleared > 0 ? 1 : 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>

            <motion.p
              className="mt-8 font-sans text-6xl font-semibold tracking-[-0.05em] sm:text-7xl"
              animate={{ opacity: phase === "open" ? 0 : 1, y: phase === "open" ? -10 : 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              {count}
            </motion.p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.28em] text-slash">Open tasks</p>

            <ul className="mt-10 w-full max-w-sm space-y-3 text-left">
              {tasks.map((task, index) => {
                const done = index < cleared;
                return (
                  <motion.li
                    key={task}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.14 * index, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="relative flex items-center gap-3 text-sm font-medium lowercase tracking-[-0.02em] text-paper/55"
                  >
                    <span className="font-mono text-slash">ø</span>
                    <span className="relative">
                      {task}
                      <motion.span
                        aria-hidden="true"
                        className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 origin-left bg-slash"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: done ? 1 : 0 }}
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          <motion.div
            className="pointer-events-none absolute inset-0 bg-slash"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "open" ? [0, 0.28, 0] : 0 }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
