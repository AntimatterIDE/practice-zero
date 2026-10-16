"use client";

import { CategorySection, Drift, TiltFrame } from "@/components/marketing/depth";

const slips = [
  { who: "Paul Wallace", when: "Oct 14", what: "99203 · draft", amount: "$185", rotate: "-8deg", place: "left-0 top-6 w-[70%]", dx: 14, dy: 8 },
  { who: "Anas Khan", when: "Jun 3", what: "99213 · paid", amount: "$140", rotate: "2deg", place: "left-[12%] top-16 w-[70%]", dx: 6, dy: 12 },
  { who: "Anas Khan", when: "Aug 12", what: "99214 · CARC 50", amount: "$0", rotate: "8deg", place: "right-0 top-24 w-[70%]", dx: 16, dy: 6 },
];

export function ClaimsSection() {
  return (
    <CategorySection
      eyebrow="Claims"
      title="One draft. One payment. One denial."
      body="Paul’s 99203 for $185 is still a draft. Anas’s June visit paid $140. The August visit came back denied, CARC 50, medical necessity."
    >
      <TiltFrame className="relative h-[24rem]">
        {slips.map((slip) => (
          <Drift key={slip.what} dx={slip.dx} dy={slip.dy} className={`absolute ${slip.place}`}>
            <article
              className="rounded-2xl border border-line bg-white p-4 shadow-xl shadow-ink/10"
              style={{ rotate: slip.rotate }}
            >
              <p className="text-[11px] uppercase tracking-[0.14em] text-graphite/70">{slip.when}</p>
              <p className="mt-2 text-sm font-medium text-ink">{slip.who}</p>
              <p className="text-xs text-graphite">{slip.what}</p>
              <p className="mt-4 font-display text-3xl text-ink">{slip.amount}</p>
            </article>
          </Drift>
        ))}
      </TiltFrame>
    </CategorySection>
  );
}
