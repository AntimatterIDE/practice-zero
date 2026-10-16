"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ResearchArticle } from "@/lib/research/types";

const SUGGESTIONS = [
  { title: "Agentic EHR without an office manager", hint: "Front-office autonomy" },
  { title: "Room hardware that schedules follow-ups", hint: "Visit capture" },
  { title: "Claims that leave the room clean", hint: "Billing agents" },
  { title: "Payment tracking without a spreadsheet", hint: "Remit & balance" },
];

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ResearchDesk({ articles }: { articles: ResearchArticle[] }) {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  async function draft(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNote(null);
    try {
      const res = await fetch("/api/admin/research/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Draft failed.");
        return;
      }
      if (!data.usedModel) {
        setNote(
          "Draft saved with the Practice Zero template (OPENAI_API_KEY unset or API unavailable). Open it to edit and publish.",
        );
      }
      router.push(`/admin/research/${data.article.id}`);
      router.refresh();
    } catch {
      setError("Network error while drafting.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slash">
          Website
        </p>
        <h1 className="mt-2 font-sans text-3xl font-semibold lowercase tracking-[-0.03em] text-ink">
          Research
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-graphite">
          Research agentic EHR topics, draft a note in Practice Zero&apos;s voice,
          and leave it unpublished until you approve it.
        </p>
      </div>

      <form
        onSubmit={draft}
        className="mt-8 rounded-2xl border border-line bg-card p-6 sm:p-8"
      >
        <p className="text-sm text-graphite">
          The draft lists sources first, then writes a full note promoting
          Practice Zero agents, room hardware, and autonomous scheduling,
          claims, and payment tracking. It stays a draft until you approve it.
        </p>
        <label className="mt-6 block">
          <span className="text-sm font-medium text-ink">Topic</span>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Agentic EHR without an office manager"
            required
            className="mt-2 h-11 w-full rounded-xl border border-line bg-paper px-4 text-sm text-ink placeholder:text-graphite/60 focus:border-slash focus:outline-none focus:ring-2 focus:ring-slash/25"
          />
        </label>
        {error ? (
          <p className="mt-3 text-sm text-emergency">{error}</p>
        ) : null}
        {note ? <p className="mt-3 text-sm text-graphite">{note}</p> : null}
        <button
          type="submit"
          disabled={busy || topic.trim().length < 2}
          className="mt-6 inline-flex h-11 items-center rounded-full bg-slash px-5 text-sm font-medium text-paper transition-colors hover:bg-oxide-deep disabled:opacity-50"
        >
          {busy ? "Researching and drafting…" : "Research and draft"}
        </button>
      </form>

      <div className="mt-12">
        <h2 className="text-lg font-semibold text-ink">What to publish next</h2>
        <p className="mt-2 max-w-2xl text-sm text-graphite">
          Topics that explain how Practice Zero replaces front-office drag with
          agents—good landing pages after ads or demos.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.title}
              type="button"
              onClick={() => setTopic(s.title)}
              className="rounded-2xl border border-line bg-card px-5 py-4 text-left transition-colors hover:border-slash"
            >
              <span className="block text-sm font-semibold text-slash">
                {s.title}
              </span>
              <span className="mt-1 block text-xs text-graphite">{s.hint}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-lg font-semibold text-ink">All notes</h2>
        {articles.length === 0 ? (
          <p className="mt-4 text-sm text-graphite">
            No drafts yet. Enter a topic above to create the first one.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {articles.map((article) => (
              <li key={article.id}>
                <Link
                  href={`/admin/research/${article.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-card px-5 py-4 transition-colors hover:border-slash"
                >
                  <div className="min-w-0">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
                        article.status === "published"
                          ? "bg-slash/10 text-slash"
                          : "bg-mist text-graphite"
                      }`}
                    >
                      {article.status}
                    </span>
                    <p className="mt-2 truncate text-sm font-medium text-ink">
                      {article.title}
                    </p>
                  </div>
                  <span className="text-xs text-graphite">
                    {article.status === "published"
                      ? formatDate(article.published_at)
                      : `Updated ${formatDate(article.updated_at)}`}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
