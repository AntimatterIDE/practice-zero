"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BadgeCheck,
  Check,
  Megaphone,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const coreFeatures = [
  "Full EHR for the morning chart",
  "Billing, claims, and remittances",
  "Eligibility and payer work",
  "Outreach, scheduling, and follow-up",
  "Patient portal and intake",
  "Practice analytics",
  "One-year billing agreement",
  "8% of collections — no software fee",
];

const adsFeatures = [
  "Everything in the core platform",
  "Optional ad dollars on top",
  "Local patient acquisition campaigns",
  "Creative and placement you control",
  "Spend stays separate from the 8%",
  "Pause or scale ads anytime",
  "Reporting beside the morning board",
  "Same one-year billing agreement",
];

const assurances = [
  { icon: ShieldCheck, label: "Software stays free" },
  { icon: RefreshCcw, label: "One-year billing agreement" },
  { icon: Megaphone, label: "Ads are optional" },
];

const periods = [
  { id: "core", label: "Platform" },
  { id: "ads", label: "Platform + ads", badge: "Optional" },
] as const;

export default function Pricing12() {
  const [plan, setPlan] = useState<"core" | "ads">("core");
  const reduceMotion = useReducedMotion();
  const shift = reduceMotion ? 0 : 18;
  const features = plan === "core" ? coreFeatures : adsFeatures;

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: shift },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  };

  return (
    <section className="w-full bg-paper px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={container}
        className="mx-auto w-full max-w-[1400px]"
      >
        <motion.div variants={item} className="mx-auto max-w-2xl text-center">
          <p className="kicker">Pricing</p>
          <h2 className="mt-5 font-sans text-3xl font-semibold lowercase leading-tight tracking-[-0.035em] text-ink sm:text-4xl lg:text-5xl">
            the software is free. the agreement is simple.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-graphite sm:text-lg">
            EHR, billing, and marketing ship together at no software cost. You run on a one-year billing agreement at 8% of collections — and you can add ad dollars on top when you want growth spend.
          </p>
        </motion.div>

        <motion.div variants={item} className="mt-10 flex justify-center">
          <div
            role="group"
            aria-label="Pricing plan"
            className="inline-flex rounded-full border border-line bg-mist p-1"
          >
            {periods.map((period) => (
              <button
                key={period.id}
                type="button"
                aria-pressed={plan === period.id}
                onClick={() => setPlan(period.id)}
                className={`relative cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slash focus-visible:ring-offset-2 focus-visible:ring-offset-mist ${
                  plan === period.id ? "text-ink" : "text-graphite hover:text-ink"
                }`}
              >
                {plan === period.id && (
                  <motion.span
                    layoutId="pricing12-billing-thumb"
                    transition={{
                      duration: reduceMotion ? 0 : 0.35,
                      ease: EASE,
                    }}
                    className="absolute inset-0 rounded-full bg-card shadow-sm"
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {period.label}
                  {"badge" in period && (
                    <span className="rounded-full bg-slash px-1.5 py-0.5 text-[10px] font-semibold leading-none text-paper">
                      {period.badge}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={item}
          className="mx-auto mt-10 w-full max-w-5xl rounded-3xl border border-ink bg-ink shadow-2xl shadow-ink/15"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-6 sm:p-10 lg:p-12">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slash/20 px-3 py-1 text-xs font-medium text-paper">
                <BadgeCheck className="h-3.5 w-3.5 text-slash" />
                {plan === "core" ? "Practice Zero platform" : "Platform + ad dollars"}
              </span>

              <div className="mt-8 flex items-baseline gap-1.5">
                <span className="relative inline-grid overflow-hidden">
                  <span
                    aria-hidden="true"
                    className="invisible col-start-1 row-start-1 font-sans text-6xl font-semibold tracking-tight tabular-nums sm:text-7xl"
                  >
                    {plan === "core" ? "Free" : "Ads"}
                  </span>
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={plan}
                      initial={{ opacity: 0, y: shift }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -shift }}
                      transition={{
                        duration: reduceMotion ? 0 : 0.3,
                        ease: EASE,
                      }}
                      className="col-start-1 row-start-1 font-sans text-6xl font-semibold tracking-tight tabular-nums text-paper sm:text-7xl"
                    >
                      {plan === "core" ? "Free" : "Ads"}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </div>

              <div className="mt-3 min-h-5">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={plan}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.2 }}
                    className="text-sm text-paper/60"
                  >
                    {plan === "core"
                      ? "EHR, billing, and marketing included. One-year billing agreement at 8% of collections."
                      : "Same free platform and 8% agreement — plus optional ad dollars you choose to spend."}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="mt-6 rounded-2xl bg-paper/5 px-4 py-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slash">The agreement</p>
                <p className="mt-2 font-sans text-3xl font-semibold tracking-tight text-paper">8%</p>
                <p className="mt-1 text-sm text-paper/55">of collections · one-year billing contract</p>
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <Link
                  href="/contact"
                  className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-slash px-8 py-3.5 text-sm font-medium text-paper transition-colors duration-200 hover:bg-oxide-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slash focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:w-auto"
                >
                  Request a consultation
                </Link>
                <Link
                  href="/try"
                  className="text-sm font-medium text-paper/55 underline decoration-paper/25 underline-offset-4 transition-colors duration-200 hover:text-paper"
                >
                  Try the demo first
                </Link>
              </div>

              <div className="mt-10 pt-6">
                <p className="text-xs leading-relaxed text-paper/45">
                  No seat fees. No monthly software invoice. Ad dollars are optional and billed separately from the 8% collections agreement.
                </p>
              </div>
            </div>

            <div className="border-t border-paper/10 p-6 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-paper/45">
                Everything included
              </p>
              <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                {features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm leading-relaxed text-paper/75"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-slash" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-3"
        >
          {assurances.map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-2 text-sm text-graphite">
              <Icon className="h-4 w-4 text-slash" />
              {label}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
