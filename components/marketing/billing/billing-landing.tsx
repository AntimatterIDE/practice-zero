"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarCheck2,
  CheckCircle2,
  FileText,
  PieChart,
  ShieldCheck,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const pillars = [
  {
    icon: CalendarCheck2,
    title: "Protect revenue early.",
    body: "Verify eligibility and resolve coverage issues before the visit.",
  },
  {
    icon: FileText,
    title: "Keep claims moving.",
    body: "Connect documentation, preparation, and submission in one workflow.",
  },
  {
    icon: PieChart,
    title: "Act on unpaid revenue.",
    body: "Prioritize denials and outstanding claims so follow-up stays focused.",
  },
  {
    icon: BarChart3,
    title: "See cash flow clearly.",
    body: "Track collections, balances, and payer activity without another export.",
  },
];

const claims = [
  {
    id: "CLM-10482",
    date: "Oct 12",
    status: "Submitted",
    tone: "slash" as const,
    next: "Awaiting payer response",
  },
  {
    id: "CLM-10461",
    date: "Oct 9",
    status: "Action needed",
    tone: "warn" as const,
    next: "Review and resolve",
  },
  {
    id: "CLM-10428",
    date: "Oct 3",
    status: "Reconciled",
    tone: "ok" as const,
    next: "Payment posted",
  },
];

const months = [
  { label: "Apr", height: 42 },
  { label: "May", height: 58 },
  { label: "Jun", height: 51 },
  { label: "Jul", height: 72 },
  { label: "Aug", height: 64 },
  { label: "Sep", height: 88 },
];

const statusClass = {
  slash: "bg-slash/10 text-slash",
  warn: "bg-amber-100 text-amber-900",
  ok: "bg-emerald-100 text-emerald-800",
} as const;

function FadeIn({
  children,
  className,
  delay = 0,
  y = 22,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.65, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function RevenueOverview() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="rounded-[1.75rem] border border-line bg-card p-5 shadow-[var(--shadow-card)] sm:p-6"
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.75, ease: EASE }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-ink">Revenue overview</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">
            Illustrative data
          </p>
        </div>
        <span className="rounded-full bg-slash/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-slash">
          Live
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          ["Collections this month", "$248,600"],
          ["Outstanding receivables", "$86,420"],
          ["Claims requiring action", "24"],
        ].map(([label, value], index) => (
          <motion.div
            key={label}
            className="rounded-2xl bg-mist px-3.5 py-3"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 + index * 0.06, ease: EASE }}
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-graphite">{label}</p>
            <p className="mt-1.5 font-sans text-xl font-semibold tracking-tight text-ink">{value}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-6">
        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-graphite">Collections by month</p>
        <div className="mt-4 flex h-36 items-end gap-2.5 sm:gap-3">
          {months.map((month, index) => (
            <div key={month.label} className="flex flex-1 flex-col items-center gap-2">
              <motion.div
                className="w-full origin-bottom rounded-t-md bg-slash"
                initial={reduce ? false : { scaleY: 0.08 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: "-5%" }}
                transition={{ duration: 0.7, delay: 0.12 + index * 0.05, ease: EASE }}
                style={{ height: `${month.height}%` }}
              />
              <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-graphite">{month.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-4">
        {[
          { icon: FileText, label: "Submitted" },
          { icon: ShieldCheck, label: "Payer response" },
          { icon: CheckCircle2, label: "Reconciled" },
        ].map(({ icon: Icon, label }, index) => (
          <motion.div
            key={label}
            className="inline-flex items-center gap-2"
            initial={reduce ? false : { opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.35 + index * 0.1, ease: EASE }}
          >
            {index > 0 ? <span className="mx-1 h-px w-5 bg-line sm:w-8" aria-hidden="true" /> : null}
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slash/10 text-slash">
              <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
            </span>
            <span className="text-xs font-medium text-ink">{label}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export function BillingLanding() {
  const reduce = useReducedMotion();

  return (
    <>
      <section className="px-6 pb-16 pt-14 lg:pb-24 lg:pt-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <p className="kicker">Billing and revenue cycle</p>
            <h1 className="mt-6 max-w-[14ch] font-sans text-5xl font-semibold lowercase leading-[1.02] tracking-[-0.04em] text-ink sm:text-6xl lg:text-7xl">
              care delivered. revenue collected.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-graphite">
              Connect care to collections. Reduce billing friction, keep claims moving, and gain a clearer view of cash
              flow.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
              <Link
                href="/contact"
                prefetch={false}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slash px-7 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-oxide-deep"
              >
                Book a revenue assessment
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/try/claims"
                prefetch={false}
                className="group inline-flex items-center gap-2 text-sm font-medium text-slash transition-colors hover:text-oxide-deep"
              >
                Explore billing
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </FadeIn>

          <RevenueOverview />
        </div>
      </section>

      <section className="border-t border-line bg-paper px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <h2 className="max-w-[18ch] font-sans text-4xl font-semibold lowercase leading-[1.05] tracking-[-0.035em] text-ink sm:text-5xl">
              a stronger revenue cycle. at every step.
            </h2>
          </FadeIn>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {pillars.map(({ icon: Icon, title, body }, index) => (
              <motion.article
                key={title}
                className="rounded-[1.5rem] border border-line bg-card p-6 shadow-[var(--shadow-card)] transition-transform duration-300 hover:-translate-y-1"
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.55, delay: index * 0.06, ease: EASE }}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slash/10 text-slash">
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite">{body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line px-6 py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <p className="kicker">From encounter to payment</p>
            <h2 className="mt-5 max-w-[14ch] font-sans text-4xl font-semibold lowercase leading-[1.05] tracking-[-0.035em] text-ink sm:text-5xl">
              every claim. a clear next step.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-graphite">
              Give your team the visibility to resolve exceptions and move revenue forward.
            </p>
          </FadeIn>

          <FadeIn delay={0.08} y={28}>
            <div className="overflow-hidden rounded-[1.5rem] border border-line bg-card shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-ink">Claim activity</p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">
                    Illustrative workflow
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[28rem] text-left text-sm">
                  <thead>
                    <tr className="border-b border-line text-[11px] uppercase tracking-[0.12em] text-graphite">
                      <th className="px-5 py-3 font-medium">Claim ID</th>
                      <th className="px-3 py-3 font-medium">Date</th>
                      <th className="px-3 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium">Next step</th>
                    </tr>
                  </thead>
                  <tbody>
                    {claims.map((claim, index) => (
                      <motion.tr
                        key={claim.id}
                        className="border-b border-line/80 last:border-0"
                        initial={reduce ? false : { opacity: 0, x: 16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, delay: 0.1 + index * 0.08, ease: EASE }}
                      >
                        <td className="px-5 py-4 font-medium text-ink">{claim.id}</td>
                        <td className="px-3 py-4 text-graphite">{claim.date}</td>
                        <td className="px-3 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass[claim.tone]}`}>
                            {claim.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-graphite">{claim.next}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="border-t border-ink bg-ink px-6 py-16 text-paper lg:py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <FadeIn className="max-w-2xl">
            <h2 className="font-sans text-3xl font-semibold lowercase leading-[1.08] tracking-[-0.035em] sm:text-4xl lg:text-5xl">
              one platform. aligned with your collections.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-paper/70 sm:text-lg">
              Enterprise EHR included at no additional license fee when PracticeZero handles your billing.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Link
              href="/contact"
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slash px-7 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-oxide-deep"
            >
              Talk to PracticeZero
              <ArrowRight className="h-4 w-4" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
