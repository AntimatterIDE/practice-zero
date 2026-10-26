import { product as brandProduct } from "@/lib/brand";

export const product = {
  name: brandProduct.displayName,
  description:
    "practice zero is an agentic EHR for independent practices chart, billing, and outreach in one morning board.",
} as const;

export function canonicalOrigin() {
  const fromEnv = process.env.CANONICAL_ORIGIN?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(/\/$/, "");
  if (process.env.VERCEL_ENV === "production" && vercel) {
    return `https://${vercel}`;
  }

  // Public production host for practice zero.
  if (process.env.VERCEL_ENV === "production") {
    return "https://www.practicezero.com";
  }

  return "http://localhost:3000";
}

/**
 * Index the marketing site on Vercel production.
 * Preview and local stay noindex unless INDEXING_ENABLED=true.
 * Set NOINDEX=true only if you need to emergency-block production crawl.
 */
export function isIndexingEnabled() {
  if (process.env.NOINDEX?.trim() === "true") return false;
  if (process.env.VERCEL_ENV === "production") return true;
  return process.env.INDEXING_ENABLED?.trim() === "true";
}
