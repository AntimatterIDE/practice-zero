"use client";

import { useState } from "react";
import { CategorySection } from "@/components/marketing/depth";
import { cn } from "@/lib/utils";

const steps = [
  {
    when: "June 3",
    label: "Visit",
    detail: "Anas Khan, established visit. The claim goes out with the note.",
  },
  {
    when: "June 20",
    label: "Paid",
    detail: "Pinetree Health paid the practice $140. $40 is still the patient balance.",
  },
  {
    when: "October 14",
    label: "Next touch",
    detail: "The balance text is written. It stays in the outbox until someone sends it.",
  },
];

export function FollowUpSection() {
  const [selected, setSelected] = useState(2);

  return (
    <CategorySection
      id="follow-up"
      flip
      eyebrow="Follow-up"
      title="The next touch is already chosen."
      body="The June visit was paid. A balance remains. The follow-up is a text, and it waits until someone sends it."
    >
      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-xl shadow-ink/10">
        <div className="border-b border-line px-5 py-4">
          <p className="text-sm font-medium text-ink">Anas Khan</p>
          <p className="text-xs text-graphite">June visit through this morning</p>
        </div>
        <div>
          {steps.map((step, index) => {
            const open = index === selected;
            return (
              <button
                key={step.label}
                type="button"
                aria-pressed={open}
                onClick={() => setSelected(index)}
                className={cn(
                  "block w-full border-t border-line px-5 py-4 text-left first:border-t-0",
                  open ? "bg-mist" : "hover:bg-paper",
                )}
              >
                <p className="text-[11px] uppercase tracking-[0.16em] text-graphite/70">{step.when}</p>
                <p className="mt-1 font-display text-2xl text-ink">{step.label}</p>
                {open && <p className="mt-2 max-w-sm text-sm leading-relaxed text-graphite">{step.detail}</p>}
              </button>
            );
          })}
        </div>
      </div>
    </CategorySection>
  );
}
