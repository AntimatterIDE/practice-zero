"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Mail, Phone, Search } from "lucide-react";
import { LoadingDesk, PageHeader, Stat, fieldClass, panelClass } from "@/components/admin/rcm/ui";
import { useRcm } from "@/components/admin/rcm/store";
import type { DemoRequest, DemoRequestStatus } from "@/lib/rcm/types";
import { cn } from "@/lib/utils";

function when(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

const FILTERS: Array<DemoRequestStatus | "all"> = ["all", "new", "reached", "closed"];

const statusLabel: Record<DemoRequestStatus, string> = {
  new: "New",
  reached: "Reached",
  closed: "Closed",
};

const statusHint: Record<DemoRequestStatus, string> = {
  new: "Needs a first reply",
  reached: "Someone has been in touch",
  closed: "Nothing more to do",
};

const statusTone: Record<DemoRequestStatus, string> = {
  new: "bg-amber-50 text-amber-950",
  reached: "bg-mist text-oxide-deep",
  closed: "bg-mint text-oxide-deep",
};

const rank: Record<DemoRequestStatus, number> = { new: 0, reached: 1, closed: 2 };

const kindLabel: Record<DemoRequest["kind"], string> = {
  consultation: "Consultation",
  question: "General question",
};

const nextStatus: Record<DemoRequestStatus, { status: DemoRequestStatus; label: string; primary?: boolean }[]> = {
  new: [
    { status: "reached", label: "Mark reached", primary: true },
    { status: "closed", label: "Close" },
  ],
  reached: [
    { status: "closed", label: "Close", primary: true },
    { status: "new", label: "Mark new" },
  ],
  closed: [{ status: "new", label: "Reopen", primary: true }],
};

function RequestStatus({ status }: { status: DemoRequestStatus }) {
  return (
    <span className={cn("inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs uppercase tracking-[0.12em]", statusTone[status])}>
      {statusLabel[status]}
    </span>
  );
}

export function ConsultationDesk() {
  const { ready, requests, setRequestStatus } = useRcm();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<DemoRequestStatus | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const counts = useMemo(
    () => ({
      new: requests.filter((r) => r.status === "new").length,
      reached: requests.filter((r) => r.status === "reached").length,
      closed: requests.filter((r) => r.status === "closed").length,
    }),
    [requests],
  );

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase();
    return requests
      .filter((request) => (status === "all" ? true : request.status === status))
      .filter((request) => {
        if (!term) return true;
        return [request.name, request.email, request.phone, request.message, kindLabel[request.kind]]
          .join(" ")
          .toLowerCase()
          .includes(term);
      })
      .sort((a, b) => rank[a.status] - rank[b.status] || b.createdAt.localeCompare(a.createdAt));
  }, [requests, query, status]);

  if (!ready) return <LoadingDesk />;

  return (
    <div className="grid gap-8">
      <PageHeader
        kicker="Clinic"
        title="Requests"
        lede="People leave a name and a way to reach them. Open a request to read the message and move it along. Status changes stay in this browser."
        meta={
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="New" value={String(counts.new)} detail={statusHint.new} />
            <Stat label="Reached" value={String(counts.reached)} detail={statusHint.reached} />
            <Stat label="Closed" value={String(counts.closed)} detail={statusHint.closed} />
          </div>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative min-w-0 flex-1 sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" aria-hidden />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, email, or message"
            className={`${fieldClass} pl-10`}
            aria-label="Search requests"
          />
        </label>
        <select
          className={`${fieldClass} sm:max-w-52`}
          value={status}
          onChange={(event) => setStatus(event.target.value as DemoRequestStatus | "all")}
          aria-label="Filter by status"
        >
          {FILTERS.map((item) => (
            <option key={item} value={item}>
              {item === "all" ? "All statuses" : statusLabel[item]}
            </option>
          ))}
        </select>
      </div>

      {requests.length === 0 ? (
        <p className={`${panelClass} text-sm text-muted`}>
          No requests yet. When someone fills in the contact form on the site, they will show up here.
        </p>
      ) : rows.length === 0 ? (
        <p className={`${panelClass} text-sm text-muted`}>No requests match.</p>
      ) : (
        <ul className="grid gap-3">
          {rows.map((request) => {
            const open = openId === request.id;
            const panelId = `request-${request.id}`;
            return (
              <li
                key={request.id}
                className={cn(
                  "rounded-2xl border bg-card transition-colors",
                  open ? "border-oxide/50" : "border-line hover:border-oxide/30",
                )}
              >
                <button
                  type="button"
                  className="flex w-full items-start gap-3 rounded-2xl p-4 text-left"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenId(open ? null : request.id)}
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="font-semibold text-ink">{request.name}</span>
                      <span className="text-xs text-muted">
                        {kindLabel[request.kind]} · {when(request.createdAt)}
                      </span>
                    </span>
                    {open ? null : (
                      <span className="mt-1 block truncate text-sm text-muted">{request.message}</span>
                    )}
                  </span>
                  <RequestStatus status={request.status} />
                  <ChevronDown
                    className={cn("mt-1 size-4 shrink-0 text-muted transition-transform", open && "rotate-180")}
                    aria-hidden
                  />
                </button>
                {open ? (
                  <div id={panelId} className="grid gap-4 border-t border-line p-4">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{request.message}</p>
                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                      <a href={`mailto:${request.email}`} className="inline-flex items-center gap-2 text-oxide-deep hover:underline">
                        <Mail className="size-4" aria-hidden />
                        {request.email}
                      </a>
                      {request.phone ? (
                        <a href={`tel:${request.phone}`} className="inline-flex items-center gap-2 text-oxide-deep hover:underline">
                          <Phone className="size-4" aria-hidden />
                          {request.phone}
                        </a>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {nextStatus[request.status].map((action) => (
                        <button
                          key={action.status}
                          type="button"
                          className={cn(
                            "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium",
                            action.primary
                              ? "border-slash bg-slash text-white hover:bg-oxide-deep"
                              : "border-line hover:border-oxide",
                          )}
                          onClick={() => setRequestStatus(request.id, action.status)}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
