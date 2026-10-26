"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { AiBoardSection } from "@/components/marketing/ai/board";
import { AiCaptureSection } from "@/components/marketing/ai/capture";
import { AiClaimSection } from "@/components/marketing/ai/claim";
import { AiPaymentsSection } from "@/components/marketing/ai/payments";

export function AiLanding() {
  return (
    <div className="bg-paper text-ink">
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(45,75,240,0.12),transparent_55%),radial-gradient(ellipse_at_90%_40%,rgba(15,23,42,0.06),transparent_50%)]"
        />
        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 sm:pb-28 sm:pt-24">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-slash"
          >
            AI · Agentic EHR
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl md:text-6xl"
          >
            practice zero agents run the practice so you can run the rooms.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-graphite sm:text-lg"
          >
            Agentic EHR means scheduling, claims, payment tracking, and
            follow-ups keep moving without a full front-office stack. Need only
            space and optional room hardware that records visits and feeds the
            agents automatically.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Link
              href="/contact"
              className="rounded-full bg-slash px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-oxide-deep"
            >
              Book a walkthrough
            </Link>
            <Link
              href="/try"
              className="rounded-full border border-line bg-card px-5 py-2.5 text-sm font-medium text-ink hover:border-slash"
            >
              Try the demo
            </Link>
            <Link
              href="/research"
              className="rounded-full px-5 py-2.5 text-sm font-medium text-graphite hover:text-ink"
            >
              Read the research
            </Link>
          </motion.div>
        </div>
      </section>

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
