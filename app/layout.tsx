import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
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

const sans = localFont({
  src: [
    { path: "./fonts/instrument-sans-latin-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/instrument-sans-latin-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-sans-family",
  // optional avoids long LCP render-delay while the webfont arrives on slow mobile.
  display: "optional",
  adjustFontFallback: "Arial",
  preload: true,
});

const mono = localFont({
  src: [
    { path: "./fonts/jetbrains-mono-latin-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/jetbrains-mono-latin-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-mono-family",
  display: "optional",
  preload: false,
});

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} h-full antialiased`}>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className="min-h-full bg-paper font-sans text-ink">
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
