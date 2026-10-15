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
      body="Pinetree Health is the payer for Jordan, Elena, and Chris. Choice PPO is the plan on Jordan’s coverage."
    >
      <motion.article
        initial={reduce ? false : { rotateX: 18, opacity: 0 }}
        whileInView={{ rotateX: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformPerspective: 900 }}
        className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-2xl shadow-neutral-900/10"
      >
        <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-400">Payer</p>
        <h3 className="mt-3 font-display text-5xl text-neutral-950">Pinetree Health</h3>
        <div className="mt-8 grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-neutral-400">Plan</p>
            <p className="mt-1 font-medium text-neutral-950">Choice PPO</p>
          </div>
          <div>
            <p className="text-neutral-400">On the 9:00 chart</p>
            <p className="mt-1 font-medium text-neutral-950">Jordan Hale</p>
          </div>
        </div>
      </motion.article>
    </CategorySection>
  );
}
