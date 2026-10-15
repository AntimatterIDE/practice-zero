import dynamic from "next/dynamic";
import { BrandIntro } from "@/components/marketing/brand-intro";
import { HomeTop } from "@/components/marketing/home-top";

const HomeHero = dynamic(
  () => import("@/components/marketing/home-hero").then((mod) => mod.HomeHero),
  {
    loading: () => (
      <section className="border-t border-line bg-paper px-6 py-20 lg:py-28" aria-hidden="true">
        <div className="mx-auto min-h-[18rem] max-w-6xl rounded-[1.75rem] bg-mist" />
      </section>
    ),
  },
);

const HomePlatform = dynamic(
  () => import("@/components/marketing/home-platform").then((mod) => mod.HomePlatform),
  {
    loading: () => (
      <section className="border-t border-line bg-paper px-6 py-20 lg:py-28" aria-hidden="true">
        <div className="mx-auto min-h-[16rem] max-w-6xl rounded-[1.75rem] bg-mist" />
      </section>
    ),
  },
);

const HomeZeroOut = dynamic(
  () => import("@/components/marketing/home-zero-out").then((mod) => mod.HomeZeroOut),
  {
    loading: () => (
      <section className="border-t border-line bg-mist px-6 py-20 lg:py-28" aria-hidden="true">
        <div className="mx-auto min-h-[16rem] max-w-6xl rounded-[1.75rem] bg-paper/60" />
      </section>
    ),
  },
);

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

const Footer11 = dynamic(
  () => import("@/components/blocks/footer-11").then((mod) => mod.Footer11),
  {
    loading: () => <footer className="min-h-40 bg-ink" aria-hidden="true" />,
  },
);

export default function HomePage() {
  return (
    <div className="min-h-full bg-paper text-ink">
      <BrandIntro />
      <main>
        <HomeTop />
        <HomeHero />
        <HomePlatform />
        <HomeZeroOut />
        <HomeMetrics />
        <Footer11 />
      </main>
    </div>
  );
}
