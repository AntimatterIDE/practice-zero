import type { Metadata } from "next";
import Pricing12 from "@/components/blocks/pricing-12";
import { Footer11 } from "@/components/blocks/footer-11";
import { SiteHeader } from "@/components/marketing/site-header";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "practice zero is free for EHR, billing, and marketing on a one-year billing agreement at 8% of collections. Optional ad dollars on top.",
};

export default function PricingPage() {
  return (
    <div className="min-h-full bg-paper text-ink">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8">
        <SiteHeader />
      </div>
      <main>
        <Pricing12 />
      </main>
      <Footer11 />
    </div>
  );
}
