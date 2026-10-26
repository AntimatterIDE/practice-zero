"use client";

import { useState } from "react";
import { CategorySection } from "@/components/marketing/depth";

const stages = [
  {
    label: "Draft",
    detail: "99203 is on the chart. The fee was collected. The note is attached, and the claim has not moved.",
    action: "Queue the claim",
  },
  {
    label: "Queued",
    detail: "The agent is holding it for the out-of-network file. A person can still stop it.",
    action: "File it",
  },
  {
    label: "Filed",
    detail: "Filed out of network. Pinetree Health has the note and the visit.",
    action: "Back to the draft",
  },
];

export function AiClaimSection() {
  const [stage, setStage] = useState(0);
  const current = stages[stage];

  return (
    <CategorySection
      id="claims"
      eyebrow="Claims"
      title="The claim moves when the visit is ready."
      body="Paul’s 99203 is a $185 draft. The agent queues it with the note attached. Filing still waits on the practice."
    >
      <article className="rounded-3xl border border-line bg-white p-6 shadow-xl shadow-ink/10">
        <p className="text-[11px] uppercase tracking-[0.16em] text-slash">{current.label}</p>
        <h3 className="mt-3 font-display text-4xl text-ink">$185</h3>
        <p className="mt-2 text-sm font-medium text-ink">Paul Wallace · 99203</p>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-graphite" aria-live="polite">
          {current.detail}
        </p>
        <button
          type="button"
          onClick={() => setStage((value) => (value + 1) % stages.length)}
          className="mt-6 inline-flex rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink/90"
        >
          {current.action}
        </button>
      </article>
    </CategorySection>
  );
}
