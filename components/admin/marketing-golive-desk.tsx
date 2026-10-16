"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Circle,
  Loader2,
  MessageSquare,
  Send,
} from "lucide-react";
import {
  countGoliveSteps,
  goliveStepKey,
  GOLIVE_TASKS,
  type GoliveTask,
} from "@/lib/marketing/golive-tasks";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "What’s the next incomplete step?",
  "Walk me through task 3 — GA4 and Search Console",
  "Help me with Instantly domains (task 7)",
  "What Google Ads campaigns first?",
  "How do I wire the Instantly webhook?",
];

const STORAGE_KEY = "pz_marketing_golive_steps_v2";

function taskProgress(task: GoliveTask, done: Record<string, boolean>) {
  const total = task.steps.length;
  const completed = task.steps.filter((step) => done[goliveStepKey(task.id, step.id)]).length;
  return { completed, total, allDone: completed === total && total > 0 };
}

export function MarketingGoliveDesk() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [openTaskId, setOpenTaskId] = useState<string>(GOLIVE_TASKS[0]?.id ?? "");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "I’m your marketing go-live assistant. Each task on the left has separate steps — check them off as you go. Ask “what’s next,” or tap Help on any step.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [usedModel, setUsedModel] = useState<boolean | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDone(JSON.parse(raw) as Record<string, boolean>);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
    } catch {
      // ignore
    }
  }, [done]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  const totalSteps = countGoliveSteps();
  const completedSteps = useMemo(
    () => Object.values(done).filter(Boolean).length,
    [done],
  );

  const nextIncomplete = useMemo(() => {
    for (const task of GOLIVE_TASKS) {
      for (const step of task.steps) {
        if (!done[goliveStepKey(task.id, step.id)]) {
          return { task, step };
        }
      }
    }
    return null;
  }, [done]);

  function toggleStep(taskId: string, stepId: string) {
    const key = goliveStepKey(taskId, stepId);
    setDone((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function askAboutStep(task: GoliveTask, stepId: string) {
    const step = task.steps.find((s) => s.id === stepId);
    if (!step) return;
    setOpenTaskId(task.id);
    void send(
      `Help me complete Task ${task.number} (“${task.title}”), step “${step.title}”: ${step.detail}`,
    );
  }

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
            completedSteps,
            totalSteps,
            nextTaskNumber: nextIncomplete?.task.number,
            nextTaskTitle: nextIncomplete?.task.title,
            nextStepTitle: nextIncomplete?.step.title,
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
          : "Something went wrong. Try again, or open marketing/cold-email/README.md in the repo.";
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

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void send(input);
  }

  return (
    <div>
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slash">Admin</p>
        <h1 className="mt-2 font-sans text-3xl font-semibold lowercase tracking-[-0.03em] text-ink">
          marketing go-live
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-graphite">
          Ten tasks with separate steps for analytics, Ads, Semrush, Instantly, and attribution —
          plus an AI assistant on the same{" "}
          <span className="font-mono text-[12px] text-ink">OPENAI_API_KEY</span>.
        </p>
        <p className="mt-3 text-xs text-graphite">
          Steps {completedSteps}/{totalSteps}
          {nextIncomplete
            ? ` · next: task ${nextIncomplete.task.number} — ${nextIncomplete.step.title}`
            : " · all steps complete"}
          {usedModel === false ? " · assistant on template fallback" : null}
          {usedModel === true ? " · assistant using OpenAI" : null}
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section className="space-y-3">
          {GOLIVE_TASKS.map((task) => {
            const { completed, total, allDone } = taskProgress(task, done);
            const open = openTaskId === task.id;
            return (
              <article
                key={task.id}
                className={cn(
                  "overflow-hidden rounded-2xl border bg-card",
                  allDone ? "border-slash/30" : "border-line",
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
                      allDone
                        ? "bg-slash/15 text-slash"
                        : "bg-mist text-graphite",
                    )}
                  >
                    {task.number}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span
                        className={cn(
                          "text-sm font-medium text-ink",
                          allDone && "text-graphite",
                        )}
                      >
                        {task.title}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">
                        {completed}/{total} steps
                      </span>
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-graphite">
                      {task.summary}
                    </span>
                    {task.docs ? (
                      <span className="mt-1 block font-mono text-[11px] text-slash/80">
                        {task.docs}
                      </span>
                    ) : null}
                  </span>
                  <ChevronDown
                    className={cn(
                      "mt-1 size-4 shrink-0 text-graphite transition-transform",
                      open && "rotate-180",
                    )}
                  />
                </button>

                {open ? (
                  <ul className="border-t border-line divide-y divide-line bg-paper/40">
                    {task.steps.map((step, index) => {
                      const key = goliveStepKey(task.id, step.id);
                      const checked = Boolean(done[key]);
                      return (
                        <li key={step.id} className="flex items-start gap-2 px-4 py-3 sm:px-5">
                          <button
                            type="button"
                            onClick={() => toggleStep(task.id, step.id)}
                            className="mt-0.5 shrink-0"
                            aria-pressed={checked}
                            aria-label={
                              checked
                                ? `Mark incomplete: ${step.title}`
                                : `Mark complete: ${step.title}`
                            }
                          >
                            {checked ? (
                              <CheckCircle2 className="size-5 text-slash" />
                            ) : (
                              <Circle className="size-5 text-graphite/45" />
                            )}
                          </button>
                          <div className="min-w-0 flex-1">
                            <p
                              className={cn(
                                "text-sm font-medium text-ink",
                                checked && "text-graphite line-through",
                              )}
                            >
                              <span className="mr-1.5 font-mono text-[10px] text-graphite">
                                {task.number}.{index + 1}
                              </span>
                              {step.title}
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-graphite">
                              {step.detail}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => askAboutStep(task, step.id)}
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
              Knows every task and step. Tap Help on a step or ask what’s next.
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
              placeholder="Ask about a task or step…"
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
