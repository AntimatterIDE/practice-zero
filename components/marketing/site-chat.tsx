"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Send, X } from "lucide-react";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics/events";
import { parseChatCtas } from "@/lib/chat/cta";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "What is Practice Zero?",
  "Do I still need an office manager?",
  "How does pricing work?",
  "What can agents handle?",
];

const PANEL =
  "pointer-events-auto flex w-[min(24rem,calc(100vw-1.75rem))] flex-col overflow-hidden rounded-3xl border border-line bg-paper shadow-[0_28px_80px_-32px_rgba(17,20,24,0.55)]";

/**
 * Keep the popup docked to the visible viewport when the mobile keyboard opens.
 * Never call scrollIntoView on document — only scroll the messages pane.
 */
function useChatViewport() {
  const [inset, setInset] = useState({ bottom: 20, maxHeight: 448 });

  useEffect(() => {
    const sync = () => {
      const vv = window.visualViewport;
      const layoutH = window.innerHeight;
      if (!vv) {
        setInset({ bottom: 20, maxHeight: Math.min(448, layoutH - 120) });
        return;
      }
      // Distance from layout bottom to the visible viewport bottom (= keyboard + browser chrome).
      const obscured = Math.max(0, layoutH - vv.height - vv.offsetTop);
      const bottom = Math.max(16, obscured + 16);
      const maxHeight = Math.max(240, Math.min(448, vv.height - 88));
      setInset({ bottom, maxHeight });
    };

    sync();
    const vv = window.visualViewport;
    vv?.addEventListener("resize", sync);
    vv?.addEventListener("scroll", sync);
    window.addEventListener("resize", sync);
    return () => {
      vv?.removeEventListener("resize", sync);
      vv?.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  return inset;
}

export function SiteChat() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi — ask anything about Practice Zero: agentic EHR, room hardware, billing, pricing, or the demo.",
    },
  ]);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const viewport = useChatViewport();

  const hidden =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/try") ||
    pathname.startsWith("/portal") ||
    pathname.startsWith("/og");

  // Keep chat off the homepage critical path (labs never mount it).
  useEffect(() => {
    if (hidden) return;
    if (document.documentElement.dataset.pzLab === "1") return;
    if (window.navigator.webdriver) return;

    let cancelled = false;
    const show = () => {
      if (!cancelled) setMounted(true);
    };
    let idleId: number | undefined;
    let timeoutId: number | undefined;
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(show, { timeout: 4000 });
    } else {
      timeoutId = window.setTimeout(show, 2000);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [hidden]);

  useEffect(() => {
    if (!open) return;
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [open, messages, busy]);

  if (hidden || !mounted) return null;

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;

    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next
            .filter((m) => m.role === "user" || m.role === "assistant")
            .slice(-16)
            .map(({ role, content: c }) => ({ role, content: c })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      const reply =
        typeof data.reply === "string" && data.reply.trim()
          ? data.reply.trim()
          : "Something went wrong. Try again.\n[[cta:Request a consultation|/contact]]";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Network error. Try again, or request a consultation.\n[[cta:Request a consultation|/contact]]",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="pointer-events-none fixed right-4 z-[60] flex flex-col items-end gap-3 sm:right-6"
      style={{ bottom: viewport.bottom }}
    >
      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Practice Zero product guide"
          className={cn(PANEL)}
          style={{ height: viewport.maxHeight, maxHeight: viewport.maxHeight }}
        >
          <header className="flex shrink-0 items-center justify-between gap-3 border-b border-line bg-ink px-4 py-3 text-paper">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">practice zero</p>
              <p className="truncate text-xs text-paper/65">Product guide</p>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="grid size-9 shrink-0 place-items-center rounded-full bg-paper/10 text-paper hover:bg-paper/15"
            >
              <X className="size-4" />
            </button>
          </header>

          <div
            ref={scrollerRef}
            className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
          >
            {messages.map((msg, i) =>
              msg.role === "user" ? (
                <div
                  key={`${msg.role}-${i}`}
                  className="ml-auto max-w-[90%] rounded-2xl bg-slash px-3.5 py-2.5 text-sm leading-relaxed text-paper"
                >
                  {msg.content}
                </div>
              ) : (
                <AssistantBubble key={`${msg.role}-${i}`} content={msg.content} />
              ),
            )}
            {busy ? (
              <div className="w-fit rounded-2xl bg-mist px-3.5 py-2.5 text-sm text-graphite">
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
                  onClick={() => send(s)}
                  className="rounded-full border border-line bg-card px-3 py-1.5 text-left text-xs text-ink hover:border-slash disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          ) : null}

          <form
            className="flex shrink-0 items-center gap-2 border-t border-line p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Practice Zero…"
              disabled={busy}
              enterKeyHint="send"
              // 16px prevents iOS focus-zoom
              className="h-11 min-w-0 flex-1 rounded-full border border-line bg-paper px-4 text-base text-ink placeholder:text-graphite/70 focus:border-slash focus:outline-none focus:ring-2 focus:ring-slash/25 disabled:opacity-60 sm:text-sm"
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
        </div>
      ) : null}

      <button
        type="button"
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
        onClick={() => {
          setOpen((v) => {
            const next = !v;
            if (next) trackEvent(AnalyticsEvents.chatOpen);
            return next;
          });
        }}
        className="pointer-events-auto grid size-14 place-items-center rounded-full bg-ink text-paper shadow-lg shadow-ink/25 transition-transform hover:scale-[1.03] active:scale-[0.98]"
      >
        {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
      </button>
    </div>
  );
}

function AssistantBubble({ content }: { content: string }) {
  const { text, ctas } = parseChatCtas(content);

  return (
    <div className="flex max-w-[90%] flex-col gap-2">
      {text ? (
        <div className="whitespace-pre-wrap rounded-2xl bg-mist px-3.5 py-2.5 text-sm leading-relaxed text-ink">
          {text}
        </div>
      ) : null}
      {ctas.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {ctas.map((cta) => (
            <Link
              key={cta.href}
              href={cta.href}
              prefetch={false}
              onClick={() => {
                if (cta.href.includes("/contact")) {
                  trackEvent(AnalyticsEvents.chatQualified, {
                    cta_label: cta.label,
                    href: cta.href,
                  });
                }
                trackEvent(AnalyticsEvents.ctaClick, {
                  cta_name: "chat_cta",
                  cta_location: "site_chat",
                  href: cta.href,
                });
              }}
              className="inline-flex items-center justify-center rounded-full bg-slash px-4 py-2 text-xs font-medium text-paper transition-colors hover:bg-oxide-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slash"
            >
              {cta.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
