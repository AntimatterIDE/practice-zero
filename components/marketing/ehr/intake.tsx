"use client";

import { motion, useReducedMotion } from "motion/react";
import { CategorySection } from "@/components/marketing/depth";

const answers = [
  ["Reason", "Checkup. Blood pressure has been high at the pharmacy."],
  ["Pharmacy", "Hope Street Pharmacy"],
  ["Medications", "Lisinopril 10 mg daily"],
  ["Allergies", "Penicillin, rash"],
];

export function IntakeSection() {
  const reduce = useReducedMotion();
  return (
    <CategorySection
      flip
      eyebrow="Intake"
      title="The answers arrived last night."
      body="Jordan’s intake is on file for the 9:00 visit. Reason, pharmacy, medication, and the penicillin rash."
    >
      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-xl shadow-ink/10">
        <div className="border-b border-line px-5 py-4">
          <p className="text-sm font-medium text-ink">Intake · Jordan Hale</p>
          <p className="text-xs text-graphite">On file for Wednesday, October 14</p>
        </div>
        <div>
          {answers.map(([label, value], index) => (
            <motion.div
              key={label}
              initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
              whileInView={{ clipPath: "inset(0 0% 0 0)" }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: 0.1 * index, ease: [0.22, 1, 0.36, 1] }}
              className="border-t border-line px-5 py-4"
            >
              <p className="text-[11px] uppercase tracking-[0.14em] text-graphite/70">{label}</p>
              <p className="mt-1 text-sm text-ink">{value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </CategorySection>
  );
}
