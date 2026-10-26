"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { CategorySection } from "@/components/marketing/depth";
import { cn } from "@/lib/utils";

const tasks = [
  { title: "Records release is unsigned", detail: "Garrett Holliday still needs to sign before 10:30." },
  { title: "Prior auth follow-up", detail: "Anas Khan’s imaging auth is still pending payer response." },
];

export function TasksSection() {
  const [done, setDone] = useState<boolean[]>(() => tasks.map(() => false));
  const open = done.filter((item) => !item).length;

  return (
    <CategorySection
      id="tasks"
      flip
      eyebrow="Tasks"
      title="Two things are still open."
      body="The morning has a records release waiting on Garrett, and a prior auth follow-up waiting on Anas. Both are due today."
    >
      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-lg shadow-ink/5">
        <div className="border-b border-line px-5 py-4">
          <p className="text-sm font-medium text-ink">October 14</p>
          <p className="text-xs text-graphite">{open === 0 ? "Clear for now" : `${open} still open`}</p>
        </div>
        <div>
          {tasks.map((task, index) => {
            const complete = done[index];
            return (
              <button
                key={task.title}
                type="button"
                aria-pressed={complete}
                onClick={() =>
                  setDone((current) => current.map((item, itemIndex) => (itemIndex === index ? !item : item)))
                }
                className="flex w-full items-start gap-4 border-t border-line px-5 py-4 text-left first:border-t-0 hover:bg-paper"
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                    complete ? "border-ink bg-ink text-paper" : "border-line bg-white text-transparent",
                  )}
                  aria-hidden
                >
                  <Check className="h-3 w-3" />
                </span>
                <span>
                  <span className={cn("block font-display text-2xl text-ink", complete && "text-graphite line-through")}>
                    {task.title}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-graphite">
                    {complete ? "Done for this morning." : task.detail}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </CategorySection>
  );
}
