"use client";

import { motion, useReducedMotion } from "motion/react";
import { CategorySection } from "@/components/marketing/depth";

const lines = [
  ["Plan", "Choice PPO"],
  ["Member", "PT-44021"],
  ["Network", "Out of network"],
  ["Payment", "Pays the patient"],
];

export function CoverageSection() {
  const reduce = useReducedMotion();
  return (
    <CategorySection
      flip
      eyebrow="Find the coverage"
      title="the plan is on the chart."
      body="Paul Wallace’s Choice PPO is active with Pinetree Health, member PT-44021. This practice is out of network. Until assignment of benefits is signed, the plan pays the patient."
      href="/try/patients/pt-hale"
      action="Open the chart"
    >
      <div className="grid grid-cols-2 gap-3">
        {lines.map(([label, value], index) => (
          <motion.div
            key={label}
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            className="rounded-3xl border border-line bg-white p-5 shadow-lg shadow-ink/5"
          >
            <p className="text-[11px] uppercase tracking-[0.16em] text-graphite/70">{label}</p>
            <p className="mt-3 font-display text-3xl text-ink">{value}</p>
          </motion.div>
        ))}
      </div>
    </CategorySection>
  );
}
