import type { MetadataRoute } from "next";
import { canonicalOrigin, isIndexingEnabled } from "@/lib/site";

const paths = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/features", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/ehr", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/billing", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/marketing", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/pricing", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexingEnabled()) return [];

  const origin = canonicalOrigin();
  const now = new Date();

  return paths.map(({ path, priority, changeFrequency }) => ({
    url: `${origin}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
