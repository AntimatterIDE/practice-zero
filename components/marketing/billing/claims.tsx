"use client";

import { CategorySection, Drift, TiltFrame } from "@/components/marketing/depth";

const slips = [
  { who: "Jordan Hale", when: "Oct 14", what: "99203 · draft", amount: "$185", rotate: "-8deg", place: "left-0 top-6 w-[70%]", dx: 14, dy: 8 },
  { who: "Elena Voss", when: "Jun 3", what: "99213 · paid", amount: "$140", rotate: "2deg", place: "left-[12%] top-16 w-[70%]", dx: 6, dy: 12 },
  { who: "Elena Voss", when: "Aug 12", what: "99214 · CARC 50", amount: "$0", rotate: "8deg", place: "right-0 top-24 w-[70%]", dx: 16, dy: 6 },
];

export function ClaimsSection() {
  return (
    <CategorySection
      eyebrow="Claims"
      title="One draft. One payment. One denial."
      body="Jordan’s 99203 for $185 is still a draft. Elena’s June visit paid $140. The August visit came back denied, CARC 50, medical necessity."
    >
      <TiltFrame className="relative h-[24rem]">
        {slips.map((slip) => (
          <Drift key={slip.what} dx={slip.dx} dy={slip.dy} className={`absolute ${slip.place}`}>
            <article
              className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl shadow-neutral-900/10"
              style={{ rotate: slip.rotate }}
            >
              <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-400">{slip.when}</p>
              <p className="mt-2 text-sm font-medium text-neutral-950">{slip.who}</p>
              <p className="text-xs text-neutral-500">{slip.what}</p>
              <p className="mt-4 font-display text-3xl text-neutral-950">{slip.amount}</p>
            </article>
          </Drift>
        ))}
      </TiltFrame>
    </CategorySection>
  );
}
