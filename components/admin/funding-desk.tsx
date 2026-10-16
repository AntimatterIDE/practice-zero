"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page";
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

const CATEGORY_ORDER: ExpenseCategory[] = ["staff", "compliance", "marketing", "operating"];

const fieldInput =
  "w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm tabular-nums text-ink outline-none focus:border-slash";

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
        className={cn("mt-1", fieldInput)}
      />
      {hint ? <span className="mt-1 block text-[11px] leading-relaxed text-graphite">{hint}</span> : null}
    </label>
  );
}

function AmountMonth({
  label,
  amount,
  onAmount,
  month,
  onMonth,
  hint,
}: {
  label: string;
  amount: number;
  onAmount: (value: number) => void;
  month: number;
  onMonth: (value: number) => void;
  hint?: string;
}) {
  return (
    <div>
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">{label}</span>
      <div className="mt-1 grid grid-cols-[minmax(0,1fr)_4.5rem] gap-2">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          step={500}
          aria-label={`${label} amount`}
          value={Number.isFinite(amount) ? amount : 0}
          onChange={(event) => {
            const next = event.target.value === "" ? 0 : Number(event.target.value);
            onAmount(Number.isFinite(next) ? next : 0);
          }}
          className={fieldInput}
        />
        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={18}
          aria-label={`${label} start month`}
          value={Number.isFinite(month) ? month : 1}
          onChange={(event) => {
            const next = event.target.value === "" ? 1 : Number(event.target.value);
            onMonth(Number.isFinite(next) ? next : 1);
          }}
          className={fieldInput}
        />
      </div>
      {hint ? <span className="mt-1 block text-[11px] leading-relaxed text-graphite">{hint}</span> : null}
    </div>
  );
}

