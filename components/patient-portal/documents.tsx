"use client";

import { useState } from "react";
import { FileUp, Upload } from "lucide-react";

const initial = [
  { id: "d1", name: "Insurance card · front", meta: "Uploaded Oct 12 · PDF", state: "On file" as const },
  { id: "d2", name: "Driver license", meta: "Uploaded Oct 12 · JPG", state: "On file" as const },
  { id: "d3", name: "Prior authorization · PT", meta: "Requested by the practice", state: "Action needed" as const },
];

export function PatientDocuments() {
  const [docs, setDocs] = useState(initial);

  return (
    <div className="mx-auto grid max-w-3xl gap-6">
      <div>
        <p className="kicker">Documents</p>
        <h1 className="mt-3 font-sans text-4xl font-semibold lowercase tracking-[-0.035em] text-ink">
          your files. on your profile.
        </h1>
        <p className="mt-3 max-w-xl text-base text-graphite">
          Upload insurance cards, IDs, and forms so they land on the chart before you arrive.
        </p>
      </div>

      <div className="space-y-3">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-card px-4 py-3.5 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slash/10 text-slash">
                <FileUp className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{doc.name}</p>
                <p className="text-xs text-graphite">{doc.meta}</p>
              </div>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                doc.state === "Action needed" ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {doc.state}
            </span>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            setDocs((current) => [
              {
                id: `d${current.length + 1}`,
                name: "Referral letter",
                meta: "Just added · PDF",
                state: "On file",
              },
              ...current,
            ])
          }
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slash/35 bg-card px-4 py-8 text-sm font-medium text-slash transition-colors hover:bg-slash/[0.04]"
        >
          <Upload className="h-4 w-4" />
          Upload a document to your profile
        </button>
      </div>
    </div>
  );
}
