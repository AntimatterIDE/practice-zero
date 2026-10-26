"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { CategorySection } from "@/components/marketing/depth";
import { cn } from "@/lib/utils";

const items = [
  { title: "Two exam rooms", detail: "Room 1 and room 2, Wednesday mornings." },
  { title: "Pinetree Health", detail: "Choice PPO, out of network, payer ID 44021." },
  { title: "Fee schedule", detail: "99203 is $185, collected at the visit." },
  { title: "Dr. Francois", detail: "Wednesday mornings. The 9:00 is a new-patient checkup." },
];

export function OnboardingDiscovery() {
  const [done, setDone] = useState<boolean[]>(() => items.map(() => false));
  const open = done.filter((item) => !item).length;

  return (
    <CategorySection
      id="discovery"
      eyebrow="Discovery"
      title="The morning gets mapped before it opens."
      body="Engineers and managers sit with the practice until rooms, payers, the fee schedule, and staffing are concrete. There is no hour cap."
    >
      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-xl shadow-ink/10">
        <div className="border-b border-line px-5 py-4">
          <p className="text-sm font-medium text-ink">Southeast Medical</p>
          <p className="text-xs text-graphite" aria-live="polite">
            {open === 0 ? "Ready to build" : `${open} still to map`}
          </p>
        </div>
        <div>
          {items.map((item, index) => {
            const complete = done[index];
            return (
              <button
                key={item.title}
                type="button"
                aria-pressed={complete}
                onClick={() => setDone((current) => current.map((value, valueIndex) => (valueIndex === index ? !value : value)))}
                className="flex w-full items-start gap-4 border-t border-line px-5 py-4 text-left first:border-t-0 hover:bg-paper"
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                    complete ? "border-ink bg-ink text-paper" : "border-line bg-white text-transparent",
                  )}
                  aria-hidden
                >
                  <Check className="h-3 w-3" />
                </span>
                <span>
                  <span className={cn("block font-display text-2xl text-ink", complete && "text-graphite")}>{item.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-graphite">
                    {complete ? "Mapped." : item.detail}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </CategorySection>
  );
}
