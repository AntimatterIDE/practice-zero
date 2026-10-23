"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { claimTotal, formatDay, money, patientBalance, patientName } from "@/lib/rcm/format";
import { LoadingDesk } from "@/components/admin/rcm/ui";
import { useRcm } from "@/components/admin/rcm/store";

export default function StatementPage() {
  const params = useParams<{ id: string }>();
  const id = typeof params.id === "string" ? params.id : "";
  const { ready, claims, patients, practice } = useRcm();
  const claim = claims.find((item) => item.id === id);
  const patient = patients.find((item) => item.id === claim?.patientId);
  if (!ready) return <LoadingDesk />;
  if (!claim || !patient) return <p>Claim not found.</p>;
  const balance = patientBalance(claim);

  return (
    <main className="mx-auto max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emergency">Not sent</p>
      <h1 className="mt-2 font-display text-4xl">Patient statement</h1>
      <p className="mt-2 text-sm text-muted">{practice.legalName}. This preview is generated here. It is not a bill that was mailed.</p>
      <p className="mt-6 text-sm">{patientName(patient)} · date of service {formatDay(claim.dateOfService)} · {claim.controlNumber}</p>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div><dt className="text-muted">Practice fee</dt><dd>{money(claimTotal(claim))}</dd></div>
        <div><dt className="text-muted">Collected at the visit</dt><dd>{money(claim.collectedAmount ?? 0)}</dd></div>
        <div><dt className="text-muted">Plan paid the practice</dt><dd>{claim.paymentAmount == null ? "No remit yet" : money(claim.paymentAmount)}</dd></div>
        <div><dt className="text-muted">Balance</dt><dd>{money(balance)}</dd></div>
      </dl>
      {claim.remitReason ? <p className="mt-4 text-sm">{claim.remitReason}</p> : null}
      {claim.adjustmentAmount ? <p className="mt-2 text-sm text-muted">Write-off recorded: {money(claim.adjustmentAmount)}</p> : null}
      <div className="mt-6 flex gap-3 print:hidden">
        <button type="button" className="rounded-full bg-oxide px-4 py-2 text-sm text-white" onClick={() => window.print()}>Print</button>
        <Link href={`/try/claims/${claim.id}`} className="text-sm underline">Back</Link>
      </div>
    </main>
  );
}
