import { describe, expect, it } from "vitest";
import { complianceStepKey } from "@/lib/compliance/tasks";
import { GOLIVE_TASKS, goliveStepKey } from "@/lib/marketing/golive-tasks";
import type { GoliveStatusReport, StepStatus } from "@/lib/marketing/golive-status-types";
import {
  companySentence,
  complianceLane,
  fundingLane,
  marketingLane,
} from "@/lib/status/brief";

function report(statusFor: (taskId: string, stepId: string) => StepStatus): GoliveStatusReport {
  const steps = GOLIVE_TASKS.flatMap((task) =>
    task.steps.map((step) => ({
      taskId: task.id,
      stepId: step.id,
      key: goliveStepKey(task.id, step.id),
      status: statusFor(task.id, step.id),
      detail: step.detail,
    })),
  );
  const count = (status: StepStatus) => steps.filter((step) => step.status === status).length;
  return {
    checkedAt: "2026-10-16T00:00:00.000Z",
    steps,
    summary: {
      pass: count("pass"),
      fail: count("fail"),
      pending: count("pending"),
      deferred: count("deferred"),
      optionalPass: count("optional_pass"),
      total: steps.length,
    },
    freePathNext: null,
    signals: {
      gaMeasurementId: false,
      gtmId: false,
      posthogKey: false,
      gscVerification: false,
      instantlyWebhookSecret: false,
      instantlyApiKey: false,
      openaiKey: false,
      resendConfigured: false,
      attributionColumns: false,
      leadsReadable: false,
      attributedLeadExists: false,
    },
  };
}

describe("status brief", () => {
  it("leaves compliance open until a whole track is checked", () => {
    const empty = complianceLane([]);
    expect(empty.checks.every((check) => check.state === "open")).toBe(true);
    expect(companySentence([empty])).toContain("This week’s safeguards");

    const quick = complianceLane(
      ["qw-mfa", "qw-github-security", "qw-openai-baa", "qw-vercel-baa", "qw-workspace-baa", "qw-uptime", "qw-secrets", "qw-vendor-reports", "qw-posthog-boundary", "qw-marketing-honesty"].map(
        (id) => complianceStepKey("quick-wins", id),
      ),
    );
    expect(quick.checks.find((check) => check.id === "quick-wins")?.state).toBe("done");
    expect(quick.checks.find((check) => check.id === "soc2")?.state).toBe("open");
  });

  it("marks paid search as later when those steps are only deferred", () => {
    const lane = marketingLane(
      report((taskId) => (taskId === "ads" || taskId === "semrush" ? "deferred" : "pass")),
    );
    expect(lane.checks.find((check) => check.id === "measure")?.state).toBe("done");
    expect(lane.checks.find((check) => check.id === "ads")?.state).toBe("later");
  });

  it("treats the default funding plan as a bridge that stays solvent", () => {
    const lane = fundingLane(null, false);
    expect(lane.headline.startsWith("Base plan")).toBe(true);
    expect(lane.checks.find((check) => check.id === "cash")?.state).toBe("done");
    expect(lane.checks.find((check) => check.id === "payback")?.state).toBe("open");
    expect(companySentence([lane])).toContain("Fees cover spend inside 18 months");
  });

  it("says the page is clear when every check is done", () => {
    const lane = complianceLane([]);
    const done = {
      ...lane,
      checks: lane.checks.map((check) => ({ ...check, state: "done" as const })),
    };
    expect(companySentence([done])).toBe(
      "Marketing, compliance, and funding checks on this page are done.",
    );
  });
});
