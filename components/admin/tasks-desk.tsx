"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page";
import { adminTasks, type AdminTaskLane } from "@/lib/admin/task-catalog";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Marketing", "Compliance"] as const;

type Filter = (typeof FILTERS)[number];

export function TasksDesk() {
  const tasks = useMemo(() => adminTasks(), []);
  const [filter, setFilter] = useState<Filter>("All");
  const lanes: AdminTaskLane[] = filter === "All" ? ["Marketing", "Compliance"] : [filter];
  const shown = tasks.filter((task) => filter === "All" || task.lane === filter);

  return (
    <div>
      <AdminPageHeader
        title="tasks"
        lede="Every marketing and compliance task, with the steps, the cost, and what finished looks like."
        meta={`${shown.length} of ${tasks.length} tasks`}
        actions={
          <div className="inline-flex rounded-full border border-line bg-mist p-1" role="group" aria-label="Task lane">
            {FILTERS.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={filter === item}
                onClick={() => setFilter(item)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm",
                  filter === item ? "bg-card font-medium text-ink shadow-sm" : "text-graphite hover:text-ink",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        }
      />

      <div className="mt-8 space-y-10">
        {lanes.map((lane) => {
          const group = tasks.filter((task) => task.lane === lane);
          if (group.length === 0) return null;
          return (
            <section key={lane} className="space-y-4">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-graphite">{lane}</h2>
              {group.map((task) => (
                <article key={task.id} className="overflow-hidden rounded-2xl border border-line bg-card">
                  <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-5">
                    <div className="min-w-0 max-w-2xl">
                      <h3 className="text-lg font-medium tracking-[-0.02em] text-ink">{task.title}</h3>
                      <Link href={task.href} className="mt-2 inline-block text-xs font-medium text-slash hover:text-oxide-ink">
                        Open {lane.toLowerCase()} desk
                      </Link>
                    </div>
                    <div className="sm:text-right">
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">Cost</p>
                      <p className="mt-1 max-w-xs text-sm font-medium leading-snug text-ink">{task.cost}</p>
                    </div>
                  </div>
                  <div className="border-t border-line bg-mist/40 px-5 py-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">Expected result</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink">{task.result}</p>
                  </div>
                  <ol className="divide-y divide-line border-t border-line">
                    {task.steps.map((step, index) => (
                      <li
                        key={step.id}
                        className="grid gap-2 px-5 py-3.5 sm:grid-cols-[1.75rem_minmax(0,1fr)_auto] sm:gap-4"
                      >
                        <span className="font-mono text-xs tabular-nums text-graphite">{index + 1}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-ink">{step.title}</p>
                          <p className="mt-1 text-xs leading-relaxed text-graphite">{step.detail}</p>
                        </div>
                        {step.cost ? (
                          <p className="text-xs font-medium text-ink sm:max-w-[12rem] sm:text-right">{step.cost}</p>
                        ) : null}
                      </li>
                    ))}
                  </ol>
                </article>
              ))}
            </section>
          );
        })}
      </div>
    </div>
  );
}
