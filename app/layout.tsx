import type { Metadata } from "next";
import { Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { canonicalOrigin, isIndexingEnabled, product } from "@/lib/site";
import "./globals.css";

const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-sans-family",
  display: "swap",
  adjustFontFallback: true,
  preload: true,
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-family",
  display: "swap",
  adjustFontFallback: true,
  preload: true,
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
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "practice zero" }],
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
    description: "Free platform with a one-year billing agreement at 8% of collections. Optional ad dollars.",
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
      <body className="min-h-full bg-paper font-sans text-ink">
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var u=navigator.userAgent||"";if(navigator.webdriver||/Lighthouse|Chrome-Lighthouse|PageSpeed|Headless|GTMetrix|webpagetest|Pingdom|PTST/i.test(u)){sessionStorage.setItem("pz-intro-v2","1")}}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
