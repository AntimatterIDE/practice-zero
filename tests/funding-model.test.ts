import { describe, expect, it } from "vitest";
import {
  FUNDING_HORIZON,
  SCENARIOS,
  applyScenario,
  buildFundingPlan,
  defaultAssumptions,
  lineTotal,
  matchingScenario,
  monthsActive,
} from "@/lib/funding/model";

describe("funding plan", () => {
  it("keeps starting cash plus revenue minus spend", () => {
    const plan = buildFundingPlan(defaultAssumptions());
    expect(plan.months).toHaveLength(FUNDING_HORIZON);
    expect(plan.totals.endingCash).toBeCloseTo(
      plan.assumptions.startingCash + plan.totals.revenue - plan.totals.spend,
      6,
    );
    expect(plan.totals.net).toBeCloseTo(plan.totals.revenue - plan.totals.spend, 6);
  });

  it("collects the fee two months after a practice signs", () => {
    const plan = buildFundingPlan({
      ...defaultAssumptions(),
      newPractices: Array.from({ length: FUNDING_HORIZON }, (_, i) => (i === 4 ? 1 : 0)),
      revenueLagMonths: 2,
      monthlyChurnPct: 0,
      takeRatePct: 5,
      collectionsPerPractice: 100_000,
    });
    expect(plan.months[4]?.practicesLive).toBe(1);
    expect(plan.months[4]?.revenue).toBe(0);
    expect(plan.months[5]?.revenue).toBe(0);
    expect(plan.months[6]?.revenue).toBe(5_000);
    expect(plan.months[6]?.practicesBilling).toBe(1);
  });

  it("prices Vercel every month and Supabase only after the PHI month", () => {
    const plan = buildFundingPlan(defaultAssumptions());
    const vercel = plan.expenses.find((line) => line.id === "vercel-hipaa");
    const supabase = plan.expenses.find((line) => line.id === "supabase-hipaa");
    expect(vercel).toMatchObject({ amount: 350, startMonth: 1, basis: "repo" });
    expect(monthsActive(vercel!)).toHaveLength(18);
    expect(lineTotal(vercel!)).toBe(350 * 18);
    expect(supabase).toMatchObject({ amount: 1050, startMonth: 6, basis: "repo" });
    expect(monthsActive(supabase!)).toEqual(
      Array.from({ length: 13 }, (_, i) => i + 6),
    );
  });

  it("uses the published scenario books", () => {
    expect(SCENARIOS.conservative.newPractices.reduce((sum, n) => sum + n, 0)).toBe(4);
    expect(SCENARIOS.base.newPractices.reduce((sum, n) => sum + n, 0)).toBe(8);
    expect(SCENARIOS.stretch.newPractices.reduce((sum, n) => sum + n, 0)).toBe(16);
    for (const preset of Object.values(SCENARIOS)) {
      expect(preset.newPractices).toHaveLength(FUNDING_HORIZON);
    }
  });

  it("marks a preset as custom once the sign curve changes", () => {
    const base = applyScenario(defaultAssumptions(), "base");
    expect(matchingScenario(base)).toBe("base");
    const edited = {
      ...base,
      newPractices: base.newPractices.map((n, i) => (i === 0 ? n + 1 : n)),
    };
    expect(matchingScenario(edited)).toBe("custom");
  });

  it("shrinks the book by the monthly churn rate", () => {
    const plan = buildFundingPlan({
      ...defaultAssumptions(),
      newPractices: Array.from({ length: FUNDING_HORIZON }, (_, i) => (i === 0 ? 10 : 0)),
      monthlyChurnPct: 10,
      revenueLagMonths: 0,
    });
    expect(plan.months[0]?.practicesLive).toBeCloseTo(10);
    expect(plan.months[1]?.practicesLive).toBeCloseTo(9);
  });

  it("counts practices required to cover the ending run rate", () => {
    const plan = buildFundingPlan(defaultAssumptions());
    expect(plan.totals.feePerPractice).toBe(5_000);
    expect(plan.totals.practicesToCoverRunRate).toBe(
      Math.ceil(plan.totals.endingRunRate / 5_000),
    );
    expect(plan.totals.endingRunRate).toBeGreaterThan(5_000);
  });
});
