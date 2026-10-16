"use client";

import Link from "next/link";
import { patientName } from "@/lib/rcm/format";
import { LoadingDesk, PageHeader } from "@/components/admin/rcm/ui";
import { useRcm } from "@/components/admin/rcm/store";

export function IntakeDesk() {
  const { ready, patients } = useRcm();
  if (!ready) return <LoadingDesk />;
  const hale = patients.find((patient) => patient.id === "pt-hale");

  return (
    <main>
      <PageHeader
        kicker="Clinic"
        title="Intake"
        lede="Paul Wallace already answered the form. The answers stay on the chart."
      />
      {hale ? (
        <section className="mt-8 max-w-2xl rounded-2xl border border-line bg-card p-5">
          <h2 className="font-display text-2xl">{patientName(hale)}</h2>
          <p className="mt-1 text-sm text-muted">Saved answers · /intake/intake-hale</p>
          <dl className="mt-4 grid gap-3 text-sm">
            {(hale.intakeAnswers ?? []).map((answer) => (
              <div key={answer.label}>
                <dt className="text-muted">{answer.label}</dt>
                <dd>{answer.value}</dd>
              </div>
            ))}
          </dl>
          <Link href="/intake/intake-hale" className="mt-4 inline-block text-sm underline">
            Open the patient form
          </Link>
        </section>
      ) : null}
    </main>
  );
}
