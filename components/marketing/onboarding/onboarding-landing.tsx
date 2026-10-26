"use client";

import Link from "next/link";
import { ShieldCheck, Wrench } from "lucide-react";
import { motion } from "motion/react";
import { OnboardingBuild } from "@/components/marketing/onboarding/build";
import { OnboardingDiscovery } from "@/components/marketing/onboarding/discovery";
import { OnboardingSite } from "@/components/marketing/onboarding/website";
import { OnboardingSupport } from "@/components/marketing/onboarding/support";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

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
            we stay until the practice is ready then we stay for the contract.
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

      <OnboardingDiscovery />
      <OnboardingBuild />
      <OnboardingSite />
      <OnboardingSupport />

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
              24/7 support, uptime, and maintenance post-onboarding, for the life of the
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
