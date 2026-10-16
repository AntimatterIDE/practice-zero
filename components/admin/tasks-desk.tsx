"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page";
import {
  adminTasks,
  formatTaskCost,
  formatUsd,
  taskCostTotals,
  type AdminTask,
  type AdminTaskLane,
} from "@/lib/admin/task-catalog";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Marketing", "Compliance"] as const;
type Filter = (typeof FILTERS)[number];

function CostStrip({
  once,
  monthly,
  detail,
}: {
  once: number;
  monthly: number;
  detail: string;
}) {
  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-line bg-card">
      <div className="grid gap-0 sm:grid-cols-2">
        <div className="border-b border-line px-5 py-5 sm:border-b-0 sm:border-r">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">One-time</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums tracking-[-0.03em] text-ink">
            {formatUsd(once)}
          </p>
        </div>
        <div className="px-5 py-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">Monthly</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums tracking-[-0.03em] text-ink">
            {formatUsd(monthly)}
            <span className="text-lg font-medium text-graphite">/mo</span>
          </p>
        </div>
      </div>
      <p className="border-t border-line bg-mist/50 px-5 py-3 text-xs leading-relaxed text-graphite">{detail}</p>
    </section>
  );
}

function TaskRow({
  task,
  open,
  onToggle,
}: {
  task: AdminTask;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="border-b border-line last:border-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-start gap-3 px-4 py-4 text-left hover:bg-mist/40 sm:gap-4 sm:px-5"
      >
        <span className="mt-0.5 w-6 shrink-0 font-mono text-xs tabular-nums text-graphite">
          {task.number}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <span className="text-sm font-medium text-ink">{task.title}</span>
            <span className="shrink-0 text-sm font-medium tabular-nums text-ink">
              {formatTaskCost(task.cost)}
            </span>
          </span>
          <span className="mt-1 block line-clamp-2 text-xs leading-relaxed text-graphite">{task.result}</span>
        </span>
        <ChevronDown
          className={cn("mt-1 size-4 shrink-0 text-graphite transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="border-t border-line bg-mist/30 px-4 pb-4 pt-3 sm:px-5 sm:pl-[3.25rem]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-medium text-ink">Expected result</p>
            <Link href={task.href} className="text-xs font-medium text-slash hover:text-oxide-ink">
              Open {task.lane.toLowerCase()} desk
            </Link>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-graphite">{task.result}</p>
          <ol className="mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line bg-card">
            {task.steps.map((step, index) => (
              <li
                key={step.id}
                className="grid gap-1 px-4 py-3 sm:grid-cols-[1.5rem_minmax(0,1fr)_auto] sm:gap-3"
              >
                <span className="font-mono text-[11px] tabular-nums text-graphite">{index + 1}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">{step.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-graphite">{step.detail}</p>
                </div>
                {step.cost ? (
                  <p className="text-xs font-medium text-ink sm:max-w-[10rem] sm:text-right">{step.cost}</p>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </article>
  );
}

export function TasksDesk() {
  const tasks = useMemo(() => adminTasks(), []);
  const totals = useMemo(() => taskCostTotals(tasks), [tasks]);
  const [filter, setFilter] = useState<Filter>("All");
  const [openId, setOpenId] = useState<string | null>(null);

  const lanes: AdminTaskLane[] = filter === "All" ? ["Marketing", "Compliance"] : [filter];
  const shown = tasks.filter((task) => filter === "All" || task.lane === filter);

  return (
    <div>
      <AdminPageHeader
        title="tasks"
        lede="Marketing and compliance work in one place. Open a row for the steps."
        meta={`${shown.length} tasks`}
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

      <CostStrip
        once={
          filter === "Marketing"
            ? totals.marketingOnce
            : filter === "Compliance"
              ? totals.complianceOnce
              : totals.once
        }
        monthly={
          filter === "Marketing"
            ? totals.marketingMonthly
            : filter === "Compliance"
              ? totals.complianceMonthly
              : totals.monthly
        }
        detail={
          filter === "All"
            ? `Marketing ${formatUsd(totals.marketingOnce)} one-time · ${formatUsd(totals.marketingMonthly)}/mo. Compliance ${formatUsd(totals.complianceOnce)} one-time · ${formatUsd(totals.complianceMonthly)}/mo. Shared vendors are counted once per task.`
            : "Totals follow the filter above. Expand a task for the step list and step-level prices."
        }
      />

      <div className="mt-8 space-y-8">
        {lanes.map((lane) => {
          const group = tasks.filter((task) => task.lane === lane);
          if (group.length === 0) return null;
          const laneOnce = group.reduce((sum, task) => sum + task.cost.once, 0);
          const laneMonthly = group.reduce((sum, task) => sum + task.cost.monthly, 0);
          return (
            <section key={lane}>
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-graphite">{lane}</h2>
                <p className="text-xs tabular-nums text-graphite">
                  {formatUsd(laneOnce)} one-time · {formatUsd(laneMonthly)}/mo
                </p>
              </div>
              <div className="overflow-hidden rounded-2xl border border-line bg-card">
                {group.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    open={openId === task.id}
                    onToggle={() => setOpenId((current) => (current === task.id ? null : task.id))}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
