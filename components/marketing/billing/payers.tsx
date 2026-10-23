"use client";

import { motion, useReducedMotion } from "motion/react";
import { CategorySection } from "@/components/marketing/depth";

export function PayersSection() {
  const reduce = useReducedMotion();
  return (
    <CategorySection
      flip
      eyebrow="Payers"
      title="One plan, on every chart this morning."
      body="Pinetree Health is the payer across the panel. Choice PPO is on Paul’s chart, and it is not a contracted plan. Patients pay the practice fee."
      href="/try/patients/pt-hale"
      action="Open the chart"
    >
      <motion.article
        initial={reduce ? false : { rotateX: 18, opacity: 0 }}
        whileInView={{ rotateX: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformPerspective: 900 }}
        className="rounded-[2rem] border border-line bg-white p-8 shadow-2xl shadow-ink/10"
      >
        <p className="text-[11px] uppercase tracking-[0.16em] text-graphite/70">Payer</p>
        <h3 className="mt-3 font-display text-5xl text-ink">Pinetree Health</h3>
        <div className="mt-8 grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-graphite/70">Plan</p>
            <p className="mt-1 font-medium text-ink">Choice PPO · out of network</p>
          </div>
          <div>
            <p className="text-graphite/70">On the 9:00 chart</p>
            <p className="mt-1 font-medium text-ink">Paul Wallace</p>
          </div>
        </div>
      </motion.article>
    </CategorySection>
  );
}
