"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const tasks = [
  "after-hours charting",
  "missed eligibility checks",
  "phone tag with payers",
  "unconfirmed mornings",
];

const STORAGE_KEY = "pz-intro-v2";
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function BrandIntroAnimation({ onReady }: { onReady?: () => void }) {
  const reduce = useReducedMotion();
  const [gate, setGate] = useState<"play" | "skip">("play");
  const [count, setCount] = useState(23);
  const [cleared, setCleared] = useState(0);
  const [exiting, setExiting] = useState(false);
  const marked = useRef(false);

  useEffect(() => {
    // Swap the CSS first-paint cover for this overlay without a gap.
    onReady?.();
  }, [onReady]);

  useEffect(() => {
    if (reduce === null) return;
    if (reduce) {
      // Still play, just faster via duration below.
    }
    setGate("play");
  }, [reduce]);

  useEffect(() => {
    if (gate !== "play" || exiting) return;

    const duration = reduce ? 1700 : 3000;
    const start = performance.now();
    let frame = 0;
    const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

    const tick = (now: number) => {
      const raw = Math.min(1, (now - start) / duration);
      const t = easeOutCubic(raw);
      setCount(Math.round(23 * (1 - t)));
      setCleared(Math.min(tasks.length, Math.floor(t * (tasks.length + 0.12))));
      if (raw < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setCount(0);
        setCleared(tasks.length);
        window.setTimeout(() => setExiting(true), 280);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [gate, exiting, reduce]);

  useEffect(() => {
    if (gate !== "play") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [gate]);

  useEffect(() => {
    if (!exiting) return;
    const timer = window.setTimeout(() => {
      if (!marked.current) {
        marked.current = true;
        try {
          sessionStorage.setItem(STORAGE_KEY, "1");
        } catch {
          /* ignore */
        }
      }
      setGate("skip");
    }, 750);
    return () => window.clearTimeout(timer);
  }, [exiting]);

  return (
    <AnimatePresence>
      {gate === "play" ? (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-ink text-paper will-change-transform"
          initial={false}
          animate={{ opacity: exiting ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          aria-hidden="true"
        >
          <motion.div
            className="relative z-10 flex w-full max-w-lg flex-col items-center px-6 text-center"
            animate={{
              opacity: exiting ? 0 : 1,
              y: exiting ? -12 : 0,
              scale: exiting ? 1.03 : 1,
            }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <div className="relative">
              <span className="font-mono text-[5rem] leading-none text-slash sm:text-[7rem]">Ø</span>
              <motion.span
                className="absolute left-1/2 top-1/2 h-[3px] w-[120%] -translate-x-1/2 -translate-y-1/2 origin-center bg-slash"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: cleared > 0 ? 1 : 0 }}
                transition={{ duration: 0.6, ease: EASE }}
              />
            </div>

            <p className="mt-8 font-sans text-6xl font-semibold tracking-[-0.05em] tabular-nums sm:text-7xl">
              {count}
            </p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.28em] text-foam">Open tasks</p>

            <ul className="mt-10 w-full max-w-sm space-y-3 text-left">
              {tasks.map((task) => {
                const done = tasks.indexOf(task) < cleared;
                return (
                  <li
                    key={task}
                    className="relative flex items-center gap-3 text-sm font-medium lowercase tracking-[-0.02em] text-paper/80"
                  >
                    <span className="font-mono text-foam">ø</span>
                    <span className="relative">
                      {task}
                      <motion.span
                        aria-hidden="true"
                        className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 origin-left bg-slash"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: done ? 1 : 0 }}
                        transition={{ duration: 0.5, ease: EASE }}
                      />
                    </span>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
