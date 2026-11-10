import * as React from "react";
import { ZeroMark } from "./ZeroMark";

const SIZES = { sm: "text-base", md: "text-xl", lg: "text-3xl", xl: "text-5xl" } as const;

export interface ZeroLogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** md = the site header (20px wordmark, 26px mark box). */
  size?: keyof typeof SIZES;
  /** "ink" on paper and mist; "paper" on ink sections and the footer. */
  tone?: "ink" | "paper";
  /** Play the strike once on mount: pill draws, slash lands, wordmark settles in from the left. */
  animate?: boolean;
}

/**
 * Mark + wordmark lockup, at the proportions of the Direction B primary lockup (168 : 128 : 30):
 * the mark box is 1.31em, the gap 0.23em, and the wordmark sits 0.11em above center so its x-height lines up with the slash.
 * The mark switches to the heavy cut on its own below 64px, which covers every header size.
 * Wrap it in your own <Link href="/" aria-label="practice zero home">.
 */
export function ZeroLogo({ size = "md", tone = "ink", animate = false, className = "", ...rest }: ZeroLogoProps) {
  const text = tone === "ink" ? "text-ink" : "text-paper";
  return (
    <span className={`inline-flex items-center gap-[0.23em] leading-none ${SIZES[size]} ${className}`.trim()} {...rest}>
      {/* 1.31em of a 48px wordmark is 63px, so every lockup size takes the heavy cut */}
      <ZeroMark size="1.31em" cut="heavy" tone={tone} animate={animate} />
      <span
        className={`font-sans font-semibold lowercase tracking-[-0.045em] whitespace-nowrap pb-[0.11em] ${text} ${animate ? "pz-anim-word" : ""}`.trim()}
      >
        practice zero
      </span>
    </span>
  );
}
