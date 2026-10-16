export type ResearchStatus = "draft" | "published" | "archived";

export type ResearchSection = {
  id: string;
  title: string;
  body: string;
};

export type ResearchSource = {
  kind: string;
  year: string;
  title: string;
  url?: string;
};

export type ResearchArticle = {
  id: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  status: ResearchStatus;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string | null;
  cover_credit: string | null;
  search_title: string | null;
  search_description: string | null;
  keywords: string[];
  topic: string | null;
  body_markdown: string;
  sections: ResearchSection[];
  sources: ResearchSource[];
  read_minutes: number;
  author_name: string;
};

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}
