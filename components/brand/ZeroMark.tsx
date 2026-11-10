import * as React from "react";

export type ZeroTone = "ink" | "paper" | "current";
export type ZeroCut = "auto" | "standard" | "heavy";

export interface ZeroMarkProps extends Omit<React.SVGProps<SVGSVGElement>, "ref"> {
  /** Box size in px (or any CSS length). The mark sits in a square 100-unit box; the pill fills 54 × 82 of it. Default 42 (1.31 × a 32px wordmark). */
  size?: number | string;
  /** Ring color. "ink" on paper and mist, "paper" on ink, "current" inherits text color. */
  tone?: ZeroTone;
  /** "brand" = cobalt on light, lifted #7D93FF on ink. "mono" = one color with the ring. */
  slash?: "brand" | "mono";
  /** "heavy" is the 15-unit stroke for 64px and below. "auto" picks by size when size is a number. */
  cut?: ZeroCut;
  /** Play the strike on mount: the pill draws from the top, then the slash lands. */
  animate?: boolean;
  /** Accessible name. Omit when the mark sits next to the wordmark (it's then decorative). */
  title?: string;
}

const RING = { ink: "text-ink", paper: "text-paper", current: "" } as const;

/**
 * The Practice Zero mark (Direction B): a pill-shaped zero with a short diagonal slash inside it.
 * Geometry: pill 54 × 82, rx 27, stroke 12; slash from 42,60 to 58,40 at 51°, round caps. The slash never touches the ring.
 * Heavy cut at 64px and below: pill 55 × 83, rx 27.5, stroke 15; slash 43,59 to 57,41.
 * On ink the slash lifts to #7D93FF (cobalt is too dark on ink).
 */
export function ZeroMark({
  size = 42,
  tone = "ink",
  slash = "brand",
  cut = "auto",
  animate = false,
  title,
  className = "",
  ...rest
}: ZeroMarkProps) {
  const px = typeof size === "number" ? size : undefined;
  const heavy = cut === "heavy" || (cut === "auto" && px !== undefined && px <= 64);
  const titleId = React.useId();
  const a11y = title ? { role: "img" as const, "aria-labelledby": titleId } : { "aria-hidden": true as const };
  const slashColor =
    slash === "mono" ? "currentColor" : tone === "paper" ? "var(--color-lift, #7D93FF)" : "var(--color-slash, #2D4BF0)";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      width={size}
      height={size}
      className={`shrink-0 ${RING[tone]} ${className}`.trim()}
      {...a11y}
      {...rest}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      {heavy ? (
        <>
          <rect x="22.5" y="8.5" width="55" height="83" rx="27.5" stroke="currentColor" strokeWidth={15} pathLength={100} className={animate ? "pz-anim-pill" : undefined} />
          <line x1="43" y1="59" x2="57" y2="41" stroke={slashColor} strokeWidth={15} strokeLinecap="round" pathLength={100} className={animate ? "pz-anim-slash" : undefined} />
        </>
      ) : (
        <>
          <rect x="23" y="9" width="54" height="82" rx="27" stroke="currentColor" strokeWidth={12} pathLength={100} className={animate ? "pz-anim-pill" : undefined} />
          <line x1="42" y1="60" x2="58" y2="40" stroke={slashColor} strokeWidth={12} strokeLinecap="round" pathLength={100} className={animate ? "pz-anim-slash" : undefined} />
        </>
      )}
    </svg>
  );
}
