"use client";

import { motion, useReducedMotion } from "motion/react";
import { CategorySection, Drift, TiltFrame } from "@/components/marketing/depth";

export function AgreementsSection() {
  const reduce = useReducedMotion();
  return (
    <CategorySection
      eyebrow="Agreements"
      title="The consent is already signed."
      body="Jordan signed the consent to evaluate and treat. Chris Adelman’s records release is the one still missing."
    >
      <TiltFrame className="relative">
        <Drift dx={8} dy={6}>
          <article className="rounded-3xl border border-neutral-200 bg-[#fbfbf9] p-6 shadow-2xl shadow-neutral-900/10">
            <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-400">Consent to evaluate and treat</p>
            <p className="mt-4 font-display text-3xl text-neutral-950">Jordan Hale</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-600">
              Signed for the 9:00 visit with Dr. Shah. The chart can be opened.
            </p>
            <svg viewBox="0 0 280 90" className="mt-6 h-20 w-full text-neutral-950" aria-hidden="true">
              <motion.path
                d="M12 58 C 28 18, 46 78, 70 48 S 104 16, 128 52 S 168 86, 198 44 S 236 22, 266 50"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
            <p className="text-xs text-neutral-400">Signed</p>
          </article>
        </Drift>
      </TiltFrame>
    </CategorySection>
  );
}
