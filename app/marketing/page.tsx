import type { Metadata } from "next";
import { Footer11 } from "@/components/blocks/footer-11";
import { FollowUpSection } from "@/components/marketing/marketing/follow-up";
import { MarketingHero } from "@/components/marketing/marketing/hero";
import { OutreachSection } from "@/components/marketing/marketing/outreach";
import { SchedulingSection } from "@/components/marketing/marketing/scheduling";
import { SeoSection } from "@/components/marketing/marketing/seo";
import { SocialSection } from "@/components/marketing/marketing/social";
import { CategoryClose } from "@/components/marketing/depth";
import { SiteHeader } from "@/components/marketing/site-header";
import { pageOpenGraph } from "@/lib/open-graph";

export const metadata: Metadata = {
  title: "Marketing",
  description:
    "Search, social, and scheduling bring a patient in. Outreach and follow-up pick up after the visit.",
  alternates: { canonical: "/marketing" },
  openGraph: pageOpenGraph({
    title: "Marketing · practice zero",
    description:
      "Search, social, and scheduling bring a patient in. Outreach and follow-up pick up after the visit.",
    url: "/marketing",
  }),
};

export default function MarketingPage() {
  return (
    <div className="min-h-full bg-paper text-ink">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8">
        <SiteHeader />
      </div>
      <MarketingHero />
      <SeoSection />
      <SocialSection />
      <SchedulingSection />
      <OutreachSection />
      <FollowUpSection />
      <CategoryClose
        title="then the practice follows up."
        body="The page and the post brought them in. Anas’s balance text is still in the outbox."
      />
      <Footer11 />
    </div>
  );
}
