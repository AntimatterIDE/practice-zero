import {
  COMPLIANCE_TRACKS,
  complianceStepKey,
  countComplianceSteps,
} from "@/lib/compliance/tasks";
import { buildFundingPlan, type FundingAssumptions } from "@/lib/funding/model";
import { GOLIVE_TASKS, goliveStepKey } from "@/lib/marketing/golive-tasks";
import type { GoliveStatusReport, StepStatus } from "@/lib/marketing/golive-status-types";

export const COMPLIANCE_CHECKLIST_KEY = "practice-zero-compliance-checklist";
export const FUNDING_ASSUMPTIONS_KEY = "practice-zero-funding-assumptions";

export type StatusState = "done" | "open" | "later";

export type StatusCheck = {
  id: string;
  label: string;
  detail: string;
  state: StatusState;
};

export type StatusLane = {
  id: "marketing" | "compliance" | "funding";
  title: string;
  href: string;
  headline: string;
  checks: StatusCheck[];
};

const MARKETING_GROUPS: { id: string; label: string; taskIds: string[] }[] = [
  {
    id: "measure",
    label: "Consultations are being measured",
    taskIds: ["env", "ga4", "posthog"],
  },
  {
    id: "capture",
    label: "Leads keep source and campaign",
    taskIds: ["supabase"],
  },
  {
    id: "outbound",
    label: "Cold email can send",
    taskIds: ["domains", "list", "webhook"],
  },
  {
    id: "ads",
    label: "Paid search is on",
    taskIds: ["ads", "semrush"],
  },
];

const COMPLIANCE_GROUPS: { id: string; label: string; detail: string }[] = [
  {
    id: "quick-wins",
    label: "This week’s safeguards",
    detail: "MFA, the BAAs you can sign now, monitors, and a secrets vault.",
  },
  {
    id: "baa",
    label: "A customer BAA can be offered",
    detail: "Subprocessor BAAs plus a counsel-approved agreement for practices.",
  },
  {
    id: "uptime",
    label: "Uptime is being measured",
    detail: "External monitors, a status page, and a written 99.9% scope.",
  },
  {
    id: "hipaa",
    label: "The HIPAA program is in place",
    detail: "Risk analysis, policies, access control, training, and a pen test.",
  },
  {
    id: "soc2",
    label: "SOC 2 Type II is underway",
    detail: "A GRC platform, an observation window, and an auditor engaged.",
  },
];

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function usd(value: number) {
  return money.format(Math.round(value));
}

function rollup(statuses: StepStatus[]): StatusState {
  if (statuses.length === 0) return "open";
  if (statuses.every((status) => status === "pass" || status === "optional_pass")) return "done";
  if (statuses.every((status) => status === "pass" || status === "optional_pass" || status === "deferred")) {
    return "later";
  }
  return "open";
}

function statusesFor(report: GoliveStatusReport, taskIds: string[]): StepStatus[] {
  const wanted = new Set<string>();
  for (const task of GOLIVE_TASKS) {
    if (!taskIds.includes(task.id)) continue;
    for (const step of task.steps) wanted.add(goliveStepKey(task.id, step.id));
  }
  const byKey = new Map(report.steps.map((step) => [step.key, step.status]));
  return [...wanted].map((key) => byKey.get(key) ?? "pending");
}

function laneHeadline(noun: string, checks: StatusCheck[]) {
  const done = checks.filter((check) => check.state === "done").length;
  const next = checks.find((check) => check.state === "open") ?? checks.find((check) => check.state === "later");
  if (!next) return `${noun} checks on this page are done.`;
  if (next.state === "later") {
    return `${done} of ${checks.length} ${noun} checks are done. Next is later: ${next.label}.`;
  }
  return `${done} of ${checks.length} ${noun} checks are done. Next: ${next.label}.`;
}

export function marketingLane(report: GoliveStatusReport | null): StatusLane {
  if (!report) {
    return {
      id: "marketing",
      title: "Marketing",
      href: "/admin/marketing",
      headline: "Reading production signals.",
      checks: [],
    };
  }

  const pass = report.summary.pass + report.summary.optionalPass;
  const checks = MARKETING_GROUPS.map((group) => {
    const statuses = statusesFor(report, group.taskIds);
    const state = rollup(statuses);
    const passed = statuses.filter((status) => status === "pass" || status === "optional_pass").length;
    return {
      id: group.id,
      label: group.label,
      state,
      detail:
        state === "later"
          ? "Deferred until there is budget. The go-live check is not treating this as a failure."
          : `${passed} of ${statuses.length} underlying steps are passing. ${pass} of ${report.summary.total} go-live steps pass overall.`,
    };
  });

  return {
    id: "marketing",
    title: "Marketing",
    href: "/admin/marketing",
    headline: laneHeadline("marketing", checks),
    checks,
  };
}

