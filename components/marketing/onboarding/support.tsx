"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CategorySection } from "@/components/marketing/depth";

export function OnboardingSupport() {
  const reduce = useReducedMotion();
  const [sent, setSent] = useState(false);

  return (
    <CategorySection
      id="support"
      flip
      eyebrow="Support"
      title="The same team stays after the morning opens."
      body="Onboarding ends when the practice says it is ready. Support does not. A message about the 10:30 release gets a person, for the life of the contract."
    >
      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-xl shadow-ink/10">
        <div className="border-b border-line px-5 py-4">
          <p className="text-sm font-medium text-ink">Onboarding</p>
          <p className="text-xs text-graphite">{sent ? "Answered" : "24/7 · waiting"}</p>
        </div>
        <div className="grid gap-3 px-5 py-5">
          <p className="max-w-sm rounded-2xl rounded-bl-md bg-mist px-4 py-3 text-sm leading-relaxed text-ink">
            The 10:30 records release is still unsigned.
          </p>
          {sent && (
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-sm justify-self-end rounded-2xl rounded-br-md bg-ink px-4 py-3 text-sm leading-relaxed text-paper"
              aria-live="polite"
            >
              We will stay on it until Garrett signs. Wednesday can still open.
            </motion.p>
          )}
        </div>
        <div className="border-t border-line px-5 py-4">
          <button
            type="button"
            onClick={() => setSent((value) => !value)}
            className="inline-flex rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink/90"
          >
            {sent ? "Clear the thread" : "Send to onboarding"}
          </button>
        </div>
      </div>
    </CategorySection>
  );
}
