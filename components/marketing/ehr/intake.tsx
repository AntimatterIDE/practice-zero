"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CategorySection } from "@/components/marketing/depth";
import { cn } from "@/lib/utils";

const answers = [
  ["Reason", "Checkup. Blood pressure has been high at the pharmacy."],
  ["Pharmacy", "Hope Street Pharmacy"],
  ["Medications", "Lisinopril 10 mg daily"],
  ["Allergies", "Penicillin, rash"],
];

export function IntakeSection() {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState(0);

  return (
    <CategorySection
      id="intake"
      flip
      eyebrow="Intake"
      title="The answers arrived last night."
      body="Paul’s intake is on file for the 9:00 visit. Reason, pharmacy, medication, and the penicillin rash."
    >
      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-xl shadow-ink/10">
        <div className="border-b border-line px-5 py-4">
          <p className="text-sm font-medium text-ink">Intake · Paul Wallace</p>
          <p className="text-xs text-graphite">4 answers on file · Wednesday, October 14</p>
        </div>
        <div>
          {answers.map(([label, value], index) => (
            <motion.button
              key={label}
              type="button"
              aria-pressed={index === selected}
              onClick={() => setSelected(index)}
              initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
              whileInView={{ clipPath: "inset(0 0% 0 0)" }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: 0.1 * index, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "block w-full border-t border-line px-5 py-4 text-left first:border-t-0",
                index === selected ? "bg-mist" : "hover:bg-paper",
              )}
            >
              <p className="text-[11px] uppercase tracking-[0.14em] text-graphite/70">{label}</p>
              <p className="mt-1 text-sm text-ink">{value}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </CategorySection>
  );
}
