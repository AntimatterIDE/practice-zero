"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Home, LifeBuoy, Search } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { brand } from "@/lib/brand";

const tickRotations = [
  "rotate-0",
  "rotate-[30deg]",
  "rotate-[60deg]",
  "rotate-[90deg]",
  "rotate-[120deg]",
  "rotate-[150deg]",
  "rotate-[180deg]",
  "rotate-[210deg]",
  "rotate-[240deg]",
  "rotate-[270deg]",
  "rotate-[300deg]",
  "rotate-[330deg]",
];

const blips = [
  { position: "left-[81%] top-[40%]", delay: 1.2 },
  { position: "left-[61%] top-[69%]", delay: 2.5 },
  { position: "left-[15%] top-[56%]", delay: 4.33 },
];

const readoutsTop = ["Sweep 06.0s", "Board · live"];
const readoutsBottom = ["Contacts: 00", "Signal: lost"];

const PAGES = [
  { href: "/", label: "Home", keywords: "home practice zero agentic ehr" },
  { href: "/ehr", label: "EHR", keywords: "chart visits scribe patients tasks" },
  { href: "/billing", label: "Billing", keywords: "claims eligibility remittance payers" },
  { href: "/marketing", label: "Marketing", keywords: "outreach seo social scheduling" },
  { href: "/patient", label: "Patient experience", keywords: "portal patient messages" },
  { href: "/ai", label: "AI", keywords: "agents autonomous practice" },
  { href: "/research", label: "Research", keywords: "articles insights research" },
  { href: "/onboarding", label: "Onboarding", keywords: "setup go live onboarding" },
  { href: "/pricing", label: "Pricing", keywords: "plans pricing cost" },
  { href: "/contact", label: "Contact", keywords: "contact consult demo support hello" },
  { href: "/try", label: "Try the demo", keywords: "demo try board" },
] as const;

function matchPages(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return PAGES.filter(
    (page) =>
      page.label.toLowerCase().includes(q) ||
      page.href.includes(q) ||
      page.keywords.includes(q),
  ).slice(0, 5);
}

