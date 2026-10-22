import type { Metadata } from "next";
import { Footer11 } from "@/components/blocks/footer-11";
import { PatientPrepare } from "@/components/marketing/patient/prepare";
import { SiteHeader } from "@/components/marketing/site-header";
import { pageOpenGraph } from "@/lib/open-graph";

export const metadata: Metadata = {
  title: "Before you arrive",
  description:
    "Thursday at 9:00 for Paul Wallace at Southeast Medical — sign the open agreement, confirm intake, upload the insurance card, and arrive early.",
  alternates: { canonical: "/patient/prepare" },
  openGraph: pageOpenGraph({
    title: "Before you arrive · practice zero",
    description:
      "Thursday at 9:00 for Paul Wallace at Southeast Medical — sign the open agreement, confirm intake, upload the insurance card, and arrive early.",
    url: "/patient/prepare",
  }),
};

export default function PatientPreparePage() {
  return (
    <div className="min-h-full bg-paper text-ink">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8">
        <SiteHeader />
      </div>
      <main>
        <PatientPrepare />
      </main>
      <Footer11 />
    </div>
  );
}
