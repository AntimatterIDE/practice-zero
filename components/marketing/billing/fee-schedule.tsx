"use client";

import { CategorySection } from "@/components/marketing/depth";

const rows = [
  ["99203", "New patient office visit", "$185"],
  ["99213", "Office visit, low complexity", "$145"],
  ["99214", "Office visit, moderate complexity", "$210"],
];

export function FeeScheduleSection() {
  return (
    <CategorySection
      eyebrow="Fee schedule"
      title="the practice fee, by code."
      body="99203 is $185. That is the cash fee Southeast Medical charges. Charge entry uses this schedule. There is no second in-network allowed amount."
      href="/try/tools"
      action="Open the fee schedule"
    >
      <ul className="divide-y divide-line rounded-[2rem] border border-line bg-white shadow-xl shadow-ink/10">
        {rows.map(([code, description, fee]) => (
          <li key={code} className="flex items-baseline justify-between gap-4 px-6 py-5">
            <span>
              <span className="font-medium text-ink">{code}</span>
              <span className="mt-1 block text-sm text-graphite">{description}</span>
            </span>
            <span className="font-display text-3xl text-ink">{fee}</span>
          </li>
        ))}
      </ul>
    </CategorySection>
  );
}
