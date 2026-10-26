"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import type { ResearchArticle } from "@/lib/research/types";

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ArticleCard({
  article,
  delay = 0,
}: {
  article: ResearchArticle;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Link
        href={`/research/${article.slug}`}
        prefetch={false}
        className="group flex flex-col gap-3"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-mist">
          {article.cover_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.cover_image_url}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full place-items-center bg-gradient-to-br from-mist via-paper to-slash/20 font-mono text-xs uppercase tracking-[0.2em] text-slash">
              research
            </div>
          )}
          <span className="absolute right-3 top-3 rounded-full bg-paper px-3 py-1 text-xs font-medium text-ink shadow-sm">
            Research
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-ink transition-colors group-hover:text-slash sm:text-base">
            {article.title}
          </h3>
          <span className="text-xs text-graphite">
            {formatDate(article.published_at)}
            {article.read_minutes ? ` · ${article.read_minutes} min` : ""}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export function ResearchIndex({ articles }: { articles: ResearchArticle[] }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return articles;
    return articles.filter((a) => {
      const hay = [
        a.title,
        a.excerpt,
        a.topic ?? "",
        ...(a.keywords ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [articles, q]);

  return (
    <section className="w-full bg-paper pb-8 sm:pb-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-0 bg-paper px-4 pb-20 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:px-8 md:pb-28 md:pt-20"
      >
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slash">
                Research
              </p>
              <h1 className="mt-3 text-5xl font-medium tracking-tight text-ink sm:text-6xl md:text-7xl">
                Research
              </h1>
            </div>
            <p className="max-w-sm text-base tracking-tight text-graphite sm:text-lg">
              Notes on agentic EHR, room hardware, and running a practice with
              Practice Zero agents not a full front-office stack.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="relative z-10 -mt-12 px-4 sm:-mt-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="rounded-3xl border border-line bg-card px-6 pb-12 pt-10 shadow-lg sm:rounded-[2rem] sm:px-10 sm:pb-16 sm:pt-14">
            <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-2xl font-medium text-ink sm:text-3xl md:text-4xl">
                Latest notes
              </h2>
              <label className="block w-full max-w-sm">
                <span className="sr-only">Search research</span>
                <input
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search topics, titles…"
                  className="h-11 w-full rounded-full border border-line bg-paper px-4 text-sm text-ink placeholder:text-graphite/70 focus:border-slash focus:outline-none focus:ring-2 focus:ring-slash/30"
                />
              </label>
            </div>

            {filtered.length === 0 ? (
              <p className="text-sm text-graphite">
                No published notes match that search yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
                {filtered.map((article, idx) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    delay={0.1 + idx * 0.04}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
