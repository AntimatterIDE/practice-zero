"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  FileText,
  FlaskConical,
  Inbox,
  LayoutDashboard,
  ListTodo,
  Mic,
  PenLine,
  Receipt,
  Search,
  ShieldCheck,
  Stethoscope,
  User,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Scope = "All" | "Patients" | "Chart" | "Billing";

type Result = {
  title: string;
  detail: string;
  source: string;
  href: string;
  scope: Exclude<Scope, "All">;
  icon: LucideIcon;
  keywords: string;
};

const SCOPES: Scope[] = ["All", "Patients", "Chart", "Billing"];

const RESULTS: Result[] = [
  {
    title: "Paul Wallace",
    detail: "MRN 100481 · Room 2 · March 14, 1988",
    source: "Chart",
    href: "/try/patients/pt-hale",
    scope: "Patients",
    icon: User,
    keywords: "patient hale hope street providence pinetree pt-44021",
  },
  {
    title: "Wednesday visits",
    detail: "Anas is finished. Paul is in room 2. Garrett is at 10:30.",
    source: "Visits",
    href: "/ehr#visits",
    scope: "Chart",
    icon: Stethoscope,
    keywords: "schedule rooms morning board 9:00 8:40",
  },
  {
    title: "Draft claim",
    detail: "99203 · $185 practice fee collected · still a draft",
    source: "Claims",
    href: "/try/claims/clm-hale",
    scope: "Billing",
    icon: FileText,
    keywords: "clm-hale billing out of network",
  },
  {
    title: "Eligibility at 8:10",
    detail: "Pinetree Choice PPO · out of network · PT-44021",
    source: "Eligibility",
    href: "/try/eligibility",
    scope: "Billing",
    icon: ShieldCheck,
    keywords: "coverage benefits payer active",
  },
  {
    title: "The 9:00 note",
    detail: "Essential hypertension. Continue lisinopril 10 mg.",
    source: "Scribe",
    href: "/ehr#scribe",
    scope: "Chart",
    icon: Mic,
    keywords: "transcript francois blood pressure e-prescribe",
  },
  {
    title: "Front desk",
    detail: "Collect what was added in the room before Paul leaves.",
    source: "Desk",
    href: "/try/desk",
    scope: "Chart",
    icon: LayoutDashboard,
    keywords: "checkout day sheet collect",
  },
  {
    title: "Anas Khan",
    detail: "MRN 100228 · $40 still due from the June visit",
    source: "Patients",
    href: "/try/patients/pt-voss",
    scope: "Patients",
    icon: User,
    keywords: "balance text outbox prior auth imaging",
  },
  {
    title: "Garrett Holliday",
    detail: "MRN 100502 · records release still unsigned",
    source: "Patients",
    href: "/try/patients/pt-adelman",
    scope: "Patients",
    icon: User,
    keywords: "10:30 confirm",
  },
  {
    title: "Intake on file",
    detail: "Hope Street Pharmacy. Penicillin rash.",
    source: "Intake",
    href: "/ehr#intake",
    scope: "Chart",
    icon: ClipboardList,
    keywords: "answers form last night lisinopril",
  },
  {
    title: "Consent signed",
    detail: "Paul signed consent to evaluate and treat.",
    source: "Agreements",
    href: "/ehr#agreements",
    scope: "Chart",
    icon: PenLine,
    keywords: "agreement signature",
  },
  {
    title: "Open tasks",
    detail: "Garrett’s release, and Anas’s prior auth.",
    source: "Tasks",
    href: "/ehr#tasks",
    scope: "Chart",
    icon: ListTodo,
    keywords: "due today unsigned follow-up",
  },
  {
    title: "Morgan Lee",
    detail: "New-patient request at 7:40. Mornings work best.",
    source: "Requests",
    href: "/ehr#requests",
    scope: "Chart",
    icon: Inbox,
    keywords: "lead blood pressure",
  },
  {
    title: "Basic metabolic panel",
    detail: "In range. Creatinine 0.9 mg/dL.",
    source: "Results",
    href: "/patient/results",
    scope: "Patients",
    icon: FlaskConical,
    keywords: "labs paul portal",
  },
  {
    title: "Paul’s bill",
    detail: "$185 practice fee, collected. Claim filed out of network.",
    source: "Bills",
    href: "/patient/bills",
    scope: "Billing",
    icon: Receipt,
    keywords: "statement receipt what you owe",
  },
  {
    title: "The morning board",
    detail: "Today at Southeast Medical.",
    source: "Today",
    href: "/try",
    scope: "Chart",
    icon: LayoutDashboard,
    keywords: "demo home practice",
  },
  {
    title: "Insurance card",
    detail: "Pinetree Health Choice PPO · group NL-100",
    source: "Patients",
    href: "/ehr#patients",
    scope: "Patients",
    icon: ShieldCheck,
    keywords: "coverage member card hope street",
  },
];

