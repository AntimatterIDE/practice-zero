"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FUNDING_HORIZON,
  SCENARIOS,
  applyScenario,
  buildFundingPlan,
  defaultAssumptions,
  lineTotal,
  matchingScenario,
  type ExpenseCategory,
  type FundingAssumptions,
  type ScenarioId,
} from "@/lib/funding/model";
import { FUNDING_ASSUMPTIONS_KEY } from "@/lib/status/brief";
import { cn } from "@/lib/utils";

const STORAGE_KEY = FUNDING_ASSUMPTIONS_KEY;

const CATEGORY_LABEL: Record<ExpenseCategory, string> = {
  compliance: "Compliance",
  marketing: "Marketing",
  staff: "Staff",
  operating: "Operating",
};

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const countFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

function formatMoney(value: number) {
  const rounded = Math.round(value);
  return rounded < 0 ? `−${money.format(Math.abs(rounded))}` : money.format(rounded);
}

function whenLabel(start: number, end: number | undefined, kind: "monthly" | "once") {
  if (kind === "once") return `Month ${start}`;
  const last = end ?? FUNDING_HORIZON;
  if (start === 1 && last === FUNDING_HORIZON) return "Every month";
  if (start === last) return `Month ${start}`;
  return `Months ${start}–${last}`;
}

function loadAssumptions(): FundingAssumptions {
  if (typeof window === "undefined") return defaultAssumptions();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultAssumptions();
    return buildFundingPlan(JSON.parse(raw) as Partial<FundingAssumptions>).assumptions;
  } catch {
    return defaultAssumptions();
  }
}

function Field({
  label,
  value,
  onChange,
  min,
  max,
  step,
  hint,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">{label}</span>
      <input
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step ?? 1}
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => {
          const next = event.target.value === "" ? 0 : Number(event.target.value);
          onChange(Number.isFinite(next) ? next : 0);
        }}
        className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm tabular-nums text-ink outline-none focus:border-slash"
      />
      {hint ? <span className="mt-1 block text-[11px] leading-relaxed text-graphite">{hint}</span> : null}
    </label>
  );
}

