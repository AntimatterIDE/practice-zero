import type { Metadata } from "next";
import { product } from "@/lib/site";

/** Shared iMessage / social media assets — static image only (no video → no play button). */
export function ogMedia(): NonNullable<Metadata["openGraph"]> {
  return {
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "PZ" }],
  };
}

export function pageOpenGraph(input: {
  title: string;
  description: string;
  url: string;
}): NonNullable<Metadata["openGraph"]> {
  return {
    title: input.title,
    description: input.description,
    url: input.url,
    siteName: product.name,
    ...ogMedia(),
  };
}
