"use client";

import { useState } from "react";
import { CategorySection } from "@/components/marketing/depth";
import { cn } from "@/lib/utils";

const pages = [
  {
    label: "Home",
    href: "https://thealignmentclinic.com/",
    path: "thealignmentclinic.com",
    title: "The Alignment Clinic",
    body: "Elvis Francois, MD, orthopedic spine surgery. The work is to understand the problem, explain it clearly, and decide the next step together.",
  },
  {
    label: "Conditions",
    href: "https://thealignmentclinic.com/conditions",
    path: "thealignmentclinic.com/conditions",
    title: "Where people start",
    body: "Neck pain, low back pain, sciatica, and pain that remains after surgery. The visit starts with the story and an examination.",
  },
  {
    label: "Visit",
    href: "https://thealignmentclinic.com/visit",
    path: "thealignmentclinic.com/visit",
    title: "What to expect",
    body: "A history, an examination, and a plan you can follow. Bring a photo ID, a list of medicines, and imaging you already have.",
  },
  {
    label: "Physician",
    href: "https://thealignmentclinic.com/dr-elvis-francois",
    path: "thealignmentclinic.com/dr-elvis-francois",
    title: "Elvis Francois, MD",
    body: "Spine fellowship at Harvard, after orthopedic residency at the Mayo Clinic. The office is at 245 5th Ave, New York.",
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
      body="A custom site is included. The Alignment Clinic is live: conditions, the visit, and the physician, at thealignmentclinic.com."
    >
      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-xl shadow-ink/10">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <span className="truncate text-xs text-graphite">{page.path}</span>
          <span className="shrink-0 text-[11px] uppercase tracking-[0.16em] text-slash">Live</span>
        </div>
        <div className="flex flex-wrap gap-2 px-5 pt-4">
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
          <a
            href={page.href}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink/90"
          >
            Open the live site
          </a>
        </div>
      </div>
    </CategorySection>
  );
}
