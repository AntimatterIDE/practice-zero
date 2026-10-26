import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Footer11 } from "@/components/blocks/footer-11";
import { SiteHeader } from "@/components/marketing/site-header";
import { specialties, specialtyPath } from "@/lib/marketing/specialties";
import { pageOpenGraph } from "@/lib/open-graph";

export const metadata: Metadata = {
  title: "Specialties",
  description:
    "Practice Zero for independent ophthalmology, orthopedics, primary care, dermatology, and OB-GYN practices.",
  alternates: { canonical: "/specialties" },
  openGraph: pageOpenGraph({
    title: "Specialties · practice zero",
    description:
      "Agentic EHR for independent specialties chart, billing, and outreach on one morning board.",
    url: "/specialties",
  }),
};

export default function SpecialtiesIndexPage() {
  return (
    <div className="min-h-full bg-paper text-ink">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8">
        <SiteHeader />
      </div>
      <main className="mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <p className="kicker">Specialties</p>
        <h1 className="mt-5 max-w-3xl font-sans text-4xl font-semibold lowercase leading-[1.05] tracking-[-0.035em] sm:text-5xl">
          built for independent practices framed for your specialty.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-graphite sm:text-lg">
          Same agentic EHR. Specialty-specific mornings how the day actually breaks, how
          practice zero maps to it, and what goes to zero on the board.
        </p>
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {specialties.map((specialty) => (
            <li key={specialty.slug}>
              <Link
                href={specialtyPath(specialty.slug)}
                className="group flex h-full flex-col rounded-2xl border border-line bg-card p-6 transition-colors hover:border-slash/40"
              >
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-slash">
                  {specialty.kicker}
                </p>
                <p className="mt-3 text-lg font-medium text-ink">{specialty.label}</p>
                <p className="mt-2 text-base font-medium lowercase leading-snug text-ink">
                  {specialty.headline}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-graphite">
                  {specialty.support.slice(0, 160).trim()}
                  {specialty.support.length > 160 ? "…" : ""}
                </p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm text-slash">
                  Open page
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer11 />
    </div>
  );
}
