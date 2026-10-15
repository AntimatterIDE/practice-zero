"use client";

import { motion, useReducedMotion } from "motion/react";
import { CategorySection, Drift, TiltFrame } from "@/components/marketing/depth";

export function RequestsSection() {
  const reduce = useReducedMotion();
  return (
    <CategorySection
      eyebrow="Requests"
      title="A morning, asked for."
      body="Morgan Lee wrote in at 7:40. A new-patient visit for blood pressure. Mornings work best. The request is still new."
    >
      <TiltFrame className="relative h-72">
        <Drift dx={14} dy={10} className="absolute inset-x-6 top-8">
          <div className="h-40 rotate-[-4deg] rounded-3xl bg-neutral-100" />
        </Drift>
        <Drift dx={6} dy={4} className="absolute inset-x-0 top-0">
          <motion.article
            initial={reduce ? false : { opacity: 0, y: 24, rotate: -2 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl shadow-neutral-900/10"
          >
            <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-400">New · 7:40</p>
            <h3 className="mt-2 font-display text-3xl text-neutral-950">Morgan Lee</h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              I would like a new-patient visit for blood pressure. Mornings work best.
            </p>
          </motion.article>
        </Drift>
      </TiltFrame>
    </CategorySection>
  );
}
