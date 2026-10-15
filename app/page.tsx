import { Footer11 } from "@/components/blocks/footer-11";
import { HomeHero } from "@/components/marketing/home-hero";
import { HomeMetrics } from "@/components/marketing/home-metrics";
import { HomePlatform } from "@/components/marketing/home-platform";
import { HomeZeroOut } from "@/components/marketing/home-zero-out";

export default function HomePage() {
  return (
    <div className="min-h-full bg-paper text-ink">
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
