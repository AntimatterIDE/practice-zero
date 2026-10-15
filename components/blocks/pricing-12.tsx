"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Database,
  FileText,
  Settings2,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const features = [
  {
    icon: Database,
    title: "Route billing through the platform",
    body: "Eligibility, claims, remittances, and payer work in one place — from the visit to the deposit.",
  },
  {
    icon: FileText,
    title: "Enterprise EHR included",
    body: "Charting, scribe, scheduling, intake, and the patient portal — free with the agreement.",
  },
  {
    icon: ShieldCheck,
    title: "Fully compliant & secure",
    body: "Built for HIPAA-minded practices with writes that stay in the browser for the demo — and controls that scale.",
  },
  {
    icon: Settings2,
    title: "Automate & reduce manual work",
    body: "Agents clear after-hours charting, phone tag with payers, and unconfirmed mornings.",
  },
  {
    icon: BarChart3,
    title: "Real-time insights",
    body: "See collections, open tasks, and the morning board without exporting another spreadsheet.",
  },
  {
    icon: Users,
    title: "Scales with you",
    body: "Solo or multi-provider — the same free platform, one-year billing agreement at 8% of collections.",
  },
];

const assurances = [
  { icon: Zap, label: "Software stays free" },
  { icon: ShieldCheck, label: "8% of collections · one year" },
  { icon: FileText, label: "EHR, billing & marketing included" },
  { icon: Users, label: "Optional ad dollars on top" },
];

export default function Pricing12() {
  const reduce = useReducedMotion();
  const shift = reduce ? 0 : 18;

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };
  const item = {
    hidden: { opacity: 0, y: shift },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
  };

  return (
    <section className="w-full bg-paper px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={container}
        className="mx-auto w-full max-w-[1400px]"
      >
        <motion.div
          variants={item}
          className="overflow-hidden rounded-[2rem] border border-ink bg-ink text-paper shadow-2xl shadow-ink/20"
        >
          <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <div className="flex flex-col p-6 sm:p-10 lg:p-12">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-slash/20 px-3 py-1 text-xs font-medium text-paper">
                <BadgeCheck className="h-3.5 w-3.5 text-foam" />
                practice zero platform
              </span>

              <h1 className="mt-7 max-w-[16ch] font-sans text-4xl font-semibold lowercase leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-[3.25rem]">
                run your entire practice on one{" "}
                <span className="text-foam">intelligent platform.</span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-paper/70 sm:text-lg">
                EHR, billing, and marketing are free. Route collections through practice zero on a one-year billing agreement at{" "}
                <span className="font-medium text-paper">8%</span>
                — then add optional ad dollars when you want growth spend.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slash px-7 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-oxide-deep"
                >
                  Request a consultation
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/try"
                  className="text-sm font-medium text-paper/75 underline decoration-paper/30 underline-offset-4 transition-colors hover:text-paper"
                >
                  See a demo
                </Link>
              </div>

              <div className="relative mt-12 flex flex-1 items-end">
                <PlatformPreview />
              </div>
            </div>

            <div className="border-t border-paper/10 bg-paper/[0.03] p-6 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-paper/45">
                Everything included
              </p>
              <ul className="mt-8 space-y-7">
                {features.map(({ icon: Icon, title, body }) => (
                  <li key={title} className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-paper/5 text-foam ring-1 ring-paper/10">
                      <Icon className="h-5 w-5" strokeWidth={1.6} />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-paper">{title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-paper/60">{body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 rounded-2xl border border-line bg-card px-6 py-5 sm:px-8"
        >
          {assurances.map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-2.5 text-sm text-graphite">
              <Icon className="h-4 w-4 text-slash" strokeWidth={1.8} />
              {label}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

function PlatformPreview() {
  return (
    <div className="relative w-full max-w-xl pb-2">
      <div className="overflow-hidden rounded-2xl border border-paper/10 bg-[#1a1d22] shadow-2xl shadow-black/40">
        <div className="flex items-center gap-1.5 border-b border-paper/10 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-paper/20" />
          <span className="h-2 w-2 rounded-full bg-paper/20" />
          <span className="h-2 w-2 rounded-full bg-paper/20" />
          <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/35">
            morning board
          </span>
        </div>
        <div className="grid gap-3 p-3 sm:grid-cols-[4.5rem_1fr]">
          <div className="hidden flex-col gap-2 rounded-xl bg-paper/5 p-2 sm:flex">
            {["Today", "Chart", "Claims", "Tasks"].map((item) => (
              <div
                key={item}
                className={`rounded-lg px-2 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] ${
                  item === "Today" ? "bg-slash text-paper" : "text-paper/40"
                }`}
              >
                {item}
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                ["12", "Patients"],
                ["9", "Claims"],
                ["$18k", "Collections"],
                ["23", "Open tasks"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-xl bg-paper/5 px-2.5 py-2">
                  <p className="font-sans text-sm font-semibold text-paper">{value}</p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-paper/40">{label}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl bg-paper/5 p-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-paper/40">Collections trend</p>
              <div className="mt-3 flex h-16 items-end gap-1.5">
                {[40, 55, 48, 70, 62, 85, 78].map((height, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-t-sm bg-slash/80"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-paper/5 p-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-paper/40">Recent claims</p>
              <div className="mt-2 space-y-1.5">
                {[
                  ["Jordan Hale", "$185", "Queued"],
                  ["Elena Ruiz", "$92", "Paid"],
                ].map(([name, amount, status]) => (
                  <div key={name} className="flex items-center justify-between text-[11px]">
                    <span className="text-paper/80">{name}</span>
                    <span className="text-paper/50">
                      {amount} · {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-1 right-2 w-[7.5rem] overflow-hidden rounded-[1.35rem] border-[3px] border-[#2a2e34] bg-[#12151a] shadow-xl sm:right-6 sm:w-36">
        <div className="mx-auto mt-1.5 h-1 w-10 rounded-full bg-paper/15" />
        <div className="space-y-1.5 p-2.5">
          {["Today’s schedule", "Charting", "Claims", "Messages", "Tasks"].map((label, index) => (
            <div
              key={label}
              className={`rounded-lg px-2 py-2 font-mono text-[9px] uppercase tracking-[0.1em] ${
                index === 0 ? "bg-slash text-paper" : "bg-paper/5 text-paper/55"
              }`}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
