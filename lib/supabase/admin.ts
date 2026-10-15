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
};

let cached: SupabaseClient | null = null;

export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !key) {
    throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  if (!cached) {
    cached = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return cached;
}
