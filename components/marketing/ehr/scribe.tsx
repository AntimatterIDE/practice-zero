"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { CategorySection } from "@/components/marketing/depth";

const lines = [
  ["Dr. Francois", "What brought you in?"],
  ["Paul", "The pharmacy machine has been reading my pressure high."],
  ["Dr. Francois", "We will keep the lisinopril and look again in a month."],
] as const;

const note = "Essential hypertension. Continue lisinopril 10 mg. Return in a month.";

export function ScribeSection() {
  const reduce = useReducedMotion();
  const frame = useRef<HTMLDivElement>(null);
  const inView = useInView(frame, { once: true, margin: "-12%" });
  const [run, setRun] = useState(0);
  const [shown, setShown] = useState(0);
  const [chars, setChars] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setShown(lines.length);
      setChars(note.length);
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
      const next = Math.min(note.length, count + 1);
      setChars(next);
      if (next < note.length) timers.push(window.setTimeout(() => type(next), 16));
    };
    timers.push(window.setTimeout(() => type(0), 700 * (lines.length + 1)));
    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [inView, reduce, run]);

  const ready = shown >= lines.length && chars >= note.length;
  const writing = shown >= lines.length && chars < note.length;

  return (
    <CategorySection
      id="scribe"
      eyebrow="Scribe"
      title="The visit becomes the note."
      body="The 9:00 transcript stays with the chart. The assessment is essential hypertension note, labs, and e-prescribe stay with the visit until someone asks to see them."
    >
      <div ref={frame} className="overflow-hidden rounded-3xl border border-line bg-white shadow-xl shadow-ink/10">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <p className="text-sm font-medium text-ink">Room 2 · 9:00</p>
            <p className="text-xs text-graphite">{ready ? "Note on the chart" : writing ? "Writing the note" : "Listening"}</p>
          </div>
          <button
            type="button"
            onClick={() => setRun((value) => value + 1)}
            className="text-sm font-medium text-slash underline-offset-4 hover:underline"
          >
            Replay
          </button>
        </div>
        <div className="grid min-h-40 gap-2 p-4">
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
          <p className="text-[11px] uppercase tracking-[0.16em] text-white/50">Note</p>
          <p className="mt-3 min-h-16 font-display text-2xl leading-snug">
            {note.slice(0, chars)}
            {!ready && <span className="ml-0.5 inline-block h-[0.9em] w-px translate-y-1 animate-pulse bg-paper" />}
          </p>
        </div>
      </div>
    </CategorySection>
  );
}
