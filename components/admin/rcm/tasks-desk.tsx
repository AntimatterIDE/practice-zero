"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDay, patientName } from "@/lib/rcm/format";
import { Field, LoadingDesk, PageHeader, Stat, fieldClass, panelClass, useClinicToday } from "@/components/admin/rcm/ui";
import { useRcm } from "@/components/admin/rcm/store";
import type { PracticeTask } from "@/lib/rcm/types";
import { cn } from "@/lib/utils";

type Bucket = "overdue" | "today" | "upcoming" | "done";
type Filter = "open" | Bucket;

const bucketLabel: Record<Bucket, string> = {
  overdue: "Overdue",
  today: "Due today",
  upcoming: "Upcoming",
  done: "Done",
};

const bucketTone: Record<Bucket, string> = {
  overdue: "bg-red-50 text-emergency",
  today: "bg-amber-50 text-amber-950",
  upcoming: "bg-mist text-ink",
  done: "bg-mint text-oxide-deep",
};

const bucketOrder: Bucket[] = ["overdue", "today", "upcoming", "done"];

const filters: { id: Filter; label: string }[] = [
  { id: "open", label: "Open" },
  { id: "overdue", label: "Overdue" },
  { id: "today", label: "Today" },
  { id: "upcoming", label: "Upcoming" },
  { id: "done", label: "Done" },
];

const emptyCopy: Record<Filter, string> = {
  open: "Nothing is waiting on the front desk. Add a task when something needs doing before a visit.",
  overdue: "Nothing is overdue.",
  today: "Nothing is due today.",
  upcoming: "Nothing is scheduled ahead.",
  done: "No completed tasks yet.",
};

function bucketOf(task: PracticeTask, today: string): Bucket {
  if (task.status === "done") return "done";
  if (task.due < today) return "overdue";
  if (task.due === today) return "today";
  return "upcoming";
}

export function TasksDesk() {
  const { ready, tasks, patients, addTask, setTaskStatus } = useRcm();
  const today = useClinicToday();
  const [patientId, setPatientId] = useState("");
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [due, setDue] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("open");

  const names = useMemo(() => new Map(patients.map((patient) => [patient.id, patientName(patient)])), [patients]);

  const counts = useMemo(() => {
    const result: Record<Bucket, number> = { overdue: 0, today: 0, upcoming: 0, done: 0 };
    for (const task of tasks) result[bucketOf(task, today)] += 1;
    return result;
  }, [tasks, today]);

  const groups = useMemo(() => {
    const term = query.trim().toLowerCase();
    const matched = tasks
      .map((task) => ({ task, bucket: bucketOf(task, today) }))
      .filter(({ bucket }) => (filter === "open" ? bucket !== "done" : bucket === filter))
      .filter(({ task }) => {
        if (!term) return true;
        return [task.title, task.detail, names.get(task.patientId) ?? ""].join(" ").toLowerCase().includes(term);
      })
      .sort((a, b) => a.task.due.localeCompare(b.task.due) || a.task.title.localeCompare(b.task.title));
    return bucketOrder
      .map((bucket) => ({ bucket, items: matched.filter((item) => item.bucket === bucket).map((item) => item.task) }))
      .filter((group) => group.items.length > 0);
  }, [tasks, today, filter, query, names]);

  if (!ready) return <LoadingDesk />;

  const resolvedPatient = patientId || patients[0]?.id || "";
  const resolvedDue = due || today;
  const openCount = counts.overdue + counts.today + counts.upcoming;
  const anyMatch = groups.length > 0;

  return (
    <main>
      <PageHeader
        kicker="Practice"
        title="Tasks"
        lede="Confirmations, missing intake, interpreters, and anything the front desk owes before the visit."
        meta={
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Overdue" value={String(counts.overdue)} detail="Past the due date" />
            <Stat label="Due today" value={String(counts.today)} detail={formatDay(today)} />
            <Stat label="Open" value={String(openCount)} detail={`${counts.done} done`} />
          </div>
        }
      />
      <div className="mt-8 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="grid gap-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative min-w-0 flex-1 sm:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" aria-hidden />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search task, patient, or detail"
                className={`${fieldClass} pl-10`}
                aria-label="Search tasks"
              />
            </label>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter tasks">
              {filters.map((item) => {
                const count = item.id === "open" ? openCount : counts[item.id];
                const active = filter === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilter(item.id)}
                    className={cn(
                      "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-sm transition-colors",
                      active ? "border-slash bg-slash text-white" : "border-line hover:border-oxide",
                    )}
                  >
                    {item.label}
                    <span className={cn("text-xs tabular-nums", active ? "text-white/80" : "text-muted")}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {anyMatch ? (
            groups.map(({ bucket, items }) => (
              <div key={bucket}>
                <h2 className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-neutral-500">
                  {bucketLabel[bucket]}
                  <span className="tabular-nums">{items.length}</span>
                </h2>
                <ul className="grid gap-2">
                  {items.map((task) => {
                    const done = task.status === "done";
                    return (
                      <li key={task.id} className="flex items-start gap-3 rounded-2xl border border-line bg-card p-3.5">
                        <button
                          type="button"
                          className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full text-muted hover:text-oxide-deep"
                          aria-label={done ? `Reopen ${task.title}` : `Mark ${task.title} done`}
                          onClick={() => setTaskStatus(task.id, done ? "open" : "done")}
                        >
                          {done ? <CheckCircle2 className="size-5 text-oxide-deep" aria-hidden /> : <Circle className="size-5" aria-hidden />}
                        </button>
                        <div className="min-w-0 flex-1">
                          <p className={done ? "text-muted line-through" : "font-semibold"}>{task.title}</p>
                          <p className="mt-0.5 text-sm text-muted">
                            <Link href={`/try/patients/${task.patientId}`} className="underline">
                              {names.get(task.patientId) ?? "Unknown patient"}
                            </Link>
                          </p>
                          {task.detail ? <p className="mt-1 text-sm">{task.detail}</p> : null}
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1.5">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2.5 py-1 text-xs uppercase tracking-[0.12em]",
                              bucketTone[bucket],
                            )}
                          >
                            {bucketLabel[bucket]}
                          </span>
                          <span className="text-xs text-muted">{formatDay(task.due)}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          ) : (
            <p className={`${panelClass} text-sm text-muted`}>
              {query.trim() ? "No tasks match that search." : emptyCopy[filter]}
            </p>
          )}
        </section>
        <form
          className="grid h-fit gap-4 rounded-2xl border border-line bg-card p-5 shadow-[0_16px_36px_-28px_rgb(7_30_54_/_0.45)]"
          onSubmit={(event) => {
            event.preventDefault();
            if (!resolvedPatient || !title.trim()) return;
            addTask({
              patientId: resolvedPatient,
              title: title.trim(),
              detail: detail.trim(),
              due: resolvedDue,
            });
            setTitle("");
            setDetail("");
            setFilter("open");
            setQuery("");
          }}
        >
          <h2 className="font-display text-2xl">Add task</h2>
          <Field label="Patient">
            <select className={fieldClass} value={resolvedPatient} onChange={(event) => setPatientId(event.target.value)}>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patientName(patient)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Task">
            <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} required />
          </Field>
          <Field label="Detail">
            <input className={fieldClass} value={detail} onChange={(event) => setDetail(event.target.value)} />
          </Field>
          <Field label="Due">
            <input className={fieldClass} type="date" value={resolvedDue} onChange={(event) => setDue(event.target.value)} required />
          </Field>
          <Button type="submit">Save task</Button>
        </form>
      </div>
    </main>
  );
}
