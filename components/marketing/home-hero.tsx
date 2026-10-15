import Link from "next/link";
import { BarChart3, Clock3, ShieldCheck } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { ZeroDevice } from "@/components/marketing/brand-mark";

export function HomeHero() {
  return (
    <div className="bg-paper">
      <div className="relative z-30 mx-auto w-full max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8">
        <MarketingHeader />
      </div>
      <section className="relative px-6 pb-20 pt-16 lg:pb-28 lg:pt-24">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="kicker">The autonomous practice</p>
            <h1 className="mt-6 max-w-[14ch] font-sans text-5xl font-semibold lowercase leading-[1.02] tracking-[-0.04em] text-ink sm:text-6xl lg:text-7xl">
              less administration. more care.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-graphite">
              practice zero connects clinical, financial, and operational work with agents — from the visit to the remittance.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/try"
                prefetch={false}
                className="inline-flex items-center justify-center rounded-full bg-slash px-7 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-oxide-deep"
              >
                Try the demo
              </Link>
              <Link
                href="/features"
                prefetch={false}
                className="inline-flex items-center justify-center rounded-full border border-slash/25 bg-paper px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:border-slash/50 hover:bg-slash/[0.04]"
              >
                See the screens
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6 text-sm text-graphite">
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-slash" aria-hidden="true" />
                Saves hours every day
              </span>
              <span className="inline-flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-slash" aria-hidden="true" />
                Improves revenue & cash flow
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-slash" aria-hidden="true" />
                Writes stay in this browser
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[1.75rem] border border-line bg-card p-5 shadow-[var(--shadow-card)] sm:p-6">
              <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
                <div className="flex items-center gap-3">
                  <ZeroDevice />
                  <div>
                    <p className="text-sm font-semibold text-ink">Jordan Hale</p>
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-graphite">9:00 · room 2 · in progress</p>
                  </div>
                </div>
                <span className="rounded-full bg-slash/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-slash">
                  Live
                </span>
              </div>
              <div className="mt-4 grid gap-3">
                {[
                  ["Scribe", "Listening · transcript ready"],
                  ["Codes", "I10 · Z00.00 · 99203"],
                  ["Claim", "Draft · $185 · queued"],
                ].map(([label, detail]) => (
                  <div key={label} className="flex items-center justify-between rounded-2xl bg-mist px-4 py-3">
                    <span className="text-sm font-medium text-ink">{label}</span>
                    <span className="text-sm text-graphite">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pointer-events-none absolute left-0 top-full z-20 hidden max-w-[12.5rem] -translate-x-3 -translate-y-3 rounded-2xl border border-line bg-card p-3 shadow-xl sm:block lg:-translate-x-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-graphite">Eligibility</p>
              <p className="mt-1 text-sm font-medium text-ink">Pinetree Health · Active</p>
            </div>
            <div className="pointer-events-none absolute bottom-full right-0 z-20 hidden translate-x-3 translate-y-3 rounded-2xl bg-slash px-4 py-3 text-paper shadow-xl sm:block lg:translate-x-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper">Copay</p>
              <p className="mt-1 font-sans text-2xl font-semibold tracking-tight">$25</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