export function complianceLane(checkedKeys: Iterable<string>): StatusLane {
  const checked = new Set(checkedKeys);
  const total = countComplianceSteps();
  let doneSteps = 0;
  for (const track of COMPLIANCE_TRACKS) {
    for (const step of track.steps) {
      if (checked.has(complianceStepKey(track.id, step.id))) doneSteps += 1;
    }
  }

  const checks = COMPLIANCE_GROUPS.map((group) => {
    const track = COMPLIANCE_TRACKS.find((item) => item.id === group.id);
    const steps = track?.steps ?? [];
    const done = steps.filter((step) => checked.has(complianceStepKey(group.id, step.id))).length;
    return {
      id: group.id,
      label: group.label,
      detail: `${group.detail} ${done} of ${steps.length} steps checked.`,
      state: steps.length > 0 && done === steps.length ? "done" : "open",
    } satisfies StatusCheck;
  });

  const next = checks.find((check) => check.state === "open");
  const headline = next
    ? `${doneSteps} of ${total} compliance steps are checked. Next: ${next.label}.`
    : `${doneSteps} of ${total} compliance steps are checked.`;

  return {
    id: "compliance",
    title: "Compliance",
    href: "/admin/compliance",
    headline,
    checks,
  };
}

export function fundingLane(raw: Partial<FundingAssumptions> | null, saved: boolean): StatusLane {
  const plan = buildFundingPlan(raw ?? {});
  const { totals, assumptions } = plan;
  const checks: StatusCheck[] = [
    {
      id: "cash",
      label: "Cash stays positive for 18 months",
      state: totals.runwayBreakMonth === null && assumptions.startingCash > 0 ? "done" : "open",
      detail: totals.runwayBreakMonth
        ? `Balance crosses zero in month ${totals.runwayBreakMonth}. Add ${usd(totals.extraCapital)} to finish above zero.`
        : `Opening ${usd(assumptions.startingCash)}. Lowest balance ${usd(totals.minCash)}. Ends at ${usd(totals.endingCash)}.`,
    },
    {
      id: "fee",
      label: "The fee is a share of collections",
      state: totals.feePerPractice > 0 ? "done" : "open",
      detail: `${assumptions.takeRatePct}% of ${usd(assumptions.collectionsPerPractice)} a month is ${usd(totals.feePerPractice)} per practice, ${assumptions.revenueLagMonths} months after signature.`,
    },
    {
      id: "people",
      label: "A seller and a biller are on the plan",
      state: assumptions.leadMonthly > 0 && assumptions.billerMonthly > 0 ? "done" : "open",
      detail: `Practice lead ${usd(assumptions.leadMonthly)} from month ${assumptions.leadStart}. Biller ${usd(assumptions.billerMonthly)} from month ${assumptions.billerStart}.`,
    },
    {
      id: "payback",
      label: "Fees cover spend inside 18 months",
      state: totals.paybackMonth ? "done" : "open",
      detail: totals.paybackMonth
        ? `Cumulative fees cover cumulative spend in month ${totals.paybackMonth}.`
        : `Fees ${usd(totals.revenue)} against spend ${usd(totals.spend)}. This horizon is a bridge.`,
    },
  ];

  const prefix = saved ? "Saved plan." : "Base plan, not edited in this browser.";
  return {
    id: "funding",
    title: "Funding",
    href: "/admin/funding",
    headline: `${prefix} ${laneHeadline("funding", checks)}`,
    checks,
  };
}

export function companySentence(lanes: StatusLane[]) {
  const open = lanes.flatMap((lane) =>
    lane.checks.filter((check) => check.state === "open").map((check) => check.label),
  );
  if (open.length === 0) {
    const later = lanes.flatMap((lane) =>
      lane.checks.filter((check) => check.state === "later").map((check) => check.label),
    );
    if (later.length === 0) return "Marketing, compliance, and funding checks on this page are done.";
    return `Open checks are clear. Still later: ${later.slice(0, 3).join(", ")}.`;
  }
  const shown = open.slice(0, 3);
  const extra = open.length - shown.length;
  const list = extra > 0 ? `${shown.join(", ")}, and ${extra} more` : shown.join(", ");
  return `Still open: ${list}.`;
}

export function describeLanes(
  lanes: {
    title: string;
    href: string;
    headline: string;
    checks: { state: StatusState; label: string; detail: string }[];
  }[],
) {
  return lanes
    .map((lane) => {
      const lines = lane.checks.map((check) => `- [${check.state}] ${check.label} ${check.detail}`);
      return `${lane.title} (${lane.href})\n${lane.headline}\n${lines.join("\n")}`;
    })
    .join("\n\n");
}
