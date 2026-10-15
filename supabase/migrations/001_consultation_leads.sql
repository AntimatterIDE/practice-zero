-- Practice Zero consultation leads
-- Paste into the Supabase SQL editor and run.

create extension if not exists "pgcrypto";

create table if not exists public.consultation_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  first_name text not null,
  last_name text not null,
  practice_name text not null,
  role text not null,
  practice_size text not null,
  phone text,
  message text,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'qualified', 'closed')),
  notes text,
  source text not null default 'contact'
);

create index if not exists consultation_leads_created_at_idx
  on public.consultation_leads (created_at desc);

create index if not exists consultation_leads_status_idx
  on public.consultation_leads (status);

alter table public.consultation_leads enable row level security;

-- No anon/authenticated policies on purpose.
-- The Next.js API uses the service role key, which bypasses RLS.
