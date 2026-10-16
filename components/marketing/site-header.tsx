"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Bell,
  Building2,
  Calendar,
  CalendarClock,
  ChevronDown,
  ClipboardList,
  Cpu,
  FileCheck,
  FileText,
  Fingerprint,
  Globe,
  Headphones,
  Inbox,
  Landmark,
  ListChecks,
  MessageSquare,
  Mic,
  Mic2,
  Search,
  Share2,
  ShieldCheck,
  Stethoscope,
  User,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { BrandMark } from "@/components/marketing/brand-mark";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Item = { title: string; body: string; icon: LucideIcon; href?: string };

type MegaMenu = {
  id: string;
  label: string;
  href: string;
  kicker: string;
  blurb: string;
  items: Item[];
  feature: "scribe" | "claims" | "outreach" | "portal" | "agents" | "onboarding";
};

const menus: MegaMenu[] = [
  {
    id: "ehr",
    label: "EHR",
    href: "/ehr",
    kicker: "Chart",
    blurb: "Patients, visits, and the scribe on one morning board.",
    feature: "scribe",
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
    kicker: "RCM",
    blurb: "Eligibility, claims, and remittance without the chase.",
    feature: "claims",
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
    kicker: "Growth",
    blurb: "Outreach, follow-up, and how new patients find you.",
    feature: "outreach",
    items: [
      { title: "Outreach", body: "A text waiting in the outbox", icon: MessageSquare },
      { title: "Follow-up", body: "The next touch after the visit", icon: Bell },
      { title: "Scheduling", body: "Who is still unconfirmed", icon: Calendar },
      { title: "SEO", body: "How a new patient finds the practice", icon: Search },
      { title: "Social", body: "How the practice shows up", icon: Share2 },
    ],
  },
  {
    id: "patient",
    label: "Patient",
    href: "/patient",
    kicker: "Portal",
    blurb: "Profile, messages, documents, and updates patients can reach.",
    feature: "portal",
    items: [
      { title: "Patient profile", body: "Demographics, coverage, and preferences", icon: User },
      {
        title: "Portal login",
        body: "A secure door into their record",
        icon: ShieldCheck,
        href: "/portal/login",
      },
      {
        title: "Messages",
        body: "Talk with the practice between visits",
        icon: MessageSquare,
        href: "/portal/messages",
      },
      {
        title: "Documents",
        body: "Upload cards, IDs, and forms",
        icon: FileText,
        href: "/portal/documents",
      },
      {
        title: "Updates",
        body: "Appointments, results, and balances",
        icon: Bell,
        href: "/portal/updates",
      },
    ],
  },
  {
    id: "ai",
    label: "AI",
    href: "/ai",
    kicker: "Agentic EHR",
    blurb: "Agents own the loops — scheduling, claims, payments, follow-ups.",
    feature: "agents",
    items: [
      { title: "Agentic EHR", body: "Space and hardware, not a front-desk army", icon: Cpu },
      { title: "Room hardware", body: "Visits recorded and handed to agents", icon: Mic2 },
      { title: "Scheduling agents", body: "Recalls and confirms under your rules", icon: CalendarClock },
      { title: "Claims agents", body: "Clean prep and denial follow-through", icon: FileText },
      { title: "Payment tracking", body: "Balances and remits already open", icon: Wallet },
      { title: "You keep the keys", body: "Approvals and audit stay with you", icon: ShieldCheck },
    ],
  },
  {
    id: "onboarding",
    label: "Onboarding",
    href: "/onboarding",
    kicker: "Go-live",
    blurb: "Unlimited hours until the practice is ready — then 24/7 for the contract.",
    feature: "onboarding",
    items: [
      { title: "Engineers & managers", body: "A team on your integration, not a ticket queue", icon: Users },
      { title: "Unlimited hours", body: "We work until your needs are met", icon: Headphones },
      { title: "Custom website", body: "Included at no extra charge", icon: Globe },
      { title: "24/7 support", body: "Uptime and maintenance for the life of the contract", icon: ShieldCheck },
    ],
  },
];

