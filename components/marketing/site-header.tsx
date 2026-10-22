"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useHideOnScroll } from "@/lib/use-hide-on-scroll";
import {
  ArrowRight,
  Baby,
  Bell,
  Bone,
  BookOpen,
  Building2,
  Calendar,
  CalendarClock,
  ChevronDown,
  ClipboardList,
  Cpu,
  Eye,
  FileCheck,
  FileText,
  Fingerprint,
  FlaskConical,
  Globe,
  Headphones,
  Inbox,
  Landmark,
  LayoutGrid,
  ListChecks,
  MessageSquare,
  Mic,
  Mic2,
  Newspaper,
  Receipt,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  User,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { BrandMark } from "@/components/marketing/brand-mark";
import { demoPublishedArticles } from "@/lib/research/demo";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Item = { title: string; body: string; icon: LucideIcon; href?: string };

type FeatureKind =
  | "scribe"
  | "claims"
  | "outreach"
  | "portal"
  | "agents"
  | "onboarding"
  | "research"
  | "specialties";

type Section = {
  id: string;
  label: string;
  href: string;
  kicker: string;
  blurb: string;
  items: Item[];
  feature: FeatureKind;
};

type AudienceId = "practice" | "patient";

type Audience = {
  id: AudienceId;
  label: string;
  sections: Section[];
};

const practiceSections: Section[] = [
  {
    id: "ehr",
    label: "EHR",
    href: "/ehr",
    kicker: "Chart",
    blurb: "Patients, visits, scribe, e-prescribing, and labs on one morning board.",
    feature: "scribe",
    items: [
      { title: "Patients", body: "The chart, already open — meds for e-prescribe", icon: User },
      { title: "Visits", body: "Rooms, labs, and e-prescribe mid-morning", icon: Stethoscope },
      { title: "Scribe", body: "Dictation settling into the note", icon: Mic },
      { title: "Intake", body: "Answers on file before the visit", icon: ClipboardList },
      { title: "Agreements", body: "Consent, already signed", icon: FileCheck },
      { title: "Tasks", body: "Prior auth and open work beside the rooms", icon: ListChecks },
      { title: "Requests", body: "Someone asking for a morning", icon: Inbox },
    ],
  },
  {
    id: "billing",
    label: "Billing",
    href: "/billing",
    kicker: "RCM",
    blurb: "Eligibility, prior auth, claims, patient pay, and remittance.",
    feature: "claims",
    items: [
      { title: "Collect from payers", body: "EFTs, remits, and patient pay together", icon: Landmark },
      { title: "Find the coverage", body: "Coverage and benefits for the patient", icon: Search },
      { title: "Coverage from demographics", body: "A name and a date of birth", icon: Fingerprint },
      { title: "Eligibility", body: "Coverage checks and prior auth status", icon: ShieldCheck },
      { title: "Claims", body: "Submit, track, remits, and statements", icon: FileText },
      { title: "Payers", body: "The plan sitting on the chart", icon: Building2 },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    href: "/marketing",
    kicker: "Growth",
    blurb: "Outreach, reviews, and how new patients find you.",
    feature: "outreach",
    items: [
      { title: "Outreach", body: "A text waiting in the outbox", icon: MessageSquare },
      { title: "Follow-up", body: "The next touch after the visit", icon: Bell },
      { title: "Scheduling", body: "Who is still unconfirmed", icon: Calendar },
      { title: "SEO", body: "Pages and reputation a new patient can find", icon: Search },
      { title: "Social", body: "How the practice shows up — including reviews", icon: Share2 },
    ],
  },
  {
    id: "ai",
    label: "AI",
    href: "/ai",
    kicker: "Agentic EHR",
    blurb: "Agents own the loops — scheduling, prior auth, claims, payments, follow-ups.",
    feature: "agents",
    items: [
      { title: "Agentic EHR", body: "Space and hardware, not a front-desk army", icon: Cpu },
      { title: "Room hardware", body: "Visits recorded and handed to agents", icon: Mic2 },
      { title: "Scheduling agents", body: "Recalls and confirms under your rules", icon: CalendarClock },
      { title: "Claims agents", body: "Eligibility, prior auth, and denial follow-through", icon: FileText },
      { title: "Payment tracking", body: "Patient pay, balances, and remits already open", icon: Wallet },
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
  {
    id: "research",
    label: "Research",
    href: "/research",
    kicker: "Journal",
    blurb: "Notes on agentic EHR, room hardware, and how independent practices run.",
    feature: "research",
    items: [
      {
        title: "All research",
        body: "Browse published journals and product notes",
        icon: Newspaper,
        href: "/research",
      },
      ...demoPublishedArticles.slice(0, 4).map((article) => ({
        title: article.search_title || article.title,
        body: article.topic ? `Latest · ${article.topic}` : article.excerpt.slice(0, 72),
        icon: BookOpen,
        href: `/research/${article.slug}`,
      })),
    ],
  },
  {
    id: "specialties",
    label: "Specialties",
    href: "/specialties",
    kicker: "Clinics",
    blurb: "Ophthalmology, orthopedics, primary care, dermatology, and OB-GYN on one morning board.",
    feature: "specialties",
    items: [
      {
        title: "Ophthalmology",
        body: "Procedure mornings and medical visits",
        icon: Eye,
        href: "/specialties/ophthalmology",
      },
      {
        title: "Orthopedics",
        body: "Prior auth, imaging, and high-dollar visits",
        icon: Bone,
        href: "/specialties/orthopedics",
      },
      {
        title: "Primary care",
        body: "Panel volume without the evening charting",
        icon: Stethoscope,
        href: "/specialties/primary-care",
      },
      {
        title: "Dermatology",
        body: "Medical visits and cash-pay on one surface",
        icon: Sparkles,
        href: "/specialties/dermatology",
      },
      {
        title: "OB-GYN",
        body: "Scheduling, coverage, and follow-up",
        icon: Baby,
        href: "/specialties/ob-gyn",
      },
      {
        title: "All specialties",
        body: "Every clinic on the same morning board",
        icon: LayoutGrid,
        href: "/specialties",
      },
    ],
  },
];

const patientSections: Section[] = [
  {
    id: "your-care",
    label: "Your care",
    href: "/patient",
    kicker: "Record",
    blurb: "The record, results, balance, and updates Paul Wallace can open.",
    feature: "portal",
    items: [
      {
        title: "Your record",
        body: "Demographics, coverage, and preferences",
        icon: User,
        href: "/patient",
      },
      {
        title: "Results",
        body: "A basic metabolic panel in plain language",
        icon: FlaskConical,
        href: "/patient/results",
      },
      {
        title: "What you owe",
        body: "The $25 copay, a receipt, and pay in the browser",
        icon: Receipt,
        href: "/patient/bills",
      },
      {
        title: "Portal updates",
        body: "Appointments, lab results, and balances",
        icon: Bell,
        href: "/portal/updates",
      },
    ],
  },
  {
    id: "find-care",
    label: "Find care",
    href: "/patient/find",
    kicker: "Schedule",
    blurb: "Search Southeast Medical by problem, insurance, or name, then get ready for Thursday.",
    feature: "portal",
    items: [
      {
        title: "Find a physician",
        body: "Search by problem, insurance, or name",
        icon: Search,
        href: "/patient/find",
      },
      {
        title: "Before you arrive",
        body: "Thursday 9:00 — sign, upload, arrive early",
        icon: ClipboardList,
        href: "/patient/prepare",
      },
    ],
  },
  {
    id: "in-portal",
    label: "Already in the portal",
    href: "/portal",
    kicker: "Portal",
    blurb: "Profile, messages, labs, statements, and updates patients can reach.",
    feature: "portal",
    items: [
      {
        title: "See patient experience",
        body: "The live demo of the patient record",
        icon: ArrowRight,
        href: "/portal",
      },
      {
        title: "Portal login",
        body: "A secure door into their record",
        icon: ShieldCheck,
        href: "/portal/login",
      },
      {
        title: "Messages",
        body: "Refills, questions, and follow-ups",
        icon: MessageSquare,
        href: "/portal/messages",
      },
      {
        title: "Documents",
        body: "Cards, IDs, referrals, and forms",
        icon: FileText,
        href: "/portal/documents",
      },
      {
        title: "Patient profile",
        body: "Demographics, coverage, and preferences",
        icon: User,
        href: "/patient",
      },
    ],
  },
];

const audiences: Audience[] = [
  { id: "practice", label: "Practice", sections: practiceSections },
  { id: "patient", label: "Patient", sections: patientSections },
];

const practiceHrefs = ["/ehr", "/billing", "/marketing", "/ai", "/onboarding", "/research", "/specialties"];

function audienceActive(id: AudienceId, pathname: string) {
  if (id === "practice") {
    return practiceHrefs.some((href) => pathname === href || pathname.startsWith(`${href}/`));
  }
  return (
    pathname === "/patient" ||
    pathname.startsWith("/patient/") ||
    pathname === "/portal" ||
    pathname.startsWith("/portal/")
  );
}

/** Links without mega panels — hovering these must close any open dropdown. */
const flatLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState<AudienceId | null>(null);
  const [sectionByAudience, setSectionByAudience] = useState<Partial<Record<AudienceId, string>>>({});
  const [mobile, setMobile] = useState(false);
  const [mobileAudience, setMobileAudience] = useState<AudienceId | null>(null);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);
  const reduce = useReducedMotion();
  const hideChrome = useHideOnScroll(mobile || !!open);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(null);
    setMobile(false);
    setMobileAudience(null);
    setMobileSection(null);
  }, [pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(null);
        setMobile(false);
        setMobileAudience(null);
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

  /** Immediate close so Pricing / Contact / CTAs are clickable with no panel in the way. */
  const closeMega = () => {
    clearClose();
    setOpen(null);
  };

  const showAudience = (id: AudienceId) => {
    clearClose();
    setOpen(id);
  };

  const showSection = (id: AudienceId, sectionId: string) => {
    setSectionByAudience((current) => ({ ...current, [id]: sectionId }));
  };

  const activeAudience = audiences.find((audience) => audience.id === open) ?? null;
  const activeSection =
    activeAudience?.sections.find((section) => section.id === sectionByAudience[activeAudience.id]) ??
    activeAudience?.sections[0] ??
    null;

  const mobileNav = (
    <div
      id="mobile-nav"
      className="fixed inset-0 z-[100] flex flex-col bg-paper xl:hidden"
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
            {audiences.map((audience) => {
              const expanded = mobileAudience === audience.id;
              return (
                <li key={audience.id}>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => {
                      setMobileAudience(expanded ? null : audience.id);
                      setMobileSection(null);
                    }}
                    className="flex w-full items-center justify-between px-4 py-3.5 text-left text-[15px] font-medium text-ink"
                  >
                    {audience.label}
                    <ChevronDown
                      className={cn("size-4 text-graphite transition-transform duration-200", expanded && "rotate-180")}
                      aria-hidden
                    />
                  </button>
                  {expanded ? (
                    <ul className="divide-y divide-line border-t border-line bg-mist/40">
                      {audience.sections.map((section) => {
                        const sectionOpen = mobileSection === section.id;
                        return (
                          <li key={section.id}>
                            <div className="flex items-stretch">
                              <Link
                                href={section.href}
                                prefetch={false}
                                className="flex min-w-0 flex-1 items-center px-4 py-3 text-sm font-medium text-ink"
                                onClick={() => setMobile(false)}
                              >
                                {section.label}
                              </Link>
                              <button
                                type="button"
                                aria-expanded={sectionOpen}
                                aria-label={`${section.label} submenu`}
                                onClick={() => setMobileSection(sectionOpen ? null : section.id)}
                                className="grid w-12 place-items-center text-graphite"
                              >
                                <ChevronDown
                                  className={cn(
                                    "size-4 transition-transform duration-200",
                                    sectionOpen && "rotate-180",
                                  )}
                                  aria-hidden
                                />
                              </button>
                            </div>
                            {sectionOpen ? (
                              <ul className="space-y-0.5 border-t border-line bg-mist/70 px-2 py-2">
                                {section.items.map((item) => {
                                  const Icon = item.icon;
                                  return (
                                    <li key={item.href ?? item.title}>
                                      <Link
                                        href={item.href ?? section.href}
                                        prefetch={false}
                                        onClick={() => setMobile(false)}
                                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-paper"
                                      >
                                        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-slash/10 text-slash">
                                          <Icon className="size-3.5" />
                                        </span>
                                        <span className="min-w-0">
                                          <span className="block text-sm font-medium text-ink">{item.title}</span>
                                          <span className="block truncate text-xs text-graphite">{item.body}</span>
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
  );

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 -mx-4 bg-paper/95 px-4 backdrop-blur transition-transform duration-300 ease-out sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8",
          hideChrome && "-translate-y-full pointer-events-none",
        )}
        onMouseLeave={scheduleClose}
      >
        <div className="flex items-center justify-between gap-4 py-3">
          <span onMouseEnter={closeMega} onFocus={closeMega} className="inline-flex">
            <BrandMark size="md" />
          </span>
          {/* Full nav only from xl (1280px) up — below that, hamburger so CTA labels never wrap. */}
          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="practice zero">
            {audiences.map((audience) => {
              const shown = open === audience.id;
              const active = audienceActive(audience.id, pathname);
              return (
                <div key={audience.id} className="contents">
                  <button
                    type="button"
                    aria-expanded={shown}
                    aria-haspopup="true"
                    aria-controls={`${audience.id}-menu`}
                    onMouseEnter={() => showAudience(audience.id)}
                    onClick={() => showAudience(audience.id)}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-2 text-sm text-graphite transition-colors hover:text-ink",
                      (shown || active) && "text-ink",
                    )}
                  >
                    {audience.label}
                    <ChevronDown
                      className={cn(
                        "size-3.5 shrink-0 text-graphite/70 transition-transform duration-200",
                        shown && "rotate-180 text-slash",
                      )}
                      aria-hidden
                    />
                  </button>
                  <AnimatePresence>
                    {shown && activeSection && activeAudience?.id === audience.id ? (
                      <AudiencePanel
                        key={audience.id}
                        audience={audience}
                        section={activeSection}
                        reduce={!!reduce}
                        onEnter={clearClose}
                        onSection={(sectionId) => showSection(audience.id, sectionId)}
                      />
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
            {flatLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                onMouseEnter={closeMega}
                onFocus={closeMega}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-full px-2.5 py-2 text-sm text-graphite hover:text-ink",
                  pathname === link.href && "text-ink",
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/try"
              prefetch={false}
              onMouseEnter={closeMega}
              onFocus={closeMega}
              className="ml-2 shrink-0 whitespace-nowrap rounded-full bg-slash px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-oxide-deep"
            >
              Try the demo
            </Link>
            <Link
              href="/portal"
              prefetch={false}
              onMouseEnter={closeMega}
              onFocus={closeMega}
              className="shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-graphite hover:text-ink"
            >
              See patient experience
            </Link>
          </nav>

          <button
            type="button"
            className="inline-flex h-9 shrink-0 items-center rounded-full border border-line px-3.5 text-sm font-medium text-ink xl:hidden"
            aria-expanded={mobile}
            aria-controls="mobile-nav"
            onClick={() => setMobile((value) => !value)}
          >
            {mobile ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      {mounted && mobile ? createPortal(mobileNav, document.body) : null}
    </>
  );
}

function AudiencePanel({
  audience,
  section,
  reduce,
  onEnter,
  onSection,
}: {
  audience: Audience;
  section: Section;
  reduce: boolean;
  onEnter: () => void;
  onSection: (sectionId: string) => void;
}) {
  const titleId = useId();
  const rail =
    audience.id === "patient"
      ? {
          kicker: "Portal",
          label: "Patient",
          blurb: "Profile, messages, labs, statements, and updates patients can reach.",
          feature: "portal" as const,
          href: "/portal",
          cta: "See patient experience",
        }
      : {
          kicker: section.kicker,
          label: section.label,
          blurb: section.blurb,
          feature: section.feature,
          href: section.href,
          cta: `Explore ${section.label}`,
        };

  return (
    <motion.div
      id={`${audience.id}-menu`}
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
          <div className="grid xl:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_minmax(16rem,18rem)]">
            <nav aria-label={`${audience.label} sections`} className="border-b border-line p-3 xl:border-b-0 xl:border-r">
              <p className="px-3 pb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-graphite">
                {audience.label}
              </p>
              <ul className="space-y-0.5">
                {audience.sections.map((item) => {
                  const selected = item.id === section.id;
                  return (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        prefetch={false}
                        aria-current={selected ? "true" : undefined}
                        onMouseEnter={() => onSection(item.id)}
                        onFocus={() => onSection(item.id)}
                        className={cn(
                          "flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm text-graphite transition-colors hover:bg-mist hover:text-ink",
                          selected && "bg-mist font-medium text-ink",
                        )}
                      >
                        {item.label}
                        <ArrowRight
                          className={cn("size-3.5 shrink-0 text-graphite/50", selected && "text-slash")}
                          aria-hidden
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="p-4 sm:p-5">
              <ul key={section.id} className="grid gap-1 sm:grid-cols-2">
                {section.items.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.li
                      key={item.href ?? item.title}
                      initial={reduce ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.03 + index * 0.025, duration: 0.28, ease: EASE }}
                    >
                      <Link
                        href={item.href ?? section.href}
                        prefetch={false}
                        className="group flex items-start gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-mist"
                      >
                        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-slash/10 text-slash transition-colors group-hover:bg-slash group-hover:text-paper">
                          <Icon className="size-4" aria-hidden />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-ink">{item.title}</span>
                          <span className="mt-0.5 block text-xs leading-relaxed text-graphite">{item.body}</span>
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

            <aside className="relative overflow-hidden border-t border-line bg-ink p-5 text-paper xl:border-l xl:border-t-0 xl:border-line/10">
              <p id={titleId} className="font-mono text-[11px] uppercase tracking-[0.16em] text-foam">
                {rail.kicker}
              </p>
              <p className="mt-3 text-lg font-semibold tracking-[-0.02em]">{rail.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-paper/65">{rail.blurb}</p>
              <div className="mt-5">
                <FeaturePreview kind={rail.feature} reduce={reduce} />
              </div>
              <Link
                href={rail.href}
                prefetch={false}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foam transition-colors hover:text-paper"
              >
                {rail.cta}
                <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </aside>
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
  kind: FeatureKind;
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
          {["Scribe · transcript ready", "Codes · I10 · 99203", "Claim · $185 queued"].map((line, i) => (
            <motion.div
              key={line}
              className="rounded-lg bg-paper/5 px-2.5 py-1.5 text-[11px] text-paper/75"
              initial={reduce ? false : { opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i, duration: 0.35, ease: EASE }}
            >
              {line}
            </motion.div>
          ))}
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
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-paper/45">Claim</span>
            <span className="text-xs font-medium">
              {row.amount} <span className={row.tone}>{row.label}</span>
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
          <span className="grid size-8 place-items-center rounded-full bg-slash/25 text-xs font-semibold">PW</span>
          <div>
            <p className="text-xs font-medium">Paul Wallace</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-paper/45">Patient</p>
          </div>
          <motion.span
            className="ml-auto grid size-5 place-items-center rounded-full bg-slash text-[10px] font-semibold"
            animate={reduce ? undefined : { scale: [1, 1.12, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            2
          </motion.span>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-paper/65">Lab results ready · message the practice</p>
      </div>
    );
  }

  if (kind === "agents") {
    return (
      <div className="rounded-2xl border border-paper/10 bg-paper/5 p-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper/45">Open agent work</p>
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

  if (kind === "research") {
    const latest = demoPublishedArticles[0];
    return (
      <div className="rounded-2xl border border-paper/10 bg-paper/5 p-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper/45">Latest journal</p>
        <motion.p
          className="mt-3 text-sm font-medium leading-snug tracking-[-0.02em]"
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          {latest?.search_title || latest?.title || "Practice Zero research"}
        </motion.p>
        <motion.div className="mt-3 h-1 overflow-hidden rounded-full bg-paper/10" aria-hidden>
          <motion.div
            className="h-full rounded-full bg-slash"
            animate={reduce ? undefined : { x: ["-100%", "100%"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: "40%" }}
          />
        </motion.div>
        <p className="mt-2 text-[11px] text-paper/50">{latest?.read_minutes ?? 3} min read</p>
      </div>
    );
  }

  if (kind === "specialties") {
    const names = ["Ophthalmology", "Orthopedics", "Primary care", "Dermatology", "OB-GYN"];
    return (
      <div className="rounded-2xl border border-paper/10 bg-paper/5 p-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper/45">Clinics</p>
        <ul className="mt-3 space-y-1.5 text-[11px] text-paper/75">
          {names.map((name, i) => (
            <motion.li
              key={name}
              className="flex items-center gap-2"
              initial={reduce ? false : { opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i, ease: EASE }}
            >
              <span className="size-1.5 rounded-full bg-slash" />
              {name}
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
