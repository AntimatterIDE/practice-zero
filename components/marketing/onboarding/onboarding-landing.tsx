"use client";

import Link from "next/link";
import {
  Headphones,
  Infinity,
  Layers,
  Rocket,
  ShieldCheck,
  Users,
  Wrench,
  Globe,
} from "lucide-react";
import { motion } from "motion/react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const pillars = [
  {
    icon: Users,
    title: "Engineers and managers, on your side",
    body: "A dedicated team of engineers and managers runs your custom integration — not a ticket queue and a FAQ. We stay with the practice until the cutover is clean.",
  },
  {
    icon: Infinity,
    title: "Unlimited onboarding hours",
    body: "There is no hour cap on onboarding. We work until your practice’s needs are met — workflows, payers, rooms, and the exceptions that make your morning unique.",
  },
  {
    icon: Rocket,
    title: "Light-speed feature turnaround",
    body: "Need something during go-live? Feature requests move at lightspeed. We can customize the platform in the onboarding window to fit how you already practice.",
  },
  {
    icon: Layers,
    title: "Practice-specific components",
    body: "Bring the pieces you already rely on — specialty forms, e-prescribing, labs, checklists, reporting, or stacked operational components. We wire them in so nothing you trust gets left behind.",
  },
  {
    icon: Globe,
    title: "Custom practice website, included",
    body: "A custom website for the practice is included at no extra charge — patient-facing pages, reputation, and reviews that match your brand and point into intake, portal, and scheduling.",
  },
  {
    icon: Headphones,
    title: "24/7 for the life of the contract",
    body: "After go-live: 24/7 support, uptime, and maintenance for the full term of your agreement — same team posture, not a handoff to a distant helpdesk.",
  },
];

const phases = [
  {
    step: "01",
    title: "Discovery",
    body: "Map rooms, payers, staffing, and the stacks you already run. Engineers and managers sit with your leads until the plan is concrete.",
  },
  {
    step: "02",
    title: "Build & customize",
    body: "Integrate, configure, and ship practice-specific components. Feature requests during this phase are first-class — not backlog fodder.",
  },
  {
    step: "03",
    title: "Go-live",
    body: "We stay until the morning board works the way your practice works. No artificial hour limit; done means done.",
  },
  {
    step: "04",
    title: "Ongoing",
    body: "24/7 support, uptime, and maintenance for the life of the contract — plus continued customization when the practice evolves.",
  },
];

export function OnboardingLanding() {
  return (
    <div className="bg-paper text-ink">
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgba(45,75,240,0.12),transparent_55%),radial-gradient(ellipse_at_85%_30%,rgba(17,20,24,0.05),transparent_50%)]"
        />
        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 sm:pb-28 sm:pt-24">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: EASE }}
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-slash"
          >
            Onboarding
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, ease: EASE }}
            className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl md:text-6xl"
          >
            we stay until the practice is ready — then we stay for the contract.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, ease: EASE }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-graphite sm:text-lg"
          >
            Practice Zero onboarding is a white-glove integration led by engineers and
            managers: unlimited hours until your needs are met, lightspeed turnaround on
            feature requests, practice-specific components, a custom website at no extra
            charge, and 24/7 support with uptime and maintenance for the life of your
            agreement. The practice fee schedule is loaded at go-live.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, ease: EASE }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Link
              href="/contact"
              className="rounded-full bg-slash px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-oxide-deep"
            >
              Start onboarding conversation
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-line bg-card px-5 py-2.5 text-sm font-medium text-ink hover:border-slash"
            >
              View pricing
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-line px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-slash">
            What you get
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl">
            custom integration without the hour clock.
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8%" }}
                  transition={{ delay: i * 0.04, duration: 0.5, ease: EASE }}
                  className="rounded-3xl border border-line bg-card p-6 shadow-[var(--shadow-card)]"
                >
                  <span className="grid size-10 place-items-center rounded-xl bg-slash/10 text-slash">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold tracking-[-0.02em] text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-graphite">{item.body}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-mist/40 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-slash">
            How it runs
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl">
            from discovery to lifetime support.
          </h2>
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {phases.map((phase, i) => (
              <motion.li
                key={phase.step}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ delay: i * 0.05, duration: 0.45, ease: EASE }}
                className="rounded-3xl border border-line bg-paper p-5"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-slash">
                  {phase.step}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-ink">{phase.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite">{phase.body}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 rounded-[2rem] border border-line bg-ink px-8 py-12 text-paper sm:flex-row sm:items-center sm:justify-between sm:px-12">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-foam">
              <Wrench className="size-4" aria-hidden />
              <span className="font-mono text-[11px] uppercase tracking-[0.16em]">
                Always on
              </span>
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              24/7 support, uptime, and maintenance — post-onboarding, for the life of the
              contract.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-paper/65 sm:text-base">
              Onboarding ends when you say the practice is ready. Support does not. Shield
              your mornings with the same team that wired the integration.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:items-end">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-slash px-6 py-3 text-sm font-medium text-paper hover:bg-oxide-deep"
            >
              Talk to onboarding
            </Link>
            <p className="inline-flex items-center gap-2 text-xs text-paper/50">
              <ShieldCheck className="size-3.5" aria-hidden />
              HIPAA · SOC 2 · BAA · 99.9% uptime
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
