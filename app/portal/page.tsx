"use client";

import { ClinicFrame } from "@/components/clinic/frame";
import { RcmProvider, useRcm } from "@/components/admin/rcm/store";
import { visitTypeLabel } from "@/lib/rcm/chart";
import { formatWhen, patientName } from "@/lib/rcm/format";
import { samplePractice } from "@/lib/rcm/seed";

export default function PortalPage() {
  return (
    <RcmProvider>
      <ClinicFrame kicker={`${samplePractice.physicianName} · Your record`}>
        <PortalHome />
      </ClinicFrame>
    </RcmProvider>
  );
}

function PortalHome() {
  const { ready, patients, appointments } = useRcm();
  const patient = patients.find((item) => item.id === "pt-hale");
  if (!ready || !patient) return <p className="px-5 py-10 text-sm text-muted">Loading the sample chart…</p>;
  const visits = appointments.filter((visit) => visit.patientId === patient.id);

  return (
    <div className="mx-auto grid max-w-3xl gap-5 px-5 py-10">
      <div>
        <p className="kicker text-oxide-deep">Your record</p>
        <h1 className="mt-2 font-display text-4xl font-medium">Hello, {patient.preferredName || patient.firstName}</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          This is the sample chart for {patientName(patient)} at {samplePractice.legalName}.
        </p>
      </div>
      <section className="rounded-3xl border border-line bg-card p-6">
        <h2 className="font-display text-2xl">On your chart</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted">Date of birth</dt>
            <dd>{patient.dateOfBirth}</dd>
          </div>
          <div>
            <dt className="text-muted">Phone</dt>
            <dd>{patient.phone}</dd>
          </div>
          <div>
            <dt className="text-muted">Coverage</dt>
            <dd>{patient.payerName}</dd>
          </div>
          <div>
            <dt className="text-muted">Record number</dt>
            <dd>{patient.mrn}</dd>
          </div>
        </dl>
      </section>
      <section className="rounded-3xl border border-line bg-card p-6">
        <h2 className="font-display text-2xl">Visit</h2>
        <ul className="mt-4 grid gap-3 text-sm">
          {visits.map((visit) => (
            <li key={visit.id}>
              {formatWhen(visit.start)} · {visitTypeLabel[visit.visitType] ?? visit.visitType} · {visit.reason}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
