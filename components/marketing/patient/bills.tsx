"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/marketing/patient/fade-in";

export function PatientBills() {
  const [paid, setPaid] = useState(false);

  return (
    <>
      <section className="px-6 pb-16 pt-14 lg:pb-20 lg:pt-20">
        <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <p className="kicker">What you owe</p>
            <h1 className="mt-6 max-w-[14ch] font-sans text-5xl font-semibold lowercase leading-[1.02] tracking-[-0.04em] text-ink sm:text-6xl lg:text-7xl">
              one balance. the copay.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-graphite">
              Paul Wallace owes Southeast Medical the $25 copay already on his record. Pinetree Health, Choice PPO. Paying
              here is a demo in the browser — nothing is charged.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
              <Link
                href="/billing"
                prefetch={false}
                className="inline-flex items-center gap-2 text-sm font-medium text-slash hover:text-oxide-deep"
              >
                How the practice bills
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/portal/updates"
                prefetch={false}
                className="inline-flex items-center gap-2 text-sm font-medium text-slash hover:text-oxide-deep"
              >
                Portal updates
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <div className="rounded-[1.75rem] border border-line bg-card p-5 shadow-[var(--shadow-card)] sm:p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">Balance</p>
              <p className="mt-3 font-sans text-6xl font-semibold tracking-[-0.04em] text-ink">$25</p>
              <p className="mt-2 text-sm text-graphite">Office visit copay · Pinetree Health</p>
              <button
                type="button"
                onClick={() => setPaid(true)}
                disabled={paid}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-slash px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-oxide-deep disabled:cursor-default disabled:bg-ink"
              >
                {paid ? "Paid · demo" : "Pay $25 in the browser"}
              </button>
              <p className="mt-3 text-xs leading-relaxed text-graphite">
                {paid
                  ? "Marked paid on this page only. No card was charged, and the practice ledger did not move."
                  : "Illustrative. This button does not open a processor or touch the live demo."}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="border-t border-line px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-xl">
          <FadeIn>
            <p className="kicker">Receipt</p>
            <div className="mt-5 rounded-[1.5rem] border border-line bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-semibold text-ink">Southeast Medical</p>
                  <p className="mt-1 text-sm text-graphite">Paul Wallace · MRN 100481</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    paid ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"
                  }`}
                >
                  {paid ? "Paid" : "Due"}
                </span>
              </div>
              <dl className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
                {[
                  ["Visit", "Thursday · 9:00 AM"],
                  ["Plan", "Pinetree Health · Choice PPO"],
                  ["Description", "Office visit copay"],
                  ["Posted", "Mon"],
                  ["Amount", "$25.00"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between gap-4">
                    <dt className="text-graphite">{label}</dt>
                    <dd className="font-medium text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 border-t border-dashed border-line pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">
                Receipt · RCP-100481 · demo copy
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
