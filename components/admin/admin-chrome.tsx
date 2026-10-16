"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/marketing/brand-mark";
import { AdminLogoutButton } from "@/components/admin/admin-logout-button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin/status", label: "Status" },
  { href: "/admin/tasks", label: "Tasks" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/research", label: "Research" },
  { href: "/admin/marketing", label: "Marketing" },
  { href: "/admin/compliance", label: "Compliance" },
  { href: "/admin/funding", label: "Funding" },
] as const;

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-full bg-paper text-ink lg:grid lg:grid-cols-[13.5rem_minmax(0,1fr)]">
      <aside className="border-b border-line bg-card lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-4 px-4 py-4">
          <BrandMark href="/admin/status" size="sm" />
          <div className="lg:hidden">
            <AdminLogoutButton />
          </div>
        </div>
        <nav
          aria-label="Admin"
          className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:px-2 lg:pb-2"
        >
          {LINKS.map((link) => {
            const active = isCurrent(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "shrink-0 rounded-lg px-3 py-2 text-sm text-graphite hover:bg-mist hover:text-ink",
                  active && "bg-mist font-medium text-ink",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden border-t border-line px-3 py-4 lg:block">
          <AdminLogoutButton className="w-full" />
        </div>
      </aside>
      <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:py-10">{children}</main>
    </div>
  );
}
