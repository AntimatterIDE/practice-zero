"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  FolderOpen,
  Home,
  MessageSquare,
  UserRound,
} from "lucide-react";
import { samplePractice } from "@/lib/rcm/seed";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/portal", label: "Home", icon: Home },
  { href: "/portal/profile", label: "Profile", icon: UserRound },
  { href: "/portal/messages", label: "Messages", icon: MessageSquare },
  { href: "/portal/documents", label: "Documents", icon: FolderOpen },
  { href: "/portal/updates", label: "Updates", icon: Bell },
] as const;

export function PatientPortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/portal/login") {
    return <div className="min-h-full bg-paper text-ink">{children}</div>;
  }

  return (
    <div className="min-h-full bg-paper text-ink lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="hidden border-r border-line bg-card lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-line px-4">
          <span className="grid size-8 place-items-center rounded-lg bg-slash text-[11px] font-semibold text-paper">
            PZ
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-ink">{samplePractice.legalName}</p>
            <p className="text-[11px] text-graphite">Patient experience</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3" aria-label="Patient portal">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = href === "/portal" ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  active ? "bg-slash text-paper" : "text-graphite hover:bg-mist hover:text-ink",
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.7} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-line p-4">
          <p className="text-[13px] font-medium text-ink">Jordan Hale</p>
          <p className="text-xs text-graphite">Sample patient · demo only</p>
          <Link href="/" className="mt-3 inline-block text-xs font-medium text-slash hover:text-oxide-deep">
            Back to practice zero
          </Link>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-ink">{samplePractice.legalName}</p>
              <p className="text-[11px] text-graphite">Patient experience</p>
            </div>
            <Link href="/" className="text-xs font-medium text-slash">
              Exit
            </Link>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 pb-3" aria-label="Patient portal mobile">
            {nav.map(({ href, label }) => {
              const active = href === "/portal" ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium",
                    active ? "bg-slash text-paper" : "bg-mist text-graphite",
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
