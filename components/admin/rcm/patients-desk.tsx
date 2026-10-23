"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ageFromDob, chartGaps, withChart } from "@/lib/rcm/chart";
import { formatDay, formatTime, patientName } from "@/lib/rcm/format";
import type { Patient, PatientInput, Sex } from "@/lib/rcm/types";
import { MemberCard } from "@/components/admin/bits/surface";
import { Field, LoadingDesk, PageHeader, fieldClass, panelClass, useClinicToday } from "@/components/admin/rcm/ui";
import { useRcm } from "@/components/admin/rcm/store";

const emptyForm: PatientInput = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  sex: "unknown",
  memberId: "",
  payerName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "GA",
  postalCode: "",
};

export function PatientsDesk() {
  const router = useRouter();
  const { ready, patients, appointments, rememberPatient, syncError } = useRcm();
  const today = useClinicToday();
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<PatientInput>(emptyForm);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase();
    return patients.filter((patient) => {
      if (!term) return true;
      return [
        patientName(patient),
        patient.preferredName,
        patient.mrn,
        patient.phone,
        patient.memberId,
        patient.payerName,
        patient.email,
        ...patient.cases.flatMap((item) => [item.caseNumber, item.claimNumber, item.attorneyName, item.attorneyFirm]),
      ]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [patients, query]);

  if (!ready) return <LoadingDesk />;

  function update<K extends keyof PatientInput>(key: K, value: PatientInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("Enter a first and last name.");
      return;
    }
    setSaving(true);
    setError("");
    const patient: Patient = {
      ...withChart({
        ...form,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        payerName: form.payerName.trim() || "Self-pay",
      }),
      id: `p_${crypto.randomUUID().slice(0, 8)}`,
      createdAt: new Date().toISOString(),
      mrn: "",
    };
    rememberPatient(patient);
    setSaving(false);
    setForm(emptyForm);
    router.push(`/try/patients/${patient.id}`);
  }

  return (
    <main>
      <PageHeader
        kicker="Practice"
        title="Patients"
        lede="Charts in this demo stay in the browser."
        action={
          <Button type="button" variant="secondary" onClick={() => setAdding((open) => !open)}>
            {adding ? "Close" : "New patient"}
          </Button>
        }
      />
      {syncError ? (
        <p role="alert" className="mt-4 text-sm text-emergency">
          {syncError}
        </p>
      ) : null}
      {adding ? (
        <form onSubmit={onSubmit} className={`${panelClass} mt-8 grid gap-4 sm:grid-cols-2`}>
          <div className="sm:col-span-2">
            <h2 className="font-display text-2xl tracking-tight">New patient</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Fill this out at the desk. The chart is saved in this browser. Email and address can be added on the chart after.
            </p>
          </div>
          <Field label="First name">
            <input className={fieldClass} value={form.firstName} onChange={(event) => update("firstName", event.target.value)} required />
          </Field>
          <Field label="Last name">
            <input className={fieldClass} value={form.lastName} onChange={(event) => update("lastName", event.target.value)} required />
          </Field>
          <Field label="Date of birth">
            <input className={fieldClass} type="date" value={form.dateOfBirth} onChange={(event) => update("dateOfBirth", event.target.value)} required />
          </Field>
          <Field label="Sex">
            <select className={fieldClass} value={form.sex} onChange={(event) => update("sex", event.target.value as Sex)}>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
              <option value="unknown">Unknown</option>
            </select>
          </Field>
          <Field label="Payer">
            <input className={fieldClass} value={form.payerName} onChange={(event) => update("payerName", event.target.value)} placeholder="Aetna" />
          </Field>
          <Field label="Member id">
            <input className={fieldClass} value={form.memberId} onChange={(event) => update("memberId", event.target.value)} />
          </Field>
          <Field label="Phone">
            <input className={fieldClass} value={form.phone} onChange={(event) => update("phone", event.target.value)} />
          </Field>
          <Field label="Email">
            <input className={fieldClass} type="email" value={form.email} onChange={(event) => update("email", event.target.value)} />
          </Field>
          {error ? <p className="text-sm text-emergency sm:col-span-2">{error}</p> : null}
          <div className="sm:col-span-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Add patient"}
            </Button>
          </div>
        </form>
      ) : null}
      <div className="mt-8">
        <section>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, date of birth, phone, or MRN"
            className={fieldClass}
            aria-label="Search patients"
          />
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {rows.length === 0 ? (
              <li className="px-4 py-5 text-sm text-neutral-500">{query.trim() ? "No charts match that search." : "No charts yet. Add a new patient."}</li>
            ) : null}
            {rows.map((patient) => {
              const upcoming = appointments
                .filter(
                  (appointment) =>
                    appointment.patientId === patient.id &&
                    appointment.status !== "cancelled" &&
                    appointment.start.slice(0, 10) >= today,
                )
                .sort((a, b) => a.start.localeCompare(b.start))[0];
              const gaps = chartGaps(patient);
              const age = ageFromDob(patient.dateOfBirth, today);
              const initials = `${patient.firstName.slice(0, 1)}${patient.lastName.slice(0, 1)}`.toUpperCase();
              return (
                <MemberCard
                  key={patient.id}
                  href={`/try/patients/${patient.id}`}
                  initials={initials}
                  name={patientName(patient)}
                  meta={`MRN ${patient.mrn || "new"} · ${patient.phone || "No phone"}`}
                  note={`${formatDay(patient.dateOfBirth)}${age !== null ? ` · ${age} yrs` : ""} · ${upcoming ? `Next ${formatDay(upcoming.start)} ${formatTime(upcoming.start)}` : "No visit booked"}`}
                  live={gaps.length === 0}
                />
              );
            })}
          </ul>
        </section>
      </div>
    </main>
  );
}
