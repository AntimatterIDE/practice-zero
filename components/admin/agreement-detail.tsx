"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeft, Copy, ExternalLink, UserRound } from "lucide-react";
import { formatWhen } from "@/lib/rcm/format";
import { LoadingDesk, PageHeader, panelClass } from "@/components/admin/rcm/ui";
import { PacketStatus } from "@/components/admin/agreements-desk";
import { useRcm } from "@/components/admin/rcm/store";
import { Button } from "@/components/ui/button";

export function AgreementDetail({ id }: { id: string }) {
  const { ready, packets } = useRcm();
  const packet = useMemo(() => packets.find((item) => item.id === id), [packets, id]);

  if (!ready) return <LoadingDesk />;
  if (!packet) {
    return (
      <main>
        <PageHeader kicker="Clinic" title="Agreement not found" lede="That packet is not in this browser demo." />
        <Button asChild className="mt-6" variant="secondary">
          <Link href="/try/agreements">Back to agreements</Link>
        </Button>
      </main>
    );
  }

  const signPath = `/sign/${packet.token}`;

  return (
    <main className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="min-w-0">
        <Link
          href="/try/agreements"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          All agreements
        </Link>

        <div className="mt-4">
          <PageHeader
            kicker="Agreement"
            title={packet.title}
            lede={`${packet.patientName} · ${packet.email}`}
            action={<PacketStatus status={packet.status} />}
          />
        </div>

        <section className={`${panelClass} mt-6`}>
          <h2 className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">Document</h2>
          <article className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink">{packet.body}</article>
        </section>
      </div>

      <aside className="grid h-fit gap-4 lg:sticky lg:top-6">
        <section className={panelClass}>
          <h2 className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">Signature</h2>
          {packet.status === "signed" ? (
            <div className="mt-3 space-y-3">
              <p className="font-display text-2xl leading-tight text-ink">{packet.signerName || packet.patientName}</p>
              <p className="text-sm text-muted">
                Signed {packet.signedAt ? formatWhen(packet.signedAt) : "—"}
              </p>
              <div className="rounded-xl border border-dashed border-line bg-mist/40 px-4 py-6 text-center">
                <p
                  className="font-serif text-3xl italic tracking-tight text-ink/80"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  {packet.signerName || packet.patientName}
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-muted">Electronic signature</p>
              </div>
            </div>
          ) : packet.status === "open" ? (
            <div className="mt-3 space-y-3">
              <p className="text-sm leading-relaxed text-muted">
                No signature yet. The patient can sign from the secure link, or you can open it to walk them through it.
              </p>
              <Button asChild className="w-full">
                <Link href={signPath} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2">
                  Open signing page
                  <ExternalLink className="size-3.5" aria-hidden />
                </Link>
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => {
                  const url = `${window.location.origin}${signPath}`;
                  void navigator.clipboard?.writeText(url);
                }}
              >
                <Copy className="size-3.5" aria-hidden />
                Copy signing link
              </Button>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted">This packet is void and is not open for signature.</p>
          )}
        </section>

        <section className={panelClass}>
          <h2 className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">Patient</h2>
          <p className="mt-3 font-semibold text-ink">{packet.patientName}</p>
          <p className="mt-1 text-sm text-muted">{packet.email}</p>
          <Button asChild variant="secondary" className="mt-4 w-full">
            <Link href={`/try/patients/${packet.patientId}`}>
              <UserRound className="size-3.5" aria-hidden />
              Open chart
            </Link>
          </Button>
        </section>

        <section className={panelClass}>
          <h2 className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">Activity</h2>
          <ol className="mt-3 space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-slash" aria-hidden />
              <span>
                <span className="block text-ink">Packet created</span>
                <span className="text-muted">Demo seed · Northline Medical</span>
              </span>
            </li>
            {packet.status === "signed" && packet.signedAt ? (
              <li className="flex gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-oxide" aria-hidden />
                <span>
                  <span className="block text-ink">Signed by {packet.signerName || packet.patientName}</span>
                  <span className="text-muted">{formatWhen(packet.signedAt)}</span>
                </span>
              </li>
            ) : packet.status === "open" ? (
              <li className="flex gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
                <span>
                  <span className="block text-ink">Awaiting patient signature</span>
                  <span className="text-muted">Link ready to send</span>
                </span>
              </li>
            ) : (
              <li className="flex gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neutral-400" aria-hidden />
                <span>
                  <span className="block text-ink">Marked void</span>
                  <span className="text-muted">Not in force</span>
                </span>
              </li>
            )}
          </ol>
        </section>
      </aside>
    </main>
  );
}
