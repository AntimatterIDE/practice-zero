"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const phases = [
  {
    step: "01",
    title: "Discovery",
    body: "Rooms, Pinetree Health, the $185 fee, and Dr. Francois’s Wednesday mornings. No hour cap.",
    href: "/onboarding#discovery",
    proof: "4 things still to map",
  },
  {
    step: "02",
    title: "Build",
    body: "A request during go-live ships in the window. This one puts the records release on the 10:30 row.",
    href: "/onboarding#build",
    proof: "Records release · requested",
  },
  {
    step: "03",
    title: "Website",
    body: "A practice site is included. The Alignment Clinic is one that is already live.",
    href: "/onboarding#website",
    proof: "thealignmentclinic.com",
  },
  {
    step: "04",
    title: "Support",
    body: "The same team stays after the morning opens. 24/7, for the life of the contract.",
    href: "/onboarding#support",
    proof: "Answered in the thread",
  },
];

export function OnboardingHero() {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState(0);
  const phase = phases[selected];

  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-16 lg:grid-cols-2 lg:gap-16 lg:pb-24 lg:pt-24">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="kicker">Onboarding</p>
        <h1 className="mt-6 max-w-xl font-sans text-5xl font-semibold lowercase leading-[1.05] tracking-[-0.04em] text-ink sm:text-6xl">
          we stay until the practice is ready then we stay for the contract.
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-graphite">
          Engineers and managers, unlimited hours, practice-specific work, a site included, and 24/7 support for the
          life of the agreement. The fee schedule is loaded at go-live.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/contact" className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink/90">
            Start onboarding
          </Link>
          <Link href="/pricing" className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink hover:bg-paper">
            View pricing
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: reduce ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(17,20,24,0.06),0_18px_40px_rgba(17,20,24,0.1)]"
      >
        <div className="border-b border-line px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-ink">Go-live</p>
            <p className="text-xs text-graphite">
              Step {phase.step} of 04
            </p>
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-mist">
            <motion.div
              className="h-full rounded-full bg-slash"
              initial={false}
              animate={{ width: `${((selected + 1) / phases.length) * 100}%` }}
              transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-[9.5rem_1fr]">
          <ol className="flex gap-1 overflow-x-auto border-b border-line p-2 sm:flex-col sm:border-b-0 sm:border-r">
            {phases.map((item, index) => {
              const open = index === selected;
              return (
                <li key={item.step}>
                  <button
                    type="button"
                    aria-pressed={open}
                    onClick={() => setSelected(index)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm",
                      open ? "bg-mist text-ink" : "text-graphite hover:bg-paper hover:text-ink",
                    )}
                  >
                    <span className="font-mono text-[11px]">{item.step}</span>
                    <span className="font-medium">{item.title}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="flex min-h-56 flex-col px-5 py-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slash">{phase.proof}</p>
            <h2 className="mt-3 font-display text-3xl text-ink">{phase.title}</h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-graphite">{phase.body}</p>
            <div className="mt-auto flex items-center gap-4 pt-6">
              <button
                type="button"
                onClick={() => setSelected((value) => (value + 1) % phases.length)}
                className="inline-flex rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink/90"
              >
                {selected === phases.length - 1 ? "Start again" : "Next step"}
              </button>
              <Link href={phase.href} className="text-sm font-medium text-slash underline-offset-4 hover:underline">
                Open this step
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
