import * as React from "react";
import { ZeroMark } from "./ZeroMark";

export interface AppBrandProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The practice using the app, e.g. "Northline Medical". */
  practiceName: string;
  /** Second line, e.g. "Practice desk". */
  subtitle?: string;
}

/**
 * Sidebar header for the product (/try and the real app). The heavy-cut mark on a white tile,
 * so the app carries the same mark as the marketing site. Replaces the black "PZ" tile.
 */
export function AppBrand({ practiceName, subtitle, className = "", ...rest }: AppBrandProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`.trim()} {...rest}>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border border-line bg-card">
        <ZeroMark size={30} title="practice zero" />
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block truncate text-sm font-semibold text-ink">{practiceName}</span>
        {subtitle ? <span className="block truncate text-xs text-graphite">{subtitle}</span> : null}
      </span>
    </div>
  );
}
