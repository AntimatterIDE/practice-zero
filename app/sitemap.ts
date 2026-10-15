import type { MetadataRoute } from "next";
import { canonicalOrigin, isIndexingEnabled } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexingEnabled()) return [];
  const origin = canonicalOrigin();
  return ["/", "/features", "/ehr", "/billing", "/marketing"].map((path) => ({
    url: `${origin}${path === "/" ? "" : path}`,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.6,
  }));
}
