import { getSupabaseAdmin, type ConsultationLead } from "@/lib/supabase/admin";
import { LeadsTable } from "@/components/admin/leads-table";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  let leads: ConsultationLead[] = [];
  let loadError: string | null = null;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("consultation_leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) loadError = error.message;
    else leads = (data ?? []) as ConsultationLead[];
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Could not load leads.";
  }

  const newCount = leads.filter((lead) => lead.status === "new").length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slash">Admin</p>
          <h1 className="mt-2 font-sans text-3xl font-semibold lowercase tracking-[-0.03em] text-ink">
            consultation leads
          </h1>
          <p className="mt-2 text-sm text-graphite">
            {leads.length} total{newCount ? ` · ${newCount} new` : ""}
          </p>
        </div>
      </div>

      {loadError ? (
        <div className="mt-8 rounded-2xl border border-emergency/20 bg-emergency/5 px-5 py-4 text-sm text-emergency">
          {loadError}
        </div>
      ) : (
        <div className="mt-8">
          <LeadsTable leads={leads} />
        </div>
      )}
    </div>
  );
}
