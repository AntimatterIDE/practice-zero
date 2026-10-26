"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CategorySection } from "@/components/marketing/depth";
import { cn } from "@/lib/utils";

const documents = [
  {
    who: "Paul Wallace",
    title: "Consent to evaluate and treat",
    status: "Signed",
    body: "Signed for the 9:00 visit with Dr. Francois. The chart can be opened.",
    signed: true,
  },
  {
    who: "Garrett Holliday",
    title: "Records release",
    status: "Missing",
    body: "Still unsigned. Needed before the 10:30 visit.",
    signed: false,
  },
];

export function AgreementsSection() {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState(0);
  const document = documents[selected];

  return (
    <CategorySection
      id="agreements"
      eyebrow="Agreements"
      title="The consent is already signed."
      body="Paul signed the consent to evaluate and treat. Garrett Holliday’s records release is the one still missing."
    >
      <article className="rounded-3xl border border-line bg-white p-6 shadow-2xl shadow-ink/10">
        <div className="flex gap-2">
          {documents.map((item, index) => (
            <button
              key={item.who}
              type="button"
              aria-pressed={index === selected}
              onClick={() => setSelected(index)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium",
                index === selected ? "bg-ink text-paper" : "bg-mist text-graphite hover:text-ink",
              )}
            >
              {item.who.split(" ")[0]}
            </button>
          ))}
        </div>
        <p className="mt-6 text-[11px] uppercase tracking-[0.16em] text-graphite/70">{document.title}</p>
        <p className="mt-3 font-display text-3xl text-ink">{document.who}</p>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-graphite">{document.body}</p>
        <div className="mt-6 h-20">
          {document.signed ? (
            <svg viewBox="0 0 280 90" className="h-20 w-full text-ink" aria-hidden>
              <motion.path
                key={selected}
                d="M12 58 C 28 18, 46 78, 70 48 S 104 16, 128 52 S 168 86, 198 44 S 236 22, 266 50"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: reduce ? 0 : 1.2, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
          ) : (
            <div className="flex h-20 items-end">
              <div className="h-px w-full border-t border-dashed border-graphite/40" />
            </div>
          )}
        </div>
        <p className="text-xs text-graphite/70">{document.status}</p>
      </article>
    </CategorySection>
  );
}
