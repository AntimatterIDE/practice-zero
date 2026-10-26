"use client";

import { useState } from "react";

const threads = [
  {
    id: "m1",
    from: "Front desk",
    when: "Today · 8:14 AM",
    subject: "Thursday visit confirmed",
    body: "Your 9:00 AM visit is confirmed. Intake is ready whenever you have a minute before Thursday.",
    unread: true,
  },
  {
    id: "m2",
    from: "Dr. Wallace",
    when: "Yesterday",
    subject: "Lab results available",
    body: "Your basic metabolic panel is in your record. Message us if anything looks unclear happy to walk through it.",
    unread: false,
  },
  {
    id: "m3",
    from: "Billing desk",
    when: "Mon",
    subject: "Practice fee receipt",
    body: "Your $185 practice fee posted. The claim was filed out of network. A receipt is attached for your records.",
    unread: false,
  },
];

export function PatientMessages() {
  const [active, setActive] = useState(threads[0].id);
  const [draft, setDraft] = useState("");
  const current = threads.find((item) => item.id === active) ?? threads[0];

  return (
    <div className="mx-auto grid max-w-5xl gap-6">
      <div>
        <p className="kicker">Messages</p>
        <h1 className="mt-3 font-sans text-4xl font-semibold lowercase tracking-[-0.035em] text-ink">
          talk with the practice.
        </h1>
        <p className="mt-3 max-w-xl text-base text-graphite">
          Secure threads for refills, questions, and follow-ups without phone tag.
        </p>
      </div>

      <div className="grid overflow-hidden rounded-2xl border border-line bg-card shadow-[var(--shadow-card)] lg:grid-cols-[18rem_minmax(0,1fr)]">
        <div className="border-b border-line lg:border-b-0 lg:border-r">
          {threads.map((thread) => (
            <button
              key={thread.id}
              type="button"
              onClick={() => setActive(thread.id)}
              className={`block w-full border-b border-line px-4 py-3.5 text-left last:border-0 ${
                active === thread.id ? "bg-mist" : "hover:bg-mist/60"
              }`}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-ink">{thread.from}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-graphite">{thread.when}</span>
              </span>
              <span className="mt-1 block text-sm text-ink">{thread.subject}</span>
              {thread.unread ? (
                <span className="mt-2 inline-flex rounded-full bg-slash/10 px-2 py-0.5 text-[11px] font-medium text-slash">
                  Unread
                </span>
              ) : null}
            </button>
          ))}
        </div>

        <div className="flex min-h-[22rem] flex-col">
          <div className="border-b border-line px-5 py-4">
            <p className="text-sm font-semibold text-ink">{current.subject}</p>
            <p className="mt-1 text-xs text-graphite">
              {current.from} · {current.when}
            </p>
          </div>
          <div className="flex-1 space-y-3 px-5 py-5">
            <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-mist px-4 py-3 text-sm leading-relaxed text-ink">
              {current.body}
            </div>
          </div>
          <form
            className="border-t border-line p-4"
            onSubmit={(event) => {
              event.preventDefault();
              setDraft("");
            }}
          >
            <label className="sr-only" htmlFor="patient-reply">
              Reply
            </label>
            <div className="flex gap-2">
              <input
                id="patient-reply"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Write a secure reply…"
                className="min-w-0 flex-1 rounded-full border border-line bg-paper px-4 py-2.5 text-sm text-ink outline-none focus:border-slash"
              />
              <button
                type="submit"
                className="rounded-full bg-slash px-4 py-2.5 text-sm font-medium text-paper hover:bg-oxide-deep"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
