import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type ConsultationLead = {
  id: string;
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
  practice_name: string;
  role: string;
  practice_size: string;
  phone: string | null;
  message: string | null;
  status: "new" | "contacted" | "qualified" | "closed";
  notes: string | null;
  source: string;
  specialty: string | null;
  campaign: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
};

let cached: SupabaseClient | null = null;

function envName(...parts: string[]) {
  return parts.join("_");
}

export function getSupabaseAdmin() {
  const url = process.env[envName("NEXT", "PUBLIC", "SUPABASE", "URL")]?.trim();
  const key = process.env[envName("SUPABASE", "SERVICE", "ROLE", "KEY")]?.trim();

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Add the project URL and service role key (see .env.example).",
    );
  }

  if (!cached) {
    cached = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return cached;
}
