import Link from "next/link";
import { ZeroLogo, ZeroMark } from "@/components/brand";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  href?: string | null;
  className?: string;
  showWordmark?: boolean;
  inverted?: boolean;
  size?: "sm" | "md" | "lg";
  /** Homepage splash only. The pill draws, the slash lands, the wordmark settles. */
  animate?: boolean;
};

const logoSize = {
  sm: "sm",
  md: "md",
  lg: "lg",
} as const;

const markSize = {
  sm: 22,
  md: 28,
  lg: 36,
};

export function BrandMark({
  href = "/",
  className,
  showWordmark = true,
  inverted = false,
  size = "md",
  animate = false,
}: BrandMarkProps) {
  const tone = inverted ? "paper" : "ink";
  const content = showWordmark ? (
    <ZeroLogo size={logoSize[size]} tone={tone} animate={animate} className={className} />
  ) : (
    <ZeroMark size={markSize[size]} tone={tone} cut="heavy" className={className} />
  );

  if (!href) return content;
  return (
    <Link
      href={href}
      aria-label="practice zero home"
      className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slash"
    >
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
  const color = tone === "ink" ? "text-lift" : tone === "slash" ? "text-paper" : "text-slash";
  return (
    <span className={cn("inline-flex font-mono text-[1.35em] font-medium leading-none", color, className)} aria-hidden="true">
      Ø
    </span>
  );
}
