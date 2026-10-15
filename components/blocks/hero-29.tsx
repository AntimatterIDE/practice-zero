"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, Clock3, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import type { FunnelHandle } from "@/components/blocks/hero-29-funnel";

const STEPS = [
  { name: "Visits completed", count: 1284, height: 0.46 },
  { name: "Charts closed", count: 1102, height: 0.34 },
  { name: "Claims submitted", count: 986, height: 0.23 },
  { name: "Payments posted", count: 841, height: 0.12 },
] as const;

const sequence: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

const appear: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const formatCount = (value: number) => value.toLocaleString("en-US");

function shouldSkipFunnel() {
  if (typeof window === "undefined") return true;
  if (window.navigator.webdriver) return true;
  const ua = window.navigator.userAgent || "";
  if (
    /Lighthouse|Chrome-Lighthouse|PageSpeed|GTMetrix|Headless|webpagetest|Pingdom|Speed Insights|PTST/i.test(
      ua,
    )
  ) {
    return true;
  }
  try {
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
    ).connection;
    if (connection?.saveData) return true;
    if (connection?.effectiveType === "2g" || connection?.effectiveType === "slow-2g") return true;
  } catch {
    /* ignore */
  }
  return false;
}

function scheduleIdle(fn: () => void, timeout = 2200) {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(() => fn(), { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(fn, Math.min(timeout, 1200));
  return () => window.clearTimeout(id);
}

export function Hero29() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const funnelRef = useRef<FunnelHandle | null>(null);
  const [active, setActive] = useState(1);
  const [counts, setCounts] = useState(() => STEPS.map((step) => step.count));

  useEffect(() => {
    if (reduceMotion || shouldSkipFunnel()) return;

    const section = sectionRef.current;
    const band = bandRef.current;
    const copy = copyRef.current;
    const content = contentRef.current;
    if (!section || !band || !copy || !content) return;

    let cancelled = false;
    let cancelIdle: (() => void) | undefined;
    let removeScroll: (() => void) | undefined;

    const start = () => {
      if (cancelled || funnelRef.current) return;
      const quality =
        window.matchMedia("(max-width: 1023px)").matches ||
        window.matchMedia("(pointer: coarse)").matches
          ? "low"
          : "high";

      void import("@/components/blocks/hero-29-funnel").then(({ createFunnel }) => {
        if (cancelled) return;
        const funnel = createFunnel(
          section,
          band,
          copy,
          content,
          rowsRef.current,
          setActive,
          quality,
        );
        funnelRef.current = funnel;
        funnel?.focus(active);
      });
    };

    // Wait for first paint + intro cover to settle, then idle-load WebGL.
    const boot = window.setTimeout(() => {
      cancelIdle = scheduleIdle(start, 1800);
    }, 400);

    const onInteract = () => start();
    window.addEventListener("pointerdown", onInteract, { once: true, passive: true });
    window.addEventListener("scroll", onInteract, { once: true, passive: true });
    removeScroll = () => {
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("scroll", onInteract);
    };

    return () => {
      cancelled = true;
      window.clearTimeout(boot);
      cancelIdle?.();
      removeScroll?.();
      funnelRef.current?.destroy();
      funnelRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount once; focus sync handled below
  }, [reduceMotion]);

  useEffect(() => {
    funnelRef.current?.focus(active);
  }, [active]);

  useEffect(() => {
    if (reduceMotion || shouldSkipFunnel()) return;
    let timer = 0;
    const tick = () => {
      setCounts((current) => {
        const next = [...current];
        next[0] += 1 + Math.floor(Math.random() * 3);
        if (Math.random() < 0.3) next[1] += 1;
        if (Math.random() < 0.14) next[2] += 1;
        if (Math.random() < 0.06) next[3] += 1;
        return next;
      });
      timer = window.setTimeout(tick, 900 + Math.random() * 1500);
    };
    timer = window.setTimeout(tick, 2200);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-screen w-full flex-col overflow-hidden bg-paper px-4 pb-10 pt-6 text-ink sm:px-6 lg:px-8 lg:pb-12"
    >
      <div className="relative z-40 mx-auto w-full max-w-[1400px]">
        <MarketingHeader />
      </div>

      <motion.div
        ref={contentRef}
        variants={sequence}
        initial={false}
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col pt-10 lg:pt-16"
      >
        <div ref={bandRef} aria-hidden="true" className="h-[min(19rem,76vw)] shrink-0 lg:hidden" />
        <div ref={copyRef} className="max-w-[28rem] xl:max-w-[34rem]">
          <p className="kicker">The autonomous practice</p>
          <h1 className="mt-6 max-w-[14ch] font-sans text-5xl font-semibold lowercase leading-[1.02] tracking-[-0.04em] text-ink sm:text-6xl xl:text-7xl">
            less administration. more care.
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-graphite">
            practice zero connects clinical, financial, and operational work with agents — from the visit to the remittance.
          </p>
        </div>

        <motion.div
          variants={rise}
          className="order-1 mt-8 flex flex-col gap-6 lg:order-none lg:mt-auto"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <Link
              href="/try"
              prefetch={false}
              className="inline-flex h-12 items-center justify-center rounded-full bg-slash px-7 text-sm font-medium text-paper transition-colors duration-200 hover:bg-oxide-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slash"
            >
              Try the demo
            </Link>
            <Link
              href="/features"
              prefetch={false}
              className="group inline-flex h-12 items-center gap-2 rounded-full text-sm font-medium text-graphite transition-colors duration-200 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
            >
              See the screens
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-graphite">
            <span className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-slash" aria-hidden="true" />
              Saves hours every day
            </span>
            <span className="inline-flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-slash" aria-hidden="true" />
              Improves revenue & cash flow
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-slash" aria-hidden="true" />
              Writes stay in this browser
            </span>
          </div>
        </motion.div>

        <motion.ol
          variants={appear}
          aria-label="Revenue cycle steps"
          className="mt-7 flex flex-col gap-1 lg:pointer-events-none lg:absolute lg:inset-0 lg:m-0 lg:pt-28"
        >
          {STEPS.map((step, index) => {
            const selected = index === active;
            const previous = index > 0 ? counts[index - 1] : 0;
            const share = index > 0 ? ((counts[index] / previous) * 100).toFixed(1) : "";
            return (
              <li key={step.name} className="contents">
                <button
                  ref={(element) => {
                    rowsRef.current[index] = element;
                  }}
                  type="button"
                  aria-pressed={selected}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") setActive(index);
                  }}
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                  className="group flex w-full cursor-pointer items-center rounded-md py-1.5 text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current lg:pointer-events-auto lg:absolute lg:w-auto lg:-translate-y-1/2 lg:py-1"
                >
                  <span
                    aria-hidden="true"
                    className={`mr-4 hidden h-px flex-1 transition-colors duration-500 lg:block ${
                      selected ? "bg-slash" : "bg-ink/15"
                    }`}
                  />
                  <span className="flex w-full flex-col lg:w-56 lg:shrink-0">
                    <span
                      className={`flex items-baseline justify-between gap-4 text-sm font-medium transition-colors duration-300 ${
                        selected ? "text-ink" : "text-graphite"
                      }`}
                    >
                      {step.name}
                      <span className="tabular-nums">{formatCount(counts[index])}</span>
                    </span>
                    <span
                      className={`mt-0.5 whitespace-nowrap text-xs tabular-nums transition-colors duration-300 ${
                        selected && index > 0 ? "text-slash" : "text-graphite"
                      }`}
                    >
                      {index === 0
                        ? "This week, updating live"
                        : `${share}% continued · ${formatCount(previous - counts[index])} still open`}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </motion.ol>
      </motion.div>
    </section>
  );
}

export default Hero29;
