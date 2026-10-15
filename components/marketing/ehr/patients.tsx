"use client";

import { CategorySection, Drift, TiltFrame } from "@/components/marketing/depth";

export function PatientsSection() {
  return (
    <CategorySection
      eyebrow="Patients"
      title="Jordan Hale is already on the chart."
      body="Demographics, coverage, and the problem list are in the room before anyone asks for them. MRN 100481. March 14, 1988."
    >
      <TiltFrame className="relative mx-auto h-[28rem] w-full max-w-md">
        <Drift dx={22} dy={12} className="absolute inset-x-10 top-10">
          <article className="rotate-[-7deg] rounded-2xl border border-line bg-mist p-5 shadow-lg">
            <p className="text-[11px] uppercase tracking-[0.16em] text-graphite/70">Problem list</p>
            <p className="mt-3 font-display text-2xl text-ink">Essential hypertension</p>
            <p className="mt-1 text-sm text-graphite">I10 · active since September</p>
          </article>
        </Drift>
        <Drift dx={12} dy={8} className="absolute inset-x-5 top-16">
          <article className="rotate-[4deg] rounded-2xl border border-line bg-white p-5 shadow-xl">
            <p className="text-[11px] uppercase tracking-[0.16em] text-graphite/70">Coverage</p>
            <p className="mt-3 text-lg font-medium text-ink">Pinetree Health</p>
            <p className="text-sm text-graphite">Choice PPO · PT-44021</p>
          </article>
        </Drift>
        <Drift dx={4} dy={3} className="absolute inset-x-0 top-0">
          <article className="rounded-3xl border border-line bg-white p-6 shadow-2xl shadow-ink/10">
            <p className="text-[11px] uppercase tracking-[0.16em] text-graphite/70">Patient</p>
            <h3 className="mt-3 font-display text-4xl text-ink">Jordan Hale</h3>
            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-graphite/70">MRN</dt>
                <dd className="font-medium text-ink">100481</dd>
              </div>
              <div>
                <dt className="text-graphite/70">Born</dt>
                <dd className="font-medium text-ink">March 14, 1988</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-graphite/70">Address</dt>
                <dd className="font-medium text-ink">18 Hope Street, Providence</dd>
              </div>
            </dl>
          </article>
        </Drift>
      </TiltFrame>
    </CategorySection>
  );
}
