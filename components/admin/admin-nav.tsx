"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  BarChart3,
  Building2,
  Bell,
  Calendar,
  CalendarDays,
  CheckSquare,
  ClipboardList,
  FileEdit,
  FileSignature,
  Inbox,
  Receipt,
  ShieldCheck,
  Stethoscope,
  Upload,
  Users,
  UsersRound,
  Wallet,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type DeskLink = {
  href: string;
  title: string;
  body: string;
  icon: LucideIcon;
};

export const practiceLinks: DeskLink[] = [
  { href: "/try", title: "Today", body: "Morning board and open work", icon: CalendarDays },
  { href: "/try/patients", title: "Patients", body: "Charts, e-prescribe, labs, and history", icon: Users },
  { href: "/try/scheduling", title: "Schedule", body: "Day view and booking", icon: Calendar },
  { href: "/try/desk", title: "Desk", body: "Checkout, add-ons, and return visits", icon: Bell },
  { href: "/try/visits", title: "Visits", body: "Rooms, status, and notes", icon: Stethoscope },
  { href: "/try/consultations", title: "Requests", body: "New patients and questions", icon: Inbox },
  { href: "/try/intake", title: "Intake", body: "Forms before the visit", icon: ClipboardList },
  { href: "/try/agreements", title: "Agreements", body: "Consents and signatures", icon: FileSignature },
  { href: "/try/tasks", title: "Tasks", body: "Follow-ups and open loops", icon: CheckSquare },
  { href: "/try/people", title: "People", body: "Staff on this practice", icon: UsersRound },
  { href: "/try/practice", title: "Practice", body: "Profile and settings", icon: Building2 },
];

export const billingLinks: DeskLink[] = [
  { href: "/try/claims", title: "Claims", body: "Coding through remittance", icon: Receipt },
  { href: "/try/eligibility", title: "Eligibility", body: "Out-of-network benefits", icon: ShieldCheck },
  { href: "/try/denials", title: "Denials", body: "Rework and appeals", icon: AlertCircle },
  { href: "/try/payments", title: "Payments", body: "Patient pay, posting, and balances", icon: Wallet },
  { href: "/try/claims/drafts", title: "Drafts", body: "Claims not yet submitted", icon: FileEdit },
  { href: "/try/upload", title: "Upload", body: "Import remits and files", icon: Upload },
  { href: "/try/analytics", title: "Analytics", body: "Collections and backlog", icon: BarChart3 },
  { href: "/try/tools", title: "Fee schedule", body: "Cash fees by CPT", icon: Wrench },
];

export function isActiveDesk(pathname: string, href: string) {
  if (href === "/try") return pathname === href;
  if (href === "/try/claims") {
    return pathname === href || (pathname.startsWith(`${href}/`) && !pathname.startsWith(`${href}/drafts`));
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Group({
  label,
  links,
  pathname,
}: {
  label: string;
  links: DeskLink[];
  pathname: string;
}) {
  return (
    <div className="mt-6 first:mt-0">
      <p className="mb-1 px-3 text-[11px] font-medium uppercase tracking-wider text-neutral-500">{label}</p>
      <div className="grid gap-0.5">
        {links.map((link) => {
          const active = isActiveDesk(pathname, link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex min-h-10 items-center rounded-[var(--rb-r-md,8px)] px-3 text-[13px] text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
                active && "bg-neutral-100 font-medium text-neutral-900",
              )}
              aria-current={active ? "page" : undefined}
            >
              {link.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function currentDeskLabel(pathname: string) {
  const links = [...practiceLinks, ...billingLinks];
  return links.find((link) => isActiveDesk(pathname, link.href))?.title ?? "Desk";
}

/** Desktop sidebar — compact text list. */
export function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Practice" onClick={onNavigate}>
      <Group label="Clinic" links={practiceLinks} pathname={pathname} />
      <Group label="Billing" links={billingLinks} pathname={pathname} />
    </nav>
  );
}
