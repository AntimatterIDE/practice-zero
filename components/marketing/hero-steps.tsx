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
 * Mobile: stacked in normal flow under the copy.
 * Desktop: a right-hand column over the cloud field.
 * Clicks and hover both drive the focused step.
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
      className="relative z-20 mx-auto mt-7 flex w-full max-w-[1400px] flex-col gap-1 lg:pointer-events-none lg:absolute lg:left-8 lg:right-8 lg:top-28 lg:mx-auto lg:mt-0 lg:w-auto lg:max-w-[1400px] lg:items-end"
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
              className="group pointer-events-auto relative z-20 flex w-full cursor-pointer select-text items-center rounded-md py-1.5 text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current lg:w-72"
            >
              <span className="flex w-full flex-col lg:w-full lg:shrink-0">
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
                    active ? "text-slash" : "text-graphite"
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
