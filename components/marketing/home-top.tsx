import Link from "next/link";
import { ArrowRight, BarChart3, Clock3, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { ComplianceBadges } from "@/components/marketing/compliance-badges";
import { MobileHeroSky } from "@/components/marketing/mobile-hero-sky";

export function HomeTop() {
  return (
    <section
      id="pz-home-hero"
      className="relative isolate flex min-h-screen w-full flex-col bg-[#E7ECFB] px-4 pb-10 pt-6 text-ink sm:px-6 lg:px-8 lg:pb-12"
    >
      {/* No overflow-x-clip on this section — it breaks sticky hide-on-scroll for the header. */}
      <MobileHeroSky />
      <div className="relative z-50 mx-auto w-full max-w-[1400px]">
        <SiteHeader />
      </div>

      {/*
        Copy / CTAs sit in a pointer-events-none shell. Interactive children opt
        back in.
      */}
      <div
        id="pz-hero-content"
        className="pointer-events-none relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col pt-10 lg:pt-16"
      >
        <div id="pz-hero-copy" className="pointer-events-auto max-w-[28rem] xl:max-w-[34rem]">
          <p className="kicker">The autonomous practice</p>
          <h1 className="mt-6 max-w-[14ch] font-sans text-5xl font-semibold lowercase leading-[1.02] tracking-[-0.04em] text-ink sm:text-6xl xl:text-7xl">
            less administration. more care.
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-graphite">
            practice zero connects clinical, financial, and operational work with agents — from the visit to the remittance.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-6">
          <div className="pointer-events-auto flex w-fit max-w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <Link
              href="/try"
              prefetch={false}
              className="inline-flex h-12 items-center justify-center rounded-full bg-slash px-7 text-sm font-medium text-paper transition-colors duration-200 hover:bg-oxide-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slash"
            >
              Try the demo
            </Link>
            <Link
              href="/portal"
              prefetch={false}
              className="group inline-flex h-12 items-center gap-2 rounded-full text-sm font-medium text-graphite transition-colors duration-200 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
            >
              See patient experience
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="pointer-events-auto flex w-fit max-w-xl flex-wrap gap-x-8 gap-y-3 text-sm text-graphite">
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
          <ComplianceBadges className="pointer-events-auto mt-1 max-w-xl opacity-90" />
        </div>
      </div>
    </section>
  );
}
