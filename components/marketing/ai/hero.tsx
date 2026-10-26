"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const runs = [
  {
    time: "8:10",
    title: "Eligibility checked",
    detail: "Paul Wallace is active out of network. The $185 fee is due today.",
    href: "/try/eligibility",
    waiting: false,
  },
  {
    time: "9:20",
    title: "Note drafted",
    detail: "Essential hypertension. Continue lisinopril 10 mg.",
    href: "/ehr#scribe",
    waiting: false,
  },
  {
    time: "9:28",
    title: "Claim queued",
    detail: "99203 · $185 · note attached · still a draft until you file it.",
    href: "/try/claims/clm-hale",
    waiting: false,
  },
  {
    time: "10:30",
    title: "Confirm Garrett",
    detail: "The follow-up is on the board. The records release is unsigned.",
    href: "/ai#board",
    waiting: true,
    done: "Confirmed for this morning.",
  },
] as const;

export function AiHero() {
  const reduce = useReducedMotion();
  const frame = useRef<HTMLDivElement>(null);
  const inView = useInView(frame, { once: true, margin: "-10%" });
  const [run, setRun] = useState(0);
  const [shown, setShown] = useState(0);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    if (!inView) return;
    setApproved(false);
    if (reduce) {
      setShown(runs.length);
      return;
    }
    setShown(0);
    let cancelled = false;
    const timers = runs.map((_, index) =>
      window.setTimeout(() => {
        if (!cancelled) setShown(index + 1);
      }, 650 * (index + 1)),
    );
    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [inView, reduce, run]);

  const ready = shown >= runs.length;

  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-16 lg:grid-cols-2 lg:gap-16 lg:pb-24 lg:pt-24">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="kicker">AI · Agentic EHR</p>
        <h1 className="mt-6 max-w-xl font-sans text-5xl font-semibold lowercase leading-[1.05] tracking-[-0.04em] text-ink sm:text-6xl">
          practice zero agents run the practice so you can run the rooms.
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-graphite">
          Scheduling, claims, payment tracking, and follow-ups keep moving. You approve the exceptions. Optional room
          hardware feeds the agents from the visit.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <Link
            href="/contact"
            prefetch={false}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-slash px-7 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-oxide-deep"
          >
            Book a walkthrough
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/try"
            prefetch={false}
            className="group inline-flex items-center gap-2 text-sm font-medium text-slash transition-colors hover:text-oxide-deep"
          >
            Try the demo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </motion.div>

      <motion.div
        ref={frame}
        initial={reduce ? false : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: reduce ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(17,20,24,0.06),0_18px_40px_rgba(17,20,24,0.1)]"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <div>
            <p className="text-sm font-medium text-ink">Wednesday agents</p>
            <p className="flex items-center gap-2 text-xs text-graphite">
              {!ready && (
                <span className="relative flex h-1.5 w-1.5" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-slash opacity-60" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-slash" />
                </span>
              )}
              <span aria-live="polite">{ready ? (approved ? "Clear for now" : "1 waiting on you") : "Running the morning"}</span>
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
        <ol className="grid min-h-72">
          {runs.slice(0, shown).map((item, index) => (
            <motion.li
              key={`${run}-${item.time}`}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={cn("border-t border-line px-4 py-3 first:border-t-0", index === runs.length - 1 && approved && "bg-mist")}
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-medium text-ink">{item.title}</p>
                <p className="font-mono text-[11px] text-graphite">{item.time}</p>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-graphite">
                {item.waiting && approved ? item.done : item.detail}
              </p>
              <div className="mt-2 flex items-center gap-4">
                <Link href={item.href} className="text-xs font-medium text-slash underline-offset-4 hover:underline">
                  Open
                </Link>
                {item.waiting && (
                  <button
                    type="button"
                    onClick={() => setApproved((value) => !value)}
                    className="text-xs font-medium text-ink underline-offset-4 hover:underline"
                  >
                    {approved ? "Undo" : "Approve 10:30"}
                  </button>
                )}
              </div>
            </motion.li>
          ))}
        </ol>
      </motion.div>
    </section>
  );
}
