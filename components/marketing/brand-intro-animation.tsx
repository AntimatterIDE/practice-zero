"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const tasks = [
  "after-hours charting",
  "missed eligibility checks",
  "phone tag with payers",
  "unconfirmed mornings",
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
/** Matches React Bits preloader slide exit. */
const SLIDE_EASE: [number, number, number, number] = [0.65, 0, 0.35, 1];
const START_COUNT = 23;
const SLIDE_MS = 800;

export function BrandIntroAnimation({ onReady }: { onReady?: () => void }) {
  const reduce = useReducedMotion();
  const [gate, setGate] = useState<"play" | "skip">("play");
  const [cleared, setCleared] = useState(0);
  const [exiting, setExiting] = useState(false);
  const marked = useRef(false);
  const countRef = useRef<HTMLSpanElement>(null);
  const clearedRef = useRef(0);

  useEffect(() => {
    // Swap the CSS first-paint cover for this overlay without a gap.
    onReady?.();
  }, [onReady]);

  useEffect(() => {
    if (reduce === null) return;
    setGate("play");
  }, [reduce]);

  useEffect(() => {
    if (gate !== "play" || exiting) return;

    const duration = reduce ? 1100 : 2000;
    const start = performance.now();
    let frame = 0;
    const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

    const tick = (now: number) => {
      const raw = Math.min(1, (now - start) / duration);
      const t = easeOutCubic(raw);
      const nextCount = Math.round(START_COUNT * (1 - t));
      if (countRef.current) countRef.current.textContent = String(nextCount);

      const nextCleared = Math.min(tasks.length, Math.floor(t * (tasks.length + 0.12)));
      if (nextCleared !== clearedRef.current) {
        clearedRef.current = nextCleared;
        setCleared(nextCleared);
      }

      if (raw < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        if (countRef.current) countRef.current.textContent = "0";
        clearedRef.current = tasks.length;
        setCleared(tasks.length);
        window.setTimeout(() => setExiting(true), 180);
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

    // Let the funnel warm during the slide — don't hold the cover waiting on WebGL.
    try {
      window.dispatchEvent(new Event("pz-intro-exit"));
    } catch {
      /* ignore */
    }

    let cancelled = false;
    const finish = () => {
      if (cancelled || marked.current) return;
      marked.current = true;
      setGate("skip");
      try {
        window.dispatchEvent(new Event("pz-intro-done"));
      } catch {
        /* ignore */
      }
    };

    const timer = window.setTimeout(finish, reduce ? 320 : SLIDE_MS);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [exiting, reduce]);

  return (
    <AnimatePresence>
      {gate === "play" ? (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-paper text-ink"
          initial={false}
          animate={{ x: exiting ? "100%" : "0%" }}
          exit={{ x: "100%" }}
          transition={{
            duration: reduce ? 0.3 : SLIDE_MS / 1000,
            ease: reduce ? EASE : SLIDE_EASE,
          }}
          aria-hidden="true"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: "linear-gradient(180deg, #FAF9F5 0%, #F5F4EF 100%)",
            }}
          />

          <motion.div
            className="relative z-10 flex w-full max-w-lg flex-col items-center px-6 text-center"
            animate={{
              opacity: exiting ? 0 : 1,
              x: exiting ? 24 : 0,
            }}
            transition={{
              duration: reduce ? 0.2 : 0.45,
              ease: EASE,
            }}
          >
            {/* Same mark language as the social share / OG card — no horizontal cross. */}
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 80"
              fill="none"
              className="h-20 w-16 sm:h-28 sm:w-[5.5rem]"
              aria-hidden
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <ellipse
                cx="32"
                cy="40"
                rx="22"
                ry="30"
                stroke="#111418"
                strokeWidth="8"
                fill="none"
              />
              <motion.path
                d="M14 62 L50 18"
                stroke="#2D4BF0"
                strokeWidth="8"
                strokeLinecap="round"
                pathLength={1}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: cleared > 0 || reduce ? 1 : 0 }}
                transition={{ duration: 0.85, ease: EASE }}
              />
            </motion.svg>

            <motion.p
              className="mt-6 font-sans text-3xl font-semibold lowercase tracking-[-0.055em] text-ink sm:text-4xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.12, ease: EASE }}
            >
              practice zero
            </motion.p>

            <p className="mt-10 font-sans text-6xl font-semibold tracking-[-0.05em] tabular-nums text-ink sm:text-7xl">
              <span ref={countRef}>{START_COUNT}</span>
            </p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.28em] text-graphite">
              Open tasks
            </p>

            <ul className="mt-10 w-full max-w-sm space-y-3 text-left">
              {tasks.map((task, index) => {
                const done = index < cleared;
                return (
                  <li
                    key={task}
                    className="relative flex items-center gap-3 text-sm font-medium lowercase tracking-[-0.02em] text-ink/75"
                  >
                    <span className="font-mono text-slash">ø</span>
                    <span className="relative">
                      {task}
                      <motion.span
                        aria-hidden="true"
                        className="absolute left-0 right-0 top-1/2 h-[2px] origin-left -translate-y-1/2 bg-slash"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: done ? 1 : 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
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
