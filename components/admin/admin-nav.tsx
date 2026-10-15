"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const practiceLinks = [
  ["/try", "Today"],
  ["/try/patients", "Patients"],
  ["/try/scheduling", "Schedule"],
  ["/try/visits", "Visits"],
  ["/try/consultations", "Requests"],
  ["/try/intake", "Intake"],
  ["/try/agreements", "Agreements"],
  ["/try/tasks", "Tasks"],
  ["/try/people", "People"],
  ["/try/practice", "Practice"],
] as const;

const billingLinks = [
  ["/try/claims", "Claims"],
  ["/try/eligibility", "Eligibility"],
  ["/try/denials", "Denials"],
  ["/try/payments", "Payments"],
  ["/try/claims/drafts", "Drafts"],
  ["/try/upload", "Upload"],
  ["/try/analytics", "Analytics"],
  ["/try/tools", "Tools"],
] as const;

function isActive(pathname: string, href: string) {
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
  links: readonly (readonly [string, string])[];
  pathname: string;
}) {
  return (
    <div className="mt-6 first:mt-0">
      <p className="mb-1 px-3 text-[11px] font-medium uppercase tracking-wider text-neutral-500">{label}</p>
      <div className="grid gap-0.5">
        {links.map(([href, title]) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex min-h-10 items-center rounded-[var(--rb-r-md,8px)] px-3 text-[13px] text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
                active && "bg-neutral-100 font-medium text-neutral-900",
              )}
              aria-current={active ? "page" : undefined}
            >
              {title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function currentDeskLabel(pathname: string) {
  const links = [...practiceLinks, ...billingLinks];
  return links.find(([href]) => isActive(pathname, href))?.[1] ?? "Desk";
}

export function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Practice" onClick={onNavigate}>
      <Group label="Clinic" links={practiceLinks} pathname={pathname} />
      <Group label="Billing" links={billingLinks} pathname={pathname} />
    </nav>
  );
}
