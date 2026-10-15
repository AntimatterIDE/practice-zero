"use client";

import Link from "next/link";
import type { Patient } from "@/lib/rcm/types";

export function PortalAccess({ patient }: { patient: Patient }) {
  return (
    <section className="rounded-2xl border border-line bg-card p-5 lg:col-span-2">
      <h2 className="font-display text-2xl tracking-tight">Patient portal</h2>
      <p className="mt-2 text-sm text-muted">The sample chart opens without a password.</p>
      {patient.id === "pt-hale" ? (
        <Link href="/portal" className="mt-4 inline-block text-sm underline">
          Open Jordan Hale's portal
        </Link>
      ) : (
        <p className="mt-4 text-sm text-muted">This demo opens the 9:00 patient's portal.</p>
      )}
    </section>
  );
}
