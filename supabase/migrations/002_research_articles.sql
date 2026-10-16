-- Practice Zero research / journal articles
-- Paste into the Supabase SQL editor and run.

create table if not exists public.research_articles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  cover_image_url text,
  cover_credit text,
  search_title text,
  search_description text,
  keywords text[] not null default '{}',
  topic text,
  body_markdown text not null default '',
  sections jsonb not null default '[]'::jsonb,
  sources jsonb not null default '[]'::jsonb,
  read_minutes integer not null default 3,
  author_name text not null default 'practice zero'
);

create index if not exists research_articles_status_idx
  on public.research_articles (status);

create index if not exists research_articles_published_at_idx
  on public.research_articles (published_at desc nulls last);

create index if not exists research_articles_slug_idx
  on public.research_articles (slug);

alter table public.research_articles enable row level security;

-- No anon policies. Next.js uses the service role key.
