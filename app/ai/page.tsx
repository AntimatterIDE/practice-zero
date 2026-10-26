import type { Metadata } from "next";
import { Footer11 } from "@/components/blocks/footer-11";
import { AiLanding } from "@/components/marketing/ai/ai-landing";
import { SiteHeader } from "@/components/marketing/site-header";
import { pageOpenGraph } from "@/lib/open-graph";

export const metadata: Metadata = {
  title: "AI · Agentic EHR",
  description:
    "Practice Zero agents run scheduling, claims, payment tracking, and follow-ups so a practice can run with space and optional room hardware, not a full office-manager stack.",
  alternates: { canonical: "/ai" },
  openGraph: pageOpenGraph({
    title: "AI · Agentic EHR · practice zero",
    description:
      "Practice Zero agents run scheduling, claims, payment tracking, and follow-ups so a practice can run with space and optional room hardware, not a full office-manager stack.",
    url: "/ai",
  }),
};

export default function AiPage() {
  return (
    <div className="min-h-full bg-paper text-ink">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8">
        <SiteHeader />
      </div>
      <AiLanding />
      <Footer11 />
    </div>
  );
}
