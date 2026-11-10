import * as React from "react";

export interface ZeroLoaderProps extends Omit<React.SVGProps<SVGSVGElement>, "ref"> {
  /** CSS length. Default 1.25em, so it sits next to button text at any size. */
  size?: number | string;
  /** Ring color: "ink" on paper, "paper" on ink sections and inside ink buttons, "current" inherits. */
  tone?: "ink" | "paper" | "current";
  /** "brand" = cobalt on an ink ring, lifted #7D93FF on a paper ring. "ring" = one color with the ring (use inside cobalt buttons). */
  slashTone?: "brand" | "ring";
  /** Announced to screen readers. Pass "" when nearby text already says what's happening. */
  label?: string;
}

/**
 * Working state: the slash turns half a turn inside the zero like a dial, then rests. 1.4 s per turn.
 * A half turn lands on the same line, so the loop is seamless. The ring never moves.
 * Always the heavy cut, because loaders live at button size.
 */
export function ZeroLoader({
  size = "1.25em",
  tone = "ink",
  slashTone = "brand",
  label = "Working",
  className = "",
  ...rest
}: ZeroLoaderProps) {
  const ring = tone === "ink" ? "text-ink" : tone === "paper" ? "text-paper" : "";
  const slash =
    slashTone === "ring" ? "currentColor" : tone === "paper" ? "var(--color-lift, #7D93FF)" : "var(--color-slash, #2D4BF0)";
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      style={{ height: size, width: size }}
      className={`inline-block shrink-0 align-[-0.3em] ${ring} ${className}`.trim()}
      role={label ? "status" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      {...rest}
    >
      <rect x="22.5" y="8.5" width="55" height="83" rx="27.5" stroke="currentColor" strokeWidth={15} />
      <line x1="43" y1="59" x2="57" y2="41" stroke={slash} strokeWidth={15} strokeLinecap="round" className="pz-turn" />
    </svg>
  );
}
