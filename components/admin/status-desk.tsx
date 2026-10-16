"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Loader2, Send } from "lucide-react";
import type { GoliveStatusReport } from "@/lib/marketing/golive-status-types";
import {
  COMPLIANCE_CHECKLIST_KEY,
  FUNDING_ASSUMPTIONS_KEY,
  companySentence,
  complianceLane,
  fundingLane,
  marketingLane,
  type StatusCheck,
  type StatusLane,
  type StatusState,
} from "@/lib/status/brief";
import type { FundingAssumptions as PlanAssumptions } from "@/lib/funding/model";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "Where are we?",
  "What should we do this week?",
  "Can we claim HIPAA yet?",
  "Do we have enough money?",
];

function readKeys(storageKey: string) {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function readFunding(): { raw: Partial<PlanAssumptions> | null; saved: boolean } {
  try {
    const raw = window.localStorage.getItem(FUNDING_ASSUMPTIONS_KEY);
    if (!raw) return { raw: null, saved: false };
    const parsed = JSON.parse(raw) as Partial<PlanAssumptions>;
    return parsed && typeof parsed === "object" ? { raw: parsed, saved: true } : { raw: null, saved: false };
  } catch {
    return { raw: null, saved: false };
  }
}

function Mark({ state }: { state: StatusState }) {
  if (state === "done") return <CheckCircle2 className="size-5 text-slash" aria-hidden />;
  if (state === "later") return <Circle className="size-5 text-graphite/35" aria-hidden />;
  return <Circle className="size-5 text-graphite/70" aria-hidden />;
}

function stateWord(state: StatusState) {
  if (state === "done") return "Done";
  if (state === "later") return "Later";
  return "Open";
}

function CheckRow({ check }: { check: StatusCheck }) {
  return (
    <li className="flex items-start gap-3 py-3">
      <span className="mt-0.5 shrink-0" title={stateWord(check.state)}>
        <Mark state={check.state} />
      </span>
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-2">
          <span className={cn("text-sm font-medium text-ink", check.state === "done" && "text-graphite")}>
            {check.label}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">
            {stateWord(check.state)}
          </span>
        </span>
        <span className="mt-1 block text-xs leading-relaxed text-graphite">{check.detail}</span>
      </span>
    </li>
  );
}

function LaneCard({ lane }: { lane: StatusLane }) {
  const done = lane.checks.filter((check) => check.state === "done").length;
  return (
    <article className="flex flex-col rounded-2xl border border-line bg-card">
      <div className="flex items-start justify-between gap-3 px-5 pt-5">
        <div>
          <h2 className="text-sm font-medium text-ink">{lane.title}</h2>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">
            {lane.checks.length === 0 ? "Loading" : `${done} of ${lane.checks.length}`}
          </p>
        </div>
        <Link href={lane.href} className="shrink-0 text-xs font-medium text-slash hover:text-oxide-ink">
          Open
        </Link>
      </div>
      <p className="px-5 pt-3 text-sm leading-relaxed text-ink">{lane.headline}</p>
      <ul className="mt-2 divide-y divide-line px-5 pb-2">
        {lane.checks.map((check) => (
          <CheckRow key={check.id} check={check} />
        ))}
      </ul>
    </article>
  );
}

export function StatusDesk() {
  const [checked, setChecked] = useState<string[]>([]);
  const [funding, setFunding] = useState<{ raw: Partial<PlanAssumptions> | null; saved: boolean }>({
    raw: null,
    saved: false,
  });
  const [marketingReport, setMarketingReport] = useState<GoliveStatusReport | null>(null);
  const [marketingError, setMarketingError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "This page is the whole picture: marketing signals from production, compliance checks saved in this browser, and the funding plan saved in this browser. Ask where to spend the next hour.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChecked(readKeys(COMPLIANCE_CHECKLIST_KEY));
    setFunding(readFunding());
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/admin/marketing/status", { cache: "no-store" });
        const data = (await res.json().catch(() => ({}))) as GoliveStatusReport & { error?: string };
        if (cancelled) return;
        if (!res.ok) {
          setMarketingError(typeof data.error === "string" ? data.error : "Marketing status did not load.");
          return;
        }
        setMarketingReport(data);
      } catch {
        if (!cancelled) setMarketingError("Marketing status did not load.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const lanes = useMemo(() => {
    const marketing = marketingError
      ? {
          ...marketingLane(null),
          headline: marketingError,
        }
      : marketingLane(marketingReport);
    return [marketing, complianceLane(checked), fundingLane(funding.raw, funding.saved)];
  }, [checked, funding, marketingError, marketingReport]);

  const sentence = companySentence(lanes.filter((lane) => lane.checks.length > 0));

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/status/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.slice(-12).map(({ role, content: value }) => ({ role, content: value })),
          snapshot: { sentence, lanes },
        }),
      });
      const data = await res.json().catch(() => ({}));
      const reply =
        typeof data.reply === "string" && data.reply.trim()
          ? data.reply
          : res.status === 401
            ? "Session expired. Sign in again at /admin/login."
            : "I couldn’t read the status page. Refresh and ask again.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "The assistant didn’t respond. The checks above are still the source of truth." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void send(input);
  }

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slash">Admin</p>
      <h1 className="mt-2 font-sans text-3xl font-semibold lowercase tracking-[-0.03em] text-ink">status</h1>
      <p className="mt-3 max-w-3xl text-lg leading-snug text-ink">{sentence}</p>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-graphite">
        Boxes fill themselves. Marketing comes from the live go-live check. Compliance and funding come from this browser. Open a lane for the full list.
      </p>

      <div className="mt-8 grid items-start gap-4 lg:grid-cols-3">
        {lanes.map((lane) => (
          <LaneCard key={lane.id} lane={lane} />
        ))}
      </div>

      <section className="mt-8 flex min-h-[28rem] flex-col overflow-hidden rounded-2xl border border-line bg-ink text-paper">
        <div className="border-b border-paper/10 px-5 py-4">
          <h2 className="text-sm font-medium">Status assistant</h2>
          <p className="mt-1 text-xs text-paper/55">
            Answers from the checks on this page. It will not invent a certification or a signed practice.
          </p>
        </div>
        <div ref={scrollerRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((message, index) =>
            message.role === "user" ? (
              <div
                key={`u-${index}`}
                className="ml-auto max-w-[40rem] rounded-2xl bg-slash px-3.5 py-2.5 text-sm leading-relaxed text-paper"
              >
                {message.content}
              </div>
            ) : (
              <div
                key={`a-${index}`}
                className="max-w-[40rem] whitespace-pre-wrap rounded-2xl bg-paper/10 px-3.5 py-2.5 text-sm leading-relaxed text-paper/90"
              >
                {message.content}
              </div>
            ),
          )}
          {busy ? (
            <div className="flex w-fit items-center gap-2 rounded-2xl bg-paper/10 px-3.5 py-2.5 text-sm text-paper/60">
              <Loader2 className="size-3.5 animate-spin" />
              Thinking…
            </div>
          ) : null}
        </div>
        {messages.length <= 2 ? (
          <div className="flex shrink-0 flex-wrap gap-2 border-t border-paper/10 px-3 py-2.5">
            {STARTERS.map((starter) => (
              <button
                key={starter}
                type="button"
                disabled={busy}
                onClick={() => void send(starter)}
                className="rounded-full border border-paper/15 bg-paper/5 px-3 py-1.5 text-left text-xs text-paper/80 hover:border-slash/50 disabled:opacity-50"
              >
                {starter}
              </button>
            ))}
          </div>
        ) : null}
        <form className="flex shrink-0 items-center gap-2 border-t border-paper/10 p-3" onSubmit={onSubmit}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask what needs attention…"
            disabled={busy}
            className="h-11 min-w-0 flex-1 rounded-full border border-paper/15 bg-ink px-4 text-sm text-paper placeholder:text-paper/40 focus:border-slash focus:outline-none focus:ring-2 focus:ring-slash/30 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label="Send"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-slash text-paper hover:bg-oxide-deep disabled:opacity-40"
          >
            <Send className="size-4" />
          </button>
        </form>
      </section>
    </div>
  );
}
