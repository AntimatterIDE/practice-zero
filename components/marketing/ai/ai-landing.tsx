"use client";

import Link from "next/link";
import { AiBoardSection } from "@/components/marketing/ai/board";
import { AiCaptureSection } from "@/components/marketing/ai/capture";
import { AiClaimSection } from "@/components/marketing/ai/claim";
import { AiHero } from "@/components/marketing/ai/hero";
import { AiPaymentsSection } from "@/components/marketing/ai/payments";

export function AiLanding() {
  return (
    <div className="bg-paper text-ink">
      <AiHero />

      <AiBoardSection />
      <AiCaptureSection />
      <AiClaimSection />
      <AiPaymentsSection />

      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="rounded-3xl border border-line bg-ink px-8 py-12 text-paper sm:px-12 sm:py-16">
          <h2 className="max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
            See agents on your workflows or read how we think about them.
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
