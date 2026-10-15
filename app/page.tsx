import dynamic from "next/dynamic";
import { Footer11 } from "@/components/blocks/footer-11";
import { BrandIntro } from "@/components/marketing/brand-intro";
import { HomeHero } from "@/components/marketing/home-hero";
import { HomePlatform } from "@/components/marketing/home-platform";
import { HomeZeroOut } from "@/components/marketing/home-zero-out";

const Hero29 = dynamic(() => import("@/components/blocks/hero-29"), {
  loading: () => <section className="min-h-screen w-full bg-paper" aria-hidden="true" />,
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
