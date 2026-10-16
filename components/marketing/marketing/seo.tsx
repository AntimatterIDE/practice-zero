"use client";

import { motion, useReducedMotion } from "motion/react";
import { CategorySection } from "@/components/marketing/depth";

const pages = [
  { title: "New patients", detail: "A first visit, and what to bring." },
  { title: "Blood pressure", detail: "The reason Paul came in." },
  { title: "Morning hours", detail: "When the practice is open." },
];

export function SeoSection() {
  const reduce = useReducedMotion();
  return (
    <CategorySection
      flip
      eyebrow="SEO"
      title="Pages a person can find."
      body="Search is a set of plain pages: new patients, the visit they need, and when the door is open. Reputation and reviews help them choose — no ranking is promised here."
    >
      <div className="grid gap-3">
        {pages.map((page, index) => (
          <motion.article
            key={page.title}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`rounded-3xl border border-line bg-white p-5 shadow-lg shadow-ink/5 ${index === 1 ? "sm:ml-5" : ""} ${index === 2 ? "sm:ml-10" : ""}`}
          >
            <p className="text-[11px] uppercase tracking-[0.16em] text-graphite/70">Page</p>
            <h3 className="mt-2 font-display text-3xl text-ink">{page.title}</h3>
            <p className="mt-1 text-sm text-graphite">{page.detail}</p>
          </motion.article>
        ))}
      </div>
    </CategorySection>
  );
}
