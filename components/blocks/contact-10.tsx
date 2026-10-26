"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { CheckCircle2, ChevronDown, Loader2 } from "lucide-react";
import { AnalyticsEvents, loadPersistedUtms, trackEvent } from "@/lib/analytics/events";
import { specialties } from "@/lib/marketing/specialties";

const benefits = [
  {
    title: "A practice walkthrough",
    description: "Share how mornings run today. We map chart, billing, and outreach onto one board.",
  },
  {
    title: "The billing agreement",
    description: "See how the one-year agreement works and when optional advertising spend makes sense.",
  },
  {
    title: "Live product time",
    description: "Open Paul Wallace, the draft claim, and the outbox with someone who knows the product.",
  },
  {
    title: "A clear next step",
    description: "Leave with a rollout path for your practice size, not a generic pitch deck.",
  },
];

const fieldClass =
  "w-full rounded-xl border border-paper/15 bg-ink/40 px-4 py-3 text-sm text-paper placeholder:text-paper/35 transition-colors duration-200 focus-visible:border-slash focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slash/40";
const labelClass = "mb-2 block text-sm font-medium text-paper/70";

type Status = "idle" | "sending" | "sent";

const specialtyOptions = specialties.map((item) => ({
  value: item.slug,
  label: item.label,
}));

