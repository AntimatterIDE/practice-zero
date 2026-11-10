"use client";
import * as React from "react";
import { useInViewOnce } from "./hooks";

export interface ZeroListProps extends React.HTMLAttributes<HTMLUListElement> {
  /** The work that goes to zero. Lowercase, no trailing period. */
  items: string[];
  /** Text size for each row. The site's "what goes to zero" list is text-3xl. */
  textClassName?: string;
  /** "light" on paper/mist, "dark" on ink. */
  tone?: "light" | "dark";
  /** Rows rise in one by one (the brand film). Off by default so the list is readable from the first paint. */
  enter?: boolean;
}

/**
 * The Ø list. Each row is a mono Ø and a lowercase line. When the list scrolls into view, each glyph wakes from 25%
 * and a 4px cobalt bar strikes the text from the left, 0.6 s apart, as the text dims to 38%: a chart correction, not a deletion.
 * Nothing is hidden from crawlers; the strike is a pseudo-element.
 */
export function ZeroList({ items, textClassName = "text-2xl sm:text-3xl", tone = "light", enter = false, className = "", ...rest }: ZeroListProps) {
  const [ref, play] = useInViewOnce<HTMLUListElement>(0.5);
  const text = tone === "light" ? "text-ink" : "text-paper";
  const glyph = tone === "light" ? "text-slash" : "text-lift";
  return (
    <ul ref={ref} data-play={play ? "true" : "false"} data-enter={enter ? "true" : "false"} data-tone={tone} className={`pz-list flex flex-col gap-4 ${className}`.trim()} {...rest}>
      {items.map((item, i) => (
        <li key={item} className="pz-list-row flex items-center gap-4" style={{ "--i": i } as React.CSSProperties}>
          <span aria-hidden="true" className={`pz-list-glyph w-[0.8em] font-mono font-medium ${glyph} ${textClassName}`}>Ø</span>
          <span className={`pz-list-text relative inline-flex font-sans font-semibold lowercase tracking-[-0.03em] leading-[1.1] ${text} ${textClassName}`}>
            <span className="pz-list-label">{item}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
