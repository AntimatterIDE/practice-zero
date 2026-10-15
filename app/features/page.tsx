import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/marketing/site-header";

export const metadata: Metadata = {
  title: "Features",
  description: "Every screen in the Practice Zero demo.",
};

const groups = [
  {
    title: "The morning",
    items: [
      ["Today", "/try"],
      ["Schedule", "/try/scheduling"],
      ["Requests", "/try/consultations"],
      ["Tasks", "/try/tasks"],
    ],
  },
  {
    title: "The chart",
    items: [
      ["Patients", "/try/patients"],
      ["Visits", "/try/visits"],
      ["Intake", "/try/intake"],
      ["Agreements", "/try/agreements"],
    ],
  },
  {
    title: "Getting paid",
    items: [
      ["Eligibility", "/try/eligibility"],
      ["Claims", "/try/claims"],
      ["Drafts", "/try/claims/drafts"],
      ["Denials", "/try/denials"],
      ["Payments", "/try/payments"],
      ["Upload", "/try/upload"],
      ["Analytics", "/try/analytics"],
      ["Tools", "/try/tools"],
    ],
  },
  {
    title: "The practice",
    items: [
      ["People", "/try/people"],
      ["Practice", "/try/practice"],
    ],
  },
] as const;

export default function FeaturesPage() {
  return (
    <div className="min-h-full bg-paper text-ink">
      <div className="mx-auto w-full max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8">
        <SiteHeader />
      </div>
      <main className="mx-auto max-w-5xl px-6 pb-20 pt-8">
        <h1 className="font-sans text-5xl font-semibold lowercase tracking-[-0.04em]">every screen in the demo.</h1>
        <p className="mt-4 max-w-2xl text-lg text-graphite">The sample practice is already mid-morning. Each link opens that desk.</p>
        <div className="mt-10 grid gap-8">
          {groups.map((group) => (
            <section key={group.title}>
              <h2 className="font-sans text-2xl font-semibold lowercase tracking-[-0.03em]">{group.title.toLowerCase()}.</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {group.items.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="block rounded-2xl border border-line bg-card px-4 py-3 hover:border-slash">
                      <span className="font-medium">{label}</span>
                      <span className="mt-1 block text-sm text-graphite">{href}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
