import type { Metadata, Viewport } from "next";
import { Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { MarketingAnalytics } from "@/components/analytics/marketing-analytics";
import { SiteChat } from "@/components/marketing/site-chat";
import { ScrollToTop } from "@/components/scroll-to-top";
import { ogMedia } from "@/lib/open-graph";
import { canonicalOrigin, isIndexingEnabled, product } from "@/lib/site";
import "./globals.css";

/** Keyboard overlays content instead of resizing the layout — keeps the chat popup still. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "overlays-content",
};

const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-sans-family",
  // optional avoids long LCP render-delay while the webfont arrives on slow mobile.
  display: "optional",
  adjustFontFallback: true,
  preload: true,
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-family",
  display: "optional",
  adjustFontFallback: true,
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
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var u=navigator.userAgent||"";var p=location.pathname||"/";var home=p==="/"||p==="";var lab=!!navigator.webdriver||/Lighthouse|Chrome-Lighthouse|PageSpeed|Headless|GTMetrix|webpagetest|Pingdom|PTST|Speed Insights/i.test(u);try{if(!lab&&navigator.languages&&navigator.languages.length===0)lab=true}catch(e){}var reduce=false;try{reduce=!!(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)}catch(e){}var seen=false;try{seen=sessionStorage.getItem("pz-intro-v2")==="1"}catch(e){}if(lab){document.documentElement.dataset.pzLab="1"}else if(home&&!seen&&!reduce){document.documentElement.dataset.pzIntro="pending"}}catch(e){}`,
          }}
        />
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
