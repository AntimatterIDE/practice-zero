"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/marketing/site-header";
import {
  Calendar,
  CheckCircle2,
  Clock3,
  FileCode,
  FileText,
  MessageSquare,
  Mic,
  Receipt,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import {
  BillingDemo,
  ClaimDemo,
  CodesDemo,
  EligibilityDemo,
  OutreachDemo,
  ScheduleDemo,
  ScribeDemo,
} from "@/components/marketing/hero-demos";

const SLIDE_MS = 4600;

const scenes: {
  id: string;
  label: string;
  detail: string;
  badge: string;
  icon: LucideIcon;
  Demo: () => React.JSX.Element;
  toast: { title: string; body: string };
  note: { title: string; body: string };
}[] = [
  {
    id: "schedule",
    label: "Schedule",
    detail: "Three visits on the board",
    badge: "Mid-morning",
    icon: Calendar,
    Demo: ScheduleDemo,
    toast: { title: "In room 2", body: "Jordan Hale · 9:00" },
    note: { title: "Still to confirm", body: "Chris Adelman · 10:30" },
  },
  {
    id: "scribe",
    label: "Scribe",
    detail: "Dictation from the 9:00 visit",
    badge: "Listening",
    icon: Mic,
    Demo: ScribeDemo,
    toast: { title: "Transcript ready", body: "Jordan Hale · checkup" },
    note: { title: "Note drafted", body: "Hidden until you ask" },
  },
  {
    id: "codes",
    label: "Codes",
    detail: "Generated from the visit",
    badge: "Three lines",
    icon: FileCode,
    Demo: CodesDemo,
    toast: { title: "99203", body: "New patient office visit" },
    note: { title: "I10", body: "Essential hypertension" },
  },
  {
    id: "claim",
    label: "Claim",
    detail: "Queued from this morning",
    badge: "Draft",
    icon: FileText,
    Demo: ClaimDemo,
    toast: { title: "Draft queued", body: "Jordan Hale · $185" },
    note: { title: "Not submitted", body: "It stays in the browser" },
  },
  {
    id: "eligibility",
    label: "Eligibility",
    detail: "Coverage already on file",
    badge: "Active",
    icon: ShieldCheck,
    Demo: EligibilityDemo,
    toast: { title: "Active coverage", body: "Pinetree Health" },
    note: { title: "Office copay", body: "$25 · deductible $650" },
  },
  {
    id: "outreach",
    label: "Outreach",
    detail: "A text waiting in the outbox",
    badge: "Unsent",
    icon: MessageSquare,
    Demo: OutreachDemo,
    toast: { title: "Text waiting", body: "Elena Voss" },
    note: { title: "Outbox", body: "Nothing has left this browser" },
  },
  {
    id: "billing",
    label: "Billing",
    detail: "One payment, one denial",
    badge: "On the books",
    icon: Receipt,
    Demo: BillingDemo,
    toast: { title: "Paid", body: "$140 · Elena Voss" },
    note: { title: "Denied", body: "August visit · CARC 50" },
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const headline: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

const panel: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Hero19() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const scene = scenes[index];
  const Icon = scene.icon;
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 90, damping: 28, mass: 0.8 });
  const springY = useSpring(pointerY, { stiffness: 90, damping: 28, mass: 0.8 });
  const cardX = useTransform(springX, [-0.5, 0.5], [-6, 6]);
  const cardY = useTransform(springY, [-0.5, 0.5], [-4, 4]);
  const floatAX = useTransform(springX, [-0.5, 0.5], [14, -14]);
  const floatAY = useTransform(springY, [-0.5, 0.5], [10, -10]);
  const floatBX = useTransform(springX, [-0.5, 0.5], [10, -10]);
  const floatBY = useTransform(springY, [-0.5, 0.5], [-8, 8]);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % scenes.length);
    }, SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <div className="bg-white">
    <div className="relative z-30 mx-auto w-full max-w-[1400px] px-4 pt-6 sm:px-6 lg:px-8">
      <SiteHeader />
    </div>
    <section
      onPointerMove={handlePointerMove}
      className="relative flex min-h-[calc(100vh-4.5rem)] w-full items-start overflow-hidden bg-white px-4 pb-16 sm:px-6 lg:px-8"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_95px,rgba(23,23,23,0.035)_95px,rgba(23,23,23,0.035)_96px)] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
        <div className="absolute -top-32 right-[-10%] h-[480px] w-[480px] rounded-full bg-neutral-100 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-8%] h-[400px] w-[400px] rounded-full bg-neutral-50 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px]">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-6 grid grid-cols-1 items-center gap-12 lg:mt-10 lg:grid-cols-2 lg:gap-16 xl:gap-20"
        >
          <div className="flex min-w-0 flex-col items-start">
            <motion.p variants={item} className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
              Agentic EHR
            </motion.p>
            <motion.h1
              variants={headline}
              className="mt-8 max-w-2xl font-display text-4xl font-medium leading-[1.05] tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl"
            >
              It&apos;s not a product.
              <br />
              It&apos;s the day itself.
            </motion.h1>
            <motion.p variants={item} className="mt-6 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">
              The scribe takes the visit. Coding, eligibility, and billing follow. Outreach goes out. Reports come back. Security holds the chart. Automation does the waiting.
            </motion.p>
            <motion.div variants={item} className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/try"
                className="inline-flex w-full items-center justify-center rounded-full bg-neutral-950 px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-neutral-800 sm:w-auto sm:px-8 sm:py-3.5 sm:text-base"
              >
                Try the demo
              </Link>
              <Link
                href="/features"
                className="inline-flex w-full items-center justify-center rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-medium text-neutral-900 transition-colors duration-200 hover:bg-neutral-50 sm:w-auto sm:px-8 sm:py-3.5 sm:text-base"
              >
                See the screens
              </Link>
            </motion.div>
            <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-neutral-200 pt-6">
              <span className="flex items-center gap-2 text-sm text-neutral-500">
                <ShieldCheck className="h-4 w-4" />
                Writes stay in this browser
              </span>
              <span className="flex items-center gap-2 text-sm text-neutral-500">
                <Clock3 className="h-4 w-4" />
                A morning, already going
              </span>
            </motion.div>
          </div>

          <motion.div variants={panel} className="relative min-w-0">
            <div aria-hidden="true" className="absolute -inset-8 rounded-[3rem] bg-neutral-100 blur-3xl" />
            <motion.div style={{ x: cardX, y: cardY }} className="relative">
              <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-2xl shadow-neutral-900/10 sm:p-6">
                <div className="flex items-center justify-between gap-3 border-b border-neutral-100 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-950 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-950">{scene.label}</p>
                      <p className="text-xs text-neutral-500">{scene.detail}</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
                    {scene.badge}
                  </span>
                </div>

                <div className="mt-4 min-h-[15.5rem]" aria-live="polite">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={scene.id}
                      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <scene.Demo />
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="mt-4 h-1 overflow-hidden rounded-full bg-neutral-100">
                  {reduceMotion ? (
                    <div className="h-full w-full bg-neutral-950" />
                  ) : (
                    <motion.div
                      key={scene.id}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
                      className="h-full origin-left rounded-full bg-neutral-950"
                    />
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {scenes.map((entry, entryIndex) => (
                    <button
                      key={entry.id}
                      type="button"
                      aria-current={entryIndex === index ? "true" : undefined}
                      onClick={() => setIndex(entryIndex)}
                      className={`cursor-pointer rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                        entryIndex === index ? "bg-neutral-950 text-white" : "text-neutral-400 hover:text-neutral-700"
                      }`}
                    >
                      {entry.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            <div className="pointer-events-none absolute -top-5 right-3 hidden sm:block">
              <AnimatePresence mode="wait">
                <motion.div
                  key={scene.id}
                  style={{ x: floatAX, y: floatAY }}
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35 }}
                  className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3.5 shadow-xl shadow-neutral-900/10"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-950 text-white">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-neutral-950">{scene.toast.title}</p>
                    <p className="text-xs text-neutral-500">{scene.toast.body}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="pointer-events-none absolute -bottom-5 left-3 hidden sm:block">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${scene.id}-note`}
                  style={{ x: floatBX, y: floatBY }}
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35 }}
                  className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3.5 shadow-xl shadow-neutral-900/10"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-600">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-neutral-950">{scene.note.title}</p>
                    <p className="text-xs text-neutral-500">{scene.note.body}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
    </div>
  );
}

export default Hero19;
