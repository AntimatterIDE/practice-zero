import Link from "next/link";
import { BrandMark } from "@/components/marketing/brand-mark";

const links = [
  { href: "/ehr", label: "EHR" },
  { href: "/billing", label: "Billing" },
  { href: "/marketing", label: "Marketing" },
  { href: "/ai", label: "AI" },
  { href: "/research", label: "Research" },
  { href: "/patient", label: "Patient" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
] as const;

export function MarketingHeader() {
  return (
    <header className="relative z-40">
      <div className="flex items-center justify-between gap-4">
        <BrandMark size="md" />
        <nav className="hidden items-center gap-1 md:flex" aria-label="practice zero">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch={false}
              className="rounded-full px-3 py-2 text-sm text-graphite hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/try"
            prefetch={false}
            className="ml-3 rounded-full bg-slash px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-oxide-deep"
          >
            Try the demo
          </Link>
          <Link
            href="/portal"
            prefetch={false}
            className="rounded-full px-3 py-2 text-sm font-medium text-graphite hover:text-ink"
          >
            See patient experience
          </Link>
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <Link href="/portal" prefetch={false} className="rounded-full px-3 py-1.5 text-sm text-graphite">
            Patient
          </Link>
          <Link
            href="/try"
            prefetch={false}
            className="rounded-full bg-slash px-3 py-1.5 text-sm font-medium text-paper"
          >
            Demo
          </Link>
        </div>
      </div>
    </header>
  );
}