export function FundingDesk() {
  const [assumptions, setAssumptions] = useState<FundingAssumptions>(defaultAssumptions);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setAssumptions(loadAssumptions());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(assumptions));
  }, [assumptions, hydrated]);

  const plan = useMemo(() => buildFundingPlan(assumptions), [assumptions]);
  const scenario = matchingScenario(plan.assumptions);
  const peak = Math.max(
    1,
    ...plan.months.map((month) => Math.max(month.spend, month.revenue)),
  );

  function patch(partial: Partial<FundingAssumptions>) {
    setAssumptions((current) => buildFundingPlan({ ...current, ...partial }).assumptions);
  }

  function setSigned(index: number, value: number) {
    setAssumptions((current) => {
      const newPractices = [...current.newPractices];
      newPractices[index] = Math.max(0, value);
      return buildFundingPlan({ ...current, newPractices }).assumptions;
    });
  }

  const { totals } = plan;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slash">Admin</p>
          <h1 className="mt-2 font-sans text-3xl font-semibold lowercase tracking-[-0.03em] text-ink">
            funding
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-graphite">
            Eighteen-month cash plan from the compliance cost bands and the marketing go-live notes.
            Change the assumptions and the expenses, timeline, and return figures update together.
            Saved in this browser only.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAssumptions(defaultAssumptions())}
          className="rounded-full border border-line px-3 py-1.5 text-xs text-graphite hover:border-slash/40 hover:text-ink"
        >
          Reset to base
        </button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Metric
          label="Ending cash"
          value={formatMoney(totals.endingCash)}
          detail={
            totals.runwayBreakMonth
              ? `Crosses zero in month ${totals.runwayBreakMonth}. Add ${formatMoney(totals.extraCapital)} to finish above zero.`
              : totals.monthOfMinCash === 0
                ? "Cash stays at or above the opening balance."
                : `Lowest balance is ${formatMoney(totals.minCash)} in month ${totals.monthOfMinCash}.`
          }
          tone={totals.endingCash < 0 ? "bad" : "good"}
        />
        <Metric
          label="18-month spend"
          value={formatMoney(totals.spend)}
          detail={`${formatMoney(totals.spendByCategory.staff)} staff · ${formatMoney(totals.spendByCategory.compliance)} compliance · ${formatMoney(totals.spendByCategory.marketing)} marketing`}
        />
        <Metric
          label="18-month fees"
          value={formatMoney(totals.revenue)}
          detail={
            totals.firstRevenueMonth
              ? `First fee in month ${totals.firstRevenueMonth}. Net ${formatMoney(totals.net)}.`
              : "No fee lands inside the horizon at this lag and sign curve."
          }
        />
        <Metric
          label="Fee per practice"
          value={formatMoney(totals.feePerPractice)}
          detail={`${plan.assumptions.takeRatePct}% of ${formatMoney(plan.assumptions.collectionsPerPractice)} monthly collections, collected after ${plan.assumptions.revenueLagMonths} months.`}
        />
        <Metric
          label="Practices to cover burn"
          value={totals.practicesToCoverRunRate === null ? "—" : String(totals.practicesToCoverRunRate)}
          detail={`Ending run-rate is ${formatMoney(totals.endingRunRate)} a month, before one-time bills. Book ends at ${countFormat.format(totals.endingPractices)} live.`}
        />
        <Metric
          label="Payback"
          value={totals.paybackMonth ? `Month ${totals.paybackMonth}` : "Beyond 18"}
          detail={
            totals.spend > 0
              ? `Fees are ${Math.round((totals.revenue / totals.spend) * 100)}% of spend over the horizon.`
              : "No spend in this plan."
          }
        />
      </div>

      <section className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-sm font-medium text-ink">Scenarios</h2>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-graphite">
              Each preset sets the sign curve, when ePHI infra starts, when the practice lead and biller start, and the ads budget. Take rate, collections, and the raise stay as you set them.
            </p>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">
            {scenario === "custom" ? "Custom" : SCENARIOS[scenario].label}
          </p>
        </div>
        <div className="mt-3 grid gap-3 lg:grid-cols-3">
          {(Object.values(SCENARIOS) as Array<(typeof SCENARIOS)[ScenarioId]>).map((preset) => {
            const active = scenario === preset.id;
            const signed = preset.newPractices.reduce((sum, n) => sum + n, 0);
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setAssumptions((current) => applyScenario(current, preset.id))}
                className={cn(
                  "rounded-2xl border px-4 py-4 text-left",
                  active ? "border-slash bg-slash/5" : "border-line bg-card hover:border-slash/40",
                )}
                aria-pressed={active}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slash">
                  {signed} practices
                </span>
                <span className="mt-1 block text-sm font-medium text-ink">{preset.label}</span>
                <span className="mt-1 block text-xs leading-relaxed text-graphite">{preset.summary}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-line bg-card px-5 py-5">
        <h2 className="text-sm font-medium text-ink">Assumptions</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field
            label="Starting cash"
            value={plan.assumptions.startingCash}
            min={0}
            step={10000}
            onChange={(startingCash) => patch({ startingCash })}
            hint="Raise or savings available in month 1."
          />
          <Field
            label="Take rate %"
            value={plan.assumptions.takeRatePct}
            min={0}
            max={40}
            step={0.5}
            onChange={(takeRatePct) => patch({ takeRatePct })}
            hint="Share of collections. The site does not publish a rate; 5% is a planning default."
          />
          <Field
            label="Collections / practice"
            value={plan.assumptions.collectionsPerPractice}
            min={0}
            step={5000}
            onChange={(collectionsPerPractice) => patch({ collectionsPerPractice })}
            hint="Monthly collections for one independent practice."
          />
          <Field
            label="Fee lag (months)"
            value={plan.assumptions.revenueLagMonths}
            min={0}
            max={12}
            onChange={(revenueLagMonths) => patch({ revenueLagMonths })}
            hint="Claims pay, then the fee follows. Two months is about 60 days."
          />
          <Field
            label="Monthly churn %"
            value={plan.assumptions.monthlyChurnPct}
            min={0}
            max={20}
            step={0.5}
            onChange={(monthlyChurnPct) => patch({ monthlyChurnPct })}
            hint="Share of the live book that leaves each month."
          />
          <Field
            label="ePHI month"
            value={plan.assumptions.phiMonth}
            min={1}
            max={18}
            onChange={(phiMonth) => patch({ phiMonth })}
            hint="Supabase HIPAA, insurance, model usage, and the clearinghouse start here."
          />
          <Field
            label="Founder draw / mo"
            value={plan.assumptions.founderMonthly}
            min={0}
            step={500}
            onChange={(founderMonthly) => patch({ founderMonthly })}
          />
          <Field
            label="Founder starts"
            value={plan.assumptions.founderStart}
            min={1}
            max={18}
            onChange={(founderStart) => patch({ founderStart })}
          />
          <Field
            label="Practice lead / mo"
            value={plan.assumptions.leadMonthly}
            min={0}
            step={500}
            onChange={(leadMonthly) => patch({ leadMonthly })}
          />
          <Field
            label="Lead starts"
            value={plan.assumptions.leadStart}
            min={1}
            max={18}
            onChange={(leadStart) => patch({ leadStart })}
          />
          <Field
            label="Biller / mo"
            value={plan.assumptions.billerMonthly}
            min={0}
            step={500}
            onChange={(billerMonthly) => patch({ billerMonthly })}
            hint="One person. Past about eight practices, raise this or the model understates cost."
          />
          <Field
            label="Biller starts"
            value={plan.assumptions.billerStart}
            min={1}
            max={18}
            onChange={(billerStart) => patch({ billerStart })}
          />
          <Field
            label="Ads / mo"
            value={plan.assumptions.adsMonthly}
            min={0}
            step={500}
            onChange={(adsMonthly) => patch({ adsMonthly })}
          />
          <Field
            label="Ads from"
            value={plan.assumptions.adsStart}
            min={1}
            max={18}
            onChange={(adsStart) => patch({ adsStart })}
          />
          <Field
            label="Ads through"
            value={plan.assumptions.adsEnd}
            min={1}
            max={18}
            onChange={(adsEnd) => patch({ adsEnd })}
          />
        </div>

        <h3 className="mt-6 text-sm font-medium text-ink">Practices signed each month</h3>
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-9">
          {plan.assumptions.newPractices.map((signed, index) => (
            <label key={index} className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">
                M{index + 1}
              </span>
              <input
                type="number"
                min={0}
                step={1}
                value={signed}
                onChange={(event) => {
                  const next = event.target.value === "" ? 0 : Number(event.target.value);
                  setSigned(index, Number.isFinite(next) ? next : 0);
                }}
                className="mt-1 w-full rounded-lg border border-line bg-paper px-2 py-1.5 text-sm tabular-nums text-ink outline-none focus:border-slash"
              />
            </label>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-ink">Itemized expenses</h2>
        <p className="mt-1 max-w-2xl text-xs leading-relaxed text-graphite">
          Repo lines use a figure written in the compliance desk or the marketing go-live checks.
          Planning lines are allowances inside a stated band, or costs those docs name without a price.
        </p>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-line bg-card">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-line font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">
                <th className="px-4 py-3 font-medium">Item</th>
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 text-right font-medium">Amount</th>
                <th className="px-4 py-3 text-right font-medium">Horizon</th>
              </tr>
            </thead>
            <tbody>
              {plan.expenses.map((line) => (
                <tr key={line.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 align-top">
                    <p className="font-medium text-ink">{line.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-graphite">{line.source}</p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-slash">
                      {CATEGORY_LABEL[line.category]} · {line.basis}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 align-top text-graphite">
                    {whenLabel(line.startMonth, line.endMonth, line.kind)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right align-top tabular-nums text-ink">
                    {formatMoney(line.amount)}
                    {line.kind === "monthly" ? <span className="text-graphite">/mo</span> : null}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right align-top tabular-nums text-ink">
                    {formatMoney(lineTotal(line))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-sm font-medium text-ink">Timeline</h2>
            <p className="mt-1 text-xs text-graphite">
              Bars compare spend and fees. Cash is the raise plus every month of net.
            </p>
          </div>
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-sm bg-ink/25" /> Spend
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-sm bg-slash" /> Fees
            </span>
          </p>
        </div>
        <div className="mt-3 flex h-28 items-end gap-1 rounded-2xl border border-line bg-card px-3 py-3">
          {plan.months.map((month) => (
            <div key={month.month} className="flex h-full min-w-0 flex-1 items-end gap-px" title={`Month ${month.month}`}>
              <div
                className="w-1/2 rounded-sm bg-ink/20"
                style={{ height: `${Math.max(2, (month.spend / peak) * 100)}%` }}
              />
              <div
                className="w-1/2 rounded-sm bg-slash"
                style={{ height: `${(month.revenue / peak) * 100}%` }}
              />
            </div>
          ))}
        </div>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-line bg-card">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-line font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">
                <th className="px-4 py-3 font-medium">Month</th>
                <th className="px-4 py-3 text-right font-medium">Signed</th>
                <th className="px-4 py-3 text-right font-medium">Live</th>
                <th className="px-4 py-3 text-right font-medium">Billing</th>
                <th className="px-4 py-3 text-right font-medium">Spend</th>
                <th className="px-4 py-3 text-right font-medium">Fees</th>
                <th className="px-4 py-3 text-right font-medium">Net</th>
                <th className="px-4 py-3 text-right font-medium">Cash</th>
              </tr>
            </thead>
            <tbody>
              {plan.months.map((month) => (
                <tr key={month.month} className="border-b border-line last:border-0">
                  <td className="px-4 py-2.5 tabular-nums text-ink">{month.month}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-graphite">
                    {countFormat.format(month.newPractices)}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-graphite">
                    {countFormat.format(month.practicesLive)}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-graphite">
                    {countFormat.format(month.practicesBilling)}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-ink">{formatMoney(month.spend)}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-ink">{formatMoney(month.revenue)}</td>
                  <td
                    className={cn(
                      "px-4 py-2.5 text-right tabular-nums",
                      month.net < 0 ? "text-emergency" : "text-ink",
                    )}
                  >
                    {formatMoney(month.net)}
                  </td>
                  <td
                    className={cn(
                      "px-4 py-2.5 text-right tabular-nums",
                      month.cash < 0 ? "text-emergency" : "text-ink",
                    )}
                  >
                    {formatMoney(month.cash)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="mt-6 max-w-2xl text-xs leading-relaxed text-graphite">
        Sources: Vercel $350, monitors, 1Password, Supabase Team plus HIPAA plus PITR, the GRC band, the pen-test band, and the Type II auditor band are the compliance desk. Instantly Hypergrowth is the marketing go-live note. Staff, ads, counsel, insurance, lists, Semrush, mailboxes, credentialing, model usage, and the clearinghouse minimum are planning allowances. Headcount does not add a second biller as the book grows.
      </p>
    </div>
  );
}

function Metric({
  label,
  value,
  detail,
  tone = "neutral",
}: {
  label: string;
  value: string;
  detail: string;
  tone?: "neutral" | "good" | "bad";
}) {
  return (
    <div className="rounded-2xl border border-line bg-card px-4 py-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">{label}</p>
      <p
        className={cn(
          "mt-2 text-2xl font-medium tabular-nums tracking-[-0.02em]",
          tone === "bad" ? "text-emergency" : "text-ink",
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-[13px] leading-relaxed text-graphite">{detail}</p>
    </div>
  );
}
