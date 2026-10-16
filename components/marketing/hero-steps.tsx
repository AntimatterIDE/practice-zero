"use client";

import { useEffect, useState } from "react";

const STEPS = [
  { name: "Visits completed", count: 1284 },
  { name: "Charts closed", count: 1102, share: "85.8", left: 182 },
  { name: "Claims submitted", count: 986, share: "89.5", left: 116 },
  { name: "Payments posted", count: 841, share: "85.3", left: 145 },
] as const;

function formatCount(value: number) {
  return value.toLocaleString("en-US");
}

/**
 * Desktop: absolutely positioned by the funnel (section-relative left/top/right).
 * Mobile: stacked in normal flow. Clicks and hover both drive the focused step.
 */
export function HeroSteps() {
  const [selected, setSelected] = useState(1);

  useEffect(() => {
    const onFocus = (event: Event) => {
      const index = (event as CustomEvent<number>).detail;
      if (typeof index === "number" && index >= 0 && index < STEPS.length) {
        setSelected(index);
      }
    };
    window.addEventListener("pz-funnel-focus", onFocus);
    return () => window.removeEventListener("pz-funnel-focus", onFocus);
  }, []);

  return (
    <ol
      id="pz-hero-steps"
      aria-label="Revenue cycle steps"
      className="relative z-20 mx-auto mt-7 flex w-full max-w-[1400px] flex-col gap-1 lg:pointer-events-none lg:absolute lg:inset-0 lg:mx-0 lg:mt-0 lg:max-w-none lg:px-8 lg:pt-28"
    >
      {STEPS.map((step, index) => {
        const active = index === selected;
        return (
          <li key={step.name} className="contents">
            <div
              role="button"
              tabIndex={0}
              data-funnel-step={index}
              aria-pressed={active}
              onClick={() => {
                setSelected(index);
                window.dispatchEvent(new CustomEvent("pz-funnel-select", { detail: index }));
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelected(index);
                  window.dispatchEvent(new CustomEvent("pz-funnel-select", { detail: index }));
                }
              }}
              className="group pointer-events-auto relative z-20 flex w-full cursor-pointer select-text items-center rounded-md py-1.5 text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current lg:absolute lg:w-auto lg:-translate-y-1/2 lg:py-1"
            >
              <span
                aria-hidden="true"
                className={`mr-4 hidden h-px flex-1 transition-colors duration-500 lg:block ${
                  active ? "bg-slash" : "bg-ink/15"
                }`}
              />
              <span className="flex w-full flex-col lg:w-56 lg:shrink-0">
                <span
                  className={`flex items-baseline justify-between gap-4 text-sm font-medium ${
                    active ? "text-ink" : "text-graphite group-hover:text-ink"
                  }`}
                >
                  {step.name}
                  <span className="tabular-nums">{formatCount(step.count)}</span>
                </span>
                <span
                  className={`mt-0.5 whitespace-nowrap text-xs tabular-nums ${
                    active && index > 0 ? "text-slash" : "text-graphite"
                  }`}
                >
                  {index === 0
                    ? "This week, updating live"
                    : `${"share" in step ? step.share : ""}% continued · ${formatCount(
                        "left" in step ? step.left : 0,
                      )} still open`}
                </span>
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
