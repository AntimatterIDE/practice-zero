import { cn } from "@/lib/utils";

const BADGES = [
  "HIPAA",
  "SOC 2 Type II",
  "AES-256",
  "BAA available",
  "99.9% uptime",
] as const;

type Props = {
  className?: string;
  /** Dark footer surfaces use inverted contrast */
  tone?: "light" | "dark";
};

/**
 * Subtle trust marks for hero + footer — typographic, not loud logo walls.
 */
export function ComplianceBadges({ className, tone = "light" }: Props) {
  const isDark = tone === "dark";
  return (
    <ul
      aria-label="Compliance and security"
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-2",
        className,
      )}
    >
      {BADGES.map((label) => (
        <li key={label}>
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em]",
              isDark
                ? "border-paper/15 bg-paper/5 text-paper/55"
                : "border-line bg-card/80 text-graphite",
            )}
          >
            {label}
          </span>
        </li>
      ))}
    </ul>
  );
}
