"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FileSignature, Search } from "lucide-react";
import { formatWhen } from "@/lib/rcm/format";
import type { DemoPacket, DemoPacketStatus } from "@/lib/rcm/types";
import { LoadingDesk, PageHeader, Stat, StatusPill, fieldClass, panelClass } from "@/components/admin/rcm/ui";
import { useRcm } from "@/components/admin/rcm/store";
import { cn } from "@/lib/utils";

const FILTERS: Array<DemoPacketStatus | "all"> = ["all", "open", "signed", "void"];

const statusLabel: Record<DemoPacketStatus, string> = {
  open: "Awaiting signature",
  signed: "Signed",
  void: "Void",
};

function packetTone(status: DemoPacketStatus) {
  if (status === "signed") return "bg-mint text-oxide-deep";
  if (status === "void") return "bg-mist text-muted";
  return "bg-amber-50 text-amber-950";
}

export function PacketStatus({ status }: { status: DemoPacketStatus }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs uppercase tracking-[0.12em]", packetTone(status))}>
      {statusLabel[status]}
    </span>
  );
}

export function AgreementsDesk() {
  const { ready, packets } = useRcm();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<DemoPacketStatus | "all">("all");

  const counts = useMemo(() => {
    const open = packets.filter((p) => p.status === "open").length;
    const signed = packets.filter((p) => p.status === "signed").length;
    const voided = packets.filter((p) => p.status === "void").length;
    return { open, signed, voided, total: packets.length };
  }, [packets]);

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase();
    return packets
      .filter((packet) => (status === "all" ? true : packet.status === status))
      .filter((packet) => {
        if (!term) return true;
        return [packet.title, packet.patientName, packet.email, packet.signerName, statusLabel[packet.status]]
          .join(" ")
          .toLowerCase()
          .includes(term);
      })
      .sort((a, b) => {
        const rank = { open: 0, signed: 1, void: 2 } as const;
        if (rank[a.status] !== rank[b.status]) return rank[a.status] - rank[b.status];
        return a.title.localeCompare(b.title);
      });
  }, [packets, query, status]);

  if (!ready) return <LoadingDesk />;

  return (
    <main>
      <PageHeader
        kicker="Clinic"
        title="Agreements"
        lede="Consents and authorizations waiting on a signature, or already on the chart. Open a packet to read the form and see who signed."
        meta={
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Awaiting" value={String(counts.open)} detail="Need a patient signature" />
            <Stat label="Signed" value={String(counts.signed)} detail="On file in this browser" />
            <Stat label="On desk" value={String(counts.total)} detail={`${counts.voided} void`} />
          </div>
        }
      />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative min-w-0 flex-1 sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" aria-hidden />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, patient, or email"
            className={`${fieldClass} pl-10`}
            aria-label="Search agreements"
          />
        </label>
        <select
          className={`${fieldClass} sm:max-w-52`}
          value={status}
          onChange={(event) => setStatus(event.target.value as DemoPacketStatus | "all")}
          aria-label="Filter by status"
        >
          {FILTERS.map((item) => (
            <option key={item} value={item}>
              {item === "all" ? "All statuses" : statusLabel[item]}
            </option>
          ))}
        </select>
      </div>

      {rows.length === 0 ? (
        <p className={`${panelClass} mt-6 text-sm text-muted`}>No agreements match.</p>
      ) : (
        <ul className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((packet) => (
            <li key={packet.id}>
              <AgreementCard packet={packet} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

function AgreementCard({ packet }: { packet: DemoPacket }) {
  return (
    <Link
      href={`/try/agreements/${packet.id}`}
      className="group flex h-full flex-col justify-between gap-4 rounded-2xl border border-line bg-card p-4 transition-colors hover:border-oxide/40"
    >
      <span className="flex items-start gap-3">
        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-slash/10 text-slash">
          <FileSignature className="size-4" aria-hidden />
        </span>
        <span className="min-w-0">
          <span className="block font-semibold text-ink group-hover:text-oxide-deep">{packet.title}</span>
          <span className="mt-1 block text-sm text-muted">{packet.patientName}</span>
        </span>
      </span>
      <span className="flex flex-wrap items-center justify-between gap-2">
        <PacketStatus status={packet.status} />
        <span className="text-xs text-muted">
          {packet.status === "signed" && packet.signedAt
            ? `Signed ${formatWhen(packet.signedAt)}`
            : packet.status === "open"
              ? "Waiting"
              : "Not in force"}
        </span>
      </span>
    </Link>
  );
}

/** Re-export StatusPill-compatible helper if claim desk patterns need it later. */
export function AgreementStatusPill({ status }: { status: DemoPacketStatus }) {
  return <StatusPill status={status} label={statusLabel[status]} />;
}
