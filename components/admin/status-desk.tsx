"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Loader2, Send } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page";
import { formatUsd, taskCostTotals } from "@/lib/admin/task-catalog";
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
    <li className="flex items-start gap-3 py-3.5">
      <span className="mt-0.5 shrink-0" title={stateWord(check.state)}>
        <Mark state={check.state} />
      </span>
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-ink">{check.label}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">
            {stateWord(check.state)}
          </span>
        </span>
        <span className="mt-1 block text-xs leading-relaxed text-graphite">{check.detail}</span>
      </span>
    </li>
  );
}

function laneProgress(lane: StatusLane) {
  const done = lane.checks.filter((check) => check.state === "done").length;
  const total = lane.checks.length;
  const next = lane.checks.find((check) => check.state === "open") ?? lane.checks.find((check) => check.state === "later");
  const note = total === 0 ? lane.headline : next ? next.label : "Clear";
  return { done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100), note };
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

  const costs = useMemo(() => taskCostTotals(), []);
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

  const openCount = lanes.reduce(
    (sum, lane) => sum + lane.checks.filter((check) => check.state !== "done").length,
    0,
  );

  return (
    <div>
      <AdminPageHeader
        title="status"
        lede="Marketing is read from production. Compliance and funding are saved in this browser."
      />

      <p className="mt-6 max-w-3xl text-xl font-medium leading-snug tracking-[-0.02em] text-ink">{sentence}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {lanes.map((lane) => {
          const progress = laneProgress(lane);
          return (
            <Link
              key={lane.id}
              href={lane.href}
              className="rounded-2xl border border-line bg-card px-4 py-4 hover:border-slash/40"
            >
              <span className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-medium text-ink">{lane.title}</span>
                <span className="font-mono text-[11px] tabular-nums text-graphite">
                  {progress.total === 0 ? "…" : `${progress.done}/${progress.total}`}
                </span>
              </span>
              <span className="mt-3 block h-1.5 overflow-hidden rounded-full bg-mist">
                <span className="block h-full rounded-full bg-slash" style={{ width: `${progress.pct}%` }} />
              </span>
              <span className="mt-3 block line-clamp-2 text-xs leading-relaxed text-graphite">{progress.note}</span>
            </Link>
          );
        })}
        <Link
          href="/admin/tasks"
          className="rounded-2xl border border-line bg-card px-4 py-4 hover:border-slash/40"
        >
          <span className="flex items-baseline justify-between gap-3">
            <span className="text-sm font-medium text-ink">Task cost</span>
            <span className="font-mono text-[11px] tabular-nums text-graphite">{costs.taskCount} tasks</span>
          </span>
          <span className="mt-3 block text-2xl font-semibold tabular-nums tracking-[-0.03em] text-ink">
            {formatUsd(costs.once)}
          </span>
          <span className="mt-1 block text-xs leading-relaxed text-graphite">
            one-time · {formatUsd(costs.monthly)}/mo after
          </span>
        </Link>
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-4">
          {openCount === 0 && lanes.every((lane) => lane.checks.length > 0) ? (
            <section className="rounded-2xl border border-line bg-card px-5 py-5">
              <h2 className="text-sm font-medium text-ink">Nothing open</h2>
              <p className="mt-1 text-sm leading-relaxed text-graphite">
                The meters above are the whole picture. Open a lane for the full list.
              </p>
            </section>
          ) : (
            lanes.map((lane) => {
              const attention = lane.checks.filter((check) => check.state !== "done");
              const loading = lane.checks.length === 0;
              if (!loading && attention.length === 0) return null;
              return (
                <section key={lane.id} className="overflow-hidden rounded-2xl border border-line bg-card">
                  <div className="flex items-center justify-between gap-3 px-5 py-4">
                    <h2 className="text-sm font-medium text-ink">{lane.title}</h2>
                    <Link href={lane.href} className="text-xs font-medium text-slash hover:text-oxide-ink">
                      Open
                    </Link>
                  </div>
                  {loading ? (
                    <p className="border-t border-line px-5 py-4 text-sm text-graphite">{lane.headline}</p>
                  ) : (
                    <ul className="divide-y divide-line border-t border-line px-5">
                      {attention.map((check) => (
                        <CheckRow key={check.id} check={check} />
                      ))}
                    </ul>
                  )}
                </section>
              );
            })
          )}
        </div>

        <section className="flex min-h-[24rem] flex-col overflow-hidden rounded-2xl border border-line bg-card lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)]">
          <div className="border-b border-line px-4 py-4">
            <h2 className="text-sm font-medium text-ink">Status assistant</h2>
            <p className="mt-1 text-xs leading-relaxed text-graphite">
              Answers from the checks on this page. It will not invent a certification or a signed practice.
            </p>
          </div>
          <div ref={scrollerRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) =>
              message.role === "user" ? (
                <div
                  key={`u-${index}`}
                  className="ml-auto max-w-[90%] rounded-2xl bg-slash px-3.5 py-2.5 text-sm leading-relaxed text-paper"
                >
                  {message.content}
                </div>
              ) : (
                <div
                  key={`a-${index}`}
                  className="max-w-[90%] whitespace-pre-wrap rounded-2xl bg-mist px-3.5 py-2.5 text-sm leading-relaxed text-ink"
                >
                  {message.content}
                </div>
              ),
            )}
            {busy ? (
              <div className="flex w-fit items-center gap-2 rounded-2xl bg-mist px-3.5 py-2.5 text-sm text-graphite">
                <Loader2 className="size-3.5 animate-spin" />
                Thinking…
              </div>
            ) : null}
          </div>
          {messages.length <= 2 ? (
            <div className="flex shrink-0 flex-wrap gap-2 border-t border-line px-3 py-2.5">
              {STARTERS.map((starter) => (
                <button
                  key={starter}
                  type="button"
                  disabled={busy}
                  onClick={() => void send(starter)}
                  className="rounded-full border border-line bg-paper px-3 py-1.5 text-left text-xs text-graphite hover:text-ink disabled:opacity-50"
                >
                  {starter}
                </button>
              ))}
            </div>
          ) : null}
          <form className="flex shrink-0 items-center gap-2 border-t border-line p-3" onSubmit={onSubmit}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask what needs attention…"
              disabled={busy}
              className="h-11 min-w-0 flex-1 rounded-full border border-line bg-paper px-4 text-sm text-ink placeholder:text-graphite/60 focus:border-slash focus:outline-none focus:ring-2 focus:ring-slash/30 disabled:opacity-60"
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
    </div>
  );
}
