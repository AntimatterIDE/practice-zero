"use client";

import { motion, useReducedMotion } from "motion/react";
import { CategorySection } from "@/components/marketing/depth";

const tasks = [
  { title: "Records release is unsigned", detail: "Garrett Holliday still needs to sign before 10:30.", from: -28 },
  { title: "Denial follow-up", detail: "Anas Khan has an August claim denied for medical necessity.", from: 28 },
];

export function TasksSection() {
  const reduce = useReducedMotion();
  return (
    <CategorySection
      flip
      eyebrow="Tasks"
      title="Two things are still open."
      body="The morning has a records release waiting on Garrett, and a denial follow-up waiting on Anas. Both are due today."
    >
      <div className="grid gap-4">
        {tasks.map((task, index) => (
          <motion.article
            key={task.title}
            initial={reduce ? false : { opacity: 0, x: task.from }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl border border-line bg-white p-5 shadow-lg shadow-ink/5"
          >
            <p className="text-[11px] uppercase tracking-[0.16em] text-graphite/70">Open · October 14</p>
            <h3 className="mt-2 font-display text-2xl text-ink">{task.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-graphite">{task.detail}</p>
          </motion.article>
        ))}
      </div>
    </CategorySection>
  );
}
