"use client";

import { CategorySection, Drift, TiltFrame } from "@/components/marketing/depth";

export function ChecksSection() {
  return (
    <CategorySection
      flip
      eyebrow="Paper checks"
      title="A check can still arrive in the mail."
      body="The June visit left $25 with Elena. Depositing the check, and knowing which envelope it came in, stays with the billing day."
    >
      <TiltFrame className="relative h-72">
        <Drift dx={16} dy={8} className="absolute right-2 top-4 w-48">
          <div className="rotate-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 shadow-lg">
            <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-400">Mail</p>
            <p className="mt-3 text-sm text-neutral-700">Elena Voss</p>
            <p className="text-xs text-neutral-500">90 Wickenden Street</p>
          </div>
        </Drift>
        <Drift dx={6} dy={10} className="absolute left-0 top-10 w-[19rem]">
          <article className="rounded-2xl border border-neutral-300 bg-[#f7f4ea] p-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <p className="font-display text-xl text-neutral-950">Elena Voss</p>
              <p className="rounded-md border border-neutral-400 px-2 py-1 font-medium">$25</p>
            </div>
            <p className="mt-6 border-b border-neutral-400 pb-2 text-sm text-neutral-700">Patient share · June visit</p>
            <p className="mt-4 text-xs text-neutral-500">Paper check · still to deposit</p>
          </article>
        </Drift>
      </TiltFrame>
    </CategorySection>
  );
}
