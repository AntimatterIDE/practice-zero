import type { Metadata } from "next";
import Pricing12 from "@/components/blocks/pricing-12";
import { Footer11 } from "@/components/blocks/footer-11";
import { SiteHeader } from "@/components/marketing/site-header";
import { pageOpenGraph } from "@/lib/open-graph";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "EHR, billing, and marketing included at no additional license fee when you route collections through PracticeZero under a one-year billing agreement. Optional advertising spend is separate.",
  alternates: { canonical: "/pricing" },
  openGraph: pageOpenGraph({
    title: "Pricing · practice zero",
    description:
      "EHR, billing, and marketing included at no additional license fee. One-year billing agreement. Optional advertising spend on your terms.",
    url: "/pricing",
  }),
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
