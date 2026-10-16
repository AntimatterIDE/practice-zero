import { ResearchDesk } from "@/components/admin/research-desk";
import { listResearchArticles } from "@/lib/research/store";
import type { ResearchArticle } from "@/lib/research/types";

export const dynamic = "force-dynamic";

export default async function AdminResearchPage() {
  let articles: ResearchArticle[] = [];
  let loadError: string | null = null;

  try {
    articles = await listResearchArticles({ status: "all" });
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Could not load research.";
  }

  return (
    <div>
      {loadError ? (
        <div className="mb-8 rounded-2xl border border-emergency/20 bg-emergency/5 px-5 py-4 text-sm text-emergency">
          {loadError}
          <p className="mt-2 text-graphite">
            Run{" "}
            <code className="font-mono text-xs">supabase/migrations/002_research_articles.sql</code>{" "}
            in the Supabase SQL editor, and confirm the project URL and service
            role key are set on Vercel (see <code className="font-mono text-xs">.env.example</code>).
          </p>
        </div>
      ) : null}
      <ResearchDesk articles={articles} />
    </div>
  );
}
