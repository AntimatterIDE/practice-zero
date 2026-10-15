"use client";

import Link from "next/link";
import { formatWhen } from "@/lib/rcm/format";
import { LoadingDesk, PageHeader } from "@/components/admin/rcm/ui";
import { useRcm } from "@/components/admin/rcm/store";

export function AgreementsDesk() {
  const { ready, packets } = useRcm();
  if (!ready) return <LoadingDesk />;
  const unsigned = packets.filter((packet) => packet.status === "open");

  return (
    <main>
      <PageHeader
        kicker="Clinic"
        title="Agreements"
        lede={unsigned.length ? "One agreement is still unsigned." : "Every agreement on file is signed."}
      />
      <ul className="mt-8 grid gap-4">
        {packets.map((packet) => (
          <li key={packet.id} className="rounded-2xl border border-line bg-card p-5">
            <p className="font-semibold">{packet.title}</p>
            <p className="mt-1 text-sm text-muted">
              {packet.patientName} · {packet.status === "signed" ? `Signed ${packet.signedAt ? formatWhen(packet.signedAt) : ""}` : "Waiting for a signature"}
            </p>
            <article className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">{packet.body}</article>
            {packet.status === "open" ? (
              <Link href={`/sign/${packet.token}`} className="mt-4 inline-block text-sm underline">
                Open the signing link
              </Link>
            ) : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
