import type { ResearchArticle } from "@/lib/research/types";
import { publishedResearchCatalog } from "@/lib/research/catalog";

/** Shown on /research when Supabase has no published notes yet. */
export const demoPublishedArticles: ResearchArticle[] = publishedResearchCatalog;

export function findDemoArticle(slug: string) {
  return demoPublishedArticles.find((a) => a.slug === slug) ?? null;
}
