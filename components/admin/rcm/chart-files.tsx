"use client";

import type { ChartDocument, DocumentStatus, Patient } from "@/lib/rcm/types";
import { fieldClass } from "@/components/admin/rcm/ui";

const statuses: DocumentStatus[] = ["missing", "received", "signed"];

export function ChartFiles({
  patient,
  onSave,
}: {
  patient: Patient;
  onSave: (id: string, patch: Partial<Patient>) => void;
}) {
  function setStatus(document: ChartDocument, status: DocumentStatus) {
    onSave(patient.id, {
      documents: patient.documents.map((item) => (item.id === document.id ? { ...item, status } : item)),
    });
  }

  return (
    <ul className="grid gap-3">
      {patient.documents.map((document) => (
        <li key={document.id} className="rounded-2xl border border-line bg-card p-4">
          <p className="font-medium">{document.name}</p>
          {document.note ? <p className="mt-1 text-sm text-muted">{document.note}</p> : null}
          <label className="mt-3 grid max-w-xs gap-2 text-sm">
            <span className="text-muted">Status</span>
            <select className={fieldClass} value={document.status} onChange={(event) => setStatus(document, event.target.value as DocumentStatus)}>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </li>
      ))}
    </ul>
  );
}
