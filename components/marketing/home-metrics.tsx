"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const queue = [
  { id: "hale", label: "Jordan Hale · room 2", detail: "Scribe listening" },
  { id: "claim", label: "Claim · $185", detail: "Queued for payer" },
  { id: "elena", label: "Elena · balance text", detail: "Waiting in outbox" },
  { id: "elig", label: "Eligibility · Pinetree", detail: "Active · confirmed" },
  { id: "sched", label: "Unconfirmed mornings", detail: "3 still open" },
];

export function HomeMetrics() {
  const [count, setCount] = useState(23);
  const [active, setActive] = useState(0);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(media.matches);
    if (media.matches) {
      setCount(0);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const duration = 2400;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setCount(Math.round(23 * (1 - eased)));
      if (t < 1) frame = requestAnimationFrame(tick);
      else setCount(0);
    };

    frame = requestAnimationFrame(tick);
    const onChange = () => {
      if (media.matches) {
        cancelAnimationFrame(frame);
        setCount(0);
        setReduce(true);
      }
    };
    media.addEventListener("change", onChange);
    return () => {
      cancelAnimationFrame(frame);
      media.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % queue.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, [reduce]);

  return (
    <section className="border-t border-line bg-paper px-6 py-20 lg:py-28">
      <div className="mx-auto grid max-w-6xl items-stretch gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-ink p-6 text-paper sm:min-h-[28rem] sm:p-8">
          <div className="relative flex h-full flex-col">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-foam">Morning board</p>
                <div className="mt-3 flex items-end gap-3">
                  <span className="font-sans text-6xl font-semibold tracking-[-0.05em] tabular-nums sm:text-7xl">
                    {count}
                  </span>
                  <span className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/80">
                    open tasks
                  </span>
                </div>
              </div>
              <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slash font-mono text-lg text-paper">
                Ø
              </span>
            </div>

            <div className="relative mt-8 flex-1">
              <div className="pointer-events-none absolute left-[15px] top-2 bottom-2 w-px bg-paper/10" aria-hidden="true" />
              <ul className="space-y-3">
                {queue.map((item, index) => {
                  const isActive = index === active;
                  const cleared = count === 0 && index <= active;
                  return (
                    <li
                      key={item.id}
                      className={`relative rounded-2xl border px-4 py-3 pl-10 transition-colors duration-300 ${
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
                          <p className="mt-0.5 text-xs text-paper/80">{item.detail}</p>
                        </div>
                        {isActive ? (
                          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-foam">Live</span>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

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
            prefetch={false}
            className="mt-8 inline-flex w-fit rounded-full bg-slash px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-oxide-deep"
          >
            Open Jordan Hale
          </Link>
        </div>
      </div>
    </section>
  );
}
