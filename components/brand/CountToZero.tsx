"use client";
import * as React from "react";
import { useInViewOnce, usePrefersReducedMotion } from "./hooks";

export interface CountToZeroProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The values shown on the way down. The last one must be 0. */
  steps?: number[];
  /** Mono label beside the number, as on the site's morning board. */
  label?: string;
  /** "dark" = paper on ink (the morning board); "light" = ink on paper. */
  tone?: "dark" | "light";
  /** Milliseconds per step. The brand film uses 400. */
  stepMs?: number;
  /** Tailwind text size for the numeral. */
  numeralClassName?: string;
  /** What happens when the count reaches zero: keep the label (site board) or swap it for the rising wordmark (opener). */
  resolve?: "label" | "wordmark";
  /** Called with the step index each time the number changes (0 = first value). */
  onStep?: (index: number) => void;
  onComplete?: () => void;
}

/**
 * Count to zero: the open-task count ticks down in JetBrains Mono when the board scrolls into view.
 * At zero the digit dims and the mark draws over it: the pill from the top, then the slash. The last zero becomes the mark.
 * Screen readers only hear the final count.
 */
export function CountToZero({
  steps = [128, 96, 57, 23, 8, 3, 1, 0],
  label = "open tasks",
  tone = "dark",
  stepMs = 400,
  numeralClassName = "text-6xl sm:text-7xl",
  resolve = "label",
  onStep,
  onComplete,
  className = "",
  ...rest
}: CountToZeroProps) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();
  const [i, setI] = React.useState(0);
  const last = steps.length - 1;
  const done = i >= last;
  const onCompleteRef = React.useRef(onComplete);
  onCompleteRef.current = onComplete;
  const onStepRef = React.useRef(onStep);
  onStepRef.current = onStep;
  React.useEffect(() => { onStepRef.current?.(Math.min(i, last)); }, [i, last]);

  React.useEffect(() => {
    if (!inView) return;
    if (reduced && i < last) { setI(last); return; }
    if (i >= last) { onCompleteRef.current?.(); return; }
    const t = window.setTimeout(() => setI((n) => n + 1), stepMs);
    return () => window.clearTimeout(t);
  }, [inView, reduced, i, last, stepMs]);

  const numeral = tone === "dark" ? "text-paper" : "text-ink";
  const dim = tone === "dark" ? "text-dim" : "text-graphite/60";
  const muted = tone === "dark" ? "text-paper/80" : "text-graphite";
  const ring = tone === "dark" ? "text-paper" : "text-ink";
  const slash = tone === "dark" ? "var(--color-lift, #7D93FF)" : "var(--color-slash, #2D4BF0)";

  return (
    <div ref={ref} className={`flex items-end gap-3 ${className}`.trim()} {...rest}>
      <span className="sr-only">{`${steps[last]} ${label}`}</span>
      <span aria-hidden="true" className={`relative inline-grid place-items-center font-mono font-medium leading-none tabular-nums ${done ? dim : numeral} ${numeralClassName}`}>
        <span className="col-start-1 row-start-1">{steps[Math.min(i, last)]}</span>
        {done ? (
          <svg viewBox="0 0 100 100" fill="none" className={`pointer-events-none col-start-1 row-start-1 h-[1.25em] w-[1.25em] ${ring}`}>
            <rect x="23" y="9" width="54" height="82" rx="27" stroke="currentColor" strokeWidth={12} pathLength={100} className="pz-count-pill" />
            <line x1="42" y1="60" x2="58" y2="40" stroke={slash} strokeWidth={12} strokeLinecap="round" pathLength={100} className="pz-count-slash" />
          </svg>
        ) : null}
      </span>
      {done && resolve === "wordmark" ? (
        <span aria-hidden="true" className={`pz-count-word pb-[0.2em] font-sans text-[0.4em] font-semibold lowercase leading-none tracking-[-0.045em] ${numeral}`}>practice zero</span>
      ) : (
        <span aria-hidden="true" className={`pb-[0.35em] font-mono text-[11px] uppercase tracking-[0.2em] ${muted} ${done && resolve === "wordmark" ? "hidden" : ""}`}>{label}</span>
      )}
    </div>
  );
}
