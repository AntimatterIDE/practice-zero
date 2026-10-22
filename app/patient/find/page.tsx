import type { Metadata } from "next";
import { Footer11 } from "@/components/blocks/footer-11";
import { FindPhysician } from "@/components/marketing/patient/find-physician";
import { SiteHeader } from "@/components/marketing/site-header";
import { pageOpenGraph } from "@/lib/open-graph";

export const metadata: Metadata = {
  title: "Find a physician",
  description:
    "Search Southeast Medical by problem, insurance, or name. Paul Wallace’s coverage is Pinetree Health, with a $25 copay. Illustrative demo — the live patient experience is the portal.",
  alternates: { canonical: "/patient/find" },
  openGraph: pageOpenGraph({
    title: "Find a physician · practice zero",
    description:
      "Search Southeast Medical by problem, insurance, or name. Paul Wallace’s coverage is Pinetree Health, with a $25 copay.",
    url: "/patient/find",
  }),
};

export default function FindPhysicianPage() {
  return (
    <div className="min-h-full bg-paper text-ink">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8">
        <SiteHeader />
      </div>
      <main>
        <FindPhysician />
      </main>
      <Footer11 />
    </div>
  );
}
