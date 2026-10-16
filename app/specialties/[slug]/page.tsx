import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer11 } from "@/components/blocks/footer-11";
import { SpecialtyLanding } from "@/components/marketing/specialties/specialty-landing";
import { SiteHeader } from "@/components/marketing/site-header";
import { getSpecialty, specialties } from "@/lib/marketing/specialties";
import { pageOpenGraph } from "@/lib/open-graph";
import { canonicalOrigin } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return specialties.map((specialty) => ({ slug: specialty.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const specialty = getSpecialty(slug);
  if (!specialty) return {};

  return {
    title: specialty.searchTitle,
    description: specialty.searchDescription,
    keywords: specialty.keywords,
    alternates: { canonical: `/specialties/${specialty.slug}` },
    openGraph: pageOpenGraph({
      title: `${specialty.searchTitle} · practice zero`,
      description: specialty.searchDescription,
      url: `/specialties/${specialty.slug}`,
    }),
  };
}

export default async function SpecialtyPage({ params }: Props) {
  const { slug } = await params;
  const specialty = getSpecialty(slug);
  if (!specialty) notFound();

  const origin = canonicalOrigin();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: specialty.searchTitle,
    description: specialty.searchDescription,
    url: `${origin}/specialties/${specialty.slug}`,
    isPartOf: {
      "@type": "WebSite",
      name: "practice zero",
      url: origin,
    },
    about: {
      "@type": "SoftwareApplication",
      name: "practice zero",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
    },
  };

  return (
    <div className="min-h-full bg-paper text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8">
        <SiteHeader />
      </div>
      <main>
        <SpecialtyLanding specialty={specialty} />
      </main>
      <Footer11 />
    </div>
  );
}
