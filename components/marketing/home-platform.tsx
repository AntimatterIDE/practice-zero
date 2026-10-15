"use client";

import Link from "next/link";
import { BarChart3, FileText, Stethoscope, Users } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { ZeroDevice } from "@/components/marketing/brand-mark";

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
    href: "/try/analytics",
    icon: BarChart3,
  },
];

export function HomePlatform() {
  const reduce = useReducedMotion();

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

        <div className="relative mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="absolute left-1/2 top-1/2 z-10 hidden h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-paper lg:flex">
            <ZeroDevice className="text-[2rem] text-slash" tone="ink" />
          </div>
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
              >
                <Link
                  href={pillar.href}
                  className="flex h-full flex-col rounded-[1.5rem] border border-line bg-card p-5 shadow-[var(--shadow-card)] transition-colors hover:border-slash/40"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mist text-ink">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold text-ink">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-graphite">{pillar.body}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
