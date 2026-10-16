"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTime, patientName } from "@/lib/rcm/format";
import { LoadingDesk, PageHeader, fieldClass, panelClass, visitLabel } from "@/components/admin/rcm/ui";
import { useRcm } from "@/components/admin/rcm/store";
import type { AppointmentStatus } from "@/lib/rcm/types";
import { cn } from "@/lib/utils";

const statusOrder: AppointmentStatus[] = ["scheduled", "arrived", "in_progress", "completed", "cancelled", "no_show"];

const statusTone: Record<AppointmentStatus, string> = {
  scheduled: "bg-mist text-ink",
  arrived: "bg-amber-50 text-amber-950",
  in_progress: "bg-mint text-oxide-deep",
  completed: "bg-mist text-muted",
  cancelled: "bg-red-50 text-emergency",
  no_show: "bg-red-50 text-emergency",
};

export function VisitDesk() {
  const params = useSearchParams();
  const focus = params.get("appointment") ?? "";
  const { ready, appointments, patients, visitNotes, revealVisitNote } = useRcm();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<AppointmentStatus | "all">("all");

  const names = useMemo(() => new Map(patients.map((patient) => [patient.id, patientName(patient)])), [patients]);
  const visits = useMemo(() => [...appointments].sort((a, b) => a.start.localeCompare(b.start)), [appointments]);

  const counts = useMemo(() => {
    const result = new Map<AppointmentStatus, number>();
    for (const visit of appointments) result.set(visit.status, (result.get(visit.status) ?? 0) + 1);
    return result;
  }, [appointments]);

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase();
    return visits
      .filter((visit) => (filter === "all" ? true : visit.status === filter))
      .filter((visit) => {
        if (!term) return true;
        return [names.get(visit.patientId) ?? "", visit.reason, visit.providerName, visit.room].join(" ").toLowerCase().includes(term);
      });
  }, [visits, filter, query, names]);

  if (!ready) return <LoadingDesk />;

  const chips = statusOrder.filter((status) => (counts.get(status) ?? 0) > 0);

  return (
    <main>
      <PageHeader
        kicker="Clinic"
        title="Visits"
        lede="The 9:00 visit already has a transcript, a note, and codes. Showing them stays in this browser."
      />

      <div className="mt-8 grid gap-3">
        <label className="relative min-w-0 sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" aria-hidden />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search patient, reason, or room"
            className={`${fieldClass} pl-10`}
            aria-label="Search visits"
          />
        </label>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by status">
          {(["all", ...chips] as const).map((item) => {
            const active = filter === item;
            const count = item === "all" ? appointments.length : (counts.get(item) ?? 0);
            return (
              <button
                key={item}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(item)}
                className={cn(
                  "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-sm transition-colors",
                  active ? "border-slash bg-slash text-white" : "border-line hover:border-oxide",
                )}
              >
                {item === "all" ? "All" : visitLabel(item)}
                <span className={cn("text-xs tabular-nums", active ? "text-white/80" : "text-muted")}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {rows.length === 0 ? (
        <p className={`${panelClass} mt-6 text-sm text-muted`}>No visits match.</p>
      ) : (
        <ul className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
          {rows.map((visit) => {
            const note = visitNotes.find((item) => item.appointmentId === visit.id);
            const focused = focus === visit.id;
            return (
              <li key={visit.id} className={cn("px-4 py-3.5", focused && "bg-mist/50 ring-1 ring-inset ring-oxide")}>
                <div className="flex items-start gap-4">
                  <p className="w-16 shrink-0 pt-0.5 font-mono text-xs uppercase tracking-[0.08em] text-muted">
                    {formatTime(visit.start)}
                  </p>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">
                      <Link href={`/try/patients/${visit.patientId}`} className="hover:text-oxide-deep hover:underline">
                        {names.get(visit.patientId) ?? "Patient"}
                      </Link>
                    </p>
                    <p className="mt-0.5 text-sm text-muted">
                      {visit.reason}
                      {visit.room ? ` · ${visit.room}` : ""}
                      {note ? " · Note ready" : ""}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs uppercase tracking-[0.12em]",
                      statusTone[visit.status],
                    )}
                  >
                    {visitLabel(visit.status)}
                  </span>
                </div>
                {note ? (
                  <div className="mt-3 pl-20">
                    {note.revealed ? (
                      <div className="grid gap-4 rounded-xl border border-line p-4">
                        <section>
                          <h2 className="text-sm font-medium">Transcript</h2>
                          <pre className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{note.transcript}</pre>
                        </section>
                        <section>
                          <h2 className="text-sm font-medium">Note</h2>
                          <pre className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{note.note}</pre>
                        </section>
                        <ul className="grid gap-1 text-sm">
                          {note.codes.map((code) => (
                            <li key={code.code}>
                              {code.system} {code.code} · {code.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <Button type="button" variant="secondary" onClick={() => revealVisitNote(note.id)}>
                        Show the note
                      </Button>
                    )}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
