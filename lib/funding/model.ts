/**
 * 18-month funding plan for Practice Zero.
 *
 * Repo-backed prices come from lib/compliance/tasks.ts and the marketing
 * go-live notes. Lines marked "planning" are allowances inside those bands,
 * or costs the desks name without a quote (counsel, lists, ads, staff).
 */

export const FUNDING_HORIZON = 18;

export type ExpenseCategory = "compliance" | "marketing" | "staff" | "operating";

export type ExpenseBasis = "repo" | "planning";

export type ExpenseLine = {
  id: string;
  category: ExpenseCategory;
  name: string;
  kind: "monthly" | "once";
  /** Monthly amount, or the one-time amount. */
  amount: number;
  /** 1-based month the line starts (or is paid, if once). */
  startMonth: number;
  /** Inclusive end month for monthly lines. Defaults to the horizon. */
  endMonth?: number;
  basis: ExpenseBasis;
  source: string;
};

export type ScenarioId = "conservative" | "base" | "stretch";

export type FundingAssumptions = {
  startingCash: number;
  /** Percent of practice collections kept as the platform fee. */
  takeRatePct: number;
  /** Typical monthly collections of one independent practice. */
  collectionsPerPractice: number;
  /** Months after signature before the first fee is collected. */
  revenueLagMonths: number;
  /** Share of the live book that leaves each month. */
  monthlyChurnPct: number;
  /** Month real charts can leave the browser. HIPAA infra starts here. */
  phiMonth: number;
  founderMonthly: number;
  founderStart: number;
  leadMonthly: number;
  leadStart: number;
  billerMonthly: number;
  billerStart: number;
  adsMonthly: number;
  adsStart: number;
  adsEnd: number;
  /** New practices signed in month 1..18. */
  newPractices: number[];
};

export type ScenarioPreset = {
  id: ScenarioId;
  label: string;
  summary: string;
  newPractices: number[];
  phiMonth: number;
  leadStart: number;
  billerStart: number;
  adsMonthly: number;
};

export type MonthRow = {
  month: number;
  newPractices: number;
  practicesLive: number;
  practicesBilling: number;
  revenue: number;
  spend: number;
  net: number;
  cash: number;
  byCategory: Record<ExpenseCategory, number>;
};

export type FundingTotals = {
  spend: number;
  revenue: number;
  endingCash: number;
  minCash: number;
  monthOfMinCash: number;
  /** Cash still needed so the balance never goes negative. */
  extraCapital: number;
  firstRevenueMonth: number | null;
  /** First month cumulative fees cover cumulative spend. */
  paybackMonth: number | null;
  /** First month cash is below zero. */
  runwayBreakMonth: number | null;
  spendByCategory: Record<ExpenseCategory, number>;
  feePerPractice: number;
  /** Monthly lines active in the last month, excluding one-time hits. */
  endingRunRate: number;
  practicesToCoverRunRate: number | null;
  endingPractices: number;
  endingBillingPractices: number;
  net: number;
};

export type FundingPlan = {
  assumptions: FundingAssumptions;
  expenses: ExpenseLine[];
  months: MonthRow[];
  totals: FundingTotals;
};

const CATEGORIES: ExpenseCategory[] = ["compliance", "marketing", "staff", "operating"];

function emptyCategories(): Record<ExpenseCategory, number> {
  return { compliance: 0, marketing: 0, staff: 0, operating: 0 };
}

