"use client";

import { useParams } from "next/navigation";
import { ClinicFrame } from "@/components/clinic/frame";
import { RcmProvider, useRcm } from "@/components/admin/rcm/store";
import { samplePractice } from "@/lib/rcm/seed";

export default function IntakeTokenPage() {
  return (
    <RcmProvider>
      <IntakeToken />
    </RcmProvider>
  );
}

function IntakeToken() {
  const params = useParams<{ token: string }>();
  const token = typeof params.token === "string" ? params.token : "";
  const { ready, patients } = useRcm();
  const hale = patients.find((patient) => patient.id === "pt-hale");
  const open = token === "intake-hale" && hale;

  return (
    <ClinicFrame kicker={`${samplePractice.physicianName} · Patient form`}>
      <div className="mx-auto max-w-3xl px-5 py-10">
        {!ready ? <p className="text-sm text-muted">Loading the form…</p> : null}
        {ready && !open ? (
          <div className="max-w-xl rounded-3xl border border-line bg-card p-6">
            <p className="kicker text-oxide-deep">{samplePractice.legalName}</p>
            <h1 className="mt-3 font-display text-4xl">This link is not valid.</h1>
            <p className="mt-3 text-muted">The sample form is /intake/intake-hale.</p>
          </div>
        ) : null}
        {open ? (
          <>
            <p className="kicker text-oxide-deep">{samplePractice.legalName}</p>
            <h1 className="mt-3 font-display text-4xl">Before your visit</h1>
            <p className="mt-4 text-xl">Hello, {hale.preferredName || hale.firstName}.</p>
            <p className="mt-3 text-muted">These answers are already on file.</p>
            <dl className="mt-6 grid gap-4">
              {(hale.intakeAnswers ?? []).map((answer) => (
                <div key={answer.label}>
                  <dt className="text-sm text-muted">{answer.label}</dt>
                  <dd className="mt-1">{answer.value}</dd>
                </div>
              ))}
            </dl>
          </>
        ) : null}
      </div>
    </ClinicFrame>
  );
}
