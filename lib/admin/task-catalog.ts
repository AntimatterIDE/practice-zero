import { COMPLIANCE_TRACKS, type ComplianceTrack } from "@/lib/compliance/tasks";
import { GOLIVE_TASKS, type GoliveTask } from "@/lib/marketing/golive-tasks";

export type AdminTaskLane = "Marketing" | "Compliance";

export type AdminTaskStep = {
  id: string;
  title: string;
  detail: string;
  cost?: string;
};

export type TaskMoney = {
  /** One-time dollars (setup, year-1 program spend). */
  once: number;
  /** Recurring monthly dollars. */
  monthly: number;
  /** Short label for the task card. */
  label: string;
};

export type AdminTask = {
  id: string;
  lane: AdminTaskLane;
  number: number;
  title: string;
  result: string;
  cost: TaskMoney;
  href: string;
  steps: AdminTaskStep[];
};

export type TaskCostTotals = {
  once: number;
  monthly: number;
  marketingOnce: number;
  marketingMonthly: number;
  complianceOnce: number;
  complianceMonthly: number;
  taskCount: number;
};

/**
 * Planning costs for each marketing task.
 * Figures match the funding plan / go-live notes. Ads uses the base scenario.
 * Instantly lives under domains so the webhook task does not double-count it.
 */
const MARKETING_MONEY: Record<string, TaskMoney> = {
  supabase: { once: 0, monthly: 0, label: "$0" },
  env: { once: 0, monthly: 0, label: "$0" },
  ga4: { once: 0, monthly: 0, label: "$0" },
  posthog: { once: 0, monthly: 0, label: "$0" },
  ads: { once: 0, monthly: 2500, label: "$2,500/mo base" },
  semrush: { once: 0, monthly: 140, label: "$140/mo" },
  domains: { once: 45, monthly: 217, label: "$45 + $217/mo" },
  list: { once: 4000, monthly: 0, label: "$4,000" },
  webhook: { once: 0, monthly: 0, label: "In Instantly" },
  qa: { once: 0, monthly: 0, label: "$0" },
};

/**
 * One rollup per compliance track so shared vendors are not counted twice.
 * Step-level cost strings stay on the step rows for reading; these numbers feed the totals.
 */
const COMPLIANCE_MONEY: Record<string, TaskMoney> = {
  "quick-wins": { once: 0, monthly: 419, label: "~$419/mo" },
  "aes-256": { once: 0, monthly: 0, label: "Included" },
  baa: { once: 12000, monthly: 0, label: "$12,000 counsel" },
  uptime: { once: 0, monthly: 60, label: "~$60/mo" },
  hipaa: { once: 10000, monthly: 1050, label: "$10k + $1,050/mo" },
  soc2: { once: 37000, monthly: 0, label: "$37,000 yr1" },
  budget: { once: 0, monthly: 0, label: "Reference only" },
};

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatUsd(value: number) {
  return money.format(Math.round(value));
}

export function formatTaskCost(cost: TaskMoney) {
  return cost.label;
}

function marketingTask(task: GoliveTask): AdminTask {
  return {
    id: `marketing-${task.id}`,
    lane: "Marketing",
    number: task.number,
    title: task.title,
    result: task.summary,
    cost: MARKETING_MONEY[task.id] ?? { once: 0, monthly: 0, label: "Not priced" },
    href: "/admin/marketing",
    steps: task.steps.map((step) => ({
      id: step.id,
      title: step.title,
      detail: step.detail,
    })),
  };
}

function complianceTask(track: ComplianceTrack): AdminTask {
  return {
    id: `compliance-${track.id}`,
    lane: "Compliance",
    number: track.number,
    title: track.title,
    result: track.why,
    cost: COMPLIANCE_MONEY[track.id] ?? { once: 0, monthly: 0, label: "Not priced" },
    href: "/admin/compliance",
    steps: track.steps.map((step) => ({
      id: step.id,
      title: step.title,
      detail: step.detail,
      cost: step.cost,
    })),
  };
}

export function adminTasks(): AdminTask[] {
  return [...GOLIVE_TASKS.map(marketingTask), ...COMPLIANCE_TRACKS.map(complianceTask)];
}

export function taskCostTotals(tasks: AdminTask[] = adminTasks()): TaskCostTotals {
  return tasks.reduce<TaskCostTotals>(
    (totals, task) => {
      totals.once += task.cost.once;
      totals.monthly += task.cost.monthly;
      totals.taskCount += 1;
      if (task.lane === "Marketing") {
        totals.marketingOnce += task.cost.once;
        totals.marketingMonthly += task.cost.monthly;
      } else {
        totals.complianceOnce += task.cost.once;
        totals.complianceMonthly += task.cost.monthly;
      }
      return totals;
    },
    {
      once: 0,
      monthly: 0,
      marketingOnce: 0,
      marketingMonthly: 0,
      complianceOnce: 0,
      complianceMonthly: 0,
      taskCount: 0,
    },
  );
}
