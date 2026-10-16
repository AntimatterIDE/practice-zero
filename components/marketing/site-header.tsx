"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Bell,
  Building2,
  Calendar,
  ChevronDown,
  ClipboardList,
  FileCheck,
  FileText,
  Fingerprint,
  Inbox,
  Landmark,
  ListChecks,
  MessageSquare,
  Mic,
  Search,
  Share2,
  ShieldCheck,
  Stethoscope,
  User,
  type LucideIcon,
} from "lucide-react";
import { BrandMark } from "@/components/marketing/brand-mark";
import { cn } from "@/lib/utils";

type Item = { title: string; body: string; icon: LucideIcon };

const menus: { id: string; label: string; href: string; items: Item[] }[] = [
  {
    id: "ehr",
    label: "EHR",
    href: "/ehr",
    items: [
      { title: "Patients", body: "The chart, already open", icon: User },
      { title: "Visits", body: "Rooms in the middle of the morning", icon: Stethoscope },
      { title: "Scribe", body: "Dictation settling into the note", icon: Mic },
      { title: "Intake", body: "Answers on file before the visit", icon: ClipboardList },
      { title: "Agreements", body: "Consent, already signed", icon: FileCheck },
      { title: "Tasks", body: "Work still open beside the rooms", icon: ListChecks },
      { title: "Requests", body: "Someone asking for a morning", icon: Inbox },
    ],
  },
  {
    id: "billing",
    label: "Billing",
    href: "/billing",
    items: [
      { title: "Collect from payers", body: "Enroll for EFTs and collect payment", icon: Landmark },
      { title: "Find the coverage", body: "Coverage and benefits for the patient", icon: Search },
      { title: "Coverage from demographics", body: "A name and a date of birth", icon: Fingerprint },
      { title: "Eligibility", body: "A check in the moment, or a batch", icon: ShieldCheck },
      { title: "Claims", body: "Submit, track, and take the remittance", icon: FileText },
      { title: "Payers", body: "The plan sitting on the chart", icon: Building2 },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    href: "/marketing",
    items: [
      { title: "Outreach", body: "A text waiting in the outbox", icon: MessageSquare },
      { title: "Follow-up", body: "The next touch after the visit", icon: Bell },
      { title: "Scheduling", body: "The day, including who is still unconfirmed", icon: Calendar },
      { title: "SEO", body: "How a new patient finds the practice", icon: Search },
      { title: "Social", body: "How the practice shows up", icon: Share2 },
    ],
  },
  {
    id: "patient",
    label: "Patient",
    href: "/patient",
    items: [
      { title: "Patient profile", body: "Demographics, coverage, and preferences", icon: User },
      { title: "Portal login", body: "A secure door into their record", icon: ShieldCheck },
      { title: "Messages", body: "Talk with the practice between visits", icon: MessageSquare },
      { title: "Documents", body: "Upload cards, IDs, and forms", icon: FileText },
      { title: "Updates", body: "Appointments, results, and balances", icon: Bell },
    ],
  },
];

const flatLinks = [
  { href: "/ai", label: "AI" },
  { href: "/research", label: "Research" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    setOpen(null);
    setMobile(false);
    setMobileSection(null);
  }, [pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(null);
        setMobile(false);
        setMobileSection(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!mobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobile]);

  const clearClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  };

  const scheduleClose = () => {
    clearClose();
    closeTimer.current = window.setTimeout(() => setOpen(null), 140);
  };

  return (
    <header className="relative z-40" onMouseLeave={scheduleClose}>
      <div className="flex items-center justify-between gap-4">
        <BrandMark size="md" />
        <nav className="hidden items-center gap-1 md:flex" aria-label="practice zero">
          {menus.map((menu) => {
            const active = pathname === menu.href;
            const shown = open === menu.id;
            return (
              <div
                key={menu.id}
                className="relative"
                onMouseEnter={() => {
                  clearClose();
                  setOpen(menu.id);
                }}
              >
                <button
                  type="button"
                  aria-expanded={shown}
                  aria-controls={`${menu.id}-menu`}
                  onClick={() => setOpen(shown ? null : menu.id)}
                  className={cn(
                    "rounded-full px-3 py-2 text-sm text-graphite hover:text-ink",
                    (shown || active) && "text-ink",
                  )}
                >
                  {menu.label}
                </button>
                {shown ? <MenuPanel menu={menu} /> : null}
              </div>
            );
          })}
          {flatLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-3 py-2 text-sm text-graphite hover:text-ink",
                (link.href === "/research"
                  ? pathname.startsWith("/research")
                  : pathname === link.href) && "text-ink",
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/try"
            className="ml-3 rounded-full bg-slash px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-oxide-deep"
          >
            Try the demo
          </Link>
          <Link
            href="/portal"
            className="rounded-full px-3 py-2 text-sm font-medium text-graphite hover:text-ink"
          >
            See patient experience
          </Link>
        </nav>
        <button
          type="button"
          className="inline-flex h-9 items-center rounded-full border border-line px-3.5 text-sm font-medium text-ink md:hidden"
          aria-expanded={mobile}
          aria-controls="mobile-nav"
          onClick={() => setMobile((value) => !value)}
        >
          {mobile ? "Close" : "Menu"}
        </button>
      </div>

      {mobile ? (
        <div
          id="mobile-nav"
          className="fixed inset-0 z-50 flex flex-col bg-paper md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3">
            <BrandMark size="md" />
            <button
              type="button"
              className="inline-flex h-9 items-center rounded-full border border-line px-3.5 text-sm font-medium text-ink"
              onClick={() => setMobile(false)}
            >
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
            <nav aria-label="Mobile" className="mx-auto w-full max-w-lg">
              <ul className="divide-y divide-line rounded-2xl border border-line bg-card">
                {menus.map((menu) => {
                  const expanded = mobileSection === menu.id;
                  return (
                    <li key={menu.id}>
                      <button
                        type="button"
                        aria-expanded={expanded}
                        onClick={() =>
                          setMobileSection(expanded ? null : menu.id)
                        }
                        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                      >
                        <span className="text-[15px] font-medium text-ink">
                          {menu.label}
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
                          <li>
                            <Link
                              href={menu.href}
                              className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slash"
                            >
                              Overview
                            </Link>
                          </li>
                          {menu.items.map((item) => {
                            const Icon = item.icon;
                            return (
                              <li key={item.title}>
                                <Link
                                  href={menu.href}
                                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-paper"
                                >
                                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-slash/10 text-slash">
                                    <Icon className="size-3.5" />
                                  </span>
                                  <span className="min-w-0">
                                    <span className="block text-sm font-medium text-ink">
                                      {item.title}
                                    </span>
                                    <span className="block truncate text-xs text-graphite">
                                      {item.body}
                                    </span>
                                  </span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                    </li>
                  );
                })}
              </ul>

              <ul className="mt-3 divide-y divide-line rounded-2xl border border-line bg-card">
                {flatLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block px-4 py-3.5 text-[15px] font-medium text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="shrink-0 space-y-2 border-t border-line bg-paper px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <Link
              href="/try"
              className="block rounded-full bg-slash px-4 py-3 text-center text-sm font-medium text-paper hover:bg-oxide-deep"
            >
              Try the demo
            </Link>
            <Link
              href="/portal"
              className="block rounded-full border border-line px-4 py-3 text-center text-sm font-medium text-ink hover:bg-mist"
            >
              See patient experience
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function MenuPanel({ menu }: { menu: (typeof menus)[number] }) {
  const panel = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);

  useEffect(() => {
    const element = panel.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const pad = 16;
    let next = 0;
    if (rect.right > window.innerWidth - pad) next = window.innerWidth - pad - rect.right;
    if (rect.left + next < pad) next += pad - (rect.left + next);
    setShift(next);
  }, [menu.id]);

  return (
    <div
      ref={panel}
      id={`${menu.id}-menu`}
      style={{ transform: `translateX(calc(-50% + ${shift}px))` }}
      className="absolute left-1/2 top-full z-50 w-80 pt-3"
    >
      <div className="rounded-2xl border border-line bg-paper p-2 shadow-[0_24px_60px_-28px_rgba(17,20,24,0.45)]">
        {menu.items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={menu.href}
              className="flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-mist"
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slash/10 text-slash">
                <Icon className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-sm font-medium text-ink">{item.title}</span>
                <span className="block text-xs leading-relaxed text-graphite">{item.body}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
