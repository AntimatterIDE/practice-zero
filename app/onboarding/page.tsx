import type { Metadata } from "next";
import { Footer11 } from "@/components/blocks/footer-11";
import { OnboardingLanding } from "@/components/marketing/onboarding/onboarding-landing";
import { SiteHeader } from "@/components/marketing/site-header";
import { pageOpenGraph } from "@/lib/open-graph";

export const metadata: Metadata = {
  title: "Onboarding",
  description:
    "White-glove onboarding with engineers and managers: unlimited hours until your practice is ready, custom integrations, a free practice website, lightspeed feature turnaround, and 24/7 support for the life of your contract.",
  alternates: { canonical: "/onboarding" },
  openGraph: pageOpenGraph({
    title: "Onboarding · practice zero",
    description:
      "Unlimited onboarding hours, custom integrations, practice-specific components, a free website, and 24/7 support for the life of your contract.",
    url: "/onboarding",
  }),
};

export default function OnboardingPage() {
  return (
    <div className="min-h-full bg-paper text-ink">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8">
        <SiteHeader />
      </div>
      <main>
        <OnboardingLanding />
      </main>
      <Footer11 />
    </div>
  );
}
