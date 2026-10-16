import type { Metadata } from "next";
import { Footer11 } from "@/components/blocks/footer-11";
import { SiteHeader } from "@/components/marketing/site-header";
import { ResearchIndex } from "@/components/marketing/research/research-index";
import { demoPublishedArticles } from "@/lib/research/demo";
import { listPublishedResearch } from "@/lib/research/store";
import type { ResearchArticle } from "@/lib/research/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Practice Zero research notes on agentic EHR, room hardware, autonomous scheduling, claims, and payment tracking.",
  alternates: { canonical: "/research" },
};

async function loadArticles(): Promise<ResearchArticle[]> {
  try {
    const rows = await listPublishedResearch();
    if (rows.length > 0) return rows;
  } catch {
    // Fall through to demo notes when Supabase is unset or empty.
  }
  return demoPublishedArticles;
}

export default async function ResearchPage() {
  const articles = await loadArticles();

  return (
    <div className="min-h-full bg-paper text-ink">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8">
        <SiteHeader />
      </div>
      <ResearchIndex articles={articles} />
      <Footer11 />
    </div>
  );
}
