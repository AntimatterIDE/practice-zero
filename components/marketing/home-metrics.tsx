"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const queue = [
  { id: "hale", label: "Jordan Hale · room 2", detail: "Scribe listening" },
  { id: "claim", label: "Claim · $185", detail: "Queued for payer" },
  { id: "elena", label: "Elena · balance text", detail: "Waiting in outbox" },
  { id: "elig", label: "Eligibility · Pinetree", detail: "Active · confirmed" },
  { id: "sched", label: "Unconfirmed mornings", detail: "3 still open" },
];

export function HomeMetrics() {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(23);
  const [active, setActive] = useState(0);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (reduce) {
      setCount(0);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const duration = 2800;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setCount(Math.round(23 * (1 - eased)));
      if (t < 1) frame = requestAnimationFrame(tick);
      else setCount(0);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % queue.length);
      setPulse((value) => value + 1);
    }, 2200);
    return () => window.clearInterval(timer);
  }, [reduce]);

  return (
    <section className="border-t border-line bg-paper px-6 py-20 lg:py-28">
      <div className="mx-auto grid max-w-6xl items-stretch gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[1.75rem] bg-ink p-6 text-paper sm:min-h-[28rem] sm:p-8"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-slash/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-slash/20 blur-3xl" />

          <div className="relative flex h-full flex-col">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-slash">Morning board</p>
                <div className="mt-3 flex items-end gap-3">
                  <motion.span
                    key={count}
                    className="font-sans text-6xl font-semibold tracking-[-0.05em] sm:text-7xl"
                  >
                    {count}
                  </motion.span>
                  <span className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50">
                    open tasks
                  </span>
                </div>
              </div>
              <motion.span
                key={pulse}
                initial={reduce ? false : { scale: 0.7, opacity: 0.4 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slash font-mono text-lg text-paper"
              >
                Ø
              </motion.span>
            </div>

            <div className="relative mt-8 flex-1">
              <div className="absolute left-[15px] top-2 bottom-2 w-px bg-paper/10" />
              <ul className="space-y-3">
                {queue.map((item, index) => {
                  const isActive = index === active;
                  const cleared = count === 0 && index <= active;
                  return (
                    <motion.li
                      key={item.id}
                      animate={{
                        opacity: isActive ? 1 : 0.45,
                        x: isActive && !reduce ? 4 : 0,
                      }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className={`relative rounded-2xl border px-4 py-3 pl-10 ${
                        isActive ? "border-slash/40 bg-slash/15" : "border-paper/10 bg-paper/5"
                      }`}
                    >
                      <span
                        className={`absolute left-3 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full ${
                          cleared ? "bg-slash" : "bg-paper/30"
                        }`}
                      />
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-paper">{item.label}</p>
                          <p className="mt-0.5 text-xs text-paper/50">{item.detail}</p>
                        </div>
                        <AnimatePresence mode="wait">
                          {isActive ? (
                            <motion.span
                              key="live"
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              className="font-mono text-[10px] uppercase tracking-[0.16em] text-slash"
                            >
                              Live
                            </motion.span>
                          ) : null}
                        </AnimatePresence>
                      </div>
                      {cleared ? (
                        <span
                          aria-hidden="true"
                          className="absolute left-10 right-4 top-1/2 h-px -translate-y-1/2 bg-slash/70"
                        />
                      ) : null}
                    </motion.li>
                  );
                })}
              </ul>
            </div>
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
            className="mt-8 inline-flex w-fit rounded-full bg-slash px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-oxide-deep"
          >
            Open Jordan Hale
          </Link>
        </div>
      </div>
    </section>
  );
}
