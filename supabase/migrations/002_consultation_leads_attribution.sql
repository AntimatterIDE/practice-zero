-- Attribution fields for cold email, ads, and specialty landers.
-- Paste into the Supabase SQL editor after 001_consultation_leads.sql.

alter table public.consultation_leads
  add column if not exists specialty text,
  add column if not exists campaign text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_content text,
  add column if not exists utm_term text;

create index if not exists consultation_leads_specialty_idx
  on public.consultation_leads (specialty);

create index if not exists consultation_leads_source_idx
  on public.consultation_leads (source);
