import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Practice Zero",
    short_name: "Practice Zero",
    description: "The agentic EHR for independent practices.",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F4EF",
    theme_color: "#111418",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/brand/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
