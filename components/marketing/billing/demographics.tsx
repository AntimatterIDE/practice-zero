"use client";

import { motion, useReducedMotion } from "motion/react";
import { CategorySection } from "@/components/marketing/depth";

export function DemographicsSection() {
  const reduce = useReducedMotion();
  return (
    <CategorySection
      eyebrow="Coverage from demographics"
      title="A name and a birthday are enough to start."
      body="Paul Wallace. March 14, 1988. The member ID can come after. The match on this morning is Pinetree Health, and this practice is out of network for that plan."
      href="/try/patients/pt-hale"
      action="Open the chart"
    >
      <div className="relative h-80">
        <motion.article
          initial={reduce ? false : { y: 12, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="absolute inset-x-0 top-0 rounded-3xl border border-line bg-white p-6 shadow-xl"
        >
          <p className="text-[11px] uppercase tracking-[0.16em] text-graphite/70">What the practice already knows</p>
          <p className="mt-4 font-display text-4xl text-ink">Paul Wallace</p>
          <p className="mt-2 text-graphite">March 14, 1988</p>
        </motion.article>
        <motion.article
          initial={reduce ? false : { y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-4 bottom-0 rounded-3xl bg-ink p-6 text-white shadow-2xl"
        >
          <p className="text-[11px] uppercase tracking-[0.16em] text-graphite/70">Match</p>
          <p className="mt-3 font-display text-3xl">Pinetree Health</p>
          <p className="mt-1 text-sm text-paper/55">Choice PPO · out of network</p>
        </motion.article>
      </div>
    </CategorySection>
  );
}
