"use client";

import { PageHeader, panelClass } from "@/components/admin/rcm/ui";
import { useRcm } from "@/components/admin/rcm/store";
import type { DemoRequestStatus } from "@/lib/rcm/types";

function when(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

const nextStatus: Record<DemoRequestStatus, { status: DemoRequestStatus; label: string }[]> = {
  new: [
    { status: "reached", label: "Mark reached" },
    { status: "closed", label: "Close" },
  ],
  reached: [
    { status: "new", label: "Mark new" },
    { status: "closed", label: "Close" },
  ],
  closed: [{ status: "new", label: "Reopen" }],
};

export function ConsultationDesk() {
  const { requests, setRequestStatus } = useRcm();

  return (
    <div className="grid gap-8">
      <PageHeader kicker="Clinic" title="Requests" lede="People leave a name and a way to reach them. Status changes stay in this browser." />
      {requests.length === 0 ? <p className={`${panelClass} text-sm text-muted`}>No requests yet.</p> : null}
      <ul className="grid gap-4">
        {requests.map((request) => (
          <li key={request.id} className={panelClass}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl leading-tight">{request.name}</h2>
                <p className="mt-1 text-sm text-muted">
                  {when(request.createdAt)} · {request.kind === "consultation" ? "Consultation" : "General question"} · {request.status}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {nextStatus[request.status].map((action) => (
                  <button
                    key={action.status}
                    type="button"
                    className="inline-flex min-h-11 items-center rounded-full border border-line px-3 text-sm font-medium hover:border-oxide"
                    onClick={() => setRequestStatus(request.id, action.status)}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed">{request.message}</p>
            <p className="mt-3 text-sm text-muted">
              {request.email} · {request.phone}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
