"use client";

import Link from "next/link";
import { ArrowRight, Bell, FileSignature, FolderOpen, MessageSquare, UserRound } from "lucide-react";
import { useRcm } from "@/components/admin/rcm/store";
import { visitTypeLabel } from "@/lib/rcm/chart";
import { formatWhen, patientName } from "@/lib/rcm/format";
import { samplePractice } from "@/lib/rcm/seed";

const shortcuts = [
  { href: "/portal/profile", label: "Profile", body: "Coverage, contacts, preferences", icon: UserRound },
  { href: "/portal/messages", label: "Messages", body: "Talk with the practice", icon: MessageSquare },
  { href: "/portal/documents", label: "Documents", body: "Cards, IDs, and forms", icon: FolderOpen },
  { href: "/portal/updates", label: "Updates", body: "Visits, labs, patient pay", icon: Bell },
] as const;

export function PatientHome() {
  const { ready, patients, appointments, packets } = useRcm();
  const patient = patients.find((item) => item.id === "pt-hale");
  if (!ready || !patient) {
    return <p className="text-sm text-graphite">Loading Paul’s portal…</p>;
  }
  const visits = appointments.filter((visit) => visit.patientId === patient.id).slice(0, 3);
  const toSign = packets.filter((packet) => packet.patientId === patient.id && packet.status === "open");

  return (
    <div className="mx-auto grid max-w-4xl gap-6">
      <div>
        <p className="kicker">Patient experience</p>
        <h1 className="mt-3 font-sans text-4xl font-semibold lowercase tracking-[-0.035em] text-ink sm:text-5xl">
          hello, {patient.preferredName || patient.firstName}.
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-graphite">
          This is how {patientName(patient)} sees {samplePractice.legalName} profile, messages, documents, and updates
          from the same record the practice uses.
        </p>
      </div>

      {toSign.length > 0 ? (
        <section
          className="rounded-2xl border border-slash/40 bg-slash/[0.04] p-5 shadow-[var(--shadow-card)]"
          aria-labelledby="to-sign-heading"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slash/10 text-slash">
              <FileSignature className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="kicker">Action needed</p>
              <h2 id="to-sign-heading" className="mt-1 font-sans text-xl font-semibold lowercase tracking-[-0.02em] text-ink">
                agreements to sign
              </h2>
              <p className="mt-1 text-sm text-graphite">
                {toSign.length === 1 ? "One form is" : `${toSign.length} forms are`} waiting on your signature before your
                visit.
              </p>
            </div>
          </div>
          <ul className="mt-4 divide-y divide-line rounded-xl border border-line bg-card">
            {toSign.map((packet) => (
              <li key={packet.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <span className="text-sm font-medium text-ink">{packet.title}</span>
                <Link
                  href={`/sign/${packet.token}`}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-slash px-4 text-sm font-medium text-white transition-colors hover:bg-oxide-deep"
                >
                  Sign now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        {shortcuts.map(({ href, label, body, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-start gap-3 rounded-2xl border border-line bg-card p-4 shadow-[var(--shadow-card)] transition-colors hover:border-slash/40"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slash/10 text-slash">
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-ink">{label}</span>
                <ArrowRight className="h-4 w-4 text-graphite transition-transform group-hover:translate-x-0.5 group-hover:text-slash" />
              </span>
              <span className="mt-1 block text-sm text-graphite">{body}</span>
            </span>
          </Link>
        ))}
      </div>

      <section className="rounded-2xl border border-line bg-card p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink">Upcoming care</h2>
          <Link href="/portal/updates" className="text-sm font-medium text-slash hover:text-oxide-deep">
            All updates
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-line">
          {visits.map((visit) => (
            <li key={visit.id} className="flex items-start justify-between gap-3 py-3 text-sm first:pt-0 last:pb-0">
              <div>
                <p className="font-medium text-ink">{visitTypeLabel[visit.visitType] ?? visit.visitType}</p>
                <p className="mt-0.5 text-graphite">{visit.reason}</p>
              </div>
              <p className="shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-graphite">
                {formatWhen(visit.start)}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
