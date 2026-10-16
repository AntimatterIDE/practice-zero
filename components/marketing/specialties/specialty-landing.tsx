"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { TrackCtaLink } from "@/components/analytics/track-cta";
import { ComplianceBadges } from "@/components/marketing/compliance-badges";
import {
  specialtyContactHref,
  type SpecialtyContent,
} from "@/lib/marketing/specialties";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const pillars = [
  { href: "/ehr", label: "Clinical", body: "AI documentation & coding" },
  { href: "/billing", label: "Revenue", body: "Claims, collections & payer work" },
  { href: "/marketing", label: "Operations", body: "Scheduling, outreach & engagement" },
] as const;

function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.65, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function SpecialtyLanding({ specialty }: { specialty: SpecialtyContent }) {
  const contactHref = specialtyContactHref(specialty.slug);

  return (
    <div className="bg-paper text-ink">
      <section className="mx-auto w-full max-w-[1400px] px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:px-8">
        <FadeIn>
          <p className="kicker">{specialty.kicker}</p>
          <h1 className="mt-5 max-w-4xl font-sans text-4xl font-semibold lowercase leading-[1.05] tracking-[-0.035em] text-ink sm:text-5xl md:text-6xl">
            {specialty.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-graphite sm:text-lg">
            {specialty.support}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <TrackCtaLink
              href="/try"
              ctaName="try_demo"
              ctaLocation={`specialty_${specialty.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-slash px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-oxide-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slash focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            >
              Try the demo
              <ArrowRight className="size-4" />
            </TrackCtaLink>
            <TrackCtaLink
              href={contactHref}
              ctaName="request_consultation"
              ctaLocation={`specialty_${specialty.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-card px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-ink/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slash focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            >
              Request a consultation
            </TrackCtaLink>
          </div>
          <ComplianceBadges className="mt-10" />
        </FadeIn>
      </section>

      <section className="border-y border-line bg-mist/40">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <FadeIn>
            <p className="kicker">What goes to zero</p>
            <h2 className="mt-4 max-w-2xl font-sans text-3xl font-semibold lowercase tracking-[-0.03em] text-ink sm:text-4xl">
              the work that should not own the day.
            </h2>
          </FadeIn>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {specialty.zeroOut.map((item, index) => (
              <FadeIn key={item.title} delay={0.05 * index}>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-slash">ø</p>
                <h3 className="mt-3 text-lg font-medium lowercase text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite">{item.body}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <FadeIn>
          <p className="kicker">Platform</p>
          <h2 className="mt-4 max-w-2xl font-sans text-3xl font-semibold lowercase tracking-[-0.03em] text-ink sm:text-4xl">
            every workflow. one morning.
          </h2>
        </FadeIn>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {pillars.map((pillar, index) => (
            <FadeIn key={pillar.href} delay={0.05 * index}>
              <Link
                href={pillar.href}
                className="group block rounded-2xl border border-line bg-card p-6 transition-colors hover:border-slash/40"
              >
                <p className="text-sm font-medium text-ink">{pillar.label}</p>
                <p className="mt-2 text-sm text-graphite">{pillar.body}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm text-slash">
                  Learn more
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-ink text-paper">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <FadeIn>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-slash">FAQ</p>
            <h2 className="mt-4 max-w-2xl font-sans text-3xl font-semibold lowercase tracking-[-0.03em] sm:text-4xl">
              before you book a walkthrough.
            </h2>
          </FadeIn>
          <dl className="mt-12 grid gap-8 md:grid-cols-3">
            {specialty.faq.map((item, index) => (
              <FadeIn key={item.q} delay={0.05 * index}>
                <dt className="text-base font-medium text-paper">{item.q}</dt>
                <dd className="mt-3 text-sm leading-relaxed text-paper/65">{item.a}</dd>
              </FadeIn>
            ))}
          </dl>
          <FadeIn className="mt-12">
            <TrackCtaLink
              href={contactHref}
              ctaName="request_consultation_faq"
              ctaLocation={`specialty_${specialty.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-slash px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-oxide-deep"
            >
              Request a consultation
              <ArrowRight className="size-4" />
            </TrackCtaLink>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
