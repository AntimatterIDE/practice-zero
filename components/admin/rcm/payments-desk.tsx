"use client";

import Link from "next/link";
import { claimTotal, formatDay, money, patientBalance, patientName } from "@/lib/rcm/format";
import { LoadingDesk, PageHeader, StatusPill } from "@/components/admin/rcm/ui";
import { useRcm } from "@/components/admin/rcm/store";

export function PaymentsDesk() {
  const { ready, claims, patients } = useRcm();
  if (!ready) return <LoadingDesk />;
  const paid = claims.filter(
    (claim) =>
      claim.status === "paid" ||
      (claim.paymentAmount ?? 0) > 0 ||
      (claim.collectedAmount ?? 0) > 0 ||
      (claim.adjustmentAmount ?? 0) > 0 ||
      patientBalance(claim) > 0,
  );
  const names = new Map(patients.map((patient) => [patient.id, patientName(patient)]));

  return (
    <main>
      <PageHeader
        kicker="Billing"
        title="Patient pay & payments"
        lede="Practice fee, what was collected, what the plan paid the practice, and the balance. Nothing is sent to a bank."
      />
      <ul className="mt-8 grid gap-3">
        {paid.length === 0 ? <li className="text-sm text-muted">No payments are on file.</li> : null}
        {paid.map((claim) => (
          <li key={claim.id} className="rounded-2xl border border-line bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{names.get(claim.patientId) ?? "Patient"}</p>
                <p className="mt-1 text-sm text-muted">
                  {claim.payerName} · {formatDay(claim.dateOfService)} · practice fee {money(claimTotal(claim))} · collected{" "}
                  {money(claim.collectedAmount ?? 0)} · plan paid {money(claim.paymentAmount ?? 0)} · balance {money(patientBalance(claim))}
                </p>
                {claim.remitReason ? <p className="mt-2 text-sm">{claim.remitReason}</p> : null}
              </div>
              <StatusPill status={claim.status} />
            </div>
            <Link href={`/try/claims/${claim.id}`} className="mt-3 inline-block text-sm underline">
              Open claim
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
