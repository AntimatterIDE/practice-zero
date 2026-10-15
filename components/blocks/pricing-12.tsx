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

              <div className="relative mt-10 flex-1 lg:mt-12">
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
  const rooms = [
    { time: "9:00", name: "Jordan Hale", room: "Room 2", state: "In progress", live: true },
    { time: "9:30", name: "Elena Ruiz", room: "Room 1", state: "Checked in", live: false },
    { time: "10:00", name: "Marcus Chen", room: "Room 3", state: "Confirmed", live: false },
  ];

  return (
    <div className="relative w-full max-w-2xl pb-8 pt-4">
      {/* Main workbench */}
      <div className="overflow-hidden rounded-2xl border border-paper/10 bg-[#16191e] shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between border-b border-paper/10 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[1.1rem] leading-none text-foam">Ø</span>
            <div>
              <p className="text-[11px] font-semibold text-paper">Northline Family Medicine</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-paper/40">Wednesday · practice desk</p>
            </div>
          </div>
          <span className="rounded-full bg-slash/20 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-foam">
            Live
          </span>
        </div>

        <div className="grid sm:grid-cols-[5rem_1fr]">
          <aside className="hidden border-r border-paper/10 bg-black/20 p-2 sm:block">
            {["Today", "Patients", "Visits", "Claims", "Tasks", "Outreach"].map((item, index) => (
              <div
                key={item}
                className={`mb-1 rounded-lg px-2 py-2 font-mono text-[9px] uppercase tracking-[0.12em] ${
                  index === 0 ? "bg-slash text-paper" : "text-paper/40"
                }`}
              >
                {item}
              </div>
            ))}
          </aside>

          <div className="space-y-3 p-3">
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              {[
                ["12", "Patients today"],
                ["4", "In rooms"],
                ["$18.4k", "Collections"],
                ["23", "Open tasks"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-xl border border-paper/8 bg-paper/[0.04] px-2.5 py-2">
                  <p className="font-sans text-base font-semibold tracking-tight text-paper">{value}</p>
                  <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.12em] text-paper/40">{label}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-xl border border-paper/8 bg-paper/[0.04] p-3">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-paper/45">Today’s rooms</p>
                  <p className="font-mono text-[9px] text-foam">3 in progress</p>
                </div>
                <div className="mt-3 space-y-2">
                  {rooms.map((visit) => (
                    <div
                      key={visit.name}
                      className={`flex items-center justify-between rounded-lg px-2.5 py-2 ${
                        visit.live ? "bg-slash/20 ring-1 ring-slash/40" : "bg-black/25"
                      }`}
                    >
                      <div>
                        <p className="text-[11px] font-medium text-paper">{visit.name}</p>
                        <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-paper/45">
                          {visit.time} · {visit.room}
                        </p>
                      </div>
                      <span className={`text-[10px] ${visit.live ? "text-foam" : "text-paper/50"}`}>{visit.state}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl border border-paper/8 bg-paper/[0.04] p-3">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-paper/45">Claims queue</p>
                  <div className="mt-2 space-y-1.5">
                    {[
                      ["Hale · 99203", "$185", "Queued"],
                      ["Ruiz · 99213", "$92", "Paid"],
                      ["Chen · 99214", "$145", "Draft"],
                    ].map(([label, amount, status]) => (
                      <div key={label} className="flex items-center justify-between text-[10px]">
                        <span className="text-paper/80">{label}</span>
                        <span className="text-paper/45">
                          {amount} · <span className={status === "Queued" ? "text-foam" : ""}>{status}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-paper/8 bg-paper/[0.04] p-3">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-paper/45">Outbox</p>
                  <p className="mt-2 text-[11px] text-paper/80">Elena · balance text</p>
                  <p className="mt-0.5 text-[10px] text-paper/45">Waiting to send · $40 remaining</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart card overlay */}
      <div className="absolute -right-1 top-0 hidden w-[13.5rem] overflow-hidden rounded-2xl border border-paper/15 bg-[#1c2027] p-3 shadow-2xl shadow-black/50 sm:block lg:-right-4">
        <div className="flex items-center justify-between gap-2 border-b border-paper/10 pb-2">
          <div>
            <p className="text-[12px] font-semibold text-paper">Jordan Hale</p>
            <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-paper/45">9:00 · room 2</p>
          </div>
          <span className="rounded-full bg-slash/25 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] text-foam">
            Chart
          </span>
        </div>
        <div className="mt-2 space-y-1.5">
          {[
            ["Scribe", "Listening · ready"],
            ["Codes", "I10 · Z00.00 · 99203"],
            ["Claim", "Draft · $185"],
            ["Meds", "No changes"],
          ].map(([label, detail]) => (
            <div key={label} className="flex items-center justify-between rounded-lg bg-paper/[0.05] px-2 py-1.5">
              <span className="text-[10px] font-medium text-paper">{label}</span>
              <span className="text-[9px] text-paper/50">{detail}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Eligibility chip */}
      <div className="absolute bottom-16 left-2 hidden rounded-xl border border-paper/15 bg-[#1c2027] px-3 py-2 shadow-xl sm:block">
        <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-paper/45">Eligibility</p>
        <p className="mt-0.5 text-[11px] font-medium text-paper">Pinetree Health · Active</p>
      </div>

      {/* Copay chip */}
      <div className="absolute bottom-14 left-[9.5rem] hidden rounded-xl bg-slash px-3 py-2 text-paper shadow-xl sm:block">
        <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-paper/80">Copay</p>
        <p className="font-sans text-lg font-semibold tracking-tight">$25</p>
      </div>

      {/* Phone */}
      <div className="absolute -bottom-2 right-3 w-[7.75rem] overflow-hidden rounded-[1.4rem] border-[3px] border-[#2f343c] bg-[#0f1216] shadow-2xl sm:right-8 sm:w-36">
        <div className="mx-auto mt-1.5 h-1 w-10 rounded-full bg-paper/20" />
        <div className="space-y-1.5 p-2">
          <p className="px-1 font-mono text-[8px] uppercase tracking-[0.14em] text-paper/40">On the floor</p>
          {[
            ["Schedule", true],
            ["Charting", false],
            ["Claims", false],
            ["Messages", false],
            ["Tasks", false],
          ].map(([label, active]) => (
            <div
              key={String(label)}
              className={`rounded-lg px-2 py-2 font-mono text-[8px] uppercase tracking-[0.1em] ${
                active ? "bg-slash text-paper" : "bg-paper/[0.06] text-paper/55"
              }`}
            >
              {label as string}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
