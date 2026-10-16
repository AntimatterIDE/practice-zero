import type { Metadata } from "next";
import { canonicalOrigin, product } from "@/lib/site";

const origin = () => canonicalOrigin();

/** Shared iMessage / social media assets — always re-apply on page openGraph overrides. */
export function ogMedia(): NonNullable<Metadata["openGraph"]> {
  const base = origin();
  return {
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "practice zero" }],
    videos: [
      {
        url: `${base}/og/preview.mp4`,
        secureUrl: `${base}/og/preview.mp4`,
        type: "video/mp4",
        width: 1200,
        height: 630,
      },
    ],
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
