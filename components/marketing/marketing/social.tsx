"use client";

import { motion, useReducedMotion } from "motion/react";
import { CategorySection, Drift, TiltFrame } from "@/components/marketing/depth";

export function SocialSection() {
  const reduce = useReducedMotion();
  return (
    <CategorySection
      eyebrow="Social"
      title="The practice, in public."
      body="Two notes the practice can post: mornings are open, and new patients are welcome. Counts stay off the page."
    >
      <TiltFrame className="relative h-80">
        <Drift dx={14} dy={8} className="absolute left-0 top-8 w-64">
          <motion.article
            initial={reduce ? false : { rotate: -8, opacity: 0 }}
            whileInView={{ rotate: -6, opacity: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-xl"
          >
            <div className="h-24 rounded-2xl bg-neutral-100" />
            <p className="mt-4 font-display text-2xl text-neutral-950">Mornings</p>
            <p className="mt-1 text-sm text-neutral-600">Wednesday visits, from 8:40.</p>
          </motion.article>
        </Drift>
        <Drift dx={8} dy={12} className="absolute bottom-0 right-0 w-64">
          <motion.article
            initial={reduce ? false : { rotate: 8, opacity: 0 }}
            whileInView={{ rotate: 4, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl bg-neutral-950 p-5 text-white shadow-2xl"
          >
            <div className="h-24 rounded-2xl bg-neutral-800" />
            <p className="mt-4 font-display text-2xl">New patients</p>
            <p className="mt-1 text-sm text-neutral-300">Blood pressure visits, mornings.</p>
          </motion.article>
        </Drift>
      </TiltFrame>
    </CategorySection>
  );
}
