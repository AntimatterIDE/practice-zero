export const product = {
  name: "Practice Zero",
  description: "Practice Zero is an agentic EHR for any independent practice.",
} as const;

export function canonicalOrigin() {
  return process.env.CANONICAL_ORIGIN?.replace(/\/$/, "") || "http://localhost:3000";
}

export function isIndexingEnabled() {
  return process.env.INDEXING_ENABLED?.trim() === "true" && process.env.VERCEL_ENV === "production";
}
