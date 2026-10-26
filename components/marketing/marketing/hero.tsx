"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const surfaces = [
  { id: "page", label: "Page" },
  { id: "post", label: "Post" },
  { id: "schedule", label: "Schedule" },
] as const;

type Surface = (typeof surfaces)[number]["id"];

export function MarketingHero() {
  const reduce = useReducedMotion();
  const [surface, setSurface] = useState<Surface>("page");
  const [posted, setPosted] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-16 lg:grid-cols-2 lg:gap-16 lg:pb-24 lg:pt-24">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="kicker">Marketing</p>
        <h1 className="mt-6 max-w-xl font-sans text-5xl font-semibold lowercase leading-[1.05] tracking-[-0.04em] text-ink sm:text-6xl">
          found, then booked.
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-graphite">
          A page someone can search, a post the practice can put up, and a morning that still has a slot to confirm.
          The follow-up text comes after they are already on the chart.
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
            href="/marketing#seo"
            prefetch={false}
            className="group inline-flex items-center gap-2 text-sm font-medium text-slash transition-colors hover:text-oxide-deep"
          >
            See how they arrive
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: reduce ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(17,20,24,0.06),0_18px_40px_rgba(17,20,24,0.1)]"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <div>
            <p className="text-sm font-medium text-ink">How they arrive</p>
            <p className="text-xs text-graphite" aria-live="polite">
              Page is up · {posted ? "Post is public" : "Post is a draft"} · {confirmed ? "10:30 confirmed" : "10:30 open"}
            </p>
          </div>
          <div className="flex rounded-lg bg-paper p-1">
            {surfaces.map((item) => {
              const selected = item.id === surface;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setSurface(item.id)}
                  className={cn(
                    "relative rounded-md px-2.5 py-1 text-xs font-medium",
                    selected ? "text-ink" : "text-graphite hover:text-ink",
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId="arrive-tab"
                      className="absolute inset-0 rounded-md bg-white shadow-sm"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-h-64 p-5">
          {surface === "page" && (
            <div className="flex h-56 flex-col justify-center">
              <p className="text-[11px] uppercase tracking-[0.16em] text-graphite/70">Search · blood pressure</p>
              <p className="mt-3 text-sm text-slash">southeast.example/blood-pressure</p>
              <p className="mt-2 font-display text-3xl text-ink">Blood pressure</p>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-graphite">
                The reason Paul came in. A plain page a new patient can find. No ranking is promised.
              </p>
            </div>
          )}
          {surface === "post" && (
            <div
              className={cn(
                "flex h-56 flex-col justify-center rounded-2xl px-5",
                posted ? "bg-ink text-paper" : "bg-mist text-ink",
              )}
            >
              <p className={cn("text-[11px] uppercase tracking-[0.16em]", posted ? "text-white/50" : "text-graphite/70")}>
                {posted ? "Public" : "Draft"}
              </p>
              <p className="mt-3 font-display text-3xl">Mornings are open</p>
              <p className={cn("mt-2 text-sm", posted ? "text-paper/70" : "text-graphite")}>
                New patients welcome. Wednesday visits, from 8:40.
              </p>
            </div>
          )}
          {surface === "schedule" && (
            <div className="flex h-56 flex-col justify-center">
              <p className="text-[11px] uppercase tracking-[0.16em] text-graphite/70">Wednesday, October 14</p>
              <p className="mt-3 font-display text-4xl text-ink">10:30</p>
              <p className="mt-2 text-sm font-medium text-ink">Garrett Holliday</p>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-graphite">
                {confirmed
                  ? "Confirmed. The morning can keep that slot."
                  : "Still unconfirmed. The slot is on the board, waiting for a yes."}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3">
          {surface === "page" && (
            <Link href="/marketing#seo" className="inline-flex rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink/90">
              Open search
            </Link>
          )}
          {surface === "post" && (
            <button
              type="button"
              onClick={() => setPosted((value) => !value)}
              className="inline-flex rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink/90"
            >
              {posted ? "Take it down" : "Post it"}
            </button>
          )}
          {surface === "schedule" && (
            <button
              type="button"
              onClick={() => setConfirmed((value) => !value)}
              className="inline-flex rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink/90"
            >
              {confirmed ? "Undo the confirmation" : "Confirm 10:30"}
            </button>
          )}
          <Link
            href={surface === "page" ? "/marketing#seo" : surface === "post" ? "/marketing#social" : "/marketing#scheduling"}
            className="text-sm font-medium text-slash underline-offset-4 hover:underline"
          >
            {surface === "page" ? "The pages" : surface === "post" ? "The posts" : "The board"}
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