export default function NotFound7() {
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const matches = useMemo(() => matchPages(query), [query]);

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.09, delayChildren: 0.1 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="flex min-h-screen w-full items-start bg-paper px-4 py-16 text-ink sm:px-6 sm:py-20 lg:items-center lg:px-8">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative order-2 flex flex-col rounded-3xl border border-line bg-paper bg-[radial-gradient(circle,rgba(45,75,240,0.08)_1px,transparent_1px)] p-6 [background-size:22px_22px] sm:p-8 lg:order-1 lg:p-10"
        >
          <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.2em] text-graphite">
            <span>{readoutsTop[0]}</span>
            <span>{readoutsTop[1]}</span>
          </div>

          <div className="relative mx-auto my-8 aspect-square w-full max-w-[300px] sm:my-10 sm:max-w-[380px] lg:max-w-[430px]">
            <div className="absolute inset-0 rounded-full border border-line" />
            <div className="absolute inset-[16%] rounded-full border border-line" />
            <div className="absolute inset-[32%] rounded-full border border-line" />
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-line/80" />
            <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-line/80" />
            {tickRotations.map((rotation) => (
              <div
                key={rotation}
                aria-hidden="true"
                className={`absolute inset-0 ${rotation}`}
              >
                <span className="absolute left-1/2 top-0 h-2 w-px -translate-x-1/2 bg-graphite/35" />
              </div>
            ))}

            <motion.div
              animate={reduceMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 overflow-hidden rounded-full"
            >
              <div className="absolute inset-0 [background:conic-gradient(from_0deg,rgba(45,75,240,0)_0deg,rgba(45,75,240,0)_282deg,rgba(45,75,240,0.22)_360deg)]" />
              <div className="absolute left-1/2 top-0 h-1/2 w-px origin-bottom -translate-x-1/2 bg-slash/70" />
            </motion.div>

            {blips.map((blip) => (
              <div
                key={blip.position}
                aria-hidden="true"
                className={`absolute -translate-x-1/2 -translate-y-1/2 ${blip.position}`}
              >
                <span className="block size-1.5 rounded-full bg-graphite/50" />
                {!reduceMotion && (
                  <>
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{
                        duration: 1.6,
                        delay: blip.delay,
                        repeat: Infinity,
                        repeatDelay: 4.4,
                        ease: "easeOut",
                      }}
                      className="absolute inset-0 rounded-full bg-slash"
                    />
                    <motion.span
                      animate={{ opacity: [0.6, 0], scale: [0.5, 2.8] }}
                      transition={{
                        duration: 1.6,
                        delay: blip.delay,
                        repeat: Infinity,
                        repeatDelay: 4.4,
                        ease: "easeOut",
                      }}
                      className="absolute -inset-1.5 rounded-full border border-slash/50"
                    />
                  </>
                )}
              </div>
            ))}

            <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slash" />
          </div>

          <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.2em] text-graphite">
            <span>{readoutsBottom[0]}</span>
            <span>{readoutsBottom[1]}</span>
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="order-1 max-w-xl lg:order-2"
        >
          <motion.p
            variants={item}
            className="text-sm font-medium uppercase tracking-[0.18em] text-slash"
          >
            {brand.name}
          </motion.p>

          <motion.h1 variants={item}>
            <span className="mt-3 block select-none text-[5.5rem] font-black leading-none tracking-[-0.05em] text-ink sm:text-[7.5rem] lg:text-[9rem]">
              4
              <span className="text-transparent [-webkit-text-stroke:2.5px_#2d4bf0]">
                0
              </span>
              4
            </span>
            <span className="mt-5 block text-balance text-2xl font-semibold tracking-tight text-ink sm:text-3xl md:text-4xl">
              Nothing on the scope.
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-4 max-w-lg text-pretty text-base leading-relaxed text-graphite sm:text-lg"
          >
            We swept every route on the board and this page isn&apos;t
            broadcasting anymore. Search for what you need, or head back home.
          </motion.p>

          <motion.form
            variants={item}
            className="relative mt-8 max-w-md"
            onSubmit={(event) => {
              event.preventDefault();
              const next = matches[0] ?? PAGES.find((page) => page.href === "/");
              if (next) router.push(next.href);
            }}
          >
            <div className="flex items-center gap-2 rounded-full border border-line bg-paper py-1.5 pl-4 pr-1.5 transition-colors duration-200 focus-within:border-slash focus-within:ring-2 focus-within:ring-slash/25">
              <Search className="size-4 shrink-0 text-graphite" />
              <input
                type="search"
                name="q"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search pages…"
                aria-label="Search pages"
                autoComplete="off"
                className="w-full min-w-0 bg-transparent py-2 text-sm text-ink placeholder:text-graphite/70 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Search"
                className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-slash text-paper transition-colors duration-200 hover:bg-oxide-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slash focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              >
                <ArrowRight className="size-4" />
              </button>
            </div>

            {matches.length > 0 ? (
              <ul className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-10 overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_24px_60px_-28px_rgba(17,20,24,0.45)]">
                {matches.map((page) => (
                  <li key={page.href}>
                    <Link
                      href={page.href}
                      className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-ink hover:bg-slash/5"
                    >
                      <span>{page.label}</span>
                      <span className="font-mono text-xs text-graphite">{page.href}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </motion.form>

          <motion.div
            variants={item}
            className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
          >
            <motion.div
              whileHover={reduceMotion ? undefined : { y: -2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              <Link
                href="/"
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-slash px-6 py-3 text-sm font-medium text-paper transition-colors duration-200 hover:bg-oxide-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slash focus-visible:ring-offset-2 focus-visible:ring-offset-paper sm:w-auto sm:px-8 sm:py-3.5 sm:text-base"
              >
                <Home className="size-4" />
                Back home
              </Link>
            </motion.div>
            <Link
              href="/contact"
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-medium text-graphite transition-colors duration-200 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slash focus-visible:ring-offset-2 focus-visible:ring-offset-paper sm:py-3.5 sm:text-base"
            >
              <LifeBuoy className="size-4" />
              Contact us
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
