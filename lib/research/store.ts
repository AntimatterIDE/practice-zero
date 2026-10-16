import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type {
  ResearchArticle,
  ResearchSection,
  ResearchSource,
  ResearchStatus,
} from "@/lib/research/types";
import { slugify } from "@/lib/research/types";

type Row = {
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
  keywords: string[] | null;
  topic: string | null;
  body_markdown: string;
  sections: ResearchSection[] | unknown;
  sources: ResearchSource[] | unknown;
  read_minutes: number;
  author_name: string;
};

function mapRow(row: Row): ResearchArticle {
  return {
    ...row,
    keywords: row.keywords ?? [],
    sections: Array.isArray(row.sections) ? (row.sections as ResearchSection[]) : [],
    sources: Array.isArray(row.sources) ? (row.sources as ResearchSource[]) : [],
  };
}

export async function listResearchArticles(opts?: {
  status?: ResearchStatus | "all";
  q?: string;
}) {
  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("research_articles")
    .select("*")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false });

  if (opts?.status && opts.status !== "all") {
    query = query.eq("status", opts.status);
  }

  if (opts?.q?.trim()) {
    const q = opts.q.trim();
    query = query.or(
      `title.ilike.%${q}%,excerpt.ilike.%${q}%,topic.ilike.%${q}%,search_description.ilike.%${q}%`,
    );
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data as Row[]).map(mapRow);
}

export async function listPublishedResearch(q?: string) {
  return listResearchArticles({ status: "published", q });
}

export async function getResearchBySlug(slug: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("research_articles")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapRow(data as Row) : null;
}

export async function getResearchById(id: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("research_articles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapRow(data as Row) : null;
}

export type CreateResearchInput = {
  title: string;
  slug?: string;
  excerpt: string;
  topic?: string;
  cover_image_url?: string | null;
  cover_credit?: string | null;
  search_title?: string;
  search_description?: string;
  keywords?: string[];
  body_markdown?: string;
  sections: ResearchSection[];
  sources: ResearchSource[];
  read_minutes?: number;
  status?: ResearchStatus;
};

export async function createResearchArticle(input: CreateResearchInput) {
  const supabase = getSupabaseAdmin();
  const baseSlug = slugify(input.slug || input.title) || "research-note";
  let slug = baseSlug;
  for (let i = 0; i < 5; i++) {
    const { data: existing } = await supabase
      .from("research_articles")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!existing) break;
    slug = `${baseSlug}-${i + 2}`;
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("research_articles")
    .insert({
      title: input.title,
      slug,
      excerpt: input.excerpt,
      topic: input.topic ?? null,
      cover_image_url: input.cover_image_url ?? null,
      cover_credit: input.cover_credit ?? null,
      search_title: input.search_title ?? input.title.slice(0, 60),
      search_description: input.search_description ?? input.excerpt.slice(0, 160),
      keywords: input.keywords ?? [],
      body_markdown: input.body_markdown ?? "",
      sections: input.sections,
      sources: input.sources,
      read_minutes: input.read_minutes ?? 4,
      status: input.status ?? "draft",
      updated_at: now,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapRow(data as Row);
}

export type UpdateResearchInput = Partial<CreateResearchInput> & {
  published_at?: string | null;
};

export async function updateResearchArticle(id: string, input: UpdateResearchInput) {
  const supabase = getSupabaseAdmin();
  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.title !== undefined) patch.title = input.title;
  if (input.slug !== undefined) patch.slug = slugify(input.slug);
  if (input.excerpt !== undefined) patch.excerpt = input.excerpt;
  if (input.topic !== undefined) patch.topic = input.topic;
  if (input.cover_image_url !== undefined) patch.cover_image_url = input.cover_image_url;
  if (input.cover_credit !== undefined) patch.cover_credit = input.cover_credit;
  if (input.search_title !== undefined) patch.search_title = input.search_title;
  if (input.search_description !== undefined) {
    patch.search_description = input.search_description;
  }
  if (input.keywords !== undefined) patch.keywords = input.keywords;
  if (input.body_markdown !== undefined) patch.body_markdown = input.body_markdown;
  if (input.sections !== undefined) patch.sections = input.sections;
  if (input.sources !== undefined) patch.sources = input.sources;
  if (input.read_minutes !== undefined) patch.read_minutes = input.read_minutes;
  if (input.status !== undefined) patch.status = input.status;
  if (input.published_at !== undefined) patch.published_at = input.published_at;

  const { data, error } = await supabase
    .from("research_articles")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapRow(data as Row);
}

export async function publishResearchArticle(id: string) {
  return updateResearchArticle(id, {
    status: "published",
    published_at: new Date().toISOString(),
  });
}

export async function deleteResearchArticle(id: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("research_articles").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
