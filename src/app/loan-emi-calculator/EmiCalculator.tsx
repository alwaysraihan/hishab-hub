"use client";

import { useMemo, useState } from "react";
import { ChevronDown, HandCoins } from "lucide-react";
import { CalculatorPanels, ResultEmpty } from "@/components/calculator/CalculatorPanels";
import { useNumberField } from "@/components/calculator/useNumberField";
import { useFormatters } from "@/components/providers/PreferencesProvider";
import { ChartLegend, DoughnutChart } from "@/components/charts/DoughnutChart";
import { Input } from "@/components/ui/Input";
import { ResultBox } from "@/components/ui/ResultBox";
import { Segmented } from "@/components/ui/Segmented";
import { Tooltip } from "@/components/ui/Tooltip";
import { amortizationSchedule, emiSummary, tenureToMonths, type AmortizationRow } from "@/lib/emi";

type TenureUnit = "years" | "months";
const MAX_MONTHS = 600; // 50 years

/** Amortization table, rendered only when opened (keeps the page light). */
function ScheduleTable({ rows }: { rows: AmortizationRow[] }) {
  const f = useFormatters();
  const [open, setOpen] = useState(false);
  return (
    <details
      className="group rounded-2xl border border-border bg-surface shadow-soft"
      onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
    >
      <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-3 px-5 py-3 font-semibold hover:bg-surface-2">
        <span>মাসভিত্তিক পরিশোধ তালিকা (অ্যামর্টাইজেশন টেবিল) — {f.num(rows.length)} মাস</span>
        <ChevronDown aria-hidden="true" className="size-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180" />
      </summary>
      {open ? (
        <div className="max-h-[480px] overflow-auto border-t border-border">
          <table className="tabular w-full min-w-[520px] text-right text-[15px]">
            <caption className="sr-only">প্রতি মাসের কিস্তি, আসল, সুদ ও বাকি ঋণ</caption>
            <thead className="sticky top-0 bg-surface-2 text-muted">
              <tr>
                <th scope="col" className="px-4 py-2 text-left font-semibold">মাস</th>
                <th scope="col" className="px-4 py-2 font-semibold">কিস্তি</th>
                <th scope="col" className="px-4 py-2 font-semibold">আসল</th>
                <th scope="col" className="px-4 py-2 font-semibold">সুদ</th>
                <th scope="col" className="px-4 py-2 font-semibold">বাকি ঋণ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.month} className="hover:bg-surface-2">
                  <th scope="row" className="px-4 py-2 text-left font-medium">{f.num(r.month)}</th>
                  <td className="px-4 py-2">{f.taka(r.emi)}</td>
                  <td className="px-4 py-2">{f.taka(r.principal)}</td>
                  <td className="px-4 py-2">{f.taka(r.interest)}</td>
                  <td className="px-4 py-2">{f.taka(r.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </details>
  );
}

/** Interactive loan EMI calculator. */
export function EmiCalculator() {
  const f = useFormatters();
  const amount = useNumberField("১০,০০,০০০", { label: "লোনের পরিমাণ", allowZero: false, max: 1e12 });
  const rate = useNumberField("১০", { label: "সুদের হার", max: 100 });
  const tenure = useNumberField("৫", { label: "মেয়াদ", allowZero: false, max: MAX_MONTHS });
  const [unit, setUnit] = useState<TenureUnit>("years");

  const months = tenure.value !== null ? tenureToMonths(tenure.value, unit) : null;
  const tenureError =
    tenure.error ??
    (months !== null && months < 1
      ? "মেয়াদ কমপক্ষে ১ মাস হতে হবে।"
      : months !== null && months > MAX_MONTHS
        ? "মেয়াদ সর্বোচ্চ ৫০ বছর (৬০০ মাস) পর্যন্ত দেওয়া যাবে।"
        : null);

  const valid = amount.value !== null && rate.value !== null && months !== null && !tenureError;

  const data = useMemo(() => {
    if (!valid || amount.value === null || rate.value === null || months === null) return null;
    return {
      summary: emiSummary(amount.value, rate.value, months),
      rows: amortizationSchedule(amount.value, rate.value, months),
    };
  }, [valid, amount.value, rate.value, months]);

  const shareText =
    data && amount.value !== null && rate.value !== null
      ? [
          `লোন: ${f.taka(amount.value)}, সুদ ${f.pct(rate.value)}, মেয়াদ ${f.num(data.summary.months)} মাস`,
          `মাসিক কিস্তি (EMI): ${f.taka(data.summary.emi)}`,
          `মোট সুদ: ${f.taka(data.summary.totalInterest)}`,
          `মোট পরিশোধ: ${f.taka(data.summary.totalPayment)}`,
          "— হিসাব হাব",
        ].join("\n")
      : null;

  const reset = () => {
    amount.reset();
    rate.reset();
    tenure.reset();
    setUnit("years");
  };

  const interestShare = data ? (data.summary.totalInterest / data.summary.totalPayment) * 100 : 0;

  return (
    <CalculatorPanels
      onReset={reset}
      shareText={shareText}
      inputs={
        <>
          <Input label="লোনের পরিমাণ" suffix="৳" placeholder="যেমন: ১০,০০,০০০" {...amount.inputProps} />
          <Input
            label="বার্ষিক সুদের হার"
            suffix="%"
            placeholder="যেমন: ১০"
            labelExtra={<Tooltip content="ব্যাংক যে বার্ষিক সুদের হার বলেছে, সেটি লিখুন। মাসিক হার হিসেবে বার্ষিক হারকে ১২ দিয়ে ভাগ করা হয়।" />}
            {...rate.inputProps}
          />
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
            <Input
              label="মেয়াদ"
              suffix={unit === "years" ? "বছর" : "মাস"}
              placeholder={unit === "years" ? "যেমন: ৫" : "যেমন: ৬০"}
              value={tenure.raw}
              onValueChange={tenure.setRaw}
              error={tenureError}
            />
            <Segmented
              label="মেয়াদের একক"
              value={unit}
              onValueChange={setUnit}
              options={[
                { value: "years", label: "বছর" },
                { value: "months", label: "মাস" },
              ]}
            />
          </div>
        </>
      }
      result={
        data ? (
          <>
            <ResultBox
              label="মাসিক কিস্তি (ইএমআই)"
              value={f.taka(data.summary.emi)}
              sub={`${f.num(data.summary.months)} মাস ধরে প্রতি মাসে`}
            />
            <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
              <ResultBox variant="stat" label="মোট সুদ" value={f.taka(data.summary.totalInterest)} />
              <ResultBox variant="stat" label="মোট পরিশোধ" value={f.taka(data.summary.totalPayment)} />
            </div>
            <div className="flex flex-col items-center gap-4 pt-2 min-[400px]:flex-row">
              <DoughnutChart
                size={150}
                ariaLabel={`আসল ${f.pct(100 - interestShare, { maxDecimals: 1 })}, সুদ ${f.pct(interestShare, { maxDecimals: 1 })}`}
                centerLabel={f.pct(interestShare, { maxDecimals: 0 })}
                centerSub="সুদ"
                segments={[
                  { label: "আসল", value: amount.value ?? 0, color: "var(--primary)" },
                  { label: "সুদ", value: data.summary.totalInterest, color: "var(--accent)" },
                ]}
              />
              <ChartLegend
                items={[
                  { label: "আসল", value: f.taka(amount.value ?? 0), color: "var(--primary)" },
                  { label: "মোট সুদ", value: f.taka(data.summary.totalInterest), color: "var(--accent)" },
                ]}
              />
            </div>
          </>
        ) : (
          <ResultEmpty>
            <HandCoins aria-hidden="true" className="mx-auto mb-2 size-8" />
            লোনের পরিমাণ, সুদের হার ও মেয়াদ লিখুন — যেমন <strong>১০,০০,০০০ টাকা, ১০%, ৫ বছর</strong>।
          </ResultEmpty>
        )
      }
      below={data ? <ScheduleTable rows={data.rows} /> : null}
    />
  );
}
