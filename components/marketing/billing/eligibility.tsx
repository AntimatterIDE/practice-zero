"use client";

import { motion, useReducedMotion } from "motion/react";
import { CategorySection, Drift, TiltFrame } from "@/components/marketing/depth";

export function EligibilitySection() {
  const reduce = useReducedMotion();
  return (
    <CategorySection
      flip
      eyebrow="Eligibility"
      title="Checked before the room."
      body="At 8:10, Jordan Hale is active with Pinetree Health. Office copay $25. Deductible remaining $650. No prior authorization on this visit."
    >
      <TiltFrame className="grid grid-cols-2 gap-4">
        <Drift dx={8} dy={10}>
          <motion.article
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[2rem] bg-ink p-6 text-white"
          >
            <p className="text-[11px] uppercase tracking-[0.16em] text-graphite/70">Copay</p>
            <p className="mt-4 font-display text-6xl">$25</p>
            <p className="mt-3 text-sm text-paper/55">Office visit</p>
          </motion.article>
        </Drift>
        <Drift dx={12} dy={6} className="mt-10">
          <motion.article
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="rounded-[2rem] border border-line bg-white p-6 shadow-xl"
          >
            <p className="text-[11px] uppercase tracking-[0.16em] text-graphite/70">Deductible left</p>
            <p className="mt-4 font-display text-6xl text-ink">$650</p>
            <p className="mt-3 text-sm text-graphite">Active · 8:10</p>
          </motion.article>
        </Drift>
      </TiltFrame>
    </CategorySection>
  );
}
