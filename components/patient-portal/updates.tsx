"use client";

import { CheckCircle2, ClipboardList, DollarSign } from "lucide-react";

const updates = [
  {
    title: "Visit confirmed",
    detail: "Thu · 9:00 AM · Room 2 with Dr. Wallace",
    when: "Today",
    icon: CheckCircle2,
    tone: "ok" as const,
  },
  {
    title: "Results ready",
    detail: "Basic metabolic panel is available in your record",
    when: "Yesterday",
    icon: ClipboardList,
    tone: "info" as const,
  },
  {
    title: "Patient pay update",
    detail: "$185 practice fee posted · claim filed out of network",
    when: "Mon",
    icon: DollarSign,
    tone: "ok" as const,
  },
  {
    title: "Intake incomplete",
    detail: "Finish forms before Thursday to skip the clipboard",
    when: "Sun",
    icon: ClipboardList,
    tone: "warn" as const,
  },
];

export function PatientUpdates() {
  return (
    <div className="mx-auto grid max-w-3xl gap-6">
      <div>
        <p className="kicker">Updates</p>
        <h1 className="mt-3 font-sans text-4xl font-semibold lowercase tracking-[-0.035em] text-ink">
          what changed.
        </h1>
        <p className="mt-3 max-w-xl text-base text-graphite">
          Appointments, lab results, and patient pay balances as they move so you are not waiting on a callback for
          status.
        </p>
      </div>

      <div className="space-y-3">
        {updates.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.title}
              className="flex items-start gap-3 rounded-2xl border border-line bg-card px-4 py-4 shadow-[var(--shadow-card)]"
            >
              <span
                className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  item.tone === "ok"
                    ? "bg-emerald-100 text-emerald-700"
                    : item.tone === "warn"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slash/10 text-slash"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-ink">{item.title}</p>
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-graphite">
                    {item.when}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-graphite">{item.detail}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
