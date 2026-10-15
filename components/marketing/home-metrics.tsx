"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

export function HomeMetrics() {
  const reduce = useReducedMotion();

  return (
    <section className="border-t border-line bg-paper px-6 py-20 lg:py-28">
      <div className="mx-auto grid max-w-6xl items-stretch gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex min-h-[22rem] w-full items-center justify-center rounded-[1.75rem] bg-ink text-paper sm:min-h-[28rem]"
        >
          <div className="text-center">
            <p className="font-sans text-7xl font-semibold tracking-[-0.05em] sm:text-8xl lg:text-9xl">23</p>
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.28em] text-paper/70">Open tasks</p>
          </div>
        </motion.div>
        <div className="flex flex-col justify-center">
          <p className="kicker">The morning, already moving</p>
          <h2 className="mt-5 max-w-[14ch] font-sans text-4xl font-semibold lowercase leading-[1.05] tracking-[-0.035em] text-ink sm:text-5xl">
            from the first patient to the claim.
          </h2>
          <p className="mt-5 max-w-md text-lg text-graphite">
            Jordan Hale is in room 2. The note is drafted. The claim is queued. Elena’s balance text is waiting in the outbox.
          </p>
          <Link
            href="/try/patients/pt-hale"
            className="mt-8 inline-flex w-fit rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink/90"
          >
            Open Jordan Hale
          </Link>
        </div>
      </div>
    </section>
  );
}
