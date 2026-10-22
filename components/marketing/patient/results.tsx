"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/marketing/patient/fade-in";

const panel = [
  { name: "Sodium", value: "139 mmol/L", sentence: "This salt level in your blood is in the usual range." },
  { name: "Potassium", value: "4.1 mmol/L", sentence: "This level, which helps your heart keep a steady rhythm, is in the usual range." },
  { name: "Chloride", value: "102 mmol/L", sentence: "This partner to sodium is in the usual range." },
  { name: "Carbon dioxide", value: "25 mmol/L", sentence: "This is the bicarbonate that keeps your blood from getting too acidic, and it is in the usual range." },
  { name: "Glucose", value: "96 mg/dL", sentence: "This is the sugar in your blood at the time of the draw, and it is in the usual range." },
  { name: "BUN", value: "14 mg/dL", sentence: "This waste product your kidneys clear is in the usual range." },
  { name: "Creatinine", value: "0.9 mg/dL", sentence: "This measure of how your kidneys are filtering is in the usual range." },
  { name: "Calcium", value: "9.4 mg/dL", sentence: "The calcium in your blood is in the usual range." },
];

const summary = [
  {
    label: "What was decided",
    body: "Continue lisinopril 10 mg daily for essential hypertension.",
  },
  {
    label: "What to do tonight",
    body: "Take your lisinopril, and write down a home blood pressure if you check it.",
  },
  {
    label: "When to come back",
    body: "Keep home readings for two weeks, and come back in one month. Thursday at 9:00 is already on the book.",
  },
];

export function PatientResults() {
  return (
    <>
      <section className="px-6 pb-16 pt-14 lg:pb-20 lg:pt-20">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <p className="kicker">Results</p>
            <h1 className="mt-6 max-w-[16ch] font-sans text-5xl font-semibold lowercase leading-[1.02] tracking-[-0.04em] text-ink sm:text-6xl lg:text-7xl">
              the panel, in plain language.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-graphite">
              Paul Wallace’s basic metabolic panel at Southeast Medical is in range. Creatinine is 0.9 mg/dL. Each number
              below has one sentence for the person who has to live with it.
            </p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">
              Illustrative record · not a live chart
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="border-t border-line px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <h2 className="font-sans text-3xl font-semibold lowercase tracking-[-0.03em] text-ink sm:text-4xl">
              basic metabolic panel.
            </h2>
          </FadeIn>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {panel.map((row) => (
              <li key={row.name} className="rounded-[1.5rem] border border-line bg-card px-5 py-4 shadow-[var(--shadow-card)]">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-semibold text-ink">{row.name}</p>
                  <p className="font-mono text-sm text-ink">{row.value}</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-graphite">{row.sentence}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line bg-mist/40 px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <p className="kicker">After the visit</p>
            <h2 className="mt-5 max-w-[16ch] font-sans text-4xl font-semibold lowercase leading-[1.05] tracking-[-0.035em] text-ink sm:text-5xl">
              what southeast medical decided.
            </h2>
          </FadeIn>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {summary.map((item) => (
              <article key={item.label} className="rounded-[1.5rem] border border-line bg-card p-5 shadow-[var(--shadow-card)]">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">{item.label}</h3>
                <p className="mt-3 text-base leading-relaxed text-ink">{item.body}</p>
              </article>
            ))}
          </div>
          <Link
            href="/portal/updates"
            prefetch={false}
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-slash transition-colors hover:text-oxide-deep"
          >
            Portal updates
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
