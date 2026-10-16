"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Circle,
  Loader2,
  MessageSquare,
  PauseCircle,
  RefreshCw,
  Send,
  XCircle,
} from "lucide-react";
import {
  countGoliveSteps,
  goliveStepKey,
  GOLIVE_TASKS,
  type GoliveTask,
} from "@/lib/marketing/golive-tasks";
import type {
  GoliveStatusReport,
  StepStatus,
  VerifiedStep,
} from "@/lib/marketing/golive-status-types";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "What’s the next free step?",
  "Verify my setup and tell me what’s missing",
  "Walk me through Search Console",
  "How do I test a UTM consultation lead?",
];

function statusIcon(status: StepStatus | undefined) {
  switch (status) {
    case "pass":
    case "optional_pass":
      return <CheckCircle2 className="size-5 text-slash" />;
    case "fail":
      return <XCircle className="size-5 text-emergency" />;
    case "deferred":
      return <PauseCircle className="size-5 text-graphite/45" />;
    default:
      return <Circle className="size-5 text-graphite/45" />;
  }
}

function statusLabel(status: StepStatus | undefined) {
  switch (status) {
    case "pass":
      return "Verified";
    case "optional_pass":
      return "Optional · set";
    case "fail":
      return "Needs fix";
    case "deferred":
      return "Deferred · paid";
    default:
      return "Pending · free";
  }
}

function taskCounts(task: GoliveTask, byKey: Map<string, VerifiedStep>) {
  let verified = 0;
  let actionable = 0;
  for (const step of task.steps) {
    const st = byKey.get(goliveStepKey(task.id, step.id))?.status;
    if (st === "pass" || st === "optional_pass") verified += 1;
    if (st === "fail" || st === "pending") actionable += 1;
  }
  return {
    verified,
    total: task.steps.length,
    actionable,
    allClear: actionable === 0,
  };
}

