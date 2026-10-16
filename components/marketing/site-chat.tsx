"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Send, X } from "lucide-react";
import { parseChatCtas } from "@/lib/chat/cta";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "What is Practice Zero?",
  "Do I still need an office manager?",
  "How does pricing work?",
  "What can agents handle?",
];

export function SiteChat() {
  const pathname = usePathname();
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
  const [vvHeight, setVvHeight] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const hidden =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/try") ||
    pathname.startsWith("/portal") ||
    pathname.startsWith("/og");

  // Track visual viewport so the panel stays above the iOS keyboard
  useEffect(() => {
    if (!open || hidden) return;

    const vv = window.visualViewport;
    if (!vv) return;

    const sync = () => {
      setVvHeight(Math.round(vv.height));
      // Keep the panel pinned to the visible top when the keyboard resizes the viewport
      if (panelRef.current && window.matchMedia("(max-width: 639px)").matches) {
        panelRef.current.style.transform = `translateY(${Math.max(0, vv.offsetTop)}px)`;
      }
    };

    sync();
    vv.addEventListener("resize", sync);
    vv.addEventListener("scroll", sync);
    return () => {
      vv.removeEventListener("resize", sync);
      vv.removeEventListener("scroll", sync);
    };
  }, [open, hidden]);

  useEffect(() => {
    if (!open) {
      setVvHeight(null);
      return;
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    // Delay focus slightly so the fullscreen panel has laid out on mobile
    const t = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(t);
  }, [open, messages, busy]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (hidden) return null;

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

  const mobilePanelStyle =
    open && vvHeight
      ? ({ height: `${vvHeight}px`, maxHeight: `${vvHeight}px` } as const)
      : undefined;

  return (
    <>
      {/* Launcher — hidden while the panel is open on mobile so it cannot float over the keyboard */}
      <button
        type="button"
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed bottom-5 right-5 z-[60] grid size-14 place-items-center rounded-full bg-ink text-paper shadow-lg shadow-ink/25 transition-transform hover:scale-[1.03] active:scale-[0.98] sm:bottom-6 sm:right-6",
          open && "hidden sm:grid",
        )}
      >
        {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
      </button>

      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Practice Zero product guide"
          style={mobilePanelStyle}
          className={cn(
            "fixed z-[70] flex flex-col overflow-hidden bg-paper",
            // Mobile: full visual viewport sheet
            "inset-x-0 top-0 h-[100dvh] max-h-[100dvh]",
            // Desktop: floating card
            "sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[min(32rem,calc(100dvh-5rem))] sm:max-h-[min(32rem,calc(100dvh-5rem))] sm:w-[min(24rem,calc(100vw-2rem))] sm:rounded-3xl sm:border sm:border-line sm:shadow-[0_28px_80px_-32px_rgba(17,20,24,0.55)]",
          )}
        >
          <header className="flex shrink-0 items-center justify-between gap-3 border-b border-line bg-ink px-4 py-3 text-paper pt-[max(0.75rem,env(safe-area-inset-top))]">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">practice zero</p>
              <p className="truncate text-xs text-paper/65">Product guide</p>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="grid size-10 shrink-0 place-items-center rounded-full bg-paper/10 text-paper hover:bg-paper/15"
            >
              <X className="size-4" />
            </button>
          </header>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4">
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
            <div ref={bottomRef} />
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
            className="flex shrink-0 items-center gap-2 border-t border-line bg-paper p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
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
              className="h-11 min-w-0 flex-1 rounded-full border border-line bg-paper px-4 text-sm text-ink placeholder:text-graphite/70 focus:border-slash focus:outline-none focus:ring-2 focus:ring-slash/25 disabled:opacity-60"
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
    </>
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
