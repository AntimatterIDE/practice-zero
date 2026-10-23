"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckoutPanel } from "@/components/admin/rcm/checkout-panel";
import { LoadingDesk, PageHeader, useClinicToday } from "@/components/admin/rcm/ui";
import { useRcm } from "@/components/admin/rcm/store";
import { Button } from "@/components/ui/button";
import { focusClinicDay } from "@/lib/rcm/chart";
import { checkoutBrief } from "@/lib/rcm/checkout";
import { formatTime, patientName } from "@/lib/rcm/format";

const tools = [
  { href: "/try/scheduling", title: "Schedule", body: "Book the return before the patient leaves the office." },
  { href: "/try/patients", title: "Patients", body: "Chart, coverage, and the outstanding balance." },
  { href: "/try/visits", title: "Visits", body: "Room status and the clinician’s note." },
  { href: "/try/intake", title: "Intake", body: "Forms the patient finishes before they arrive." },
  { href: "/try/agreements", title: "Agreements", body: "Consents still open at the desk." },
  { href: "/try/tasks", title: "Tasks", body: "Calls and open loops for this morning." },
  { href: "/try/eligibility", title: "Eligibility", body: "Out-of-network estimate before the patient is roomed." },
  { href: "/try/payments", title: "Payments", body: "What the plan paid the practice, and what is still due." },
  { href: "/try/people", title: "People", body: "Who is working the desk this morning." },
];

export function DeskManager() {
  const { ready, appointments, patients, claims, visitNotes, practice } = useRcm();
  const today = useClinicToday();
  const [warningOpen, setWarningOpen] = useState(true);
  if (!ready) return <LoadingDesk />;

  const names = new Map(patients.map((patient) => [patient.id, patientName(patient)]));
  const focus = focusClinicDay(
    appointments.map((appointment) => appointment.start.slice(0, 10)),
    today,
  );
  const rows = appointments
    .filter((visit) => visit.start.startsWith(focus) && visit.status !== "cancelled" && visit.status !== "no_show")
    .map((visit) => ({
      visit,
      name: names.get(visit.patientId) ?? "Patient",
      brief: checkoutBrief({ visit, claims, notes: visitNotes, appointments }),
    }))
    .filter((row) => row.brief.atCounter)
    .sort((a, b) => a.visit.start.localeCompare(b.visit.start));
  const waiting = rows.filter((row) => row.brief.needsBooking);

  return (
    <main>
      <PageHeader
        kicker="Practice"
        title="Desk"
        lede={`${practice.legalName}. Collect what was added in the room, and book the return from the note before the patient leaves.`}
      />

      {warningOpen && waiting.length > 0 ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="desk-warning-title"
            className="w-full max-w-md rounded-3xl border border-line bg-card p-6 shadow-[0_24px_60px_-28px_rgb(7_30_54_/_0.7)]"
          >
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-oxide">Before they leave</p>
            <h2 id="desk-warning-title" className="mt-2 font-display text-2xl tracking-tight">
              A return visit is not on the schedule.
            </h2>
            <ul className="mt-4 grid gap-3">
              {waiting.map((row) => (
                <li key={row.visit.id} className="text-sm leading-relaxed">
                  <span className="font-semibold">{row.name}</span>
                  {row.visit.status === "completed" ? " has finished" : " is still in the office"}. The note says {row.brief.followUp}.
                  Book it before they leave, or this patient is gone.
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href={`/try/scheduling?patient=${waiting[0].visit.patientId}`}>Book the return</Link>
              </Button>
              <Button type="button" variant="secondary" onClick={() => setWarningOpen(false)}>
                Stay on the desk
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <section className="mt-8">
        <h2 className="font-display text-2xl tracking-tight">At the counter</h2>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
          Anyone who has arrived, is in a room, or has finished. The same card appears when you hover their visit on the schedule.
          Something added in the room is collected here. It is not on the bill until it is posted.
        </p>
        {rows.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No one is at the counter.</p>
        ) : (
          <ul className="mt-4 grid gap-4 lg:grid-cols-2">
            {rows.map((row) => (
              <li key={row.visit.id} className="rounded-3xl border border-line bg-card p-5">
                <p className="text-sm text-muted">
                  {formatTime(row.visit.start)} · {row.visit.room || "No room"}
                </p>
                <p className="mt-1 text-lg font-semibold">{row.name}</p>
                <div className="mt-4">
                  <CheckoutPanel brief={row.brief} patientName={row.name} patientId={row.visit.patientId} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl tracking-tight">What the desk runs</h2>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
          Practice management for the people at the front desk. Schedule, chart, coverage, and the money, on this morning’s patients.
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => (
            <li key={tool.href}>
              <Link href={tool.href} className="block h-full rounded-2xl border border-line bg-card p-4 hover:border-oxide">
                <p className="font-semibold">{tool.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{tool.body}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
