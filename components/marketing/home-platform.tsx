import Link from "next/link";
import { BarChart3, FileText, Stethoscope, Users } from "lucide-react";

const pillars = [
  {
    title: "Clinical",
    body: "AI documentation & coding",
    href: "/ehr",
    icon: Stethoscope,
  },
  {
    title: "Revenue",
    body: "Claims, collections & payer work",
    href: "/billing",
    icon: FileText,
  },
  {
    title: "Operations",
    body: "Scheduling, outreach & engagement",
    href: "/marketing",
    icon: Users,
  },
  {
    title: "Intelligence",
    body: "Insights & practice analytics",
    href: "/ai",
    icon: BarChart3,
  },
];

export function HomePlatform() {
  return (
    <section className="border-t border-line bg-paper px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="kicker">One intelligent platform</p>
        <h2 className="mt-5 max-w-[18ch] font-sans text-4xl font-semibold lowercase leading-[1.05] tracking-[-0.035em] text-ink sm:text-5xl">
          every workflow. one morning.
        </h2>
        <p className="mt-5 max-w-2xl text-lg text-graphite">
          practice zero connects clinical, financial, and operational workflows with agents — from patient encounters to reimbursements.
        </p>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Link
                key={pillar.title}
                href={pillar.href}
                prefetch={false}
                className="flex h-full flex-col rounded-[1.5rem] border border-line bg-card p-5 shadow-[var(--shadow-card)] transition-colors hover:border-slash/50 hover:bg-slash/[0.03]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slash/10 text-slash">
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <h3 className="mt-6 text-lg font-semibold text-ink">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite">{pillar.body}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