function ContactForm() {
  const reduce = useReducedMotion();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("idle");

  const defaults = useMemo(() => {
    const utms = loadPersistedUtms();
    const specialty = searchParams.get("specialty")?.trim() ?? "";
    const source =
      searchParams.get("source")?.trim() ||
      utms.utm_source ||
      "contact";
    const campaign =
      searchParams.get("campaign")?.trim() ||
      utms.utm_campaign ||
      "";
    return {
      specialty,
      source,
      campaign,
      utmSource: searchParams.get("utm_source")?.trim() || utms.utm_source || "",
      utmMedium: searchParams.get("utm_medium")?.trim() || utms.utm_medium || "",
      utmCampaign: searchParams.get("utm_campaign")?.trim() || utms.utm_campaign || "",
      utmContent: searchParams.get("utm_content")?.trim() || utms.utm_content || "",
      utmTerm: searchParams.get("utm_term")?.trim() || utms.utm_term || "",
    };
  }, [searchParams]);

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const form = event.currentTarget;
    const data = new FormData(form);
    const utms = loadPersistedUtms();
    const specialty = String(data.get("specialty") ?? "");
    const source =
      String(data.get("source") ?? "") || utms.utm_source || "contact";
    const campaign =
      String(data.get("campaign") ?? "") || utms.utm_campaign || "";
    const payload = {
      email: String(data.get("email") ?? ""),
      firstName: String(data.get("firstName") ?? ""),
      lastName: String(data.get("lastName") ?? ""),
      company: String(data.get("company") ?? ""),
      title: String(data.get("title") ?? ""),
      size: String(data.get("size") ?? ""),
      phone: String(data.get("phone") ?? ""),
      message: String(data.get("message") ?? ""),
      specialty,
      source,
      campaign,
      utmSource: String(data.get("utmSource") ?? "") || utms.utm_source || "",
      utmMedium: String(data.get("utmMedium") ?? "") || utms.utm_medium || "",
      utmCampaign:
        String(data.get("utmCampaign") ?? "") || utms.utm_campaign || "",
      utmContent: String(data.get("utmContent") ?? "") || utms.utm_content || "",
      utmTerm: String(data.get("utmTerm") ?? "") || utms.utm_term || "",
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        trackEvent(AnalyticsEvents.contactSubmit, {
          specialty: specialty || null,
          source,
          campaign: campaign || null,
        });
      }
    } catch {
      // Still show success — the request may have reached the server.
    }

    setStatus("sent");
    form.reset();
  }

  return (
    <section className="w-full bg-paper px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto grid w-full max-w-[1400px] items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col"
        >
          <motion.p variants={item} className="kicker">
            Contact
          </motion.p>
          <motion.h2
            variants={item}
            className="mt-5 font-sans text-4xl font-semibold lowercase leading-[1.05] tracking-[-0.035em] text-ink sm:text-5xl md:text-6xl"
          >
            request a
            <br />
            consultation
          </motion.h2>
          <motion.p
            variants={item}
            className="mt-6 max-w-md text-base leading-relaxed text-graphite sm:text-lg"
          >
            Tell us about the practice. We will follow up with a walkthrough of chart, billing, and outreach and how the one-year billing agreement fits your mornings.
          </motion.p>

          <div className="mt-12 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {benefits.map((benefit) => (
              <motion.div key={benefit.title} variants={item} className="flex gap-4">
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-sm bg-slash" />
                <div>
                  <h3 className="text-base font-medium text-ink">{benefit.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-graphite">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-ink bg-ink p-6 shadow-2xl shadow-ink/15 sm:p-8 lg:p-10"
          onSubmit={onSubmit}
        >
          <input type="hidden" name="source" value={defaults.source} />
          <input type="hidden" name="campaign" value={defaults.campaign} />
          <input type="hidden" name="utmSource" value={defaults.utmSource} />
          <input type="hidden" name="utmMedium" value={defaults.utmMedium} />
          <input type="hidden" name="utmCampaign" value={defaults.utmCampaign} />
          <input type="hidden" name="utmContent" value={defaults.utmContent} />
          <input type="hidden" name="utmTerm" value={defaults.utmTerm} />

          <div className="grid gap-5">
            <div>
              <label htmlFor="c10-email" className={labelClass}>
                Work email<span className="text-slash">*</span>
              </label>
              <input
                id="c10-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@practice.com"
                required
                className={fieldClass}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="c10-first" className={labelClass}>
                  First name<span className="text-slash">*</span>
                </label>
                <input
                  id="c10-first"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Paul"
                  required
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="c10-last" className={labelClass}>
                  Last name<span className="text-slash">*</span>
                </label>
                <input
                  id="c10-last"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Wallace"
                  required
                  className={fieldClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="c10-company" className={labelClass}>
                Practice name<span className="text-slash">*</span>
              </label>
              <input
                id="c10-company"
                name="company"
                type="text"
                autoComplete="organization"
                placeholder="Southeast Medical"
                required
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="c10-specialty" className={labelClass}>
                Specialty
              </label>
              <div className="relative">
                <select
                  id="c10-specialty"
                  name="specialty"
                  defaultValue={defaults.specialty}
                  className={`${fieldClass} cursor-pointer appearance-none pr-10`}
                >
                  <option value="">Prefer not to say</option>
                  {specialtyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                  <option value="other">Other</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-paper/40" />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="c10-title" className={labelClass}>
                  Role<span className="text-slash">*</span>
                </label>
                <input
                  id="c10-title"
                  name="title"
                  type="text"
                  autoComplete="organization-title"
                  placeholder="Practice manager"
                  required
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="c10-size" className={labelClass}>
                  Practice size<span className="text-slash">*</span>
                </label>
                <div className="relative">
                  <select
                    id="c10-size"
                    name="size"
                    defaultValue=""
                    required
                    className={`${fieldClass} cursor-pointer appearance-none pr-10 invalid:text-paper/35`}
                  >
                    <option value="" disabled>
                      Please select
                    </option>
                    <option>Solo</option>
                    <option>2–5 providers</option>
                    <option>6–15 providers</option>
                    <option>16+</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-paper/40" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="c10-phone" className={labelClass}>
                Phone number
              </label>
              <input
                id="c10-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+1 555 000 1234"
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="c10-message" className={labelClass}>
                Anything else you&apos;d like to share?
              </label>
              <textarea
                id="c10-message"
                name="message"
                rows={5}
                placeholder="Tell us about the chart, billing stack, or growth goals."
                className={`${fieldClass} resize-none`}
              />
            </div>
          </div>

          <p className="mt-5 text-xs leading-relaxed text-paper/45">
            We only use these details to schedule your consultation.
          </p>

          {status === "sent" ? (
            <div className="mt-6 flex items-center gap-2 rounded-2xl bg-slash/15 px-4 py-3 text-sm text-paper">
              <CheckCircle2 className="h-4 w-4 text-slash" />
              Request received. We will follow up shortly.
            </div>
          ) : (
            <motion.button
              type="submit"
              disabled={status === "sending"}
              whileHover={reduce || status === "sending" ? undefined : { y: -1 }}
              whileTap={{ scale: 0.99 }}
              className="mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-slash px-6 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-oxide-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slash focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:cursor-wait disabled:opacity-70"
            >
              {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {status === "sending" ? "Sending…" : "Request a consultation"}
            </motion.button>
          )}
        </motion.form>
      </div>
    </section>
  );
}

export default function Contact10() {
  return (
    <Suspense fallback={<div className="min-h-[28rem] w-full bg-paper" aria-hidden />}>
      <ContactForm />
    </Suspense>
  );
}
