"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { ResearchArticle, ResearchSection, ResearchSource } from "@/lib/research/types";
import { ResearchArticleView } from "@/components/marketing/research/research-article-view";

export function ResearchEditor({ article: initial }: { article: ResearchArticle }) {
  const router = useRouter();
  const [article, setArticle] = useState(initial);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const searchTitleLen = article.search_title?.length ?? 0;
  const searchDescLen = article.search_description?.length ?? 0;

  const keywordsText = useMemo(
    () => (article.keywords ?? []).join(", "),
    [article.keywords],
  );

  async function patch(body: Record<string, unknown>) {
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/research/${article.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Update failed.");
        return null;
      }
      setArticle(data.article as ResearchArticle);
      setSaved(true);
      router.refresh();
      return data.article as ResearchArticle;
    } catch {
      setError("Network error.");
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function saveMeta(e: React.FormEvent) {
    e.preventDefault();
    await patch({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      cover_image_url: article.cover_image_url,
      cover_credit: article.cover_credit,
      search_title: article.search_title,
      search_description: article.search_description,
      keywords: article.keywords,
      sections: article.sections,
      sources: article.sources,
      read_minutes: article.read_minutes,
    });
  }

  async function publish() {
    const next = await patch({ action: "publish" });
    if (next) router.refresh();
  }

  async function remove() {
    if (!confirmDelete) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/research/${article.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(typeof data.error === "string" ? data.error : "Delete failed.");
        return;
      }
      router.push("/admin/research");
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  function updateSection(i: number, patchSec: Partial<ResearchSection>) {
    setArticle((prev) => ({
      ...prev,
      sections: prev.sections.map((s, idx) =>
        idx === i ? { ...s, ...patchSec } : s,
      ),
    }));
  }

  function updateSource(i: number, patchSrc: Partial<ResearchSource>) {
    setArticle((prev) => ({
      ...prev,
      sources: prev.sources.map((s, idx) =>
        idx === i ? { ...s, ...patchSrc } : s,
      ),
    }));
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl font-semibold lowercase tracking-[-0.03em] text-ink">editor</h1>
          <p className="mt-2 text-sm text-graphite">
            {article.status === "published"
              ? "Published. Readers can see this on /research."
              : "Draft. Readers cannot see this yet."}
          </p>
        </div>
        <Link
          href="/admin/research"
          className="text-sm text-graphite underline-offset-2 hover:text-ink hover:underline"
        >
          All notes
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-graphite">
          <input
            type="checkbox"
            checked={confirmDelete}
            onChange={(e) => setConfirmDelete(e.target.checked)}
          />
          Delete this article
        </label>
        {article.status === "published" ? (
          <Link
            href={`/research/${article.slug}`}
            target="_blank"
            className="inline-flex h-10 items-center rounded-full border border-line bg-card px-4 text-sm font-medium text-ink"
          >
            Open live page
          </Link>
        ) : null}
        <button
          type="button"
          disabled={busy}
          onClick={publish}
          className="inline-flex h-10 items-center rounded-full bg-slash px-4 text-sm font-medium text-paper hover:bg-oxide-deep disabled:opacity-50"
        >
          {article.status === "published" ? "Re-publish" : "Approve and publish"}
        </button>
        <button
          type="button"
          disabled={busy || !confirmDelete}
          onClick={remove}
          className="inline-flex h-10 items-center rounded-full border border-line bg-card px-4 text-sm font-medium text-emergency disabled:opacity-40"
        >
          Delete
        </button>
      </div>

      {error ? <p className="text-sm text-emergency">{error}</p> : null}
      {saved ? <p className="text-sm text-slash">Saved.</p> : null}

      <form onSubmit={saveMeta} className="space-y-8">
        <section className="rounded-2xl border border-line bg-card p-6">
          <h2 className="text-base font-semibold text-ink">Cover picture</h2>
          <p className="mt-1 text-sm text-graphite">
            Paste a JPEG or PNG URL. It replaces the picture on this note and on
            the research index.
          </p>
          {article.cover_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.cover_image_url}
              alt=""
              className="mt-4 max-h-64 w-full rounded-xl object-cover"
            />
          ) : null}
          <label className="mt-4 block">
            <span className="text-xs font-medium text-graphite">Picture URL</span>
            <input
              value={article.cover_image_url ?? ""}
              onChange={(e) =>
                setArticle((p) => ({
                  ...p,
                  cover_image_url: e.target.value || null,
                }))
              }
              className="mt-1 h-10 w-full rounded-xl border border-line bg-paper px-3 text-sm"
            />
          </label>
          <label className="mt-3 block">
            <span className="text-xs font-medium text-graphite">Credit</span>
            <input
              value={article.cover_credit ?? ""}
              onChange={(e) =>
                setArticle((p) => ({
                  ...p,
                  cover_credit: e.target.value || null,
                }))
              }
              className="mt-1 h-10 w-full rounded-xl border border-line bg-paper px-3 text-sm"
            />
          </label>
        </section>

        <section className="rounded-2xl border border-line bg-card p-6">
          <h2 className="text-base font-semibold text-ink">Search</h2>
          <p className="mt-1 text-sm text-graphite">
            Phrases this note can rank for, and how it should read in search.
          </p>
          <label className="mt-4 block">
            <span className="text-xs font-medium text-graphite">
              Search title · {searchTitleLen} characters. Aim for 45 to 60.
            </span>
            <input
              value={article.search_title ?? ""}
              onChange={(e) =>
                setArticle((p) => ({ ...p, search_title: e.target.value }))
              }
              className="mt-1 h-10 w-full rounded-xl border border-line bg-paper px-3 text-sm"
            />
          </label>
          <label className="mt-3 block">
            <span className="text-xs font-medium text-graphite">
              Search description · {searchDescLen} characters. Aim for 140 to
              160.
            </span>
            <textarea
              value={article.search_description ?? ""}
              onChange={(e) =>
                setArticle((p) => ({
                  ...p,
                  search_description: e.target.value,
                }))
              }
              rows={3}
              className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm"
            />
          </label>
          <label className="mt-3 block">
            <span className="text-xs font-medium text-graphite">
              Keywords (comma-separated)
            </span>
            <input
              value={keywordsText}
              onChange={(e) =>
                setArticle((p) => ({
                  ...p,
                  keywords: e.target.value
                    .split(",")
                    .map((k) => k.trim())
                    .filter(Boolean),
                }))
              }
              className="mt-1 h-10 w-full rounded-xl border border-line bg-paper px-3 text-sm"
            />
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            {(article.keywords ?? []).map((k) => (
              <span
                key={k}
                className="rounded-full bg-mist px-3 py-1 text-xs text-ink"
              >
                {k}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-card p-6">
          <h2 className="text-base font-semibold text-ink">Note</h2>
          <label className="mt-4 block">
            <span className="text-xs font-medium text-graphite">Title</span>
            <input
              value={article.title}
              onChange={(e) =>
                setArticle((p) => ({ ...p, title: e.target.value }))
              }
              className="mt-1 h-10 w-full rounded-xl border border-line bg-paper px-3 text-sm"
            />
          </label>
          <label className="mt-3 block">
            <span className="text-xs font-medium text-graphite">Slug</span>
            <input
              value={article.slug}
              onChange={(e) =>
                setArticle((p) => ({ ...p, slug: e.target.value }))
              }
              className="mt-1 h-10 w-full rounded-xl border border-line bg-paper px-3 text-sm font-mono"
            />
          </label>
          <label className="mt-3 block">
            <span className="text-xs font-medium text-graphite">Excerpt</span>
            <textarea
              value={article.excerpt}
              onChange={(e) =>
                setArticle((p) => ({ ...p, excerpt: e.target.value }))
              }
              rows={3}
              className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm"
            />
          </label>

          <div className="mt-6 space-y-6">
            {article.sections.map((section, i) => (
              <div key={section.id} className="rounded-xl border border-line p-4">
                <label className="block">
                  <span className="text-xs font-medium text-graphite">
                    Section title
                  </span>
                  <input
                    value={section.title}
                    onChange={(e) => updateSection(i, { title: e.target.value })}
                    className="mt-1 h-9 w-full rounded-lg border border-line bg-paper px-3 text-sm"
                  />
                </label>
                <label className="mt-2 block">
                  <span className="text-xs font-medium text-graphite">Body</span>
                  <textarea
                    value={section.body}
                    onChange={(e) => updateSection(i, { body: e.target.value })}
                    rows={5}
                    className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm"
                  />
                </label>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-semibold text-ink">Sources</h3>
            {article.sources.map((source, i) => (
              <div
                key={i}
                className="grid gap-2 rounded-xl border border-line p-3 sm:grid-cols-4"
              >
                <input
                  value={source.kind}
                  onChange={(e) => updateSource(i, { kind: e.target.value })}
                  placeholder="Kind"
                  className="h-9 rounded-lg border border-line bg-paper px-2 text-sm"
                />
                <input
                  value={source.year}
                  onChange={(e) => updateSource(i, { year: e.target.value })}
                  placeholder="Year"
                  className="h-9 rounded-lg border border-line bg-paper px-2 text-sm"
                />
                <input
                  value={source.title}
                  onChange={(e) => updateSource(i, { title: e.target.value })}
                  placeholder="Title"
                  className="h-9 rounded-lg border border-line bg-paper px-2 text-sm sm:col-span-2"
                />
              </div>
            ))}
          </div>
        </section>

        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-11 items-center rounded-full bg-slash px-5 text-sm font-medium text-paper hover:bg-oxide-deep disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save changes"}
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-line">
        <div className="border-b border-line bg-mist px-5 py-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-graphite">
            Preview
          </p>
        </div>
        <ResearchArticleView article={article} />
      </div>
    </div>
  );
}
