"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
  billingLinks,
  currentDeskLabel,
  isActiveDesk,
  practiceLinks,
  type DeskLink,
} from "@/components/admin/admin-nav";
import { ResetDemoButton } from "@/components/admin/reset-demo";
import { BrandMark } from "@/components/marketing/brand-mark";
import { ExitToHome } from "@/components/marketing/exit-to-home";
import { samplePractice } from "@/lib/rcm/seed";
import { cn } from "@/lib/utils";

type SectionId = "clinic" | "billing";

function MobileSection({
  id,
  label,
  links,
  expanded,
  onToggle,
  onNavigate,
  pathname,
}: {
  id: SectionId;
  label: string;
  links: DeskLink[];
  expanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
  pathname: string;
}) {
  const sectionActive = links.some((link) => isActiveDesk(pathname, link.href));

  return (
    <li>
      <button
        type="button"
        aria-expanded={expanded}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
      >
        <span className="min-w-0">
          <span className="block text-[15px] font-medium text-ink">{label}</span>
          <span className="block truncate text-xs text-graphite">
            {sectionActive
              ? links.find((link) => isActiveDesk(pathname, link.href))?.title
              : `${links.length} desks`}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-graphite transition-transform duration-200",
            expanded && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      {expanded ? (
        <ul className="space-y-0.5 border-t border-line bg-mist/50 px-2 py-2">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActiveDesk(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  prefetch={false}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-paper",
                    active && "bg-paper",
                  )}
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-slash/10 text-slash">
                    <Icon className="size-3.5" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-ink">{link.title}</span>
                    <span className="block truncate text-xs text-graphite">{link.body}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </li>
  );
}

export function AdminMobileBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<SectionId | null>("clinic");
  const label = currentDeskLabel(pathname);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="sticky top-0 z-30 border-b border-line bg-paper lg:hidden">
      <div className="flex h-14 items-center gap-2 px-3">
        <ExitToHome />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-graphite">{samplePractice.legalName}</p>
          <p className="truncate text-[13px] font-medium text-ink">{label}</p>
        </div>
        <button
          type="button"
          className="inline-flex h-9 items-center rounded-full border border-line px-3.5 text-sm font-medium text-ink"
          aria-expanded={open}
          aria-controls="demo-mobile-nav"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open ? (
        <div
          id="demo-mobile-nav"
          className="fixed inset-0 z-50 flex flex-col bg-paper"
          role="dialog"
          aria-modal="true"
          aria-label="Demo menu"
        >
          <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3">
            <BrandMark href={null} size="md" />
            <button
              type="button"
              className="inline-flex h-9 items-center rounded-full border border-line px-3.5 text-sm font-medium text-ink"
              onClick={close}
            >
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
            <nav aria-label="Demo desks" className="mx-auto w-full max-w-lg">
              <p className="mb-3 px-1 text-xs text-graphite">
                {samplePractice.legalName} · practice desk demo
              </p>
              <ul className="divide-y divide-line rounded-2xl border border-line bg-card">
                <MobileSection
                  id="clinic"
                  label="Clinic"
                  links={practiceLinks}
                  expanded={section === "clinic"}
                  onToggle={() => setSection((s) => (s === "clinic" ? null : "clinic"))}
                  onNavigate={close}
                  pathname={pathname}
                />
                <MobileSection
                  id="billing"
                  label="Billing"
                  links={billingLinks}
                  expanded={section === "billing"}
                  onToggle={() => setSection((s) => (s === "billing" ? null : "billing"))}
                  onNavigate={close}
                  pathname={pathname}
                />
              </ul>

              <ul className="mt-3 divide-y divide-line rounded-2xl border border-line bg-card">
                <li>
                  <Link
                    href="/"
                    prefetch={false}
                    onClick={close}
                    className="block px-4 py-3.5 text-[15px] font-medium text-ink"
                  >
                    Back to practice zero
                  </Link>
                </li>
                <li>
                  <Link
                    href="/portal"
                    prefetch={false}
                    onClick={close}
                    className="block px-4 py-3.5 text-[15px] font-medium text-ink"
                  >
                    See patient experience
                  </Link>
                </li>
              </ul>

              <div className="mt-4 px-1">
                <ResetDemoButton />
              </div>
            </nav>
          </div>

          <div className="shrink-0 space-y-2 border-t border-line bg-paper px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <Link
              href="/try"
              prefetch={false}
              onClick={close}
              className="block rounded-full bg-slash px-4 py-3 text-center text-sm font-medium text-paper hover:bg-oxide-deep"
            >
              Morning board
            </Link>
            <Link
              href="/contact"
              prefetch={false}
              onClick={close}
              className="block rounded-full border border-line px-4 py-3 text-center text-sm font-medium text-ink hover:bg-mist"
            >
              Request a consultation
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