function clamp(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function monthIndex(n: number) {
  return Math.round(clamp(n, 1, FUNDING_HORIZON));
}

/** Build an 18-month sign curve from 1-based month → count. */
export function signCurve(partial: Record<number, number>): number[] {
  const row = Array.from({ length: FUNDING_HORIZON }, () => 0);
  for (const [month, count] of Object.entries(partial)) {
    const index = Number(month) - 1;
    if (index >= 0 && index < FUNDING_HORIZON && Number.isFinite(count)) {
      row[index] = Math.max(0, count);
    }
  }
  return row;
}

export const SCENARIOS: Record<ScenarioId, ScenarioPreset> = {
  conservative: {
    id: "conservative",
    label: "Conservative",
    summary: "Four practices. First signature in month 6. Ads stay small while cold email is the only motion that has to work.",
    newPractices: signCurve({ 6: 1, 10: 1, 14: 1, 18: 1 }),
    phiMonth: 7,
    leadStart: 6,
    billerStart: 7,
    adsMonthly: 1500,
  },
  base: {
    id: "base",
    label: "Base",
    summary: "Eight practices. First signature in month 5. This is the plan a $600k raise is sized for.",
    newPractices: signCurve({ 5: 1, 7: 1, 9: 1, 11: 1, 13: 1, 15: 1, 16: 1, 18: 1 }),
    phiMonth: 6,
    leadStart: 4,
    billerStart: 5,
    adsMonthly: 2500,
  },
  stretch: {
    id: "stretch",
    label: "Stretch",
    summary: "Sixteen practices. First signature in month 4. Headcount in this model does not grow with the book.",
    newPractices: signCurve({
      4: 1,
      6: 1,
      7: 1,
      8: 1,
      9: 1,
      10: 2,
      11: 1,
      12: 1,
      13: 2,
      14: 1,
      15: 1,
      16: 1,
      17: 1,
      18: 1,
    }),
    phiMonth: 5,
    leadStart: 3,
    billerStart: 4,
    adsMonthly: 4000,
  },
};

export function defaultAssumptions(): FundingAssumptions {
  const base = SCENARIOS.base;
  return {
    startingCash: 600_000,
    takeRatePct: 5,
    collectionsPerPractice: 100_000,
    revenueLagMonths: 2,
    monthlyChurnPct: 0,
    phiMonth: base.phiMonth,
    founderMonthly: 5_000,
    founderStart: 1,
    leadMonthly: 7_000,
    leadStart: base.leadStart,
    billerMonthly: 5_500,
    billerStart: base.billerStart,
    adsMonthly: base.adsMonthly,
    adsStart: 2,
    adsEnd: FUNDING_HORIZON,
    newPractices: [...base.newPractices],
  };
}

export function applyScenario(current: FundingAssumptions, id: ScenarioId): FundingAssumptions {
  const preset = SCENARIOS[id];
  return normalizeAssumptions({
    ...current,
    phiMonth: preset.phiMonth,
    leadStart: preset.leadStart,
    billerStart: preset.billerStart,
    adsMonthly: preset.adsMonthly,
    newPractices: [...preset.newPractices],
  });
}

export function matchingScenario(assumptions: FundingAssumptions): ScenarioId | "custom" {
  for (const preset of Object.values(SCENARIOS)) {
    const sameCurve = preset.newPractices.every((n, i) => n === assumptions.newPractices[i]);
    if (
      sameCurve &&
      assumptions.phiMonth === preset.phiMonth &&
      assumptions.leadStart === preset.leadStart &&
      assumptions.billerStart === preset.billerStart &&
      assumptions.adsMonthly === preset.adsMonthly
    ) {
      return preset.id;
    }
  }
  return "custom";
}

export function normalizeAssumptions(input: Partial<FundingAssumptions> | null | undefined): FundingAssumptions {
  const base = defaultAssumptions();
  const source = input ?? {};
  const rawCurve = Array.isArray(source.newPractices) ? source.newPractices : base.newPractices;
  const newPractices = Array.from({ length: FUNDING_HORIZON }, (_, i) => {
    const value = Number(rawCurve[i]);
    return Number.isFinite(value) ? Math.max(0, value) : 0;
  });
  let adsStart = monthIndex(Number(source.adsStart ?? base.adsStart));
  let adsEnd = monthIndex(Number(source.adsEnd ?? base.adsEnd));
  if (adsEnd < adsStart) adsEnd = adsStart;

  return {
    startingCash: clamp(Number(source.startingCash ?? base.startingCash), 0, 50_000_000),
    takeRatePct: clamp(Number(source.takeRatePct ?? base.takeRatePct), 0, 40),
    collectionsPerPractice: clamp(Number(source.collectionsPerPractice ?? base.collectionsPerPractice), 0, 5_000_000),
    revenueLagMonths: Math.round(clamp(Number(source.revenueLagMonths ?? base.revenueLagMonths), 0, 12)),
    monthlyChurnPct: clamp(Number(source.monthlyChurnPct ?? base.monthlyChurnPct), 0, 20),
    phiMonth: monthIndex(Number(source.phiMonth ?? base.phiMonth)),
    founderMonthly: clamp(Number(source.founderMonthly ?? base.founderMonthly), 0, 100_000),
    founderStart: monthIndex(Number(source.founderStart ?? base.founderStart)),
    leadMonthly: clamp(Number(source.leadMonthly ?? base.leadMonthly), 0, 100_000),
    leadStart: monthIndex(Number(source.leadStart ?? base.leadStart)),
    billerMonthly: clamp(Number(source.billerMonthly ?? base.billerMonthly), 0, 100_000),
    billerStart: monthIndex(Number(source.billerStart ?? base.billerStart)),
    adsMonthly: clamp(Number(source.adsMonthly ?? base.adsMonthly), 0, 100_000),
    adsStart,
    adsEnd,
    newPractices,
  };
}

function staffLine(
  id: string,
  name: string,
  amount: number,
  startMonth: number,
  source: string,
): ExpenseLine | null {
  if (amount <= 0) return null;
  return {
    id,
    category: "staff",
    name,
    kind: "monthly",
    amount,
    startMonth,
    basis: "planning",
    source,
  };
}

export function buildExpenses(assumptions: FundingAssumptions): ExpenseLine[] {
  const phi = assumptions.phiMonth;
  const lines: Array<ExpenseLine | null> = [
    {
      id: "vercel-hipaa",
      category: "compliance",
      name: "Vercel HIPAA BAA",
      kind: "monthly",
      amount: 350,
      startMonth: 1,
      basis: "repo",
      source: "Compliance track: Pro add-on $350/mo.",
    },
    {
      id: "monitors",
      category: "compliance",
      name: "Uptime + error monitoring",
      kind: "monthly",
      amount: 60,
      startMonth: 1,
      basis: "repo",
      source: "Better Stack up to $34/mo plus Sentry about $26/mo.",
    },
    {
      id: "secrets",
      category: "compliance",
      name: "1Password Business",
      kind: "monthly",
      amount: 9,
      startMonth: 1,
      basis: "repo",
      source: "Compliance track: about $9 per user.",
    },
    {
      id: "counsel",
      category: "compliance",
      name: "Healthcare counsel",
      kind: "once",
      amount: 12_000,
      startMonth: 2,
      basis: "planning",
      source: "Customer BAA and billing agreement. The track lists counsel fees with no quote.",
    },
    {
      id: "grc",
      category: "compliance",
      name: "GRC platform, year 1",
      kind: "once",
      amount: 15_000,
      startMonth: 3,
      basis: "repo",
      source: "SOC 2 track: $10–25k per year. $15k is inside that band.",
    },
    {
      id: "grc-renewal",
      category: "compliance",
      name: "GRC platform, year 2",
      kind: "once",
      amount: 15_000,
      startMonth: 15,
      basis: "repo",
      source: "Same annual band, prepaid as the first year of controls ends.",
    },
    {
      id: "pentest",
      category: "compliance",
      name: "Penetration test",
      kind: "once",
      amount: 10_000,
      startMonth: Math.max(1, phi - 1),
      basis: "repo",
      source: "HIPAA track: $5–15k before the first PHI customer.",
    },
    {
      id: "insurance",
      category: "compliance",
      name: "Cyber and E&O insurance",
      kind: "once",
      amount: 8_000,
      startMonth: phi,
      basis: "planning",
      source: "Allowance for the first policy year, paid when ePHI can be stored.",
    },
    {
      id: "auditor",
      category: "compliance",
      name: "SOC 2 Type II auditor",
      kind: "once",
      amount: 22_000,
      startMonth: 15,
      basis: "repo",
      source: "SOC 2 track: auditor $15–30k after a 6–12 month observation window.",
    },
    {
      id: "supabase-hipaa",
      category: "compliance",
      name: "Supabase Team + HIPAA + PITR",
      kind: "monthly",
      amount: 1050,
      startMonth: phi,
      basis: "repo",
      source: "Team from $599 + HIPAA add-on about $350 + PITR from $100.",
    },
    {
      id: "domains",
      category: "marketing",
      name: "Sending domains",
      kind: "once",
      amount: 45,
      startMonth: 1,
      basis: "planning",
      source: "Cold-email runbook: 2–3 domains, not the primary domain.",
    },
    {
      id: "instantly",
      category: "marketing",
      name: "Instantly Hypergrowth",
      kind: "monthly",
      amount: 97,
      startMonth: 2,
      basis: "repo",
      source: "Go-live check: native webhooks need Hypergrowth, about $97/mo.",
    },
    {
      id: "mailboxes",
      category: "marketing",
      name: "Workspace mailboxes",
      kind: "monthly",
      amount: 120,
      startMonth: 2,
      basis: "planning",
      source: "About 12 inboxes across those domains, roughly $7–10 each.",
    },
    {
      id: "semrush",
      category: "marketing",
      name: "Semrush",
      kind: "monthly",
      amount: 140,
      startMonth: 2,
      basis: "planning",
      source: "Go-live defers the subscription. $140/mo is a Pro-tier allowance.",
    },
    {
      id: "lists-1",
      category: "marketing",
      name: "List data and verification",
      kind: "once",
      amount: 4_000,
      startMonth: 2,
      basis: "planning",
      source: "NeverBounce or MillionVerifier plus a first practice-owner list.",
    },
    {
      id: "lists-2",
      category: "marketing",
      name: "List refresh",
      kind: "once",
      amount: 4_000,
      startMonth: 9,
      basis: "planning",
      source: "Second buy once the first sequence has a reply rate.",
    },
    assumptions.adsMonthly > 0
      ? {
          id: "ads",
          category: "marketing",
          name: "Google Ads",
          kind: "monthly",
          amount: assumptions.adsMonthly,
          startMonth: assumptions.adsStart,
          endMonth: assumptions.adsEnd,
          basis: "planning",
          source: "Brand and category search only, until consultation cost is known.",
        }
      : null,
    {
      id: "conference",
      category: "marketing",
      name: "One specialty meeting",
      kind: "once",
      amount: 8_000,
      startMonth: 8,
      basis: "planning",
      source: "Travel, booth or sponsorship, and a local medical-society meeting.",
    },
    staffLine(
      "founder",
      "Founder draw",
      assumptions.founderMonthly,
      assumptions.founderStart,
      "Modest draw. Set to 0 if you are not paying yourself.",
    ),
    staffLine(
      "lead",
      "Practice lead",
      assumptions.leadMonthly,
      assumptions.leadStart,
      "Sells and implements. Independent practices buy from a person.",
    ),
    staffLine(
      "biller",
      "Biller",
      assumptions.billerMonthly,
      assumptions.billerStart,
      "One biller can carry the first several small practices.",
    ),
    {
      id: "credentialing",
      category: "operating",
      name: "Credentialing help",
      kind: "once",
      amount: 18_000,
      startMonth: assumptions.billerStart,
      basis: "planning",
      source: "Contract help for the first payer enrollments, paid when billing starts.",
    },
    {
      id: "openai",
      category: "operating",
      name: "Model usage",
      kind: "monthly",
      amount: 400,
      startMonth: phi,
      basis: "planning",
      source: "Scribe and admin assistants once clinical use is real. BAA fee itself is $0.",
    },
    {
      id: "clearinghouse",
      category: "operating",
      name: "Clearinghouse minimum",
      kind: "monthly",
      amount: 300,
      startMonth: phi,
      basis: "planning",
      source: "Early monthly minimum. Per-claim fees stay inside this until volume grows.",
    },
    {
      id: "site-tools",
      category: "operating",
      name: "Resend and site model usage",
      kind: "monthly",
      amount: 80,
      startMonth: 1,
      basis: "planning",
      source: "Consult email and the marketing assistant. Resend stays off PHI.",
    },
  ];

  return lines.filter((line): line is ExpenseLine => line !== null);
}

export function monthsActive(line: ExpenseLine, horizon = FUNDING_HORIZON): number[] {
  if (line.kind === "once") {
    return line.startMonth >= 1 && line.startMonth <= horizon ? [line.startMonth] : [];
  }
  const end = Math.min(horizon, line.endMonth ?? horizon);
  const start = Math.max(1, line.startMonth);
  const months: number[] = [];
  for (let month = start; month <= end; month += 1) months.push(month);
  return months;
}

export function lineTotal(line: ExpenseLine, horizon = FUNDING_HORIZON) {
  return line.amount * monthsActive(line, horizon).length;
}

export function spendInMonth(expenses: ExpenseLine[], month: number) {
  const byCategory = emptyCategories();
  let spend = 0;
  for (const line of expenses) {
    if (!monthsActive(line).includes(month)) continue;
    byCategory[line.category] += line.amount;
    spend += line.amount;
  }
  return { spend, byCategory };
}

function simulateBook(assumptions: FundingAssumptions) {
  const cohorts: { signed: number; count: number }[] = [];
  const churn = assumptions.monthlyChurnPct / 100;
  const rows: { newPractices: number; live: number; billing: number }[] = [];

  for (let index = 0; index < FUNDING_HORIZON; index += 1) {
    const month = index + 1;
    for (const cohort of cohorts) cohort.count *= 1 - churn;
    const added = assumptions.newPractices[index] ?? 0;
    if (added > 0) cohorts.push({ signed: month, count: added });
    const live = cohorts.reduce((sum, cohort) => sum + cohort.count, 0);
    const billing = cohorts
      .filter((cohort) => month >= cohort.signed + assumptions.revenueLagMonths)
      .reduce((sum, cohort) => sum + cohort.count, 0);
    rows.push({ newPractices: added, live, billing });
  }

  return rows;
}

export function buildFundingPlan(input: Partial<FundingAssumptions> | FundingAssumptions): FundingPlan {
  const assumptions = normalizeAssumptions(input);
  const expenses = buildExpenses(assumptions);
  const book = simulateBook(assumptions);
  const feePerPractice = assumptions.collectionsPerPractice * (assumptions.takeRatePct / 100);

  let cash = assumptions.startingCash;
  let cumulativeRevenue = 0;
  let cumulativeSpend = 0;
  let minCash = cash;
  let monthOfMinCash = 0;
  let firstRevenueMonth: number | null = null;
  let paybackMonth: number | null = null;
  let runwayBreakMonth: number | null = null;

  const months: MonthRow[] = book.map((row, index) => {
    const month = index + 1;
    const { spend, byCategory } = spendInMonth(expenses, month);
    const revenue = row.billing * feePerPractice;
    const net = revenue - spend;
    cash += net;
    cumulativeRevenue += revenue;
    cumulativeSpend += spend;
    if (cash < minCash) {
      minCash = cash;
      monthOfMinCash = month;
    }
    if (revenue > 0 && firstRevenueMonth === null) firstRevenueMonth = month;
    if (paybackMonth === null && cumulativeSpend > 0 && cumulativeRevenue >= cumulativeSpend) {
      paybackMonth = month;
    }
    if (runwayBreakMonth === null && cash < 0) runwayBreakMonth = month;
    return {
      month,
      newPractices: row.newPractices,
      practicesLive: row.live,
      practicesBilling: row.billing,
      revenue,
      spend,
      net,
      cash,
      byCategory,
    };
  });

  const spendByCategory = emptyCategories();
  for (const line of expenses) {
    spendByCategory[line.category] += lineTotal(line);
  }
  const spend = CATEGORIES.reduce((sum, category) => sum + spendByCategory[category], 0);
  const revenue = months.reduce((sum, month) => sum + month.revenue, 0);
  const last = months[months.length - 1];
  const endingRunRate = last
    ? expenses.reduce((sum, line) => {
        if (line.kind !== "monthly") return sum;
        return monthsActive(line).includes(FUNDING_HORIZON) ? sum + line.amount : sum;
      }, 0)
    : 0;
  const practicesToCoverRunRate =
    feePerPractice > 0 ? Math.ceil(endingRunRate / feePerPractice) : null;

  return {
    assumptions,
    expenses,
    months,
    totals: {
      spend,
      revenue,
      endingCash: cash,
      minCash,
      monthOfMinCash,
      extraCapital: Math.max(0, -minCash),
      firstRevenueMonth,
      paybackMonth,
      runwayBreakMonth,
      spendByCategory,
      feePerPractice,
      endingRunRate,
      practicesToCoverRunRate,
      endingPractices: last?.practicesLive ?? 0,
      endingBillingPractices: last?.practicesBilling ?? 0,
      net: revenue - spend,
    },
  };
}
