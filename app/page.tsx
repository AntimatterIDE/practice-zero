import dynamic from "next/dynamic";
import { Footer11 } from "@/components/blocks/footer-11";
import { BrandIntro } from "@/components/marketing/brand-intro";
import { HomeHero } from "@/components/marketing/home-hero";

const HomePlatform = dynamic(
  () => import("@/components/marketing/home-platform").then((mod) => mod.HomePlatform),
  { ssr: true },
);
const HomeZeroOut = dynamic(
  () => import("@/components/marketing/home-zero-out").then((mod) => mod.HomeZeroOut),
  { ssr: true },
);
const HomeMetrics = dynamic(
  () => import("@/components/marketing/home-metrics").then((mod) => mod.HomeMetrics),
  { ssr: true },
);

export default function HomePage() {
  return (
    <div className="min-h-full bg-paper text-ink">
      <BrandIntro />
      <main>
        <HomeHero />
        <HomePlatform />
        <HomeZeroOut />
        <HomeMetrics />
        <Footer11 />
      </main>
    </div>
  );
}
