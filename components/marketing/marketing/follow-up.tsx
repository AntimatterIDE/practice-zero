"use client";

import { motion, useReducedMotion } from "motion/react";
import { CategorySection } from "@/components/marketing/depth";

const steps = [
  { when: "June 3", label: "Visit", detail: "Elena Voss, established visit" },
  { when: "June 20", label: "Paid", detail: "$140 from Pinetree Health" },
  { when: "October 14", label: "Next touch", detail: "Balance text, still in the outbox" },
];

export function FollowUpSection() {
  const reduce = useReducedMotion();
  return (
    <CategorySection
      flip
      eyebrow="Follow-up"
      title="The next touch is already chosen."
      body="The June visit was paid. A balance remains. The follow-up is a text, and it waits until someone sends it."
    >
      <ol className="relative grid gap-6 border-l border-line pl-6">
        {steps.map((step, index) => (
          <motion.li
            key={step.label}
            initial={reduce ? false : { opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.12 }}
            className="relative"
          >
            <span className="absolute -left-[1.65rem] top-1 h-3 w-3 rounded-full border-2 border-neutral-950 bg-white" />
            <p className="text-[11px] uppercase tracking-[0.16em] text-graphite/70">{step.when}</p>
            <p className="mt-1 font-display text-2xl text-ink">{step.label}</p>
            <p className="text-sm text-graphite">{step.detail}</p>
          </motion.li>
        ))}
      </ol>
    </CategorySection>
  );
}
