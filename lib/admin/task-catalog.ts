import { COMPLIANCE_TRACKS, type ComplianceTrack } from "@/lib/compliance/tasks";
import { GOLIVE_TASKS, type GoliveTask } from "@/lib/marketing/golive-tasks";

export type AdminTaskLane = "Marketing" | "Compliance";

export type AdminTaskStep = {
  id: string;
  title: string;
  detail: string;
  cost?: string;
};

export type AdminTask = {
  id: string;
  lane: AdminTaskLane;
  title: string;
  result: string;
  cost: string;
  href: string;
  steps: AdminTaskStep[];
};

/**
 * Marketing prices already written in the funding plan or the go-live notes.
 * Ads is the range across the three funding scenarios ($1,500 / $2,500 / $4,000).
 */
const MARKETING_COST: Record<string, string> = {
  supabase: "$0",
  env: "$0",
  ga4: "$0",
  posthog: "$0",
  ads: "$1,500–$4,000/mo",
  semrush: "$140/mo allowance",
  domains: "~$217/mo + $45",
  list: "$4,000 allowance",
  webhook: "Included in Instantly ($97/mo)",
  qa: "$0",
};

function summarizeCosts(costs: Array<string | undefined>) {
  const unique = [...new Set(costs.map((cost) => cost?.trim()).filter((cost): cost is string => Boolean(cost)))];
  if (unique.length === 0) return "Not priced";
  if (unique.length === 1) return unique[0];
  return "Listed on each step";
}

function marketingTask(task: GoliveTask): AdminTask {
  return {
    id: `marketing-${task.id}`,
    lane: "Marketing",
    title: task.title,
    result: task.summary,
    cost: MARKETING_COST[task.id] ?? "Not priced",
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
    title: track.title,
    result: track.why,
    cost: summarizeCosts(track.steps.map((step) => step.cost)),
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
