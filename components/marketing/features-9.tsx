"use client";

import Link from "next/link";
import { useState } from "react";
import { Building, Calendar, Receipt, Stethoscope, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type Persona = {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  cta: string;
  points: { title: string; body: string }[];
};

const personas: Persona[] = [
  {
    id: "desk",
    label: "Front desk",
    icon: Calendar,
    href: "/try",
    cta: "Open Today",
    points: [
      {
        title: "The day is already moving",
        body: "Today, the schedule, requests, and tasks are mid-morning. Four finished runs sit on the board.",
      },
      {
        title: "Calls still to make",
        body: "One visit is still unconfirmed, and two tasks are open beside the rooms.",
      },
    ],
  },
  {
    id: "physician",
    label: "Physician",
    icon: Stethoscope,
    href: "/try/patients/pt-hale",
    cta: "Open Jordan Hale",
    points: [
      {
        title: "The 9:00 patient is in a room",
        body: "Jordan Hale has demographics, coverage, intake answers, and a signed consent.",
      },
      {
        title: "The note is ready",
        body: "The visit has a transcript, a note, and codes. They stay hidden until you ask to see them.",
      },
    ],
  },
  {
    id: "billing",
    label: "Billing",
    icon: Receipt,
    href: "/try/claims/clm-hale",
    cta: "Open the draft claim",
    points: [
      {
        title: "The claim is still a draft",
        body: "Eligibility is already on file. Submit moves the draft to accepted in this browser.",
      },
      {
        title: "An older claim fills both desks",
        body: "One denial and one payment, so denials and payments each have something to open.",
      },
    ],
  },
  {
    id: "practice",
    label: "Practice",
    icon: Building,
    href: "/try/practice",
    cta: "Open the practice",
    points: [
      {
        title: "Two people and a profile",
        body: "The physician and the front desk are already part of the sample morning.",
      },
      {
        title: "The profile stays in the demo",
        body: "People and the practice profile are the same fictional morning. This is not a public clinic site.",
      },
    ],
  },
];

export function Features9() {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState("physician");
  const active = personas.find((persona) => persona.id === activeId) ?? personas[1];

  return (
    <section className="bg-neutral-950 px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center">
        <h2 className="max-w-[16ch] text-center font-display text-[2.25rem] leading-[1.05] font-normal tracking-[-0.03em] sm:text-5xl lg:text-6xl">
          Built to <em className="italic">run</em>
          <br />
          the morning of a practice
        </h2>
        <div className="mt-12 grid w-full grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
          {personas.map((persona) => {
            const selected = persona.id === active.id;
            const Icon = persona.icon;
            return (
              <button
                key={persona.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setActiveId(persona.id)}
                className={`flex min-h-44 cursor-pointer flex-col items-center justify-center gap-5 rounded-2xl border px-4 py-8 text-center transition-colors sm:min-h-[190px] ${
                  selected ? "border-white/35 bg-white/10 text-white" : "border-transparent bg-white/5 text-white/55 hover:text-white/80"
                }`}
              >
                <span className="flex size-14 items-center justify-center rounded-full border border-white/15">
                  <Icon className="size-6" strokeWidth={1.5} />
                </span>
                <span className="text-sm">{persona.label}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-10 w-full border-t border-white/15 pt-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <h3 className="max-w-[16ch] text-3xl font-medium tracking-tight sm:text-4xl">From the first patient to the claim</h3>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.id}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <Link href={active.href} className="inline-flex h-11 items-center rounded-full border border-white/25 px-5 text-sm font-medium hover:bg-white/10">
                  {active.cta}
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${active.id}-points`}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="mt-10 grid gap-8 sm:grid-cols-2"
            >
              {active.points.map((point) => (
                <div key={point.title}>
                  <h4 className="text-lg font-medium">{point.title}</h4>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-white/65">{point.body}</p>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