function CashChart({ values, breakMonth }: { values: number[]; breakMonth: number | null }) {
  if (values.length === 0) return null;
  const max = Math.max(...values, 0);
  const min = Math.min(...values, 0);
  const span = max - min || 1;
  const width = 640;
  const height = 148;
  const padX = 4;
  const padY = 8;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;
  const x = (index: number) =>
    padX + (values.length <= 1 ? innerW / 2 : (index / (values.length - 1)) * innerW);
  const y = (value: number) => padY + ((max - value) / span) * innerH;
  const line = values
    .map((value, index) => `${index === 0 ? "M" : "L"}${x(index).toFixed(1)} ${y(value).toFixed(1)}`)
    .join(" ");
  const zeroY = y(0);
  const area = `${line} L${x(values.length - 1).toFixed(1)} ${zeroY.toFixed(1)} L${x(0).toFixed(1)} ${zeroY.toFixed(1)} Z`;
  const breakIndex = breakMonth && breakMonth >= 1 && breakMonth <= values.length ? breakMonth - 1 : null;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="mt-2 h-36 w-full text-slash"
      role="img"
      aria-label="Cash balance across 18 months"
    >
      <line x1={padX} x2={width - padX} y1={zeroY} y2={zeroY} stroke="#e4e2da" strokeWidth="1" />
      <path d={area} fill="currentColor" fillOpacity="0.12" />
      <path d={line} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {breakIndex !== null ? <circle cx={x(breakIndex)} cy={y(values[breakIndex])} r="4" fill="#b42318" /> : null}
    </svg>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="px-5 py-4">
      <dt className="text-[11px] font-medium uppercase tracking-wider text-graphite">{label}</dt>
      <dd className="mt-1 text-lg font-medium tabular-nums tracking-[-0.02em] text-ink">{value}</dd>
      <dd className="mt-1 text-xs leading-relaxed text-graphite">{note}</dd>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-medium text-ink">{title}</h3>
      <div className="mt-3 grid gap-3">{children}</div>
    </div>
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
  const expenseGroups = CATEGORY_ORDER.map((category) => ({
    category,
    lines: plan.expenses.filter((line) => line.category === category),
    total: totals.spendByCategory[category],
  })).filter((group) => group.lines.length > 0);

  const runway = totals.runwayBreakMonth
    ? `Crosses zero in month ${totals.runwayBreakMonth}. Add ${formatMoney(totals.extraCapital)} to finish above zero.`
    : totals.monthOfMinCash === 0
      ? "Cash stays at or above the opening balance."
      : `Lowest balance is ${formatMoney(totals.minCash)} in month ${totals.monthOfMinCash}.`;

  const cover =
    totals.practicesToCoverRunRate === null
      ? `Fee is ${formatMoney(totals.feePerPractice)} per practice.`
      : `${formatMoney(totals.feePerPractice)} per practice. ${totals.practicesToCoverRunRate} live practices cover the ending run rate of ${formatMoney(totals.endingRunRate)}.`;

  return (
    <div>
      <AdminPageHeader
        title="funding"
        lede="Eighteen-month cash plan. Change a number and the rest of the page moves with it."
        meta="Saved in this browser only."
        actions={
          <button
            type="button"
            onClick={() => setAssumptions(defaultAssumptions())}
            className="rounded-full border border-line px-3 py-1.5 text-xs text-graphite hover:border-slash/40 hover:text-ink"
          >
            Reset to base
          </button>
        }
      />

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="inline-flex rounded-full border border-line bg-mist p-1" role="group" aria-label="Scenarios">
          {(Object.values(SCENARIOS) as Array<(typeof SCENARIOS)[ScenarioId]>).map((preset) => {
            const active = scenario === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setAssumptions((current) => applyScenario(current, preset.id))}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm",
                  active ? "bg-card font-medium text-ink shadow-sm" : "text-graphite hover:text-ink",
                )}
                aria-pressed={active}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
        <p className="min-w-0 max-w-xl text-sm leading-relaxed text-graphite">
          {scenario === "custom"
            ? "Custom. The fields no longer match a preset. Take rate, collections, and the raise stay when you pick one."
            : SCENARIOS[scenario].summary}
        </p>
      </div>

      <section className="mt-6 overflow-hidden rounded-2xl border border-line bg-card">
        <div className="grid gap-6 px-5 py-5 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">Ending cash</p>
            <p
              className={cn(
                "mt-2 text-4xl font-semibold tabular-nums tracking-[-0.03em]",
                totals.endingCash < 0 ? "text-emergency" : "text-ink",
              )}
            >
              {formatMoney(totals.endingCash)}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-graphite">{runway}</p>
            <p className="mt-2 text-xs leading-relaxed text-graphite">{cover}</p>
          </div>
          <div>
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-xs text-graphite">Cash by month</p>
              {totals.runwayBreakMonth ? (
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-emergency">
                  Zero in month {totals.runwayBreakMonth}
                </p>
              ) : (
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">18 months</p>
              )}
            </div>
            <CashChart values={plan.months.map((month) => month.cash)} breakMonth={totals.runwayBreakMonth} />
            <div className="mt-1 flex justify-between font-mono text-[10px] tabular-nums text-graphite">
              <span>1</span>
              <span>6</span>
              <span>12</span>
              <span>18</span>
            </div>
          </div>
        </div>
        <dl className="grid grid-cols-2 border-t border-line sm:grid-cols-4">
          <Stat
            label="18-month spend"
            value={formatMoney(totals.spend)}
            note={`${formatMoney(totals.spendByCategory.staff)} staff`}
          />
          <Stat
            label="18-month fees"
            value={formatMoney(totals.revenue)}
            note={
              totals.firstRevenueMonth
                ? `First fee in month ${totals.firstRevenueMonth}`
                : "No fee in this horizon"
            }
          />
          <Stat
            label="Payback"
            value={totals.paybackMonth ? `Month ${totals.paybackMonth}` : "Beyond 18"}
            note={
              totals.spend > 0
                ? `${Math.round((totals.revenue / totals.spend) * 100)}% of spend`
                : "No spend in this plan"
            }
          />
          <Stat
            label="Live practices"
            value={countFormat.format(totals.endingPractices)}
            note={`${countFormat.format(totals.endingBillingPractices)} billing`}
          />
        </dl>
      </section>

      <section className="mt-6 rounded-2xl border border-line bg-card px-5 py-5">
        <h2 className="text-sm font-medium text-ink">Assumptions</h2>
        <div className="mt-5 grid gap-6 lg:grid-cols-3">
            <Group title="Raise and fee">
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
                hint="Share of collections. 5% is a planning default."
              />
              <Field
                label="Collections / practice"
                value={plan.assumptions.collectionsPerPractice}
                min={0}
                step={5000}
                onChange={(collectionsPerPractice) => patch({ collectionsPerPractice })}
                hint="Monthly collections for one practice."
              />
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Fee lag"
                  value={plan.assumptions.revenueLagMonths}
                  min={0}
                  max={12}
                  onChange={(revenueLagMonths) => patch({ revenueLagMonths })}
                />
                <Field
                  label="Churn %"
                  value={plan.assumptions.monthlyChurnPct}
                  min={0}
                  max={20}
                  step={0.5}
                  onChange={(monthlyChurnPct) => patch({ monthlyChurnPct })}
                />
              </div>
            </Group>

            <Group title="People">
              <AmountMonth
                label="Founder / mo"
                amount={plan.assumptions.founderMonthly}
                onAmount={(founderMonthly) => patch({ founderMonthly })}
                month={plan.assumptions.founderStart}
                onMonth={(founderStart) => patch({ founderStart })}
              />
              <AmountMonth
                label="Practice lead / mo"
                amount={plan.assumptions.leadMonthly}
                onAmount={(leadMonthly) => patch({ leadMonthly })}
                month={plan.assumptions.leadStart}
                onMonth={(leadStart) => patch({ leadStart })}
              />
              <AmountMonth
                label="Biller / mo"
                amount={plan.assumptions.billerMonthly}
                onAmount={(billerMonthly) => patch({ billerMonthly })}
                month={plan.assumptions.billerStart}
                onMonth={(billerStart) => patch({ billerStart })}
                hint="One person. Past about eight practices, raise this."
              />
            </Group>

            <Group title="Timing">
              <Field
                label="ePHI month"
                value={plan.assumptions.phiMonth}
                min={1}
                max={18}
                onChange={(phiMonth) => patch({ phiMonth })}
                hint="HIPAA infra, insurance, and the clearinghouse start here."
              />
              <Field
                label="Ads / mo"
                value={plan.assumptions.adsMonthly}
                min={0}
                step={500}
                onChange={(adsMonthly) => patch({ adsMonthly })}
              />
              <div className="grid grid-cols-2 gap-3">
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
            </Group>

            <div className="lg:col-span-3">
            <Group title="Practices signed">
              <div className="grid grid-cols-6 gap-2 sm:grid-cols-9 lg:grid-cols-[repeat(18,minmax(0,1fr))]">
                {plan.assumptions.newPractices.map((signed, index) => (
                  <label key={index} className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-graphite">
                      {index + 1}
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
            </Group>
            </div>
          </div>
        </section>


      <section className="mt-8">
          <h2 className="text-sm font-medium text-ink">Month by month</h2>
          <p className="mt-1 text-xs leading-relaxed text-graphite">
            Cash is the raise plus every month of fees minus spend.
          </p>
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
                  <tr
                    key={month.month}
                    className={cn(
                      "border-b border-line last:border-0",
                      month.cash < 0 && "bg-emergency/5",
                    )}
                  >
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

      <section className="mt-8">
        <h2 className="text-sm font-medium text-ink">Expenses</h2>
        <p className="mt-1 max-w-2xl text-xs leading-relaxed text-graphite">
          Repo lines use a figure from the compliance desk or the marketing go-live checks. Planning lines are allowances.
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
              {expenseGroups.map((group) => (
                <Fragment key={group.category}>
                  <tr className="border-b border-line bg-mist/70">
                    <td colSpan={3} className="px-4 py-2 text-xs font-medium text-ink">
                      {CATEGORY_LABEL[group.category]}
                    </td>
                    <td className="px-4 py-2 text-right text-xs font-medium tabular-nums text-ink">
                      {formatMoney(group.total)}
                    </td>
                  </tr>
                  {group.lines.map((line) => (
                    <tr key={line.id} className="border-b border-line last:border-0">
                      <td className="px-4 py-3 align-top">
                        <p className="font-medium text-ink">
                          {line.name}
                          <span className="ml-2 font-mono text-[10px] font-normal uppercase tracking-[0.14em] text-graphite">
                            {line.basis}
                          </span>
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-graphite">{line.source}</p>
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
                </Fragment>
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
