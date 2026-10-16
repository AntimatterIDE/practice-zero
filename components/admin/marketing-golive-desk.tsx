"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { CheckCircle2, Circle, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

type ChecklistItem = {
  id: string;
  title: string;
  detail: string;
  docs?: string;
};

const CHECKLIST: ChecklistItem[] = [
  {
    id: "supabase",
    title: "Supabase attribution migration",
    detail:
      "Run supabase/migrations/002_consultation_leads_attribution.sql so specialty, campaign, and UTM columns exist on consultation_leads.",
  },
  {
    id: "env",
    title: "Set production env vars & redeploy",
    detail:
      "NEXT_PUBLIC_GA_MEASUREMENT_ID, NEXT_PUBLIC_GTM_ID, NEXT_PUBLIC_POSTHOG_KEY, NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION, INSTANTLY_WEBHOOK_SECRET, OPENAI_API_KEY, Resend keys. See .env.example.",
  },
  {
    id: "ga4",
    title: "GA4 + GTM + Search Console",
    detail:
      "Create GA4 property, optional GTM, verify www.practicezero.com in Search Console, submit /sitemap.xml, mark contact_submit and demo_open as conversions.",
  },
  {
    id: "posthog",
    title: "PostHog funnels",
    detail:
      "Create project, set NEXT_PUBLIC_POSTHOG_KEY, build funnel specialty/home → demo_open → contact_submit. No marketing pixels on /portal.",
  },
  {
    id: "ads",
    title: "Google Ads Wave 1",
    detail:
      "Link Ads to GA4, import conversions, launch Brand + Category Search first. Land on specialty or /pricing. Full plan in marketing/google-ads/campaigns.md.",
    docs: "marketing/google-ads/campaigns.md",
  },
  {
    id: "semrush",
    title: "Semrush tracking",
    detail:
      "Track practicezero.com vs Tebra/athena; seed Wave 1 specialty keywords from marketing/seo/semrush-keyword-map.md.",
    docs: "marketing/seo/semrush-keyword-map.md",
  },
  {
    id: "domains",
    title: "Cold email domains + Instantly warmup",
    detail:
      "Buy 2–3 sending domains (not practicezero.com for blasts), Workspace mailboxes, SPF/DKIM/DMARC, Instantly warmup 14–21 days.",
    docs: "marketing/cold-email/README.md",
  },
  {
    id: "list",
    title: "Verify list & load 4-touch sequence",
    detail:
      "NeverBounce/MillionVerifier ≥95% deliverable. Load sequence.md + specialty variants. UTMs on every link.",
    docs: "marketing/cold-email/sequence.md",
  },
  {
    id: "webhook",
    title: "Instantly → leads webhook",
    detail:
      "POST https://www.practicezero.com/api/webhooks/instantly with Authorization: Bearer INSTANTLY_WEBHOOK_SECRET on interested/positive replies.",
  },
  {
    id: "qa",
    title: "End-to-end QA",
    detail:
      "Specialty page with UTMs → /contact → lead in /admin/leads. /try fires demo_open. /portal stays clean of marketing analytics.",
  },
];

const STARTERS = [
  "What’s the first thing I should do?",
  "Walk me through GA4 and Search Console",
  "How do I set up Instantly domains?",
  "What Google Ads campaigns should I launch first?",
  "How do I wire the Instantly webhook?",
];

const STORAGE_KEY = "pz_marketing_golive_checks";

export function MarketingGoliveDesk() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "I’m your marketing go-live assistant. I know the analytics, Ads, Semrush, Instantly, and Supabase checklist. Ask “what’s next” or pick a starter — I’ll give ordered steps.",
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

  const completed = CHECKLIST.filter((item) => done[item.id]).length;

  function toggle(id: string) {
    setDone((prev) => ({ ...prev, [id]: !prev[id] }));
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
          Checklist + AI assistant for analytics, Google Ads, Semrush, Instantly cold email, and
          attribution. Uses the same{" "}
          <span className="font-mono text-[12px] text-ink">OPENAI_API_KEY</span> as research drafts
          and the site chat.
        </p>
        <p className="mt-3 text-xs text-graphite">
          Progress {completed}/{CHECKLIST.length}
          {usedModel === false ? " · assistant on template fallback (set OPENAI_API_KEY)" : null}
          {usedModel === true ? " · assistant using OpenAI" : null}
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <section className="rounded-2xl border border-line bg-card">
          <div className="border-b border-line px-5 py-4">
            <h2 className="text-sm font-medium text-ink">Manual checklist</h2>
            <p className="mt-1 text-xs text-graphite">
              Checks save in this browser. Ask the assistant for help on any step.
            </p>
          </div>
          <ul className="divide-y divide-line">
            {CHECKLIST.map((item) => {
              const checked = Boolean(done[item.id]);
              return (
                <li key={item.id} className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => toggle(item.id)}
                    className="flex w-full items-start gap-3 text-left"
                  >
                    {checked ? (
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-slash" />
                    ) : (
                      <Circle className="mt-0.5 size-5 shrink-0 text-graphite/50" />
                    )}
                    <span className="min-w-0">
                      <span
                        className={cn(
                          "block text-sm font-medium text-ink",
                          checked && "text-graphite line-through",
                        )}
                      >
                        {item.title}
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-graphite">
                        {item.detail}
                      </span>
                      {item.docs ? (
                        <span className="mt-1 block font-mono text-[11px] text-slash/80">
                          {item.docs}
                        </span>
                      ) : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="flex min-h-[32rem] flex-col overflow-hidden rounded-2xl border border-line bg-ink text-paper">
          <div className="border-b border-paper/10 px-5 py-4">
            <h2 className="text-sm font-medium">Go-live assistant</h2>
            <p className="mt-1 text-xs text-paper/55">
              Ask about env vars, Instantly, Ads, or “what’s next”.
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
              placeholder="Ask how to make marketing live…"
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
