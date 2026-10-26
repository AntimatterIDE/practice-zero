"use client";

import { useState } from "react";
import { CategorySection } from "@/components/marketing/depth";
import { cn } from "@/lib/utils";

const pages = [
  {
    label: "Home",
    path: "southeast.example",
    title: "Mornings in Providence.",
    body: "Wednesday visits with Dr. Francois, from 8:40.",
  },
  {
    label: "New patients",
    path: "southeast.example/new",
    title: "What to bring.",
    body: "The insurance card, a list of medicines, and the reason for the visit.",
  },
  {
    label: "Hours",
    path: "southeast.example/hours",
    title: "Wednesday, from 8:40.",
    body: "New-patient blood pressure visits are in the morning.",
  },
];

export function OnboardingSite() {
  const [selected, setSelected] = useState(0);
  const page = pages[selected];

  return (
    <CategorySection
      id="website"
      eyebrow="Website"
      title="The practice site is part of go-live."
      body="A custom site is included. It points a new patient at the visit, the hours, and the intake. No separate web project."
    >
      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-xl shadow-ink/10">
        <div className="flex items-center gap-3 border-b border-line px-5 py-4">
          <span className="text-xs text-graphite">{page.path}</span>
        </div>
        <div className="flex gap-2 px-5 pt-4">
          {pages.map((item, index) => (
            <button
              key={item.label}
              type="button"
              aria-pressed={index === selected}
              onClick={() => setSelected(index)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium",
                index === selected ? "bg-ink text-paper" : "bg-mist text-graphite hover:text-ink",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="px-5 py-6">
          <p className="font-display text-3xl text-ink">{page.title}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-graphite">{page.body}</p>
        </div>
      </div>
    </CategorySection>
  );
}
