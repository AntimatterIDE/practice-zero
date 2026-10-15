import dynamic from "next/dynamic";
import { Footer11 } from "@/components/blocks/footer-11";
import { BrandIntro } from "@/components/marketing/brand-intro";
import { HomeHero } from "@/components/marketing/home-hero";
import { HomePlatform } from "@/components/marketing/home-platform";
import { HomeZeroOut } from "@/components/marketing/home-zero-out";

const Hero29 = dynamic(() => import("@/components/blocks/hero-29"), {
  loading: () => (
    <section className="relative flex min-h-screen w-full flex-col bg-paper px-4 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1400px] pt-24">
        <p className="kicker">The autonomous practice</p>
        <h1 className="mt-6 max-w-[14ch] font-sans text-5xl font-semibold lowercase leading-[1.02] tracking-[-0.04em] text-ink sm:text-6xl">
          less administration. more care.
        </h1>
      </div>
    </section>
  ),
});

const HomeMetrics = dynamic(
  () => import("@/components/marketing/home-metrics").then((mod) => mod.HomeMetrics),
  {
    loading: () => (
      <section className="border-t border-line bg-paper px-6 py-20 lg:py-28" aria-hidden="true">
        <div className="mx-auto min-h-[22rem] max-w-6xl rounded-[1.75rem] bg-mist" />
      </section>
    ),
  },
);

export default function HomePage() {
  return (
    <div className="min-h-full bg-paper text-ink">
      <BrandIntro />
      <main>
        <Hero29 />
        <HomeHero />
        <HomePlatform />
        <HomeZeroOut />
        <HomeMetrics />
        <Footer11 />
      </main>
    </div>
  );
}
