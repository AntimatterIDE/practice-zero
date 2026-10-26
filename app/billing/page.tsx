import type { Metadata } from "next";
import { Footer11 } from "@/components/blocks/footer-11";
import { BillingLanding } from "@/components/marketing/billing/billing-landing";
import { ClaimsSection } from "@/components/marketing/billing/claims";
import { CoverageSection } from "@/components/marketing/billing/coverage";
import { DemographicsSection } from "@/components/marketing/billing/demographics";
import { EftSection } from "@/components/marketing/billing/eft";
import { EligibilitySection } from "@/components/marketing/billing/eligibility";
import { FeeScheduleSection } from "@/components/marketing/billing/fee-schedule";
import { PayersSection } from "@/components/marketing/billing/payers";
import { CategoryClose } from "@/components/marketing/depth";
import { SiteHeader } from "@/components/marketing/site-header";
import { pageOpenGraph } from "@/lib/open-graph";

export const metadata: Metadata = {
  title: "Billing",
  description:
    "Connect care to collections eligibility, prior auth, claims, patient pay, and remits without another chase.",
  alternates: { canonical: "/billing" },
  openGraph: pageOpenGraph({
    title: "Billing · practice zero",
    description:
      "Connect care to collections eligibility, prior auth, claims, patient pay, and remits without another chase.",
    url: "/billing",
  }),
};

export default function BillingPage() {
  return (
    <div className="min-h-full bg-paper text-ink">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8">
        <SiteHeader />
      </div>
      <main>
        <BillingLanding />
        <FeeScheduleSection />
        <CoverageSection />
        <EligibilitySection />
        <ClaimsSection />
        <EftSection />
        <DemographicsSection />
        <PayersSection />
        <CategoryClose
          title="open the ledger."
          body="Paul Wallace’s $185 fee is collected. The claim is filed out of network."
        />
      </main>
      <Footer11 />
    </div>
  );
}
