import { getSupabaseAdmin, type ConsultationLead } from "@/lib/supabase/admin";
import { AdminPageHeader } from "@/components/admin/admin-page";
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
      <AdminPageHeader
        title="leads"
        lede="Consultation requests from the site, newest first."
        meta={`${leads.length} total${newCount ? ` · ${newCount} new` : ""}`}
      />

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
