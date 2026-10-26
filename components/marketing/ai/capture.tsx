"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { CategorySection } from "@/components/marketing/depth";

const lines = [
  ["Dr. Francois", "We will keep the lisinopril and look again in a month."],
  ["Paul", "Mornings still work."],
] as const;

const proposal = "Follow-up Thursday at 9:00. Draft claim 99203, $185, note attached.";

export function AiCaptureSection() {
  const reduce = useReducedMotion();
  const frame = useRef<HTMLDivElement>(null);
  const inView = useInView(frame, { once: true, margin: "-12%" });
  const [run, setRun] = useState(0);
  const [shown, setShown] = useState(0);
  const [chars, setChars] = useState(0);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    if (!inView) return;
    setApproved(false);
    if (reduce) {
      setShown(lines.length);
      setChars(proposal.length);
      return;
    }

    setShown(0);
    setChars(0);
    let cancelled = false;
    const timers: number[] = [];
    lines.forEach((_, index) => {
      timers.push(
        window.setTimeout(() => {
          if (!cancelled) setShown(index + 1);
        }, 700 * (index + 1)),
      );
    });
    const type = (count: number) => {
      if (cancelled) return;
      const next = Math.min(proposal.length, count + 1);
      setChars(next);
      if (next < proposal.length) timers.push(window.setTimeout(() => type(next), 16));
    };
    timers.push(window.setTimeout(() => type(0), 700 * (lines.length + 1)));
    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [inView, reduce, run]);

  const ready = shown >= lines.length && chars >= proposal.length;
  const writing = shown >= lines.length && chars < proposal.length;

  return (
    <CategorySection
      id="capture"
      flip
      eyebrow="Room capture"
      title="The visit proposes the next step."
      body="Optional hardware in the room keeps the exchange. The agent drafts the follow-up and the claim. A person approves it."
    >
      <div ref={frame} className="overflow-hidden rounded-3xl border border-line bg-white shadow-xl shadow-ink/10">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <p className="text-sm font-medium text-ink">Room 2 · 9:00</p>
            <p className="text-xs text-graphite">
              {approved ? "Approved" : ready ? "Ready for approval" : writing ? "Proposing the follow-up" : "Listening"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setRun((value) => value + 1)}
            className="text-sm font-medium text-slash underline-offset-4 hover:underline"
          >
            Replay
          </button>
        </div>
        <div className="grid min-h-28 gap-2 p-4">
          {lines.slice(0, shown).map(([who, line], index) => (
            <motion.p
              key={`${run}-${who}-${index}`}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl bg-mist px-4 py-3 text-sm leading-relaxed text-graphite"
            >
              <span className="font-medium text-ink">{who}. </span>
              {line}
            </motion.p>
          ))}
        </div>
        <div className="bg-ink px-5 py-5 text-paper" aria-live="polite">
          <p className="text-[11px] uppercase tracking-[0.16em] text-white/50">Agent</p>
          <p className="mt-3 min-h-16 font-display text-2xl leading-snug">
            {proposal.slice(0, chars)}
            {!ready && <span className="ml-0.5 inline-block h-[0.9em] w-px translate-y-1 animate-pulse bg-paper" />}
          </p>
          {ready && (
            <button
              type="button"
              onClick={() => setApproved((value) => !value)}
              className="mt-4 inline-flex rounded-full bg-paper px-4 py-2 text-sm font-medium text-ink"
            >
              {approved ? "Undo the approval" : "Approve Thursday at 9:00"}
            </button>
          )}
        </div>
      </div>
    </CategorySection>
  );
}
