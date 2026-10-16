"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  FileUp,
  FolderOpen,
  Lock,
  MessageSquare,
  ShieldCheck,
  Upload,
  UserRound,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const capabilities = [
  {
    icon: UserRound,
    title: "Your profile, always current",
    body: "Demographics, coverage, preferred pharmacy, and emergency contacts stay in one place the practice can trust.",
  },
  {
    icon: MessageSquare,
    title: "Talk with the practice",
    body: "Secure messages for refill requests, questions, and follow-ups — without phone tag.",
  },
  {
    icon: Bell,
    title: "Updates as they happen",
    body: "Appointment reminders, lab results ready, and patient-pay balance alerts land in the portal and on your phone.",
  },
  {
    icon: FolderOpen,
    title: "Records you can reach",
    body: "Visit summaries, labs, imaging, and statements stay available whenever you need them — including online patient pay.",
  },
  {
    icon: Upload,
    title: "Upload what the office needs",
    body: "Insurance cards, ID, referral letters, and forms go straight to your chart before the visit — no fax chase.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    body: "Login, session controls, and practice-scoped access keep patient data where it belongs.",
  },
];

const messages = [
  {
    from: "Southeast Medical",
    when: "Today · 8:14 AM",
    preview: "Your Thursday 9:00 AM visit is confirmed. Intake is ready when you are.",
    unread: true,
  },
  {
    from: "Dr. Wallace",
    when: "Yesterday",
    preview: "Lab results are in your record. Message us if you have questions.",
    unread: false,
  },
  {
    from: "Billing desk",
    when: "Mon",
    preview: "Your $25 copay posted. A receipt is attached to this message.",
    unread: false,
  },
];

const documents = [
  { name: "Insurance card · front", meta: "Uploaded Oct 12 · PDF", state: "On file" },
  { name: "Driver license", meta: "Uploaded Oct 12 · JPG", state: "On file" },
  { name: "Prior authorization · PT", meta: "Waiting on patient", state: "Action needed" },
];

const updates = [
  { title: "Visit confirmed", detail: "Thu · 9:00 AM · Room 2", tone: "ok" as const },
  { title: "Results ready", detail: "Basic metabolic panel", tone: "info" as const },
  { title: "Balance update", detail: "$25 copay posted", tone: "ok" as const },
];

function FadeIn({
  children,
  className,
  delay = 0,
  y = 20,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function PortalLoginCard() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="rounded-[1.75rem] border border-line bg-card p-5 shadow-[var(--shadow-card)] sm:p-6"
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: EASE }}
    >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-ink">Patient portal login</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">
                Illustrative experience
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slash/10 px-2.5 py-1 text-[11px] font-medium text-slash">
              <Lock className="h-3 w-3" />
              Secure
            </span>
          </div>

          <div className="mt-5 space-y-3">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-graphite">Email</span>
              <div className="rounded-xl border border-line bg-mist px-3 py-2.5 text-sm text-ink">
                paul.wallace@example.com
              </div>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-graphite">Password</span>
              <div className="rounded-xl border border-line bg-mist px-3 py-2.5 text-sm tracking-[0.2em] text-ink">
                ••••••••••
              </div>
            </label>
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/portal"
              prefetch={false}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-slash px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-oxide-deep"
            >
              See patient experience
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/portal/login"
              prefetch={false}
              className="inline-flex items-center justify-center rounded-full border border-line px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-mist"
            >
              Login first
            </Link>
          </div>
    </motion.div>
  );
}

