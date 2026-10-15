"use client";

import { motion, useReducedMotion } from "motion/react";
import { CategorySection } from "@/components/marketing/depth";

export function EftSection() {
  const reduce = useReducedMotion();
  return (
    <CategorySection
      eyebrow="Collect from payers"
      title="The June visit came back paid."
      body="Pinetree Health paid $140 on Elena Voss’s June visit. Enrollment for EFTs is how that money finds the practice."
    >
      <div className="rounded-3xl border border-line bg-white p-6 shadow-xl shadow-ink/10">
        <div className="flex items-end justify-between text-sm">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-graphite/70">Payer</p>
            <p className="mt-1 font-medium text-ink">Pinetree Health</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-[0.16em] text-graphite/70">Practice</p>
            <p className="mt-1 font-medium text-ink">Paid</p>
          </div>
        </div>
        <div className="relative mt-8 h-12">
          <div className="absolute left-0 right-0 top-1/2 h-px bg-neutral-200" />
          <motion.div
            className="absolute top-1/2 flex h-10 -translate-y-1/2 items-center rounded-full bg-ink px-4 text-sm font-medium text-white"
            initial={reduce ? { left: "auto", right: 0 } : { left: 0 }}
            whileInView={{ left: "calc(100% - 5.5rem)" }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          >
            $140
          </motion.div>
        </div>
        <p className="mt-6 text-xs text-graphite">June 3 visit · remittance June 20 · Elena Voss</p>
      </div>
    </CategorySection>
  );
}
