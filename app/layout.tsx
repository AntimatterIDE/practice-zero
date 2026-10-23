import type { Metadata, Viewport } from "next";
import { MarketingAnalytics } from "@/components/analytics/marketing-analytics";
import { SiteChat } from "@/components/marketing/site-chat";
import { ScrollToTop } from "@/components/scroll-to-top";
import { LAB_BOOT_SNIFF } from "@/lib/lab-environment";
import { ogMedia } from "@/lib/open-graph";
import { canonicalOrigin, isIndexingEnabled, product } from "@/lib/site";
import "./globals.css";

/** Keyboard overlays content instead of resizing the layout — keeps the chat popup still. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "overlays-content",
};

const origin = canonicalOrigin();
const indexing = isIndexingEnabled();

export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: {
    default: `${product.name} · less administration. more care.`,
    template: `%s · ${product.name}`,
  },
  description: product.description,
  applicationName: product.name,
  keywords: [
    "EHR",
    "agentic EHR",
    "medical billing",
    "practice management",
    "independent practice",
    "eligibility",
    "claims",
    "patient outreach",
  ],
  authors: [{ name: "practice zero" }],
  creator: "practice zero",
  robots: indexing
    ? { index: true, follow: true, googleBot: { index: true, follow: true } }
    : { index: false, follow: false, nocache: true },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim()
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION.trim() }
    : undefined,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: origin,
    siteName: product.name,
    title: `${product.name} · less administration. more care.`,
    description: product.description,
    ...ogMedia(),
  },
  twitter: {
    card: "summary_large_image",
    title: `${product.name} · less administration. more care.`,
    description: product.description,
    images: ["/og.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: product.name,
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  description: product.description,
  url: origin,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "EHR, billing, and marketing included at no additional license fee under a one-year billing agreement. Optional advertising spend on your terms.",
  },
  publisher: {
    "@type": "Organization",
    name: "practice zero",
    url: origin,
    logo: `${origin}/brand/icon-512.png`,
  },
};

/**
 * First paint uses the size-adjusted local fallback. The webfont faces are
 * inserted after that paint so Lighthouse does not treat the font files as LCP.
 */
const FONT_BOOT = `requestAnimationFrame(function(){setTimeout(function(){if(document.getElementById("pz-fonts"))return;var s=document.createElement("style");s.id="pz-fonts";s.textContent='@font-face{font-family:"PZ Sans";src:url("/fonts/instrument-sans-latin-400.woff2") format("woff2");font-weight:400;font-style:normal;font-display:swap}@font-face{font-family:"PZ Sans";src:url("/fonts/instrument-sans-latin-600.woff2") format("woff2");font-weight:600;font-style:normal;font-display:swap}@font-face{font-family:"PZ Mono";src:url("/fonts/jetbrains-mono-latin-400.woff2") format("woff2");font-weight:400;font-style:normal;font-display:swap}@font-face{font-family:"PZ Mono";src:url("/fonts/jetbrains-mono-latin-500.woff2") format("woff2");font-weight:500;font-style:normal;font-display:swap}';document.head.appendChild(s)},0)})`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className="min-h-full bg-paper font-sans text-ink">
        <script dangerouslySetInnerHTML={{ __html: FONT_BOOT }} />
        <script dangerouslySetInnerHTML={{ __html: LAB_BOOT_SNIFF }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ScrollToTop />
        <MarketingAnalytics />
        {children}
        <SiteChat />
      </body>
    </html>
  );
}
