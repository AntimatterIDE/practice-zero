"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Circle,
  ExternalLink,
  FileText,
  Loader2,
  MessageSquare,
  Send,
} from "lucide-react";
import {
  COMPLIANCE_TRACKS,
  complianceStepKey,
  countComplianceSteps,
  type ComplianceTrack,
} from "@/lib/compliance/tasks";
import { COMPLIANCE_CHECKLIST_KEY } from "@/lib/status/brief";
import { AdminPageHeader } from "@/components/admin/admin-page";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = COMPLIANCE_CHECKLIST_KEY;

const STARTERS = [
  "What’s the next free step?",
  "How do I get the Vercel BAA?",
  "Can we claim HIPAA on the site yet?",
  "Walk me through 99.9% uptime evidence",
];

function loadChecked(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((x): x is string => typeof x === "string"));
  } catch {
    return new Set();
  }
}

function saveChecked(keys: Set<string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...keys]));
}

function trackProgress(track: ComplianceTrack, checked: Set<string>) {
  let done = 0;
  for (const step of track.steps) {
    if (checked.has(complianceStepKey(track.id, step.id))) done += 1;
  }
  return {
    done,
    total: track.steps.length,
    allClear: done === track.steps.length && track.steps.length > 0,
  };
}

function findNextIncomplete(checked: Set<string>) {
  for (const track of COMPLIANCE_TRACKS) {
    for (const step of track.steps) {
      const key = complianceStepKey(track.id, step.id);
      if (!checked.has(key)) {
        return { track, step, key };
      }
    }
  }
  return null;
}