function ProfileCard() {
  return (
    <div className="rounded-[1.5rem] border border-line bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slash/10 font-mono text-sm font-semibold text-slash">
          PW
        </span>
        <div>
          <p className="text-base font-semibold text-ink">Paul Wallace</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">
            MRN · 100481 · DOB 03/14/1988
          </p>
        </div>
      </div>
      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        {[
          ["Phone", "401-555-0144"],
          ["Coverage", "Pinetree Health · Active"],
          ["Preferred pharmacy", "Hope Street Pharmacy"],
          ["Next visit", "Thu · 9:00 AM"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-mist px-3 py-2.5">
            <dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-graphite">{label}</dt>
            <dd className="mt-1 font-medium text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function PatientLanding() {
  const reduce = useReducedMotion();

  return (
    <>
      <section className="px-6 pb-16 pt-14 lg:pb-24 lg:pt-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <p className="kicker">Patient profile & portal</p>
            <h1 className="mt-6 max-w-[16ch] font-sans text-5xl font-semibold lowercase leading-[1.02] tracking-[-0.04em] text-ink sm:text-6xl lg:text-7xl">
              your care. your record. always with you.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-graphite">
              Give patients a clear view of their profile, visits, messages, documents, and updates — the same chart the
              practice works from, without the noise of the back office.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
              <Link
                href="/portal"
                prefetch={false}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slash px-7 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-oxide-deep"
              >
                See patient experience
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/portal/login"
                prefetch={false}
                className="group inline-flex items-center gap-2 text-sm font-medium text-slash transition-colors hover:text-oxide-deep"
              >
                Start at portal login
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </FadeIn>
          <PortalLoginCard />
        </div>
      </section>

      <section className="border-t border-line bg-paper px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <h2 className="max-w-[18ch] font-sans text-4xl font-semibold lowercase leading-[1.05] tracking-[-0.035em] text-ink sm:text-5xl">
              everything a patient needs between visits.
            </h2>
            <p className="mt-5 max-w-2xl text-lg text-graphite">
              Profile details, secure messaging, document uploads, and practice updates — one login for the whole
              relationship.
            </p>
          </FadeIn>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map(({ icon: Icon, title, body }, index) => (
              <motion.article
                key={title}
                className="rounded-[1.5rem] border border-line bg-card p-6 shadow-[var(--shadow-card)] transition-transform duration-300 hover:-translate-y-1"
                initial={reduce ? false : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: EASE }}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slash/10 text-slash">
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite">{body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line px-6 py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:gap-14">
          <FadeIn>
            <p className="kicker">Profile</p>
            <h2 className="mt-5 font-sans text-4xl font-semibold lowercase leading-[1.05] tracking-[-0.035em] text-ink sm:text-5xl">
              the patient record they recognize.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-graphite">
              Contact details, coverage, pharmacy, and upcoming care — the same facts the front desk uses, presented for
              the patient.
            </p>
            <div className="mt-8">
              <ProfileCard />
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <p className="kicker">Messages</p>
            <h2 className="mt-5 font-sans text-4xl font-semibold lowercase leading-[1.05] tracking-[-0.035em] text-ink sm:text-5xl">
              a clear line to the practice.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-graphite">
              Confirmations, clinical notes, and billing questions stay threaded — so nothing gets lost in voicemail.
            </p>
            <div className="mt-8 space-y-3">
              {messages.map((item, index) => (
                <motion.div
                  key={item.from}
                  className="rounded-2xl border border-line bg-card px-4 py-3.5 shadow-[var(--shadow-card)]"
                  initial={reduce ? false : { opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.08 + index * 0.07, ease: EASE }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-ink">{item.from}</p>
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-graphite">{item.when}</span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-graphite">{item.preview}</p>
                  {item.unread ? (
                    <span className="mt-2 inline-flex rounded-full bg-slash/10 px-2 py-0.5 text-[11px] font-medium text-slash">
                      Unread
                    </span>
                  ) : null}
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="border-t border-line bg-mist/40 px-6 py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:gap-14">
          <FadeIn>
            <p className="kicker">Documents</p>
            <h2 className="mt-5 font-sans text-4xl font-semibold lowercase leading-[1.05] tracking-[-0.035em] text-ink sm:text-5xl">
              upload once. stay on file.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-graphite">
              Patients add cards, IDs, and forms to their profile. The practice sees them on the chart without another
              fax or email chase.
            </p>
            <div className="mt-8 space-y-3">
              {documents.map((doc, index) => (
                <motion.div
                  key={doc.name}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-card px-4 py-3.5"
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.07, ease: EASE }}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slash/10 text-slash">
                      <FileUp className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink">{doc.name}</p>
                      <p className="text-xs text-graphite">{doc.meta}</p>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      doc.state === "Action needed" ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {doc.state}
                  </span>
                </motion.div>
              ))}
              <div className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slash/30 bg-card/70 px-4 py-6 text-sm font-medium text-slash">
                <Upload className="h-4 w-4" />
                Drop a file to add to your profile
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <p className="kicker">Updates</p>
            <h2 className="mt-5 font-sans text-4xl font-semibold lowercase leading-[1.05] tracking-[-0.035em] text-ink sm:text-5xl">
              know what changed. without calling.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-graphite">
              Appointments, results, and balances surface as they move — so patients stay informed and the front desk
              fields fewer “any update?” calls.
            </p>
            <div className="mt-8 space-y-3">
              {updates.map((item, index) => (
                <motion.div
                  key={item.title}
                  className="flex items-start gap-3 rounded-2xl border border-line bg-card px-4 py-4"
                  initial={reduce ? false : { opacity: 0, x: 14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.1 + index * 0.08, ease: EASE }}
                >
                  <span
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      item.tone === "ok" ? "bg-emerald-100 text-emerald-700" : "bg-slash/10 text-slash"
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{item.title}</p>
                    <p className="mt-0.5 text-sm text-graphite">{item.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="border-t border-ink bg-ink px-6 py-16 text-paper lg:py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <FadeIn className="max-w-2xl">
            <h2 className="font-sans text-3xl font-semibold lowercase leading-[1.08] tracking-[-0.035em] sm:text-4xl lg:text-5xl">
              one chart. two sides of the same morning.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-paper/70 sm:text-lg">
              Patients see their profile and portal. The practice works the same record on the morning board.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Link
              href="/portal"
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slash px-7 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-oxide-deep"
            >
              See patient experience
              <ArrowRight className="h-4 w-4" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