function matches(result: Result, query: string, scope: Scope) {
  if (scope !== "All" && result.scope !== scope) return false;
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return `${result.title} ${result.detail} ${result.source} ${result.keywords}`.toLowerCase().includes(needle);
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-line bg-paper px-1.5 font-mono text-[11px] font-medium text-graphite">
      {children}
    </kbd>
  );
}

export function EhrHero() {
  const reduce = useReducedMotion();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<Scope>("All");
  const [active, setActive] = useState(0);

  const shown = useMemo(() => RESULTS.filter((result) => matches(result, query, scope)).slice(0, 6), [query, scope]);
  const activeIndex = shown.length === 0 ? 0 : Math.min(active, shown.length - 1);
  const activeResult = shown[activeIndex];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      const typing =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        inputRef.current?.focus();
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openActive = () => {
    if (!activeResult) return;
    router.push(activeResult.href);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 pb-16 pt-16 lg:pb-20 lg:pt-24">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="kicker">EHR</p>
        <h1 className="mt-6 max-w-3xl font-sans text-5xl font-semibold lowercase leading-[1.05] tracking-[-0.04em] text-ink sm:text-6xl">
          the chart is already in the room.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-graphite">
          Patients, visits, the scribe, e-prescribing, labs and results, intake, agreements, tasks, and requests.
          Wednesday morning is already underway.
        </p>
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: reduce ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }}
        className="mt-10 w-full max-w-2xl overflow-hidden rounded-xl border border-line bg-white text-left shadow-[0_1px_2px_rgba(17,20,24,0.06),0_12px_32px_rgba(17,20,24,0.1)]"
      >
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <Search className="h-5 w-5 shrink-0 text-graphite" aria-hidden />
          <input
            ref={inputRef}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={activeResult ? `${listId}-${activeIndex}` : undefined}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActive((index) => Math.min(index + 1, Math.max(shown.length - 1, 0)));
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActive((index) => Math.max(index - 1, 0));
              } else if (event.key === "Enter") {
                event.preventDefault();
                openActive();
              } else if (event.key === "Escape") {
                setQuery("");
                setScope("All");
                setActive(0);
              }
            }}
            placeholder="Search patients, visits, claims, and more"
            className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-graphite/70"
          />
          <Key>/</Key>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto px-3 pt-3">
          {SCOPES.map((item) => {
            const count = RESULTS.filter((result) => matches(result, query, item)).length;
            const selected = item === scope;
            return (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setScope(item);
                  setActive(0);
                  inputRef.current?.focus();
                }}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium",
                  selected ? "bg-mist text-ink" : "text-graphite hover:bg-paper",
                )}
                aria-pressed={selected}
              >
                {item}
                <span className={selected ? "text-graphite" : "text-graphite/50"}>{count}</span>
              </button>
            );
          })}
        </div>

        <div className="px-5 pb-1 pt-4">
          <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-graphite/70">
            {query.trim() ? "Results" : "Wednesday morning"}
          </span>
        </div>

        {shown.length === 0 ? (
          <p className="px-5 py-8 text-sm text-graphite">Nothing on this morning matches that.</p>
        ) : (
          <ul id={listId} role="listbox" aria-label="Search results" className="flex flex-col gap-0.5 px-2 pb-2">
            {shown.map((result, index) => {
              const Icon = result.icon;
              const selected = index === activeIndex;
              return (
                <li key={`${result.href}-${result.title}`} role="presentation">
                  <Link
                    id={`${listId}-${index}`}
                    role="option"
                    aria-selected={selected}
                    href={result.href}
                    onMouseEnter={() => setActive(index)}
                    className={cn(
                      "relative flex items-center gap-3 overflow-hidden rounded-lg px-3 py-2.5 outline-none focus-visible:ring-2 focus-visible:ring-slash",
                      selected ? "bg-slash/10" : "hover:bg-paper",
                    )}
                  >
                    {selected && !reduce && (
                      <motion.span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-ink/5 to-transparent"
                        initial={{ x: "-140%" }}
                        animate={{ x: "140%" }}
                        transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2.6, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                    <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-white text-graphite">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="relative min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink">{result.title}</span>
                      <span className="block truncate text-xs text-graphite">{result.detail}</span>
                    </span>
                    <span className="relative hidden shrink-0 text-xs text-graphite sm:block">{result.source}</span>
                    {selected && (
                      <span className="relative hidden shrink-0 items-center gap-1.5 text-xs text-graphite sm:flex">
                        Open
                        <Key>↵</Key>
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3">
          <div className="flex items-center gap-4 text-xs text-graphite">
            <span className="flex items-center gap-1.5">
              <Key>↑</Key>
              <Key>↓</Key>
              <span className="hidden sm:inline">navigate</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Key>↵</Key>
              <span className="hidden sm:inline">open</span>
            </span>
          </div>
          <span className="text-xs font-medium text-graphite">practice zero</span>
        </div>
      </motion.div>
    </div>
  );
}
