import { describe, expect, it } from "vitest";
import { countGoliveSteps, goliveStepKey, GOLIVE_TASKS } from "@/lib/marketing/golive-tasks";

describe("golive tasks", () => {
  it("has ten numbered tasks with discrete steps", () => {
    expect(GOLIVE_TASKS).toHaveLength(10);
    expect(GOLIVE_TASKS.map((t) => t.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    for (const task of GOLIVE_TASKS) {
      expect(task.steps.length).toBeGreaterThanOrEqual(3);
      const stepIds = new Set(task.steps.map((s) => s.id));
      expect(stepIds.size).toBe(task.steps.length);
    }
  });

  it("builds stable step keys and counts steps", () => {
    expect(goliveStepKey("ads", "ads-brand")).toBe("ads::ads-brand");
    expect(countGoliveSteps()).toBeGreaterThan(30);
  });
});
