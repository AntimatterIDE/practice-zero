import type { Metadata } from "next";
import { Footer11 } from "@/components/blocks/footer-11";
import { PatientBills } from "@/components/marketing/patient/bills";
import { SiteHeader } from "@/components/marketing/site-header";
import { pageOpenGraph } from "@/lib/open-graph";

export const metadata: Metadata = {
  title: "What you owe",
  description:
    "Paul Wallace’s $185 practice fee at Southeast Medical, collected, with the claim filed out of network. Nothing is charged.",
  alternates: { canonical: "/patient/bills" },
  openGraph: pageOpenGraph({
    title: "What you owe · practice zero",
    description:
      "Paul Wallace’s $185 practice fee at Southeast Medical, collected, with the claim filed out of network. Nothing is charged.",
    url: "/patient/bills",
  }),
};

export default function PatientBillsPage() {
  return (
    <div className="min-h-full bg-paper text-ink">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8">
        <SiteHeader />
      </div>
      <main>
        <PatientBills />
      </main>
      <Footer11 />
    </div>
  );
}
