import type { MetadataRoute } from "next";
import { canonicalOrigin, isIndexingEnabled } from "@/lib/site";
import { listPublishedResearch } from "@/lib/research/store";

const paths = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/ehr", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/billing", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/marketing", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/patient", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/ai", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/research", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/pricing", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isIndexingEnabled()) return [];

  const origin = canonicalOrigin();
  const now = new Date();

  const staticEntries = paths.map(({ path, priority, changeFrequency }) => ({
    url: `${origin}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  let researchEntries: MetadataRoute.Sitemap = [];
  try {
    const articles = await listPublishedResearch();
    researchEntries = articles.map((article) => ({
      url: `${origin}/research/${article.slug}`,
      lastModified: article.updated_at
        ? new Date(article.updated_at)
        : now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // Supabase unset — static paths only
  }

  return [...staticEntries, ...researchEntries];
}
