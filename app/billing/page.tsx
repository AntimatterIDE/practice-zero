import type { Metadata } from "next";
import { ChecksSection } from "@/components/marketing/billing/checks";
import { ClaimsSection } from "@/components/marketing/billing/claims";
import { CoverageSection } from "@/components/marketing/billing/coverage";
import { DemographicsSection } from "@/components/marketing/billing/demographics";
import { EftSection } from "@/components/marketing/billing/eft";
import { EligibilitySection } from "@/components/marketing/billing/eligibility";
import { PayersSection } from "@/components/marketing/billing/payers";
import { CategoryClose, CategoryIntro } from "@/components/marketing/depth";
import { SiteHeader } from "@/components/marketing/site-header";

export const metadata: Metadata = {
  title: "Billing",
  description: "Payment from payers, paper checks, coverage, eligibility, claims, and the plan on the chart.",
};

export default function BillingPage() {
  return (
    <div className="min-h-full bg-white text-neutral-950">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8">
        <SiteHeader />
      </div>
      <CategoryIntro
        kicker="Billing"
        title="The money follows the visit."
        lede="Payment from the payer, a paper check, coverage found from a name and a birthday, eligibility, the claim, and the plan on the chart."
      />
      <EftSection />
      <ChecksSection />
      <CoverageSection />
      <DemographicsSection />
      <EligibilitySection />
      <ClaimsSection />
      <PayersSection />
      <CategoryClose title="Open the draft." body="Jordan Hale’s 99203 is queued for $185. It stays in this browser until you submit it." />
    </div>
  );
}
