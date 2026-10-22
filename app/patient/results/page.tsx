import type { Metadata } from "next";
import { Footer11 } from "@/components/blocks/footer-11";
import { PatientResults } from "@/components/marketing/patient/results";
import { SiteHeader } from "@/components/marketing/site-header";
import { pageOpenGraph } from "@/lib/open-graph";

export const metadata: Metadata = {
  title: "Results",
  description:
    "Paul Wallace’s basic metabolic panel at Southeast Medical, each number in plain language, plus what was decided, what to do tonight, and when to come back.",
  alternates: { canonical: "/patient/results" },
  openGraph: pageOpenGraph({
    title: "Results · practice zero",
    description:
      "Paul Wallace’s basic metabolic panel at Southeast Medical, each number in plain language, plus the after-visit summary.",
    url: "/patient/results",
  }),
};

export default function PatientResultsPage() {
  return (
    <div className="min-h-full bg-paper text-ink">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8">
        <SiteHeader />
      </div>
      <main>
        <PatientResults />
      </main>
      <Footer11 />
    </div>
  );
}
