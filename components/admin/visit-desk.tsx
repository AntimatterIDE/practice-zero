"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatTime, patientName } from "@/lib/rcm/format";
import { LoadingDesk, PageHeader } from "@/components/admin/rcm/ui";
import { useRcm } from "@/components/admin/rcm/store";

export function VisitDesk() {
  const params = useSearchParams();
  const focus = params.get("appointment") ?? "";
  const { ready, appointments, patients, visitNotes, revealVisitNote } = useRcm();
  if (!ready) return <LoadingDesk />;

  const names = new Map(patients.map((patient) => [patient.id, patientName(patient)]));
  const visits = [...appointments].sort((a, b) => a.start.localeCompare(b.start));

  return (
    <main>
      <PageHeader
        kicker="Clinic"
        title="Visits"
        lede="The 9:00 visit already has a transcript, a note, and codes. Showing them stays in this browser."
      />
      <ul className="mt-8 grid gap-4">
        {visits.map((visit) => {
          const note = visitNotes.find((item) => item.appointmentId === visit.id);
          return (
            <li key={visit.id} className={`rounded-2xl border bg-card p-5 ${focus === visit.id ? "border-oxide" : "border-line"}`}>
              <p className="font-semibold">{names.get(visit.patientId) ?? "Patient"}</p>
              <p className="mt-1 text-sm text-muted">
                {formatTime(visit.start)} · {visit.reason} · {visit.status.replaceAll("_", " ")}
              </p>
              {note ? (
                <div className="mt-4">
                  {note.revealed ? (
                    <div className="grid gap-4">
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
                    <Button type="button" onClick={() => revealVisitNote(note.id)}>
                      Show the note
                    </Button>
                  )}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted">No note for this visit.</p>
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
