"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { FadeIn } from "@/components/marketing/patient/fade-in";

const steps = [
  {
    title: "Sign the open agreement",
    body: "Assignment of benefits is still open for Paul Wallace. The practice fee due today is $185.",
    href: "/sign/sign-hale-benefits",
    action: "Sign assignment of benefits",
  },
  {
    title: "Intake",
    body: "Answers are already on file for the Thursday visit.",
    href: "/intake/intake-hale",
    action: "Open intake",
  },
  {
    title: "Upload the insurance card",
    body: "The card goes on the chart before you sit down.",
    href: "/portal/documents",
    action: "Open documents",
  },
  {
    title: "Arrive early",
    body: "Come a few minutes before 9:00 so check-in can finish without a clipboard.",
  },
];

export function PatientPrepare() {
  return (
    <>
      <section className="px-6 pb-16 pt-14 lg:pb-20 lg:pt-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
          <FadeIn>
            <p className="kicker">Before you arrive</p>
            <h1 className="mt-6 max-w-[14ch] font-sans text-5xl font-semibold lowercase leading-[1.02] tracking-[-0.04em] text-ink sm:text-6xl lg:text-7xl">
              thursday at 9:00.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-graphite">
              Paul Wallace is expected at Southeast Medical. Sign the open agreement, leave the insurance card on file,
              and arrive a little early. This page only points at the demo flows that already exist.
            </p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <div className="rounded-[1.75rem] border border-line bg-ink p-6 text-paper shadow-[var(--shadow-card)]">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-foam">Next visit</p>
              <p className="mt-3 font-sans text-4xl font-semibold tracking-[-0.03em]">Thursday</p>
              <p className="mt-1 font-sans text-4xl font-semibold tracking-[-0.03em]">9:00 AM</p>
              <p className="mt-4 text-sm leading-relaxed text-paper/70">
                Southeast Medical
                <br />
                410 Market Street, Suite 200
                <br />
                Providence, RI
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="border-t border-line px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <h2 className="font-sans text-3xl font-semibold lowercase tracking-[-0.03em] text-ink sm:text-4xl">
              checklist.
            </h2>
          </FadeIn>
          <ol className="mt-8 space-y-3">
            {steps.map((step, index) => (
              <li key={step.title} className="rounded-[1.5rem] border border-line bg-card p-5 shadow-[var(--shadow-card)]">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slash/10 text-slash">
                    {step.href ? (
                      <span className="font-mono text-xs font-semibold">{index + 1}</span>
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-semibold text-ink">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-graphite">{step.body}</p>
                    {step.href ? (
                      <Link
                        href={step.href}
                        prefetch={false}
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-slash hover:text-oxide-deep"
                      >
                        {step.action}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
