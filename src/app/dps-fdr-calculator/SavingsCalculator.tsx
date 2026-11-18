"use client";

import { useState } from "react";
import { PiggyBank } from "lucide-react";
import { CalculatorPanels, ResultEmpty } from "@/components/calculator/CalculatorPanels";
import { useNumberField } from "@/components/calculator/useNumberField";
import { useFormatters } from "@/components/providers/PreferencesProvider";
import { ChartLegend, DoughnutChart } from "@/components/charts/DoughnutChart";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { Input } from "@/components/ui/Input";
import { ResultBox } from "@/components/ui/ResultBox";
import { Select } from "@/components/ui/Select";
import { Tabs } from "@/components/ui/Tabs";
import {
  calculateDps,
  calculateFdr,
  COMPOUNDING_OPTIONS,
  type CompoundingFrequency,
} from "@/lib/savings";

type Mode = "dps" | "fdr";

export function SavingsCalculator() {
  const f = useFormatters();
  const [mode, setMode] = useState<Mode>("dps");

  // DPS inputs
  const dpsMonthly = useNumberField("৫,০০০", { label: "মাসিক জমার পরিমাণ", allowZero: false, max: 1e10 });
  const dpsYears = useNumberField("৫", { label: "মেয়াদ (বছর)", allowZero: false, max: 50 });
  const dpsRate = useNumberField("৯", { label: "বার্ষিক মুনাফার হার", max: 100 });
  const [dpsComp, setDpsComp] = useState<CompoundingFrequency>("quarterly");

  // FDR inputs
  const fdrPrincipal = useNumberField("৫,০০,০০০", { label: "জমার পরিমাণ (আসল)", allowZero: false, max: 1e12 });
  const fdrYears = useNumberField("৩", { label: "মেয়াদ (বছর)", allowZero: false, max: 50 });
  const fdrRate = useNumberField("৯.৫", { label: "বার্ষিক মুনাফার হার", max: 100 });
  const [fdrComp, setFdrComp] = useState<CompoundingFrequency>("quarterly");

  const dpsResult =
    mode === "dps" &&
    dpsMonthly.value !== null &&
    dpsYears.value !== null &&
    dpsRate.value !== null &&
    Math.round(dpsYears.value * 12) >= 1
      ? calculateDps(dpsMonthly.value, dpsYears.value, dpsRate.value, dpsComp)
      : null;

  const fdrResult =
    mode === "fdr" && fdrPrincipal.value !== null && fdrYears.value !== null && fdrRate.value !== null
      ? calculateFdr(fdrPrincipal.value, fdrYears.value, fdrRate.value, fdrComp)
      : null;

  const activeSummary = dpsResult
    ? {
        depositedLabel: "মোট জমা",
        deposited: dpsResult.totalDeposited,
        profit: dpsResult.totalProfit,
        maturity: dpsResult.maturityAmount,
        sub: `${f.num(dpsResult.months)} মাস (${f.num(dpsYears.value ?? 0)} বছর) পর`,
      }
    : fdrResult
      ? {
          depositedLabel: "জমাকৃত আসল",
          deposited: fdrResult.principal,
          profit: fdrResult.totalProfit,
          maturity: fdrResult.maturityAmount,
          sub: `${f.num(fdrResult.years)} বছর পর`,
        }
      : null;

  const shareText = activeSummary
    ? [
        mode === "dps"
          ? `ডিপিএস হিসাব: মাসিক ${f.taka(dpsMonthly.value ?? 0)}, মেয়াদ ${f.num(dpsYears.value ?? 0)} বছর, হার ${f.pct(dpsRate.value ?? 0)}`
          : `এফডিআর হিসাব: আসল ${f.taka(fdrPrincipal.value ?? 0)}, মেয়াদ ${f.num(fdrYears.value ?? 0)} বছর, হার ${f.pct(fdrRate.value ?? 0)}`,
        `${activeSummary.depositedLabel}: ${f.taka(activeSummary.deposited)}`,
        `মোট মুনাফা: ${f.taka(activeSummary.profit)}`,
        `মেয়াদ শেষে মোট পাবেন: ${f.taka(activeSummary.maturity)}`,
        "— হিসাব হাব",
      ].join("\n")
    : null;

  const reset = () => {
    dpsMonthly.reset();
    dpsYears.reset();
    dpsRate.reset();
    setDpsComp("quarterly");
    fdrPrincipal.reset();
    fdrYears.reset();
    fdrRate.reset();
    setFdrComp("quarterly");
  };

  const profitShare =
    activeSummary && activeSummary.maturity > 0 ? (activeSummary.profit / activeSummary.maturity) * 100 : 0;

  return (
    <CalculatorPanels
      onReset={reset}
      shareText={shareText}
      inputs={
        <>
          <Tabs
            label="সঞ্চয়ের ধরন নির্বাচন"
            value={mode}
            onValueChange={(v) => setMode(v as Mode)}
            tabs={[
              { id: "dps", label: "ডিপিএস (মাসিক সঞ্চয়)" },
              { id: "fdr", label: "এফডিআর (এককালীন জমা)" },
            ]}
          >
            {mode === "dps" ? (
              <div className="space-y-4">
                <Input label="মাসিক জমার পরিমাণ" suffix="৳" placeholder="যেমন: ৫,০০০" {...dpsMonthly.inputProps} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="মেয়াদ" suffix="বছর" placeholder="যেমন: ৫" {...dpsYears.inputProps} />
                  <Input label="বার্ষিক মুনাফার হার" suffix="%" placeholder="যেমন: ৯" {...dpsRate.inputProps} />
                </div>
                <Select
                  label="মুনাফা যোগ হওয়ার ধরন (কম্পাউন্ডিং)"
                  value={dpsComp}
                  onValueChange={(v) => setDpsComp(v as CompoundingFrequency)}
                  options={COMPOUNDING_OPTIONS}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <Input label="এককালীন জমার পরিমাণ (আসল)" suffix="৳" placeholder="যেমন: ৫,০০,০০০" {...fdrPrincipal.inputProps} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="মেয়াদ" suffix="বছর" placeholder="যেমন: ৩" {...fdrYears.inputProps} />
                  <Input label="বার্ষিক মুনাফার হার" suffix="%" placeholder="যেমন: ৯.৫" {...fdrRate.inputProps} />
                </div>
                <Select
                  label="মুনাফা যোগ হওয়ার ধরন (কম্পাউন্ডিং)"
                  value={fdrComp}
                  onValueChange={(v) => setFdrComp(v as CompoundingFrequency)}
                  options={COMPOUNDING_OPTIONS}
                />
              </div>
            )}
          </Tabs>
          <Disclaimer tone="info">ব্যাংকভেদে হিসাবের নিয়ম আলাদা হতে পারে; এটি আনুমানিক।</Disclaimer>
        </>
      }
      result={
        activeSummary ? (
          <>
            <ResultBox label="মেয়াদ শেষে মোট পাবেন" value={f.taka(activeSummary.maturity)} sub={activeSummary.sub} />
            <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
              <ResultBox variant="stat" label={activeSummary.depositedLabel} value={f.taka(activeSummary.deposited)} />
              <ResultBox variant="stat" label="মোট মুনাফা" value={f.taka(activeSummary.profit)} />
            </div>
            <div className="flex flex-col items-center gap-4 pt-2 min-[400px]:flex-row">
              <DoughnutChart
                size={150}
                ariaLabel={`জমা ${f.pct(100 - profitShare, { maxDecimals: 1 })}, মুনাফা ${f.pct(profitShare, { maxDecimals: 1 })}`}
                centerLabel={f.pct(profitShare, { maxDecimals: 0 })}
                centerSub="মুনাফা"
                segments={[
                  { label: activeSummary.depositedLabel, value: activeSummary.deposited, color: "var(--primary)" },
                  { label: "মোট মুনাফা", value: activeSummary.profit, color: "var(--accent)" },
                ]}
              />
              <ChartLegend
                items={[
                  { label: activeSummary.depositedLabel, value: f.taka(activeSummary.deposited), color: "var(--primary)" },
                  { label: "মোট মুনাফা", value: f.taka(activeSummary.profit), color: "var(--accent)" },
                ]}
              />
            </div>
          </>
        ) : (
          <ResultEmpty>
            <PiggyBank aria-hidden="true" className="mx-auto mb-2 size-8" />
            জমার পরিমাণ, মেয়াদ ও মুনাফার হার লিখুন — যেমন{" "}
            {mode === "dps" ? <strong>মাসিক ৫,০০০ টাকা, ৫ বছর, ৯%</strong> : <strong>৫,০০,০০০ টাকা, ৩ বছর, ৯.৫%</strong>}।
          </ResultEmpty>
        )
      }
    />
  );
}
