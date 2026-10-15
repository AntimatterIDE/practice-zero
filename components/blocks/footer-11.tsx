"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ClipboardList, Mic, Stethoscope, User, type LucideIcon } from "lucide-react";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const columns: {
  title: string;
  links: { label: string; href: string; icon?: LucideIcon }[];
}[] = [
  {
    title: "EHR",
    links: [
      { label: "Patients", href: "/ehr", icon: User },
      { label: "Visits", href: "/ehr", icon: Stethoscope },
      { label: "Scribe", href: "/ehr", icon: Mic },
      { label: "Intake", href: "/ehr", icon: ClipboardList },
    ],
  },
  {
    title: "Billing",
    links: [
      { label: "Collect from payers", href: "/billing" },
      { label: "Eligibility", href: "/billing" },
      { label: "Claims", href: "/billing" },
      { label: "Payers", href: "/billing" },
    ],
  },
  {
    title: "Marketing",
    links: [
      { label: "Outreach", href: "/marketing" },
      { label: "Follow-up", href: "/marketing" },
      { label: "Scheduling", href: "/marketing" },
      { label: "Social", href: "/marketing" },
    ],
  },
  {
    title: "The morning",
    links: [
      { label: "Today", href: "/try" },
      { label: "Open Jordan Hale", href: "/try/patients/pt-hale" },
      { label: "The draft claim", href: "/try/claims/clm-hale" },
      { label: "The practice", href: "/try/practice" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Features", href: "/features" },
      { label: "Try the demo", href: "/try" },
    ],
  },
];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Footer11() {
  const reduce = useReducedMotion();

  return (
    <footer className="w-full bg-white py-16 sm:py-20 lg:py-24">
      <motion.div
        variants={container}
        initial={reduce ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto w-full max-w-6xl px-6"
      >
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-12">
          {columns.map((column) => (
            <motion.nav key={column.title} variants={item} aria-label={column.title} className="min-w-0">
              <h3 className="mb-5 text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">{column.title}</h3>
              <ul className="space-y-3.5">
                {column.links.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className={`group inline-flex items-center gap-3 rounded-sm text-[17px] font-medium leading-snug tracking-tight text-neutral-900 transition-colors duration-200 hover:text-neutral-500 ${focusRing}`}
                    >
                      {Icon ? (
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-700 transition-colors duration-200 group-hover:border-neutral-300 group-hover:bg-neutral-100">
                          <Icon className="h-4 w-4" />
                        </span>
                      ) : null}
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          ))}
        </div>

        <motion.div variants={item} className="mt-16 flex flex-col gap-6 pt-8 sm:mt-20">
          <Link href="/" className={`inline-flex w-fit items-center gap-2.5 rounded-md ${focusRing}`}>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 font-display text-base text-white">
              P
            </span>
            <span className="font-display text-xl text-neutral-900">Practice Zero</span>
          </Link>
          <p className="max-w-xl font-display text-3xl leading-tight tracking-tight text-neutral-950 sm:text-4xl">
            From the first patient to the claim
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
}

export default Footer11;