export function MarketingGoliveDesk() {
  const [report, setReport] = useState<GoliveStatusReport | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [openTaskId, setOpenTaskId] = useState<string>(GOLIVE_TASKS[0]?.id ?? "");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "I’ll auto-verify what’s live in production (env, Supabase, code). Paid Instantly/Ads/Semrush steps stay deferred until you’re ready to spend. Ask “what’s next” for free actions.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [usedModel, setUsedModel] = useState<boolean | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const byKey = useMemo(() => {
    const map = new Map<string, VerifiedStep>();
    for (const step of report?.steps ?? []) map.set(step.key, step);
    return map;
  }, [report]);

  const refreshStatus = useCallback(async () => {
    setLoadingStatus(true);
    setStatusError(null);
    try {
      const res = await fetch("/api/admin/marketing/status", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        setStatusError("Session expired. Sign in again.");
        return;
      }
      if (!res.ok) {
        setStatusError(typeof data.error === "string" ? data.error : "Status check failed.");
        return;
      }
      setReport(data as GoliveStatusReport);
      const next = (data as GoliveStatusReport).freePathNext;
      if (next) {
        const task = GOLIVE_TASKS.find((t) => t.id === next.taskId);
        if (task) setOpenTaskId(task.id);
      }
    } catch {
      setStatusError("Network error while verifying.");
    } finally {
      setLoadingStatus(false);
    }
  }, []);

  useEffect(() => {
    void refreshStatus();
  }, [refreshStatus]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  const totalSteps = countGoliveSteps();
  const summary = report?.summary;
  const completedLike =
    (summary?.pass ?? 0) + (summary?.optionalPass ?? 0);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;

    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/admin/marketing/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next
            .filter((m) => m.role === "user" || m.role === "assistant")
            .slice(-16)
            .map(({ role, content: c }) => ({ role, content: c })),
          progress: {
            completedSteps: completedLike,
            totalSteps,
            nextTaskNumber: report?.freePathNext
              ? GOLIVE_TASKS.find((t) => t.id === report.freePathNext?.taskId)?.number
              : undefined,
            nextTaskTitle: report?.freePathNext?.title,
            nextStepTitle: report?.freePathNext?.title,
          },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Session expired. Sign in again at /admin/login." },
        ]);
        return;
      }
      const reply =
        typeof data.reply === "string" && data.reply.trim()
          ? data.reply.trim()
          : "Something went wrong. Try Verify again.";
      setUsedModel(Boolean(data.usedModel));
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error. Check your connection and try again." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function askAboutStep(task: GoliveTask, stepId: string) {
    const step = task.steps.find((s) => s.id === stepId);
    const verified = byKey.get(goliveStepKey(task.id, stepId));
    if (!step) return;
    setOpenTaskId(task.id);
    void send(
      `Help with Task ${task.number} step “${step.title}” (status: ${verified?.status ?? "unknown"}). Verifier says: ${verified?.detail ?? step.detail}`,
    );
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void send(input);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slash">Admin</p>
          <h1 className="mt-2 font-sans text-3xl font-semibold lowercase tracking-[-0.03em] text-ink">
            marketing go-live
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-graphite">
            Auto-verifies production env, Supabase attribution, and code gates. Paid Ads / Semrush /
            Instantly sending stay deferred until you budget for them.
          </p>
          <p className="mt-3 text-xs text-graphite">
            {loadingStatus && !report
              ? "Verifying…"
              : summary
                ? `Verified ${completedLike}/${totalSteps} · ${summary.fail} fail · ${summary.pending} free pending · ${summary.deferred} deferred`
                : null}
            {report?.freePathNext
              ? ` · next free: ${report.freePathNext.title}`
              : report
                ? " · no free blockers left"
                : null}
            {usedModel === true ? " · assistant using OpenAI" : null}
            {usedModel === false ? " · assistant fallback" : null}
          </p>
          {statusError ? (
            <p className="mt-2 text-sm text-emergency">{statusError}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => void refreshStatus()}
          disabled={loadingStatus}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-sm font-medium text-ink hover:border-slash/40 disabled:opacity-60"
        >
          <RefreshCw className={cn("size-3.5", loadingStatus && "animate-spin")} />
          {loadingStatus ? "Verifying…" : "Verify now"}
        </button>
      </div>

      {report?.freePathNext ? (
        <div className="mt-6 rounded-2xl border border-slash/25 bg-slash/5 px-5 py-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-slash">
            Next free action
          </p>
          <p className="mt-1 text-sm font-medium text-ink">{report.freePathNext.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-graphite">
            {report.freePathNext.detail}
          </p>
        </div>
      ) : null}

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section className="space-y-3">
          {GOLIVE_TASKS.map((task) => {
            const { verified, total, allClear, actionable } = taskCounts(task, byKey);
            const open = openTaskId === task.id;
            return (
              <article
                key={task.id}
                className={cn(
                  "overflow-hidden rounded-2xl border bg-card",
                  allClear ? "border-slash/30" : "border-line",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenTaskId(open ? "" : task.id)}
                  className="flex w-full items-start gap-3 px-5 py-4 text-left"
                  aria-expanded={open}
                >
                  <span
                    className={cn(
                      "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full font-mono text-[11px]",
                      allClear ? "bg-slash/15 text-slash" : "bg-mist text-graphite",
                    )}
                  >
                    {task.number}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-sm font-medium text-ink">{task.title}</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">
                        {verified}/{total} verified
                        {actionable ? ` · ${actionable} open` : ""}
                      </span>
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-graphite">
                      {task.summary}
                    </span>
                  </span>
                  <ChevronDown
                    className={cn(
                      "mt-1 size-4 shrink-0 text-graphite transition-transform",
                      open && "rotate-180",
                    )}
                  />
                </button>

                {open ? (
                  <ul className="divide-y divide-line border-t border-line bg-paper/40">
                    {task.steps.map((s, index) => {
                      const verifiedStep = byKey.get(goliveStepKey(task.id, s.id));
                      const st = verifiedStep?.status;
                      return (
                        <li key={s.id} className="flex items-start gap-2 px-4 py-3 sm:px-5">
                          <span className="mt-0.5 shrink-0" title={statusLabel(st)}>
                            {statusIcon(st)}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-ink">
                              <span className="mr-1.5 font-mono text-[10px] text-graphite">
                                {task.number}.{index + 1}
                              </span>
                              {s.title}
                            </p>
                            <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.12em] text-graphite">
                              {statusLabel(st)}
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-graphite">
                              {verifiedStep?.detail ?? s.detail}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => askAboutStep(task, s.id)}
                            disabled={busy}
                            className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-full border border-line px-2.5 py-1 text-[11px] text-graphite hover:border-slash/40 hover:text-ink disabled:opacity-50"
                          >
                            <MessageSquare className="size-3" />
                            Help
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </article>
            );
          })}
        </section>

        <section className="flex min-h-[32rem] flex-col overflow-hidden rounded-2xl border border-line bg-ink text-paper lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)]">
          <div className="border-b border-paper/10 px-5 py-4">
            <h2 className="text-sm font-medium">Go-live assistant</h2>
            <p className="mt-1 text-xs text-paper/55">
              Ask what’s next for free actions. Paid steps stay deferred.
            </p>
          </div>

          <div ref={scrollerRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((msg, i) =>
              msg.role === "user" ? (
                <div
                  key={`u-${i}`}
                  className="ml-auto max-w-[92%] rounded-2xl bg-slash px-3.5 py-2.5 text-sm leading-relaxed text-paper"
                >
                  {msg.content}
                </div>
              ) : (
                <div
                  key={`a-${i}`}
                  className="max-w-[92%] whitespace-pre-wrap rounded-2xl bg-paper/10 px-3.5 py-2.5 text-sm leading-relaxed text-paper/90"
                >
                  {msg.content}
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
              {STARTERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={busy}
                  onClick={() => void send(s)}
                  className="rounded-full border border-paper/15 bg-paper/5 px-3 py-1.5 text-left text-xs text-paper/80 hover:border-slash/50 disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          ) : null}

          <form
            className="flex shrink-0 items-center gap-2 border-t border-paper/10 p-3"
            onSubmit={onSubmit}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask what’s next for free…"
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
    </div>
  );
}
