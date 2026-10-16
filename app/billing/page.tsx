import type { Metadata } from "next";
import { Footer11 } from "@/components/blocks/footer-11";
import { BillingLanding } from "@/components/marketing/billing/billing-landing";
import { SiteHeader } from "@/components/marketing/site-header";
import { pageOpenGraph } from "@/lib/open-graph";

export const metadata: Metadata = {
  title: "Billing",
  description:
    "Connect care to collections — eligibility, prior auth, claims, patient pay, and remits — without another chase.",
  alternates: { canonical: "/billing" },
  openGraph: pageOpenGraph({
    title: "Billing · practice zero",
    description:
      "Connect care to collections — eligibility, prior auth, claims, patient pay, and remits — without another chase.",
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
      </main>
      <Footer11 />
    </div>
  );
}
