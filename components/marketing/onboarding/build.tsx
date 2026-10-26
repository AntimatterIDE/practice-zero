"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { CategorySection } from "@/components/marketing/depth";

const stages = {
  requested: {
    label: "Requested",
    detail: "Show the records release on the board before Garrett’s 10:30.",
    action: "Ship it",
  },
  building: {
    label: "Building",
    detail: "Engineers are putting the release on Wednesday’s board.",
    action: "Shipping",
  },
  shipped: {
    label: "On the chart",
    detail: "The 10:30 row now says the records release is unsigned.",
    action: "Request it again",
  },
} as const;

type Stage = keyof typeof stages;

export function OnboardingBuild() {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState<Stage>("requested");
  const current = stages[stage];

  useEffect(() => {
    if (stage !== "building") return;
    if (reduce) {
      setStage("shipped");
      return;
    }
    const timer = window.setTimeout(() => setStage("shipped"), 900);
    return () => window.clearTimeout(timer);
  }, [reduce, stage]);

  return (
    <CategorySection
      id="build"
      flip
      eyebrow="Build"
      title="A request during go-live ships in the window."
      body="Feature requests are part of onboarding. This one puts Garrett Holliday’s records release on the morning board before 10:30."
    >
      <article className="rounded-3xl border border-line bg-white p-6 shadow-xl shadow-ink/10">
        <p className="text-[11px] uppercase tracking-[0.16em] text-slash" aria-live="polite">
          {current.label}
        </p>
        <h3 className="mt-3 font-display text-3xl text-ink">Records release</h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-graphite">{current.detail}</p>
        <button
          type="button"
          disabled={stage === "building"}
          onClick={() => setStage((value) => (value === "shipped" ? "requested" : "building"))}
          className="mt-6 inline-flex rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink/90 disabled:opacity-60"
        >
          {current.action}
        </button>
      </article>
    </CategorySection>
  );
}
