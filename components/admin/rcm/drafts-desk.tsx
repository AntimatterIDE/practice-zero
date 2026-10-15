"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { claimTotal, formatDay, money, patientName } from "@/lib/rcm/format";
import { LoadingDesk, PageHeader, StatusPill } from "@/components/admin/rcm/ui";
import { useRcm } from "@/components/admin/rcm/store";

export function DraftsDesk() {
  const { ready, claims, patients, submitLocalClaim } = useRcm();
  const [message, setMessage] = useState("");
  const [messageClaim, setMessageClaim] = useState("");
  if (!ready) return <LoadingDesk />;

  const drafts = claims.filter((claim) => claim.status === "draft");
  const names = new Map(patients.map((patient) => [patient.id, patientName(patient)]));

  return (
    <main>
      <PageHeader
        kicker="Billing"
        title="Drafts"
        lede="The claim from this morning's visit is waiting. Submit moves it through draft, submitted, and accepted in this browser."
      />
      <ul className="mt-8 grid gap-4">
        {drafts.length === 0 ? <li className="text-sm text-muted">No drafts. Create a claim or import a CSV.</li> : null}
        {drafts.map((claim) => (
          <li key={claim.id} className="border border-line bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{names.get(claim.patientId) ?? "Unknown patient"}</p>
                <p className="mt-1 text-sm text-muted">
                  {claim.payerName} · {formatDay(claim.dateOfService)} · {money(claimTotal(claim))} · {claim.source}
                </p>
                {claim.agentNote ? <p className="mt-3 max-w-xl text-sm">{claim.agentNote}</p> : null}
              </div>
              <StatusPill status={claim.status} />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                type="button"
                onClick={() => {
                  setMessageClaim(claim.id);
                  setMessage(submitLocalClaim(claim.id));
                }}
              >
                Submit
              </Button>
              <Button asChild variant="secondary">
                <Link href={`/try/claims/${claim.id}`}>Open claim</Link>
              </Button>
            </div>
            {message && messageClaim === claim.id ? <p className="mt-3 text-sm text-muted">{message}</p> : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
