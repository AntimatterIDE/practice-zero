"use client";

import { useMemo, useState } from "react";
import { formatDay, money } from "@/lib/rcm/format";
import { LoadingDesk, PageHeader, fieldClass } from "@/components/admin/rcm/ui";
import { useRcm } from "@/components/admin/rcm/store";

const diagnoses = [
  { code: "M54.5", kind: "ICD-10", label: "Low back pain" },
  { code: "M54.2", kind: "ICD-10", label: "Cervicalgia" },
  { code: "M51.16", kind: "ICD-10", label: "Lumbar disc degeneration" },
  { code: "M47.812", kind: "ICD-10", label: "Spondylosis, cervical region" },
] as const;

export function ToolsDesk() {
  const { ready, fees } = useRcm();
  const [query, setQuery] = useState("");
  const feeMatches = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return fees;
    return fees.filter((item) => `${item.cpt} ${item.description}`.toLowerCase().includes(term));
  }, [fees, query]);
  const diagnosisMatches = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return diagnoses;
    return diagnoses.filter((item) => `${item.code} ${item.label} ${item.kind}`.toLowerCase().includes(term));
  }, [query]);

  if (!ready) return <LoadingDesk />;

  return (
    <main>
      <PageHeader
        kicker="Practice"
        title="Fee schedule"
        lede="Each row is a CPT code, the procedure, and this practice’s cash fee. Charge entry uses these fees. There is no in-network allowed amount."
      />
      <input
        className={`${fieldClass} mt-8 max-w-md`}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search CPT or ICD-10"
        aria-label="Search codes"
      />
      <h2 className="mt-8 font-display text-2xl">Cash fees</h2>
      <ul className="mt-4 divide-y divide-line border-y border-line">
        {feeMatches.length === 0 ? <li className="py-4 text-sm text-muted">No fees match.</li> : null}
        {feeMatches.map((item) => (
          <li key={item.id} className="flex items-baseline justify-between gap-4 py-4 text-sm">
            <span>
              <span className="font-semibold">{item.cpt}</span>
              <span className="text-muted"> · {item.description} · effective {formatDay(item.effectiveDate)}</span>
            </span>
            <span>{money(item.fee)}</span>
          </li>
        ))}
      </ul>
      <h2 className="mt-8 font-display text-2xl">Diagnoses</h2>
      <ul className="mt-4 divide-y divide-line border-y border-line">
        {diagnosisMatches.length === 0 ? <li className="py-4 text-sm text-muted">No diagnoses match.</li> : null}
        {diagnosisMatches.map((item) => (
          <li key={item.code} className="flex items-baseline justify-between gap-4 py-4 text-sm">
            <span>
              <span className="font-semibold">{item.code}</span>
              <span className="text-muted"> · {item.kind} · {item.label}</span>
            </span>
            <span className="text-muted">Diagnosis</span>
          </li>
        ))}
      </ul>
      <section className="mt-8 max-w-2xl border border-line bg-card p-4 text-sm">
        <h2 className="font-display text-2xl">Prior auth watch</h2>
        <p className="mt-3 text-muted">
          MRI lumbar spine (72148) often needs authorization. Confirm the payer rule before scheduling imaging.
        </p>
      </section>
    </main>
  );
}
