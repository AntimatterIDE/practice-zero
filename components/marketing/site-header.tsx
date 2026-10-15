"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Bell,
  Building2,
  Calendar,
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
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    setOpen(null);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(null);
        setMobile(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
          <Link
            href="/try"
            className="ml-3 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink/90"
          >
            Try the demo
          </Link>
        </nav>
        <button
          type="button"
          className="rounded-full border border-line px-3 py-1.5 text-sm text-ink md:hidden"
          aria-expanded={mobile}
          onClick={() => setMobile((value) => !value)}
        >
          Menu
        </button>
      </div>
      {mobile ? (
        <div className="absolute inset-x-0 top-full z-40 mt-3 max-h-[70vh] overflow-auto rounded-2xl border border-line bg-paper p-3 shadow-2xl md:hidden">
          {menus.map((menu) => (
            <div key={menu.id} className="border-b border-line py-2 last:border-0">
              <p className="px-2 pb-1 font-mono text-[11px] uppercase tracking-[0.16em] text-graphite">{menu.label}</p>
              {menu.items.map((item) => (
                <Link key={item.title} href={menu.href} className="block rounded-xl px-2 py-2 hover:bg-mist">
                  <span className="block text-sm font-medium text-ink">{item.title}</span>
                  <span className="block text-xs text-graphite">{item.body}</span>
                </Link>
              ))}
            </div>
          ))}
          <Link href="/try" className="mt-2 block rounded-full bg-ink px-4 py-2 text-center text-sm text-paper">
            Try the demo
          </Link>
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
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink text-paper">
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
