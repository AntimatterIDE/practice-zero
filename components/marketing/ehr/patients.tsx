"use client";

import { CategorySection, Drift, TiltFrame } from "@/components/marketing/depth";
import CreditCard from "@/components/ui/credit-card";

function PineMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="7" fill="#f4f1e6" />
      <path fill="#0e4a38" d="M16 5.2 19.4 12h-2.2l3.5 5.4h-2.5L22.8 24.6H9.2l4.6-7.2h-2.5L14.8 12h-2.2z" />
    </svg>
  );
}

function CardField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[1.9cqw] tracking-[0.16em] text-[#14241c]/45 uppercase">{label}</p>
      <p className="mt-[0.45cqw] truncate font-mono text-[3.15cqw] font-medium tracking-wide text-[#14241c]">{value}</p>
    </div>
  );
}

function InsuranceFront() {
  return (
    <div className="@container relative flex h-full w-full flex-col overflow-hidden">
      <div className="relative flex h-[34%] flex-col bg-[linear-gradient(105deg,#07281f_0%,#0e4a38_58%,#187256_100%)] text-[#f4f1e6]">
        <svg
          className="pointer-events-none absolute -top-[46%] -right-[6%] h-[190%] w-[58%] opacity-30"
          viewBox="0 0 200 200"
          aria-hidden
        >
          <circle cx="150" cy="46" r="72" fill="none" stroke="#f4f1e6" strokeWidth="1" />
          <circle cx="150" cy="46" r="54" fill="none" stroke="#f4f1e6" strokeWidth="0.7" />
          <circle cx="150" cy="46" r="36" fill="none" stroke="#f4f1e6" strokeWidth="0.7" />
        </svg>
        <div className="relative flex flex-1 items-center justify-between px-[5.5%]">
          <div className="flex items-center gap-[2.4cqw]">
            <PineMark className="size-[8.2cqw]" />
            <div className="leading-none">
              <p className="text-[3.25cqw] font-semibold tracking-[0.22em]">PINETREE</p>
              <p className="mt-[0.85cqw] text-[2.05cqw] tracking-[0.32em] text-[#f4f1e6]/75">HEALTH</p>
            </div>
          </div>
          <div className="text-right leading-none">
            <p className="text-[2.9cqw] font-semibold tracking-[0.16em]">CHOICE PPO</p>
            <p className="mt-[0.9cqw] text-[1.95cqw] tracking-[0.18em] text-[#f4f1e6]/70">MEMBER CARD</p>
          </div>
        </div>
        <div className="h-[0.55cqw] bg-[#d4b36a]" />
      </div>

      <div className="flex flex-1 flex-col bg-[#f6f4ee] px-[5.5%] pt-[4.2%] pb-[3.6%] text-[#14241c]">
        <div>
          <p className="text-[1.9cqw] tracking-[0.18em] text-[#14241c]/45 uppercase">Member</p>
          <p className="mt-[0.35cqw] text-[5.5cqw] font-semibold tracking-[0.03em]">Paul Wallace</p>
          <p className="mt-[0.55cqw] text-[2.45cqw] text-[#14241c]/75">18 Hope Street, Providence, RI 02906</p>
        </div>
        <div className="mt-[3.6cqw] grid grid-cols-2 gap-x-[5cqw] gap-y-[1.8cqw]">
          <CardField label="Member ID" value="PT-44021" />
          <CardField label="Group" value="NL-100" />
          <CardField label="Born" value="03/14/1988" />
          <CardField label="MRN" value="100481" />
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-[#14241c]/10 pt-[2.1cqw] text-[1.95cqw] tracking-[0.08em] text-[#14241c]/60">
          <span>RxBIN 009988</span>
          <span>PCN PNTREE</span>
          <span>GRP NL-100</span>
          <span>Eff 01/01/2026</span>
        </div>
      </div>
    </div>
  );
}

function InsuranceBack() {
  return (
    <div className="@container flex h-full w-full flex-col bg-[#f6f4ee] text-[#14241c]">
      <div className="mt-[8%] h-[15%] w-full bg-[#111418]" />
      <div className="flex items-stretch gap-[3.5%] px-[6%] pt-[5%]">
        <div className="relative h-[15cqw] flex-1 rounded-[1.1cqw] bg-white shadow-[inset_0_0_0_1px_rgba(20,36,28,0.14)]">
          <p className="absolute top-[16%] left-[4%] text-[1.75cqw] tracking-[0.16em] text-[#14241c]/40 uppercase">
            Authorized signature
          </p>
          <p className="absolute bottom-[16%] left-[4%] font-serif text-[3.4cqw] text-[#14241c]/80 italic">Paul Wallace</p>
        </div>
        <div className="flex h-[15cqw] w-[30%] flex-col justify-center rounded-[1.1cqw] bg-white px-[5%] shadow-[inset_0_0_0_1px_rgba(20,36,28,0.14)]">
          <p className="text-[1.75cqw] tracking-[0.14em] text-[#14241c]/45 uppercase">Payer ID</p>
          <p className="font-mono text-[3.5cqw] font-semibold tracking-wide">44021</p>
        </div>
      </div>
      <div className="mt-auto space-y-[1.15cqw] px-[6%] pb-[5%] text-[2.35cqw] leading-snug text-[#14241c]/85">
        <p>
          <span className="text-[#14241c]/45">Member services </span>1-800-555-0144
        </p>
        <p>
          <span className="text-[#14241c]/45">Pharmacy help </span>1-800-555-0199
        </p>
        <p>
          <span className="text-[#14241c]/45">Claims </span>Pinetree Health, P.O. Box 44021, Providence, RI 02906
        </p>
        <p className="text-[1.9cqw] leading-snug text-[#14241c]/65">
          Demonstration card. Not proof of coverage. This sample plan pays the patient.
        </p>
      </div>
    </div>
  );
}

export function PatientsSection() {
  return (
    <CategorySection
      id="patients"
      eyebrow="Patients"
      title="Paul Wallace is already on the chart."
      body="Demographics, coverage, medications for e-prescribing, and the problem list are in the room before anyone asks for them. MRN 100481. March 14, 1988."
    >
      <TiltFrame className="relative mx-auto w-full max-w-md">
        <Drift dx={22} dy={12} className="absolute inset-x-10 top-8">
          <article className="rotate-[-7deg] rounded-2xl border border-line bg-mist p-5 shadow-lg">
            <p className="text-[11px] uppercase tracking-[0.16em] text-graphite/70">Problem list</p>
            <p className="mt-3 font-display text-2xl text-ink">Essential hypertension</p>
            <p className="mt-1 text-sm text-graphite">I10 · active since September</p>
          </article>
        </Drift>
        <Drift dx={12} dy={8} className="absolute inset-x-5 top-14">
          <article className="rotate-[4deg] rounded-2xl border border-line bg-white p-5 shadow-xl">
            <p className="text-[11px] uppercase tracking-[0.16em] text-graphite/70">Coverage</p>
            <p className="mt-3 text-lg font-medium text-ink">Pinetree Health</p>
            <p className="text-sm text-graphite">Choice PPO · out of network · PT-44021</p>
          </article>
        </Drift>
        <Drift dx={4} dy={3} className="relative z-10">
          <CreditCard
            fluid
            className="w-full"
            ariaLabel="Pinetree Health Choice PPO card for Paul Wallace, member PT-44021, born March 14, 1988, 18 Hope Street, Providence. Activate to turn the card over."
            background="#f6f4ee"
            borderRadius={16}
            rotationIntensity={0.85}
            parallaxIntensity={0.65}
            scaleOnHover={1.03}
            textColor="#14241c"
            showShine
            showShadow
            cardClassName="ring-1 ring-black/10"
            front={<InsuranceFront />}
            back={<InsuranceBack />}
          />
        </Drift>
      </TiltFrame>
    </CategorySection>
  );
}
