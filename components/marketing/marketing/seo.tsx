"use client";

import { useState } from "react";
import { CategorySection } from "@/components/marketing/depth";
import { cn } from "@/lib/utils";

const pages = [
  {
    query: "New patients",
    title: "New patients",
    detail: "A first visit, and what to bring.",
    path: "southeast.example/new",
  },
  {
    query: "Blood pressure",
    title: "Blood pressure",
    detail: "The reason Paul came in.",
    path: "southeast.example/blood-pressure",
  },
  {
    query: "Morning hours",
    title: "Morning hours",
    detail: "When the practice is open.",
    path: "southeast.example/hours",
  },
];

export function SeoSection() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(1);
  const needle = query.trim().toLowerCase();
  const results = pages.filter((page) => {
    if (!needle) return true;
    return `${page.title} ${page.detail} ${page.query}`.toLowerCase().includes(needle);
  });
  const openIndex = results.some((page) => pages.indexOf(page) === selected)
    ? selected
    : pages.indexOf(results[0]);

  return (
    <CategorySection
      id="seo"
      flip
      eyebrow="SEO"
      title="Pages a person can find."
      body="Search is a set of plain pages: new patients, the visit they need, and when the door is open. Reputation and reviews help them choose no ranking is promised here."
    >
      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-xl shadow-ink/10">
        <label className="block border-b border-line px-5 py-4">
          <span className="text-[11px] uppercase tracking-[0.16em] text-graphite/70">Search the practice</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="New patients, blood pressure, hours"
            className="mt-2 w-full bg-transparent text-sm text-ink outline-none placeholder:text-graphite/50"
          />
        </label>
        <div className="flex flex-wrap gap-2 px-5 py-3">
          {pages.map((page, index) => (
            <button
              key={page.query}
              type="button"
              onClick={() => {
                setQuery(page.query);
                setSelected(index);
              }}
              className="rounded-full bg-mist px-3 py-1.5 text-xs font-medium text-graphite hover:text-ink"
            >
              {page.query}
            </button>
          ))}
        </div>
        <div>
          {results.length === 0 ? (
            <p className="border-t border-line px-5 py-6 text-sm text-graphite">No page for that yet.</p>
          ) : (
            results.map((page) => {
              const index = pages.indexOf(page);
              const open = index === openIndex;
              return (
                <button
                  key={page.path}
                  type="button"
                  aria-pressed={open}
                  onClick={() => setSelected(index)}
                  className={cn(
                    "block w-full border-t border-line px-5 py-4 text-left",
                    open ? "bg-mist" : "hover:bg-paper",
                  )}
                >
                  <p className="text-[11px] uppercase tracking-[0.14em] text-graphite/70">{page.path}</p>
                  <p className="mt-1 font-display text-2xl text-ink">{page.title}</p>
                  {open && <p className="mt-2 text-sm leading-relaxed text-graphite">{page.detail}</p>}
                </button>
              );
            })
          )}
        </div>
      </div>
    </CategorySection>
  );
}