const flatLinks = [
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
  const reduce = useReducedMotion();

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
    closeTimer.current = window.setTimeout(() => setOpen(null), 160);
  };

  const activeMenu = menus.find((m) => m.id === open) ?? null;

  return (
    <header className="relative z-50" onMouseLeave={scheduleClose}>
      <div className="flex items-center justify-between gap-4">
        <BrandMark size="md" />
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="practice zero">
          {menus.map((menu) => {
            const active =
              pathname === menu.href ||
              (menu.href !== "/" && pathname.startsWith(`${menu.href}/`));
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
                <Link
                  href={menu.href}
                  prefetch={false}
                  aria-expanded={shown}
                  aria-haspopup="true"
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm text-graphite transition-colors hover:text-ink",
                    (shown || active) && "text-ink",
                  )}
                >
                  {menu.label}
                  <ChevronDown
                    className={cn(
                      "size-3.5 text-graphite/70 transition-transform duration-200",
                      shown && "rotate-180 text-slash",
                    )}
                    aria-hidden
                  />
                </Link>
              </div>
            );
          })}
          {flatLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch={false}
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
            prefetch={false}
            className="ml-2 rounded-full bg-slash px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-oxide-deep"
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

        <button
          type="button"
          className="inline-flex h-9 items-center rounded-full border border-line px-3.5 text-sm font-medium text-ink lg:hidden"
          aria-expanded={mobile}
          aria-controls="mobile-nav"
          onClick={() => setMobile((value) => !value)}
        >
          {mobile ? "Close" : "Menu"}
        </button>
      </div>

      <AnimatePresence>
        {activeMenu ? (
          <MegaPanel
            key={activeMenu.id}
            menu={activeMenu}
            reduce={!!reduce}
            onEnter={clearClose}
          />
        ) : null}
      </AnimatePresence>

      {mobile ? (
        <div
          id="mobile-nav"
          className="fixed inset-0 z-50 flex flex-col bg-paper lg:hidden"
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
                      <div className="flex items-stretch">
                        <Link
                          href={menu.href}
                          prefetch={false}
                          className="flex min-w-0 flex-1 items-center px-4 py-3.5 text-[15px] font-medium text-ink"
                          onClick={() => setMobile(false)}
                        >
                          {menu.label}
                        </Link>
                        <button
                          type="button"
                          aria-expanded={expanded}
                          aria-label={`${menu.label} submenu`}
                          onClick={() => setMobileSection(expanded ? null : menu.id)}
                          className="grid w-12 place-items-center text-graphite"
                        >
                          <ChevronDown
                            className={cn(
                              "size-4 transition-transform duration-200",
                              expanded && "rotate-180",
                            )}
                            aria-hidden
                          />
                        </button>
                      </div>
                      {expanded ? (
                        <ul className="space-y-0.5 border-t border-line bg-mist/50 px-2 py-2">
                          {menu.items.map((item) => {
                            const Icon = item.icon;
                            return (
                              <li key={item.title}>
                                <Link
                                  href={item.href ?? menu.href}
                                  prefetch={false}
                                  onClick={() => setMobile(false)}
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
                      prefetch={false}
                      onClick={() => setMobile(false)}
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
              prefetch={false}
              onClick={() => setMobile(false)}
              className="block rounded-full bg-slash px-4 py-3 text-center text-sm font-medium text-paper hover:bg-oxide-deep"
            >
              Try the demo
            </Link>
            <Link
              href="/portal"
              prefetch={false}
              onClick={() => setMobile(false)}
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

function MegaPanel({
  menu,
  reduce,
  onEnter,
}: {
  menu: MegaMenu;
  reduce: boolean;
  onEnter: () => void;
}) {
  const titleId = useId();

  return (
    <motion.div
      role="region"
      aria-labelledby={titleId}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, y: 6 }}
      transition={{ duration: 0.22, ease: EASE }}
      onMouseEnter={onEnter}
      className="absolute left-1/2 top-full z-50 w-screen max-w-[100vw] -translate-x-1/2 pt-3"
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-line bg-paper shadow-[0_32px_80px_-36px_rgba(17,20,24,0.55)]">
          <div className="grid lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
            <aside className="relative overflow-hidden border-b border-line bg-ink p-5 text-paper lg:border-b-0 lg:border-r lg:border-line/10">
              <p
                id={titleId}
                className="font-mono text-[11px] uppercase tracking-[0.16em] text-foam"
              >
                {menu.kicker}
              </p>
              <p className="mt-3 text-lg font-semibold tracking-[-0.02em]">{menu.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-paper/65">{menu.blurb}</p>
              <div className="mt-5">
                <FeaturePreview kind={menu.feature} reduce={reduce} />
              </div>
              <Link
                href={menu.href}
                prefetch={false}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foam transition-colors hover:text-paper"
              >
                Explore {menu.label}
                <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </aside>

            <div className="p-4 sm:p-5">
              <ul
                className={cn(
                  "grid gap-1 sm:grid-cols-2",
                  menu.items.length > 4 && "xl:grid-cols-3",
                )}
              >
                {menu.items.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.li
                      key={item.title}
                      initial={reduce ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.03 + index * 0.025, duration: 0.28, ease: EASE }}
                    >
                      <Link
                        href={item.href ?? menu.href}
                        prefetch={false}
                        className="group flex items-start gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-mist"
                      >
                        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-slash/10 text-slash transition-colors group-hover:bg-slash group-hover:text-paper">
                          <Icon className="size-4" aria-hidden />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-ink">{item.title}</span>
                          <span className="mt-0.5 block text-xs leading-relaxed text-graphite">
                            {item.body}
                          </span>
                        </span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line px-1 pt-4">
                <p className="text-xs text-graphite">
                  less administration. <span className="text-ink">more care.</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/try"
                    prefetch={false}
                    className="inline-flex items-center rounded-full bg-slash px-3.5 py-1.5 text-xs font-medium text-paper hover:bg-oxide-deep"
                  >
                    Try the demo
                  </Link>
                  <Link
                    href="/contact"
                    prefetch={false}
                    className="inline-flex items-center rounded-full border border-line px-3.5 py-1.5 text-xs font-medium text-ink hover:border-slash/40"
                  >
                    Book a walkthrough
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FeaturePreview({
  kind,
  reduce,
}: {
  kind: MegaMenu["feature"];
  reduce: boolean;
}) {
  if (kind === "scribe") {
    return (
      <div className="rounded-2xl border border-paper/10 bg-paper/5 p-3">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper/45">Live visit</p>
          <motion.span
            className="rounded-full bg-slash/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-foam"
            animate={reduce ? undefined : { opacity: [1, 0.45, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Listening
          </motion.span>
        </div>
        <div className="mt-3 space-y-1.5">
          {["Scribe · transcript ready", "Codes · I10 · 99203", "Claim · $185 queued"].map(
            (line, i) => (
              <motion.div
                key={line}
                className="rounded-lg bg-paper/5 px-2.5 py-1.5 text-[11px] text-paper/75"
                initial={reduce ? false : { opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 * i, duration: 0.35, ease: EASE }}
              >
                {line}
              </motion.div>
            ),
          )}
        </div>
      </div>
    );
  }

  if (kind === "claims") {
    const rows = [
      { label: "Paid", tone: "text-[#8fd4a8]", amount: "$185" },
      { label: "Draft", tone: "text-[#a8b5f8]", amount: "$240" },
      { label: "Review", tone: "text-[#f0c36a]", amount: "$92" },
    ];
    return (
      <div className="space-y-2">
        {rows.map((row, i) => (
          <motion.div
            key={row.label}
            className="flex items-center justify-between rounded-xl border border-paper/10 bg-paper/5 px-3 py-2"
            animate={
              reduce
                ? undefined
                : { y: [0, i % 2 === 0 ? -2 : 2, 0], x: [0, i === 1 ? 2 : -1, 0] }
            }
            transition={{ duration: 3.2 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-paper/45">
              Claim
            </span>
            <span className="text-xs font-medium">
              {row.amount}{" "}
              <span className={row.tone}>{row.label}</span>
            </span>
          </motion.div>
        ))}
      </div>
    );
  }

  if (kind === "outreach") {
    return (
      <div className="rounded-2xl border border-paper/10 bg-paper/5 p-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper/45">Outbox</p>
        <motion.div
          className="mt-3 rounded-xl bg-slash px-3 py-2.5 text-xs text-paper"
          animate={reduce ? undefined : { y: [0, -3, 0], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          Reminder · Thu 9:00 AM confirmed
        </motion.div>
        <p className="mt-2 text-[11px] text-paper/50">Sending in 12s</p>
      </div>
    );
  }

  if (kind === "portal") {
    return (
      <div className="rounded-2xl border border-paper/10 bg-paper/5 p-3">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-full bg-slash/25 text-xs font-semibold">
            JH
          </span>
          <div>
            <p className="text-xs font-medium">Jordan Hale</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-paper/45">
              Patient
            </p>
          </div>
          <motion.span
            className="ml-auto grid size-5 place-items-center rounded-full bg-slash text-[10px] font-semibold"
            animate={reduce ? undefined : { scale: [1, 1.12, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            2
          </motion.span>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-paper/65">
          Lab results ready · message the practice
        </p>
      </div>
    );
  }

  if (kind === "agents") {
    return (
      <div className="rounded-2xl border border-paper/10 bg-paper/5 p-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper/45">
          Open agent work
        </p>
        <motion.p
          className="mt-2 font-sans text-4xl font-semibold tabular-nums tracking-tight"
          animate={reduce ? undefined : { opacity: [1, 0.7, 1] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        >
          23
        </motion.p>
        <ul className="mt-3 space-y-1.5 text-[11px] text-paper/65">
          {["Schedule follow-ups", "Queue claims", "Track remits"].map((t, i) => (
            <motion.li
              key={t}
              className="flex items-center gap-2"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 * i }}
            >
              <span className="size-1.5 rounded-full bg-slash" />
              {t}
            </motion.li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-paper/10 bg-paper/5 p-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper/45">Go-live</p>
      <div className="mt-3 space-y-2">
        {["Discovery", "Build", "Support"].map((step, i) => (
          <motion.div
            key={step}
            className="flex items-center gap-2 text-xs text-paper/75"
            initial={reduce ? false : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i, ease: EASE }}
          >
            <span className="grid size-5 place-items-center rounded-full bg-slash/30 font-mono text-[10px] text-foam">
              {i + 1}
            </span>
            {step}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
