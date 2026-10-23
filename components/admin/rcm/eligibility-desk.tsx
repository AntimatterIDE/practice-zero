"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { claimTotal, formatWhen, money, patientName } from "@/lib/rcm/format";
import { lookupFee } from "@/lib/rcm/chart";
import { Field, LoadingDesk, PageHeader, fieldClass } from "@/components/admin/rcm/ui";
import { useRcm } from "@/components/admin/rcm/store";

function benefit(value: number | null) {
  return value == null ? "Unknown" : money(value);
}

export function EligibilityDesk() {
  const { ready, patients, eligibility, claims, fees, runCannedEligibility } = useRcm();
  const [patientId, setPatientId] = useState("");
  const [message, setMessage] = useState("");
  const names = new Map(patients.map((patient) => [patient.id, patientName(patient)]));
  const resolved = patientId || "pt-hale";

  function practiceFee(forPatient: string) {
    const related = claims
      .filter((claim) => claim.patientId === forPatient)
      .sort((left, right) => right.dateOfService.localeCompare(left.dateOfService));
    const line = related[0]?.lines.find((item) => item.includeOnBill !== false);
    if (!line) return null;
    return lookupFee(fees, line.cpt)?.fee ?? claimTotal({ lines: [line] });
  }

  if (!ready) return <LoadingDesk />;

  function runEligibility() {
    const saved = runCannedEligibility(resolved);
    setMessage(saved?.summary ?? "No patient was selected.");
  }

  return (
    <main>
      <PageHeader
        kicker="Billing"
        title="Eligibility"
        lede="Out-of-network benefits for this morning. Insurance figures are estimates. Amount due today is the practice fee. Running a check adds a canned result. Nothing leaves this browser."
      />
      <div className="mt-8 grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <form
          className="grid gap-4 rounded-2xl border border-line bg-card p-5"
          onSubmit={(event) => {
            event.preventDefault();
            runEligibility();
          }}
        >
          <Field label="Patient">
            <select className={fieldClass} value={resolved} onChange={(event) => setPatientId(event.target.value)}>
              {patients.map((item) => (
                <option key={item.id} value={item.id}>
                  {patientName(item)}
                </option>
              ))}
            </select>
          </Field>
          <Button type="submit">Run eligibility</Button>
          {message ? <p className="text-sm text-muted">{message}</p> : null}
        </form>
        <ul className="grid gap-3">
          {eligibility.length === 0 ? <li className="text-sm text-muted">No eligibility is on file.</li> : null}
          {eligibility.map((check) => (
            <li key={check.id} className="rounded-2xl border border-line bg-card p-4">
              <p className="font-semibold">{names.get(check.patientId) ?? "Patient"}</p>
              <p className="mt-1 text-sm text-muted">
                {check.payerName} · {formatWhen(check.createdAt)} · {check.active ? "Active" : "Inactive"}
              </p>
              <p className="mt-3 text-sm">{check.summary}</p>
              <p className="mt-2 text-sm text-muted">
                Out of network · deductible remaining {benefit(check.deductibleRemaining)} · coinsurance{" "}
                {check.coinsurance == null ? "unknown" : `${check.coinsurance}%`} · prior auth{" "}
                {check.priorAuthRequired ? "required" : "not required"} · service{" "}
                {check.serviceBenefit == null ? "not confirmed" : check.serviceBenefit ? "is a benefit" : "is not a benefit"}
              </p>
              <p className="mt-2 text-sm">
                Practice fee {practiceFee(check.patientId) == null ? "not on this visit" : money(practiceFee(check.patientId) ?? 0)}.
                Amount due today is the practice fee. Plan figures above are estimates.
              </p>
              <Link href={`/try/patients/${check.patientId}`} className="mt-3 inline-block text-sm underline">
                Open chart
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
