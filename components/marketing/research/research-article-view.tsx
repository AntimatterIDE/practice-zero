"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Clock } from "lucide-react";
import type { ResearchArticle } from "@/lib/research/types";
import { BrandMark } from "@/components/marketing/brand-mark";

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ResearchArticleView({
  article,
  related = [],
}: {
  article: ResearchArticle;
  related?: ResearchArticle[];
}) {
  const [active, setActive] = useState(article.sections[0]?.id ?? "");
  const refs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );

    for (const section of article.sections) {
      const el = refs.current[section.id];
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [article.sections]);

  return (
    <article className="w-full bg-paper">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative aspect-[21/9] w-full overflow-hidden sm:aspect-[3/1]"
      >
        {article.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.cover_image_url}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-mist via-paper to-slash/25" />
        )}
        {article.cover_credit ? (
          <div className="absolute bottom-4 right-4 rounded bg-ink/40 px-2 py-1 text-xs text-paper/80">
            {article.cover_credit}
          </div>
        ) : null}
      </motion.div>

      <div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
            <div className="min-w-0 flex-1">
              <motion.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slash">
                  Research
                </p>
                <h1 className="mt-3 text-3xl font-medium leading-tight tracking-tight text-ink sm:text-4xl md:text-5xl">
                  {article.title}
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-graphite sm:text-lg">
                  {article.excerpt}
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-8">
                  <div className="flex items-center gap-3">
                    <BrandMark size="sm" href={null} />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-ink">
                        {article.author_name}
                      </span>
                      <span className="text-xs text-graphite">
                        Practice Zero · {article.read_minutes} min read
                      </span>
                    </div>
                  </div>
                  {article.published_at ? (
                    <div className="flex items-center gap-1.5 text-xs text-graphite">
                      <Clock className="size-3.5" aria-hidden />
                      {formatDate(article.published_at)}
                    </div>
                  ) : null}
                </div>
              </motion.header>

              <div className="mt-10 space-y-12">
                {article.sections.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    ref={(el) => {
                      refs.current[section.id] = el;
                    }}
                    className="scroll-mt-28"
                  >
                    <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                      {section.title}
                    </h2>
                    {section.body.split(/\n\n+/).map((para, i) => (
                      <p
                        key={i}
                        className="mt-4 text-[15px] leading-relaxed text-graphite sm:text-base"
                      >
                        {para}
                      </p>
                    ))}
                  </section>
                ))}
              </div>

              {related.length > 0 ? (
                <div className="mt-16 border-t border-line pt-10">
                  <h2 className="text-lg font-semibold text-ink">Read next</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {related.map((r) => (
                      <Link
                        key={r.id}
                        href={`/research/${r.slug}`}
                        prefetch={false}
                        className="rounded-full border border-line bg-mist px-4 py-2 text-sm text-ink hover:border-slash hover:text-slash"
                      >
                        {r.topic || r.title.split(":")[0]}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              {article.sources.length > 0 ? (
                <div className="mt-14 border-t border-line pt-10">
                  <h2 className="text-lg font-semibold text-ink">
                    The papers behind this note
                  </h2>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {article.sources.map((source, i) => {
                      const inner = (
                        <>
                          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-slash text-xs font-semibold text-paper">
                            {source.kind.slice(0, 1).toUpperCase()}
                          </span>
                          <span className="min-w-0">
                            <span className="block text-xs text-graphite">
                              {source.kind} · {source.year}
                            </span>
                            <span className="mt-0.5 line-clamp-2 block text-sm text-ink">
                              {source.title}
                            </span>
                          </span>
                        </>
                      );
                      const className =
                        "flex items-start gap-3 rounded-2xl border border-line bg-card p-4";
                      return source.url ? (
                        <li key={i}>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            className={`${className} transition-colors hover:border-slash`}
                          >
                            {inner}
                          </a>
                        </li>
                      ) : (
                        <li key={i} className={className}>
                          {inner}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}

              <p className="mt-12 text-sm text-graphite">
                This note is general product information. A demo is where a plan
                for your practice is decided.{" "}
                <Link href="/contact" className="underline underline-offset-2">
                  Contact Practice Zero
                </Link>
                .
              </p>
            </div>

            <aside className="hidden w-56 shrink-0 lg:block xl:w-64">
              <nav
                aria-label="On this note"
                className="sticky top-28 space-y-1 border-l border-line pl-4"
              >
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-graphite">
                  On this note
                </p>
                {article.sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={`block border-l-2 py-1.5 pl-3 text-sm transition-colors ${
                      active === section.id
                        ? "-ml-px border-slash font-medium text-ink"
                        : "border-transparent text-graphite hover:text-ink"
                    }`}
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </aside>
          </div>
        </div>
      </div>
    </article>
  );
}
