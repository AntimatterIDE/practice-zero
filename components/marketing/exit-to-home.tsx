import Link from "next/link";
import { BrandMark } from "@/components/marketing/brand-mark";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Compact for dense toolbars */
  size?: "sm" | "md";
  /** Dark surfaces (demo aside) */
  tone?: "light" | "dark";
};

/**
 * Clear escape hatch from demo / portal shells back to the marketing site.
 */
export function ExitToHome({ className, size = "sm", tone = "light" }: Props) {
  const dark = tone === "dark";
  return (
    <Link
      href="/"
      prefetch={false}
      aria-label="Home — practice zero"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5 transition-colors",
        dark
          ? "border-neutral-300 bg-white text-neutral-900 hover:border-neutral-400"
          : "border-line bg-card text-ink hover:border-slash/40 hover:bg-mist",
        className,
      )}
    >
      <BrandMark href={null} showWordmark={false} size={size === "sm" ? "sm" : "md"} />
      <span className="pr-1 text-sm font-medium tracking-tight">Home</span>
    </Link>
  );
}
