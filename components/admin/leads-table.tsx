"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ConsultationLead } from "@/lib/supabase/admin";

const statuses: ConsultationLead["status"][] = ["new", "contacted", "qualified", "closed"];

function formatWhen(value: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function LeadsTable({ leads }: { leads: ConsultationLead[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function updateStatus(id: string, status: ConsultationLead["status"]) {
    setBusyId(id);
    try {
      await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-card px-6 py-12 text-center text-sm text-graphite">
        No consultation leads yet. Submissions from `/contact` will show up here.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-card">
      <ul className="divide-y divide-line">
        {leads.map((lead) => (
          <li key={lead.id} className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto]">
            <div>
              <p className="font-medium text-ink">
                {lead.first_name} {lead.last_name}
              </p>
              <p className="mt-1 text-sm text-graphite">{lead.practice_name}</p>
              <p className="mt-3 text-sm">
                <a className="text-slash underline-offset-2 hover:underline" href={`mailto:${lead.email}`}>
                  {lead.email}
                </a>
                {lead.phone ? <span className="text-graphite"> · {lead.phone}</span> : null}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-graphite">
                {lead.role} · {lead.practice_size}
              </p>
              {lead.message ? (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink/80">{lead.message}</p>
              ) : null}
            </div>
            <div className="text-sm text-graphite">
              <p>{formatWhen(lead.created_at)}</p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-slash">{lead.source}</p>
            </div>
            <div>
              <label className="grid gap-2 text-xs font-medium uppercase tracking-[0.14em] text-graphite">
                Status
                <select
                  value={lead.status}
                  disabled={busyId === lead.id}
                  onChange={(event) =>
                    void updateStatus(lead.id, event.target.value as ConsultationLead["status"])
                  }
                  className="rounded-xl border border-line bg-paper px-3 py-2 text-sm normal-case tracking-normal text-ink"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
