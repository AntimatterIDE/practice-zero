"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CountToZero, ZeroMark } from "@/components/brand";
import { onUserEngagement, shouldSkipHeavyVisuals } from "@/lib/lab-environment";

const queue = [
  { id: "hale", label: "Paul Wallace · room 2", detail: "Scribe listening" },
  { id: "claim", label: "Claim · $185", detail: "Collected · out of network" },
  { id: "elena", label: "Anas · balance text", detail: "$40 still due" },
  { id: "elig", label: "Eligibility · Pinetree", detail: "Out of network · estimate" },
  { id: "sched", label: "Unconfirmed mornings", detail: "3 still open" },
];

export function HomeMetrics() {
  const rootRef = useRef<HTMLElement>(null);
  const [play, setPlay] = useState(false);
  const [settled, setSettled] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (shouldSkipHeavyVisuals()) return;
    return onUserEngagement(() => {
      if (!shouldSkipHeavyVisuals()) setPlay(true);
    });
  }, []);

  useEffect(() => {
    if (!play) return;
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % queue.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, [play]);

  return (
    <section ref={rootRef} className="border-t border-line bg-paper px-6 py-20 lg:py-28">
      <div className="mx-auto grid max-w-6xl items-stretch gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-ink p-6 text-paper sm:min-h-[28rem] sm:p-8">
          <div className="relative flex h-full flex-col">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-lift">Morning board</p>
                <div className="mt-3">
                  {play ? (
                    <CountToZero
                      steps={[23, 16, 9, 4, 1, 0]}
                      label="open tasks"
                      tone="dark"
                      onComplete={() => setSettled(true)}
                    />
                  ) : (
                    <div className="flex items-end gap-3">
                      <span className="font-mono text-6xl font-medium tabular-nums leading-none text-paper sm:text-7xl">0</span>
                      <span className="pb-[0.35em] font-mono text-[11px] uppercase tracking-[0.2em] text-paper/80">
                        open tasks
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <ZeroMark size={40} tone="paper" title="practice zero" />
            </div>

            <div className="relative mt-8 flex-1">
              <div className="pointer-events-none absolute left-[15px] top-2 bottom-2 w-px bg-paper/10" aria-hidden="true" />
              <ul className="space-y-3">
                {queue.map((item, index) => {
                  const isActive = index === active;
                  const cleared = settled && index <= active;
                  return (
                    <li
                      key={item.id}
                      className={`relative rounded-2xl border px-4 py-3 pl-10 transition-colors duration-300 ${
                        isActive ? "border-lift/50 bg-lift/15" : "border-paper/10 bg-paper/5"
                      }`}
                    >
                      <span
                        className={`absolute left-3 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full ${
                          cleared ? "bg-lift" : "bg-paper/30"
                        }`}
                      />
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-paper">{item.label}</p>
                          <p className="mt-0.5 text-xs text-paper/80">{item.detail}</p>
                        </div>
                        {isActive ? (
                          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-lift">Live</span>
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
            Paul Wallace is in room 2. The note is drafted. The claim is queued. Anas’s balance text is waiting in the outbox.
          </p>
          <Link
            href="/try/patients/pt-hale"
            prefetch={false}
            className="mt-8 inline-flex w-fit rounded-full bg-slash px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-oxide-deep"
          >
            Open Paul Wallace
          </Link>
        </div>
      </div>
    </section>
  );
}
