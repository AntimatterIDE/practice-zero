"use client";

import { motion, useReducedMotion } from "motion/react";

function Row({
  delay,
  children,
}: {
  delay: number;
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Pill({ children, solid = false }: { children: React.ReactNode; solid?: boolean }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${
        solid
          ? "bg-neutral-950 text-white"
          : "border border-neutral-200 text-neutral-500"
      }`}
    >
      {children}
    </span>
  );
}

export function ScheduleDemo() {
  const visits = [
    ["8:40", "Elena Voss", "Completed"],
    ["9:00", "Jordan Hale", "In room 2"],
    ["10:30", "Chris Adelman", "Unconfirmed"],
  ] as const;
  return (
    <div>
      <p className="text-xs text-neutral-500">Wednesday, October 14</p>
      <div className="mt-3 divide-y divide-neutral-100">
        {visits.map(([time, name, status], index) => (
          <Row key={time} delay={0.08 * index}>
            <div className="flex items-center gap-3 py-3">
              <span className="w-12 text-sm font-medium text-neutral-950">{time}</span>
              <span className="min-w-0 flex-1 truncate text-sm text-neutral-700">{name}</span>
              <Pill solid={status === "In room 2"}>{status}</Pill>
            </div>
          </Row>
        ))}
      </div>
    </div>
  );
}

export function ScribeDemo() {
  const lines = [
    ["Dr. Shah", "What brought you in?"],
    ["Jordan", "The pharmacy machine has been reading my pressure high."],
    ["Dr. Shah", "We will keep the lisinopril and look again in a month."],
  ] as const;
  return (
    <div>
      <p className="text-xs text-neutral-500">Dictation · Jordan Hale · 9:00</p>
      <div className="mt-3 grid gap-2">
        {lines.map(([who, line], index) => (
          <Row key={who + index} delay={0.12 * index}>
            <p className="rounded-2xl bg-neutral-50 px-3 py-2 text-sm leading-relaxed text-neutral-700">
              <span className="font-medium text-neutral-950">{who}. </span>
              {line}
            </p>
          </Row>
        ))}
      </div>
    </div>
  );
}

export function CodesDemo() {
  const codes = [
    ["ICD-10", "I10", "Essential hypertension"],
    ["ICD-10", "Z00.00", "Adult medical exam"],
    ["CPT", "99203", "New patient office visit"],
  ] as const;
  return (
    <div>
      <p className="text-xs text-neutral-500">Generated from the 9:00 visit</p>
      <div className="mt-3 grid gap-2">
        {codes.map(([system, code, label], index) => (
          <Row key={code} delay={0.1 * index}>
            <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 px-3 py-2.5">
              <span className="w-14 text-[11px] font-medium uppercase tracking-wide text-neutral-400">{system}</span>
              <span className="w-16 text-sm font-semibold text-neutral-950">{code}</span>
              <span className="min-w-0 flex-1 truncate text-sm text-neutral-600">{label}</span>
            </div>
          </Row>
        ))}
      </div>
    </div>
  );
}

export function ClaimDemo() {
  return (
    <div>
      <p className="text-xs text-neutral-500">Jordan Hale · Pinetree Health · Oct 14</p>
      <Row delay={0.05}>
        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 px-3 py-3">
          <div>
            <p className="text-sm font-medium text-neutral-950">99203 · New patient office visit</p>
            <p className="text-xs text-neutral-500">I10 · 1 unit</p>
          </div>
          <p className="text-sm font-semibold text-neutral-950">$185</p>
        </div>
      </Row>
      <Row delay={0.18}>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-neutral-500">Still a draft</span>
          <Pill>Queued</Pill>
        </div>
      </Row>
    </div>
  );
}

export function EligibilityDemo() {
  return (
    <div>
      <p className="text-xs text-neutral-500">Jordan Hale · member PT-44021</p>
      <Row delay={0.05}>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm font-medium text-neutral-950">Pinetree Health</p>
          <Pill solid>Active</Pill>
        </div>
      </Row>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[
          ["Copay", "$25"],
          ["Deductible left", "$650"],
        ].map(([label, value], index) => (
          <Row key={label} delay={0.12 + index * 0.08}>
            <div className="rounded-2xl bg-neutral-50 px-3 py-3">
              <p className="text-[11px] uppercase tracking-wide text-neutral-400">{label}</p>
              <p className="mt-1 text-lg font-semibold tracking-tight text-neutral-950">{value}</p>
            </div>
          </Row>
        ))}
      </div>
    </div>
  );
}

export function OutreachDemo() {
  return (
    <div>
      <p className="text-xs text-neutral-500">Outbox · text · Elena Voss</p>
      <Row delay={0.08}>
        <div className="mt-3 rounded-2xl rounded-tl-md bg-neutral-950 px-4 py-3 text-sm leading-relaxed text-white">
          Elena, a balance from the June visit is waiting. Reply if you want a statement.
        </div>
      </Row>
      <Row delay={0.22}>
        <p className="mt-3 text-xs text-neutral-500">Waiting in this browser. Nothing has been sent.</p>
      </Row>
    </div>
  );
}

export function BillingDemo() {
  const rows = [
    ["Jun 3", "Paid", "$140", true],
    ["Aug 12", "Denied · CARC 50", "$0", false],
  ] as const;
  return (
    <div>
      <p className="text-xs text-neutral-500">Elena Voss · Pinetree Health</p>
      <div className="mt-3 divide-y divide-neutral-100">
        {rows.map(([date, status, amount, solid], index) => (
          <Row key={date} delay={0.08 * index}>
            <div className="flex items-center gap-3 py-3">
              <span className="w-14 text-sm text-neutral-500">{date}</span>
              <span className="min-w-0 flex-1 text-sm text-neutral-800">{status}</span>
              <Pill solid={solid}>{amount}</Pill>
            </div>
          </Row>
        ))}
      </div>
    </div>
  );
}
