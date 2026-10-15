"use client";

import { motion, useReducedMotion } from "motion/react";
import { CategorySection } from "@/components/marketing/depth";

const lines = [
  ["Plan", "Choice PPO"],
  ["Member", "PT-44021"],
  ["Payer", "Pinetree Health"],
  ["Status", "Active"],
];

export function CoverageSection() {
  const reduce = useReducedMotion();
  return (
    <CategorySection
      flip
      eyebrow="Find the coverage"
      title="Coverage, found for the 9:00 patient."
      body="Jordan Hale’s benefits are already on the chart. Choice PPO, member PT-44021, active with Pinetree Health."
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
