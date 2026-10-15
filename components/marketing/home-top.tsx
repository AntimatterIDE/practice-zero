import Link from "next/link";
import { ArrowRight, BarChart3, Clock3, ShieldCheck } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { HeroFunnelMount } from "@/components/blocks/hero-funnel-mount";

const STEPS = [
  { name: "Visits completed", count: 1284 },
  { name: "Charts closed", count: 1102, share: "85.8", left: 182 },
  { name: "Claims submitted", count: 986, share: "89.5", left: 116 },
  { name: "Payments posted", count: 841, share: "85.3", left: 145 },
] as const;

function formatCount(value: number) {
  return value.toLocaleString("en-US");
}

export function HomeTop() {
  return (
    <section
      id="pz-home-hero"
      className="relative isolate flex min-h-screen w-full flex-col overflow-hidden bg-paper px-4 pb-10 pt-6 text-ink sm:px-6 lg:px-8 lg:pb-12"
    >
      <div className="relative z-40 mx-auto w-full max-w-[1400px]">
        <MarketingHeader />
      </div>

      <div
        id="pz-hero-content"
        className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col pt-10 lg:pt-16"
      >
        <div id="pz-hero-copy" className="max-w-[28rem] xl:max-w-[34rem]">
          <p className="kicker">The autonomous practice</p>
          <h1 className="mt-6 max-w-[14ch] font-sans text-5xl font-semibold lowercase leading-[1.02] tracking-[-0.04em] text-ink sm:text-6xl xl:text-7xl">
            less administration. more care.
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-graphite">
            practice zero connects clinical, financial, and operational work with agents — from the visit to the remittance.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-6 lg:mt-auto">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <Link
              href="/try"
              prefetch={false}
              className="inline-flex h-12 items-center justify-center rounded-full bg-slash px-7 text-sm font-medium text-paper transition-colors duration-200 hover:bg-oxide-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slash"
            >
              Try the demo
            </Link>
            <Link
              href="/features"
              prefetch={false}
              className="group inline-flex h-12 items-center gap-2 rounded-full text-sm font-medium text-graphite transition-colors duration-200 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
            >
              See the screens
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-graphite">
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

        {/* Mobile funnel canvas space — opened after WebGL mounts so LCP stays on the headline. */}
        <div id="pz-hero-band" aria-hidden="true" className="pz-hero-band shrink-0 lg:hidden" />

        <ol
          id="pz-hero-steps"
          aria-label="Revenue cycle steps"
          className="mt-7 flex flex-col gap-1 lg:pointer-events-none lg:absolute lg:inset-0 lg:m-0 lg:pt-28"
        >
          {STEPS.map((step, index) => {
            const selected = index === 1;
            return (
              <li key={step.name} className="contents">
                <button
                  type="button"
                  data-funnel-step={index}
                  aria-pressed={selected}
                  className="group flex w-full cursor-pointer items-center rounded-md py-1.5 text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current lg:absolute lg:w-auto lg:-translate-y-1/2 lg:py-1 lg:pointer-events-auto"
                >
                  <span
                    aria-hidden="true"
                    className={`mr-4 hidden h-px flex-1 transition-colors duration-500 lg:block ${
                      selected ? "bg-slash" : "bg-ink/15"
                    }`}
                  />
                  <span className="flex w-full flex-col lg:w-56 lg:shrink-0">
                    <span
                      className={`flex items-baseline justify-between gap-4 text-sm font-medium ${
                        selected ? "text-ink" : "text-graphite"
                      }`}
                    >
                      {step.name}
                      <span className="tabular-nums">{formatCount(step.count)}</span>
                    </span>
                    <span
                      className={`mt-0.5 whitespace-nowrap text-xs tabular-nums ${
                        selected && index > 0 ? "text-slash" : "text-graphite"
                      }`}
                    >
                      {index === 0
                        ? "This week, updating live"
                        : `${"share" in step ? step.share : ""}% continued · ${formatCount(
                            "left" in step ? step.left : 0,
                          )} still open`}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <HeroFunnelMount />
    </section>
  );
}
