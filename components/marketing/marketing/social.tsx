"use client";

import { motion, useReducedMotion } from "motion/react";
import { CategorySection, Drift, TiltFrame } from "@/components/marketing/depth";

export function SocialSection() {
  const reduce = useReducedMotion();
  return (
    <CategorySection
      eyebrow="Social"
      title="The practice, in public."
      body="Two notes the practice can post: mornings are open, and new patients are welcome. Reputation and reviews stay part of how the practice shows up counts stay off the page."
    >
      <TiltFrame className="relative h-80">
        <Drift dx={14} dy={8} className="absolute left-0 top-8 w-64">
          <motion.article
            initial={reduce ? false : { rotate: -8, opacity: 0 }}
            whileInView={{ rotate: -6, opacity: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-line bg-white p-5 shadow-xl"
          >
            <div className="h-24 rounded-2xl bg-mist" />
            <p className="mt-4 font-display text-2xl text-ink">Mornings</p>
            <p className="mt-1 text-sm text-graphite">Wednesday visits, from 8:40.</p>
          </motion.article>
        </Drift>
        <Drift dx={8} dy={12} className="absolute bottom-0 right-0 w-64">
          <motion.article
            initial={reduce ? false : { rotate: 8, opacity: 0 }}
            whileInView={{ rotate: 4, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl bg-ink p-5 text-white shadow-2xl"
          >
            <div className="h-24 rounded-2xl bg-ink/80" />
            <p className="mt-4 font-display text-2xl">New patients</p>
            <p className="mt-1 text-sm text-paper/55">Blood pressure visits, mornings.</p>
          </motion.article>
        </Drift>
      </TiltFrame>
    </CategorySection>
  );
}
