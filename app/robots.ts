import type { MetadataRoute } from "next";
import { canonicalOrigin, isIndexingEnabled } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const origin = canonicalOrigin();

  if (!isIndexingEnabled()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/try/", "/api/", "/portal/", "/sign/"],
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
    host: origin.replace(/^https?:\/\//, ""),
  };
}
