import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  href?: string | null;
  className?: string;
  showWordmark?: boolean;
  inverted?: boolean;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: { device: 22, text: "text-lg" },
  md: { device: 28, text: "text-xl" },
  lg: { device: 36, text: "text-2xl" },
};

function Device({ className, size }: { className?: string; size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 80"
      fill="none"
      width={size}
      height={Math.round(size * 1.25)}
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="32" cy="40" rx="22" ry="30" stroke="currentColor" strokeWidth="7" />
      <path d="M14 62 L50 18" stroke="#2D4BF0" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

export function BrandMark({
  href = "/",
  className,
  showWordmark = true,
  inverted = false,
  size = "md",
}: BrandMarkProps) {
  const dims = sizes[size];
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Device className={inverted ? "text-paper" : "text-ink"} size={dims.device} />
      {showWordmark ? (
        <span
          className={cn(
            "font-sans font-semibold lowercase tracking-[-0.03em]",
            dims.text,
            inverted ? "text-paper" : "text-ink",
          )}
        >
          practice zero
        </span>
      ) : null}
    </span>
  );

  if (!href) return content;
  return (
    <Link href={href} className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slash">
      {content}
    </Link>
  );
}

export function ZeroDevice({
  className,
  tone = "default",
}: {
  className?: string;
  tone?: "default" | "ink" | "slash";
}) {
  const color =
    tone === "slash" ? "text-ink" : tone === "ink" ? "text-slash" : "text-slash";
  return (
    <span className={cn("inline-flex font-mono text-[1.35em] leading-none", color, className)} aria-hidden="true">
      Ø
    </span>
  );
}