export function ComplianceDesk() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);
  const [openTrackId, setOpenTrackId] = useState<string>(COMPLIANCE_TRACKS[0]?.id ?? "");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "I’ll walk you through BAAs, AES-256, uptime evidence, HIPAA, and SOC 2 Type II for Practice Zero. Check off steps as you finish them — progress stays in this browser. Ask “what’s next” for the first unchecked item.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [usedModel, setUsedModel] = useState<boolean | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initial = loadChecked();
    setChecked(initial);
    setHydrated(true);
    const next = findNextIncomplete(initial);
    if (next) setOpenTrackId(next.track.id);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveChecked(checked);
  }, [checked, hydrated]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  const totalSteps = countComplianceSteps();
  const completedSteps = useMemo(() => {
    let n = 0;
    for (const track of COMPLIANCE_TRACKS) {
      for (const step of track.steps) {
        if (checked.has(complianceStepKey(track.id, step.id))) n += 1;
      }
    }
    return n;
  }, [checked]);

  const nextIncomplete = useMemo(() => findNextIncomplete(checked), [checked]);

  const toggleStep = useCallback((trackId: string, stepId: string) => {
    const key = complianceStepKey(trackId, stepId);
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;

    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setBusy(true);

    const incompleteKeys: string[] = [];
    for (const track of COMPLIANCE_TRACKS) {
      for (const step of track.steps) {
        const key = complianceStepKey(track.id, step.id);
        if (!checked.has(key)) incompleteKeys.push(key);
      }
    }

    try {
      const res = await fetch("/api/admin/compliance/chat", {
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
            nextTrackNumber: nextIncomplete?.track.number,
            nextTrackTitle: nextIncomplete
              ? `${nextIncomplete.track.badge} — ${nextIncomplete.track.title}`
              : undefined,
            nextStepTitle: nextIncomplete?.step.title,
            incompleteKeys: incompleteKeys.slice(0, 40),
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
          : "Something went wrong. Try again.";
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

  function askAboutStep(track: ComplianceTrack, stepId: string) {
    const step = track.steps.find((s) => s.id === stepId);
    if (!step) return;
    const key = complianceStepKey(track.id, stepId);
    const done = checked.has(key);
    setOpenTrackId(track.id);
    void send(
      `Help with Track ${track.number} step “${step.title}” (currently ${done ? "checked" : "unchecked"}). Context: ${step.detail}${
        step.cost ? ` Cost hint: ${step.cost}.` : ""
      }`,
    );
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void send(input);
  }

  return (
    <div>
      <AdminPageHeader
        title="compliance"
        lede="Checklist for HIPAA, SOC 2, BAAs, and uptime, with vendor links and an assistant. Progress is saved in this browser."
        meta={
          <>
            {hydrated ? `${completedSteps}/${totalSteps} steps checked` : "Loading checklist…"}
            {hydrated && !nextIncomplete ? " · all steps checked" : null}
            {usedModel === true ? " · assistant using OpenAI" : null}
            {usedModel === false ? " · assistant fallback" : null}
          </>
        }
      />
      <div className="mt-4 flex flex-wrap gap-2">
        {(["HIPAA", "SOC 2 Type II", "AES-256", "BAA available", "99.9% uptime"] as const).map((label) => (
          <span
            key={label}
            className="inline-flex items-center rounded-full border border-line bg-card px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-graphite"
          >
            {label}
          </span>
        ))}
      </div>

      {nextIncomplete ? (
        <div className="mt-6 rounded-2xl border border-slash/25 bg-slash/5 px-5 py-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-slash">
            Next unchecked step
          </p>
          <p className="mt-1 text-sm font-medium text-ink">
            Track {nextIncomplete.track.number} — {nextIncomplete.step.title}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-graphite">
            {nextIncomplete.step.detail}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setOpenTrackId(nextIncomplete.track.id);
                toggleStep(nextIncomplete.track.id, nextIncomplete.step.id);
              }}
              className="rounded-full border border-slash/40 bg-card px-3 py-1.5 text-xs font-medium text-ink hover:border-slash"
            >
              Mark done
            </button>
            <button
              type="button"
              onClick={() => askAboutStep(nextIncomplete.track, nextIncomplete.step.id)}
              disabled={busy}
              className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs text-graphite hover:border-slash/40 hover:text-ink disabled:opacity-50"
            >
              <MessageSquare className="size-3" />
              Ask assistant
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section className="space-y-3">
          {COMPLIANCE_TRACKS.map((track) => {
            const { done, total, allClear } = trackProgress(track, checked);
            const open = openTrackId === track.id;
            return (
              <article
                key={track.id}
                className={cn(
                  "overflow-hidden rounded-2xl border bg-card",
                  allClear ? "border-slash/30" : "border-line",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenTrackId(open ? "" : track.id)}
                  className="flex w-full items-start gap-3 px-5 py-4 text-left"
                  aria-expanded={open}
                >
                  <span
                    className={cn(
                      "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full font-mono text-[11px]",
                      allClear ? "bg-slash/15 text-slash" : "bg-mist text-graphite",
                    )}
                  >
                    {track.number}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slash">
                        {track.badge}
                      </span>
                      <span className="text-sm font-medium text-ink">{track.title}</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">
                        {done}/{total} done
                      </span>
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-graphite">
                      {track.summary}
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
                  <div className="border-t border-line bg-paper/40">
                    <p className="border-b border-line px-5 py-3 text-xs leading-relaxed text-graphite">
                      {track.why}
                    </p>
                    <ul className="divide-y divide-line">
                      {track.steps.map((s, index) => {
                        const key = complianceStepKey(track.id, s.id);
                        const isDone = checked.has(key);
                        return (
                          <li key={s.id} className="flex items-start gap-2 px-4 py-3 sm:px-5">
                            <button
                              type="button"
                              onClick={() => toggleStep(track.id, s.id)}
                              className="mt-0.5 shrink-0 rounded-md p-0.5 hover:bg-mist"
                              aria-pressed={isDone}
                              aria-label={isDone ? `Uncheck ${s.title}` : `Check ${s.title}`}
                            >
                              {isDone ? (
                                <CheckCircle2 className="size-5 text-slash" />
                              ) : (
                                <Circle className="size-5 text-graphite/45" />
                              )}
                            </button>
                            <div className="min-w-0 flex-1">
                              <p
                                className={cn(
                                  "text-sm font-medium text-ink",
                                  isDone && "text-graphite line-through decoration-line",
                                )}
                              >
                                <span className="mr-1.5 font-mono text-[10px] text-graphite no-underline">
                                  {track.number}.{index + 1}
                                </span>
                                {s.title}
                              </p>
                              <p className="mt-1 text-xs leading-relaxed text-graphite">
                                {s.detail}
                              </p>
                              {(s.cost || s.effort) && (
                                <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-graphite">
                                  {[s.effort, s.cost].filter(Boolean).join(" · ")}
                                </p>
                              )}
                              {s.links && s.links.length > 0 ? (
                                <ul className="mt-2 flex flex-wrap gap-2">
                                  {s.links.map((link) => (
                                    <li key={link.href}>
                                      <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 rounded-full border border-line bg-card px-2.5 py-1 text-[11px] text-ink hover:border-slash/40"
                                      >
                                        {link.label}
                                        <ExternalLink className="size-3 opacity-60" />
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              ) : null}
                              {s.docs && s.docs.length > 0 ? (
                                <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                                  {s.docs.map((doc) => (
                                    <li
                                      key={doc}
                                      className="inline-flex items-center gap-1 font-mono text-[10px] text-graphite"
                                    >
                                      <FileText className="size-3 shrink-0" />
                                      {doc}
                                    </li>
                                  ))}
                                </ul>
                              ) : null}
                            </div>
                            <button
                              type="button"
                              onClick={() => askAboutStep(track, s.id)}
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
                  </div>
                ) : null}
              </article>
            );
          })}
        </section>

        <section className="flex min-h-[24rem] flex-col overflow-hidden rounded-2xl border border-line bg-card lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)]">
          <div className="border-b border-line px-5 py-4">
            <h2 className="text-sm font-medium text-ink">Compliance assistant</h2>
            <p className="mt-1 text-xs leading-relaxed text-graphite">
              Asks what’s next from your checklist. Won’t invent BAAs or SOC 2 reports.
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
                  className="max-w-[92%] whitespace-pre-wrap rounded-2xl bg-mist px-3.5 py-2.5 text-sm leading-relaxed text-ink"
                >
                  {msg.content}
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
              {STARTERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={busy}
                  onClick={() => void send(s)}
                  className="rounded-full border border-line bg-paper px-3 py-1.5 text-left text-xs text-graphite hover:text-ink disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          ) : null}

          <form
            className="flex shrink-0 items-center gap-2 border-t border-line p-3"
            onSubmit={onSubmit}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask what’s next for compliance…"
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
