"use client";

import Link from "next/link";
import { ShieldCheck, Wrench } from "lucide-react";
import { OnboardingBuild } from "@/components/marketing/onboarding/build";
import { OnboardingDiscovery } from "@/components/marketing/onboarding/discovery";
import { OnboardingHero } from "@/components/marketing/onboarding/hero";
import { OnboardingSite } from "@/components/marketing/onboarding/website";
import { OnboardingSupport } from "@/components/marketing/onboarding/support";

export function OnboardingLanding() {
  return (
    <div className="bg-paper text-ink">
      <OnboardingHero />

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
