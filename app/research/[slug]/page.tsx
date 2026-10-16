import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer11 } from "@/components/blocks/footer-11";
import { SiteHeader } from "@/components/marketing/site-header";
import { ResearchArticleView } from "@/components/marketing/research/research-article-view";
import { demoPublishedArticles, findDemoArticle } from "@/lib/research/demo";
import { getResearchBySlug, listPublishedResearch } from "@/lib/research/store";
import type { ResearchArticle } from "@/lib/research/types";
import { product } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

async function loadArticle(slug: string): Promise<ResearchArticle | null> {
  try {
    const row = await getResearchBySlug(slug);
    if (row && row.status === "published") return row;
  } catch {
    // demo fallback
  }
  return findDemoArticle(slug);
}

async function loadRelated(current: ResearchArticle): Promise<ResearchArticle[]> {
  try {
    const all = await listPublishedResearch();
    const pool = all.length ? all : demoPublishedArticles;
    return pool.filter((a) => a.id !== current.id).slice(0, 4);
  } catch {
    return demoPublishedArticles.filter((a) => a.id !== current.id).slice(0, 4);
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await loadArticle(slug);
  if (!article) return { title: "Research" };

  // Blog shares use the article cover only — never the site-wide OG image.
  const cover = article.cover_image_url
    ? [{ url: article.cover_image_url, alt: article.title }]
    : [{ url: "/og.png", width: 1200, height: 630, alt: article.title }];

  return {
    title: article.search_title || article.title,
    description: article.search_description || article.excerpt,
    alternates: { canonical: `/research/${article.slug}` },
    openGraph: {
      type: "article",
      siteName: product.name,
      title: article.title,
      description: article.excerpt,
      url: `/research/${article.slug}`,
      images: cover,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: cover.map((img) => img.url),
    },
  };
}

export default async function ResearchArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await loadArticle(slug);
  if (!article) notFound();

  const related = await loadRelated(article);

  return (
    <div className="min-h-full bg-paper text-ink">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8">
        <SiteHeader />
      </div>
      <ResearchArticleView article={article} related={related} />
      <Footer11 />
    </div>
  );
}
