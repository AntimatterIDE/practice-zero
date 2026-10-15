"use client";

import { motion, useReducedMotion } from "motion/react";
import { CategorySection } from "@/components/marketing/depth";

const lines = [
  ["Dr. Shah", "What brought you in?"],
  ["Jordan", "The pharmacy machine has been reading my pressure high."],
  ["Dr. Shah", "We will keep the lisinopril and look again in a month."],
];

export function ScribeSection() {
  const reduce = useReducedMotion();
  return (
    <CategorySection
      eyebrow="Scribe"
      title="The visit becomes the note."
      body="The 9:00 transcript stays with the chart. The assessment is essential hypertension, and the note stays hidden until someone asks to see it."
    >
      <div className="grid gap-3">
        {lines.map(([who, line], index) => (
          <motion.p
            key={who + index}
            initial={reduce ? false : { opacity: 0, x: index % 2 === 0 ? -16 : 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.55, delay: 0.12 * index, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl bg-neutral-50 px-4 py-3 text-sm leading-relaxed text-neutral-700"
          >
            <span className="font-medium text-neutral-950">{who}. </span>
            {line}
          </motion.p>
        ))}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-2 rounded-3xl border border-neutral-950 bg-neutral-950 p-5 text-white"
        >
          <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-400">Note</p>
          <p className="mt-3 font-display text-2xl leading-snug">Essential hypertension. Continue lisinopril 10 mg. Return in a month.</p>
        </motion.div>
      </div>
    </CategorySection>
  );
}
