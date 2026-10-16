import type { Metadata } from "next";
import { OgPreviewScene } from "@/components/marketing/og-preview-scene";

export const metadata: Metadata = {
  title: "OG preview scene",
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Fixed-size capture target for scripts/render-og-preview.mjs.
 * Viewport should be exactly 1200×630 — no chrome, no centering offset.
 */
export default function OgScenePage() {
  return (
    <div className="h-[630px] w-[1200px] overflow-hidden bg-[#F5F4EF]">
      <OgPreviewScene />
    </div>
  );
}
