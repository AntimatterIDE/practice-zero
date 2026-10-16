"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, Send, X } from "lucide-react";
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
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hide on admin / try desks so it does not cover operational UI
  const hidden =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/try") ||
    pathname.startsWith("/portal");

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [open, messages, busy]);

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
          : "Something went wrong. Try again, or use /contact.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Network error. Try again, or request a consultation at /contact.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open ? (
        <div className="pointer-events-auto flex h-[min(32rem,calc(100dvh-6.5rem))] w-[min(24rem,calc(100vw-1.75rem))] flex-col overflow-hidden rounded-3xl border border-line bg-paper shadow-[0_28px_80px_-32px_rgba(17,20,24,0.55)]">
          <header className="flex items-center justify-between gap-3 border-b border-line bg-ink px-4 py-3 text-paper">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">practice zero</p>
              <p className="truncate text-xs text-paper/65">Product guide</p>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="grid size-9 place-items-center rounded-full bg-paper/10 text-paper hover:bg-paper/15"
            >
              <X className="size-4" />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((msg, i) => (
              <div
                key={`${msg.role}-${i}`}
                className={cn(
                  "max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "ml-auto bg-slash text-paper"
                    : "bg-mist text-ink",
                )}
              >
                {msg.content}
              </div>
            ))}
            {busy ? (
              <div className="w-fit rounded-2xl bg-mist px-3.5 py-2.5 text-sm text-graphite">
                Thinking…
              </div>
            ) : null}
            <div ref={bottomRef} />
          </div>

          {messages.length <= 2 ? (
            <div className="flex flex-wrap gap-2 border-t border-line px-3 py-2.5">
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
            className="flex items-center gap-2 border-t border-line p-3"
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
              className="h-11 flex-1 rounded-full border border-line bg-paper px-4 text-sm text-ink placeholder:text-graphite/70 focus:border-slash focus:outline-none focus:ring-2 focus:ring-slash/25 disabled:opacity-60"
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
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto grid size-14 place-items-center rounded-full bg-ink text-paper shadow-lg shadow-ink/25 transition-transform hover:scale-[1.03] active:scale-[0.98]"
      >
        {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
      </button>
    </div>
  );
}
