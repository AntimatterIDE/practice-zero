import { describe, expect, it } from "vitest";
import { adminTasks, formatUsd, taskCostTotals } from "@/lib/admin/task-catalog";
import { COMPLIANCE_TRACKS } from "@/lib/compliance/tasks";
import { GOLIVE_TASKS } from "@/lib/marketing/golive-tasks";

describe("admin task catalog", () => {
  const tasks = adminTasks();
  const totals = taskCostTotals(tasks);

  it("includes every marketing and compliance task", () => {
    expect(tasks.filter((task) => task.lane === "Marketing")).toHaveLength(GOLIVE_TASKS.length);
    expect(tasks.filter((task) => task.lane === "Compliance")).toHaveLength(COMPLIANCE_TRACKS.length);
  });

  it("gives each task steps, a cost, and an expected result", () => {
    for (const task of tasks) {
      expect(task.steps.length).toBeGreaterThan(0);
      expect(task.cost.label.trim().length).toBeGreaterThan(0);
      expect(task.result.trim().length).toBeGreaterThan(0);
      for (const step of task.steps) {
        expect(step.title.trim().length).toBeGreaterThan(0);
        expect(step.detail.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("rolls up one-time and monthly task costs", () => {
    expect(totals.once).toBeGreaterThan(0);
    expect(totals.monthly).toBeGreaterThan(0);
    expect(totals.once).toBe(totals.marketingOnce + totals.complianceOnce);
    expect(totals.monthly).toBe(totals.marketingMonthly + totals.complianceMonthly);
    expect(formatUsd(totals.once)).toMatch(/^\$/);
  });
});
