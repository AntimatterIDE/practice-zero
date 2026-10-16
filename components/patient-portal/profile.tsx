"use client";

import { useRcm } from "@/components/admin/rcm/store";
import { patientName } from "@/lib/rcm/format";

export function PatientProfile() {
  const { ready, patients } = useRcm();
  const patient = patients.find((item) => item.id === "pt-hale");
  if (!ready || !patient) {
    return <p className="text-sm text-graphite">Loading profile…</p>;
  }

  const pharmacy =
    patient.intakeAnswers?.find((answer) => answer.label === "Pharmacy")?.value || "Hope Street Pharmacy";
  const initials = `${patient.firstName.slice(0, 1)}${patient.lastName.slice(0, 1)}`.toUpperCase();
  const fields = [
    ["Full name", patientName(patient)],
    ["Preferred name", patient.preferredName || patient.firstName],
    ["Date of birth", patient.dateOfBirth],
    ["Phone", patient.phone],
    ["Email", patient.email],
    ["Record number", patient.mrn],
    ["Coverage", `${patient.payerName} · Active`],
    ["Member ID", patient.memberId],
    ["Preferred pharmacy", pharmacy],
    ["Emergency contact", "Alex Wallace · (555) 014-2290"],
  ];

  return (
    <div className="mx-auto grid max-w-3xl gap-6">
      <div>
        <p className="kicker">Profile</p>
        <h1 className="mt-3 font-sans text-4xl font-semibold lowercase tracking-[-0.035em] text-ink">
          your information.
        </h1>
        <p className="mt-3 max-w-xl text-base text-graphite">
          Demographics, coverage, and preferences the practice uses at check-in — editable from the portal when
          something changes.
        </p>
      </div>

      <section className="rounded-2xl border border-line bg-card p-5 shadow-[var(--shadow-card)] sm:p-6">
        <div className="flex items-center gap-3 border-b border-line pb-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slash/10 font-mono text-sm font-semibold text-slash">
            {initials}
          </span>
          <div>
            <p className="text-base font-semibold text-ink">{patientName(patient)}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">
              Patient profile · sample
            </p>
          </div>
        </div>
        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          {fields.map(([label, value]) => (
            <div key={label} className="rounded-xl bg-mist px-3.5 py-3">
              <dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-graphite">{label}</dt>
              <dd className="mt-1 text-sm font-medium text-ink">{value}</dd>
            </div>
          ))}
        </dl>
        <button
          type="button"
          className="mt-5 inline-flex rounded-full bg-slash px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-oxide-deep"
        >
          Request a profile update
        </button>
      </section>
    </div>
  );
}
