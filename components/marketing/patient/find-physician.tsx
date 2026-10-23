"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/marketing/patient/fade-in";

const offerings = [
  {
    slug: "ophthalmology",
    label: "Ophthalmology",
    opening: "Tue · 10:30 AM",
    problems: ["eye", "vision", "cataract", "glaucoma", "injection", "laser", "retina", "ophthal"],
  },
  {
    slug: "orthopedics",
    label: "Orthopedics",
    opening: "Wed · 1:15 PM",
    problems: ["knee", "hip", "bone", "joint", "fracture", "shoulder", "back", "ortho", "sprain"],
  },
  {
    slug: "primary-care",
    label: "Primary care",
    opening: "Thu · 9:00 AM",
    problems: ["blood pressure", "blood", "pressure", "checkup", "hypertension", "primary", "cold", "cough", "annual"],
  },
  {
    slug: "dermatology",
    label: "Dermatology",
    opening: "Fri · 11:00 AM",
    problems: ["rash", "skin", "acne", "mole", "derm", "itch"],
  },
  {
    slug: "ob-gyn",
    label: "OB-GYN",
    opening: "Mon · 2:40 PM",
    problems: ["pregnancy", "prenatal", "ob", "gyn", "pap"],
  },
] as const;

const PLAN = "pinetree health choice ppo";
const PHYSICIAN = "elvis francois southeast medical";

function words(value: string) {
  return value.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

function problemMatches(offering: (typeof offerings)[number], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const hay = `${offering.label} ${offering.problems.join(" ")}`.toLowerCase();
  if (hay.includes(q)) return true;
  return words(q).some((word) => word.length > 1 && hay.includes(word));
}

function insuranceMatches(query: string) {
  const parts = words(query);
  if (parts.length === 0) return true;
  return parts.every((word) => PLAN.includes(word));
}

function nameMatches(query: string) {
  const parts = words(query);
  if (parts.length === 0) return true;
  return parts.every((word) => PHYSICIAN.includes(word) || word === "md");
}

export function FindPhysician() {
  const [problem, setProblem] = useState("");
  const [insurance, setInsurance] = useState("");
  const [name, setName] = useState("");
  const insuranceOk = insuranceMatches(insurance);
  const nameOk = nameMatches(name);
  const matched = useMemo(
    () => offerings.filter((offering) => problemMatches(offering, problem)),
    [problem],
  );
  const results = insuranceOk && nameOk ? matched : [];
  const filtering = problem.trim() || insurance.trim() || name.trim();

  return (
    <>
      <section className="px-6 pb-16 pt-14 lg:pb-20 lg:pt-20">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <p className="kicker">Find a physician</p>
            <h1 className="mt-6 max-w-[18ch] font-sans text-5xl font-semibold lowercase leading-[1.02] tracking-[-0.04em] text-ink sm:text-6xl lg:text-7xl">
              search by the problem, not only the name.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-graphite">
              One practice on this demo: Southeast Medical. Paul Wallace’s coverage is Pinetree Health, Choice PPO. It is
              not a contracted plan, so he pays the practice fee. The physician on file is Elvis Francois, MD.
            </p>
          </FadeIn>

          <FadeIn delay={0.06} className="mt-10">
            <form
              className="grid gap-4 rounded-[1.75rem] border border-line bg-card p-5 shadow-[var(--shadow-card)] sm:p-6 lg:grid-cols-3"
              onSubmit={(event) => event.preventDefault()}
            >
              <label className="block">
                <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">
                  Problem
                </span>
                <input
                  value={problem}
                  onChange={(event) => setProblem(event.target.value)}
                  placeholder="Blood pressure, rash, pregnancy"
                  className="w-full rounded-xl border border-line bg-mist px-3 py-2.5 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-slash"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">
                  Insurance
                </span>
                <input
                  value={insurance}
                  onChange={(event) => setInsurance(event.target.value)}
                  placeholder="Pinetree Health"
                  className="w-full rounded-xl border border-line bg-mist px-3 py-2.5 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-slash"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">
                  Name
                </span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Elvis Francois"
                  className="w-full rounded-xl border border-line bg-mist px-3 py-2.5 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-slash"
                />
              </label>
            </form>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">
              Illustrative directory · the live demo stays in the portal
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="border-t border-line px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <h2 className="font-sans text-3xl font-semibold lowercase tracking-[-0.03em] text-ink sm:text-4xl">
              {results.length === 1 ? "1 opening" : `${results.length} openings`} at southeast medical.
            </h2>
          </FadeIn>

          {results.length === 0 ? (
            <p className="mt-6 max-w-xl text-base leading-relaxed text-graphite">
              {!insuranceOk
                ? "This demo practice is not contracted with that plan. Patients pay the practice fee. Try Pinetree Health, or clear insurance to see every specialty."
                : !nameOk
                  ? "The physician on this demo is Elvis Francois, MD, at Southeast Medical. Clear the name to see the specialties."
                  : "No specialty at Southeast Medical matches that problem. Try blood pressure, a rash, or an eye visit."}
            </p>
          ) : (
            <ul className="mt-8 grid gap-4 lg:grid-cols-2">
              {results.map((offering) => (
                <li
                  key={offering.slug}
                  className="rounded-[1.5rem] border border-line bg-card p-5 shadow-[var(--shadow-card)] sm:p-6"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">Southeast Medical</p>
                  <h3 className="mt-2 text-xl font-semibold text-ink">{offering.label}</h3>
                  <p className="mt-1 text-sm text-graphite">Elvis Francois, MD</p>
                  <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-mist px-3 py-2.5">
                      <dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-graphite">Next opening</dt>
                      <dd className="mt-1 font-medium text-ink">{offering.opening}</dd>
                    </div>
                    <div className="rounded-xl bg-mist px-3 py-2.5">
                      <dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-graphite">Coverage</dt>
                      <dd className="mt-1 font-medium text-ink">Pays the practice fee</dd>
                    </div>
                  </dl>
                  <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                    <Link
                      href={`/specialties/${offering.slug}`}
                      prefetch={false}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-slash px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-oxide-deep"
                    >
                      {offering.label}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/portal"
                      prefetch={false}
                      className="inline-flex items-center justify-center rounded-full border border-line px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-mist"
                    >
                      See patient experience
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {filtering ? (
            <button
              type="button"
              onClick={() => {
                setProblem("");
                setInsurance("");
                setName("");
              }}
              className="mt-6 text-sm font-medium text-slash hover:text-oxide-deep"
            >
              Clear search
            </button>
          ) : null}
        </div>
      </section>
    </>
  );
}
