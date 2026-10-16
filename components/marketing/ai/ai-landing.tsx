"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Building2,
  CalendarClock,
  Cpu,
  FileText,
  Mic2,
  ShieldCheck,
  Wallet,
} from "lucide-react";

const pillars = [
  {
    icon: Building2,
    title: "Space, not a front desk army",
    body: "If you want, you do not need a traditional office manager stacking every queue. Practice Zero agents own the loops that used to live on clipboards and sticky notes.",
  },
  {
    icon: Mic2,
    title: "Hardware in the room",
    body: "Install capture in exam rooms when you are ready. Visits are recorded, summarized, and handed to agents that schedule follow-ups before anyone walks back to a desk.",
  },
  {
    icon: CalendarClock,
    title: "Scheduling that keeps moving",
    body: "Recalls, confirms, and next open slots stay autonomous under your rules. Agents propose; you approve the exceptions.",
  },
  {
    icon: FileText,
    title: "Claims without the chase",
    body: "Eligibility, clean claim prep, and denial follow-through run as agent work—so clinical time stays clinical.",
  },
  {
    icon: Wallet,
    title: "Payment tracking that is already open",
    body: "Balances, remits, and patient responsibility stay visible without another spreadsheet owner.",
  },
  {
    icon: ShieldCheck,
    title: "You keep the keys",
    body: "Agents act inside practice policy. Approvals, overrides, and audit stay on your side of the desk.",
  },
];

export function AiLanding() {
  return (
    <div className="bg-paper text-ink">
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(45,75,240,0.12),transparent_55%),radial-gradient(ellipse_at_90%_40%,rgba(15,23,42,0.06),transparent_50%)]"
        />
        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 sm:pb-28 sm:pt-24">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-slash"
          >
            AI · Agentic EHR
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl md:text-6xl"
          >
            practice zero agents run the practice—so you can run the rooms.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-graphite sm:text-lg"
          >
            Agentic EHR means scheduling, claims, payment tracking, and
            follow-ups keep moving without a full front-office stack. Need only
            space—and optional room hardware that records visits and feeds the
            agents automatically.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Link
              href="/contact"
              className="rounded-full bg-slash px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-oxide-deep"
            >
              Book a walkthrough
            </Link>
            <Link
              href="/try"
              className="rounded-full border border-line bg-card px-5 py-2.5 text-sm font-medium text-ink hover:border-slash"
            >
              Try the demo
            </Link>
            <Link
              href="/research"
              className="rounded-full px-5 py-2.5 text-sm font-medium text-graphite hover:text-ink"
            >
              Read the research
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="flex items-start gap-4">
          <span className="mt-1 grid size-10 place-items-center rounded-2xl bg-slash/10 text-slash">
            <Cpu className="size-5" aria-hidden />
          </span>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              What agentic means here
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-graphite">
              Not a chatbot bolted on. Practice Zero agents take the work that
              used to sit with an office manager—then leave you the exceptions,
              clinical judgment, and the practice voice.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl border border-line bg-card p-6"
              >
                <Icon className="size-5 text-slash" aria-hidden />
                <h3 className="mt-4 text-lg font-semibold text-ink">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite">
                  {pillar.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-line bg-mist/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slash">
              Room capture
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Hardware in the rooms. Agents after the visit.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-graphite">
              Optional capture devices in practice rooms record the encounter.
              Practice Zero agents turn that into the note draft, the follow-up
              slot, the claim path, and payment tracking—without another person
              retyping the morning.
            </p>
          </div>
          <ol className="space-y-4">
            {[
              "Visit captured in the room (optional hardware)",
              "Agent drafts note + proposes follow-up",
              "Scheduling, claims, and payments move under your rules",
              "You approve exceptions—not every keystroke",
            ].map((step, i) => (
              <li
                key={step}
                className="flex gap-4 rounded-2xl border border-line bg-card px-5 py-4"
              >
                <span className="font-mono text-sm text-slash">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-medium text-ink">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="rounded-3xl border border-line bg-ink px-8 py-12 text-paper sm:px-12 sm:py-16">
          <h2 className="max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
            See agents on your workflows—or read how we think about them.
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-paper px-5 py-2.5 text-sm font-medium text-ink hover:bg-mist"
            >
              Talk to us
            </Link>
            <Link
              href="/research"
              className="rounded-full border border-paper/30 px-5 py-2.5 text-sm font-medium text-paper hover:border-paper"
            >
              Research notes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
