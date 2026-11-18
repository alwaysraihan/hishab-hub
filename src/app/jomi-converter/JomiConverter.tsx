"use client";

import { useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { CalculatorPanels, ResultEmpty } from "@/components/calculator/CalculatorPanels";
import { useNumberField } from "@/components/calculator/useNumberField";
import { useFormatters } from "@/components/providers/PreferencesProvider";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ResultBox } from "@/components/ui/ResultBox";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { LAND_PRESETS } from "@/data/land-presets";
import { convertLandAll, LAND_UNIT_LABELS, LAND_UNIT_SHORT, LAND_UNITS, type LandConfig, type LandUnit } from "@/lib/land";
import { cn } from "@/lib/cn";

const DEFAULT_VALUE = "৫";
const DEFAULT_UNIT: LandUnit = "shotok";

/** Interactive land unit converter. */
export function JomiConverter() {
  const f = useFormatters();
  const amount = useNumberField(DEFAULT_VALUE, { label: "জমির পরিমাণ", max: 1e12 });
  const [unit, setUnit] = useState<LandUnit>(DEFAULT_UNIT);
  const [presetId, setPresetId] = useState("default");
  const sqftPerKatha = useNumberField("৭২০", { label: "১ কাঠায় বর্গফুট", allowZero: false, required: true, max: 1e7 });
  const kathaPerBigha = useNumberField("২০", { label: "১ বিঘায় কাঠা", allowZero: false, required: true, max: 1e5 });

  const preset = LAND_PRESETS.find((p) => p.id === presetId) ?? LAND_PRESETS[0];
  const isCustom = preset?.config === null;

  let cfg: LandConfig | null = preset?.config ?? null;
  if (isCustom) {
    cfg =
      sqftPerKatha.value !== null && kathaPerBigha.value !== null
        ? { sqftPerKatha: sqftPerKatha.value, kathaPerBigha: kathaPerBigha.value }
        : null;
  }

  const results = amount.value !== null && cfg ? convertLandAll(amount.value, unit, cfg) : null;
  const fmt = (n: number) => f.num(n, { maxDecimals: 4 });

  const shareText = results
    ? [
        `জমির হিসাব: ${f.num(amount.value ?? 0, { maxDecimals: 4 })} ${LAND_UNIT_SHORT[unit]} =`,
        ...LAND_UNITS.filter((u) => u !== unit).map((u) => `• ${fmt(results[u])} ${LAND_UNIT_SHORT[u]}`),
        cfg ? `(১ কাঠা = ${f.num(cfg.sqftPerKatha)} বর্গফুট, ১ বিঘা = ${f.num(cfg.kathaPerBigha)} কাঠা)` : "",
        "— হিসাব হাব",
      ]
        .filter(Boolean)
        .join("\n")
    : null;

  const reset = () => {
    amount.reset();
    setUnit(DEFAULT_UNIT);
    setPresetId("default");
    sqftPerKatha.reset();
    kathaPerBigha.reset();
  };

  return (
    <CalculatorPanels
      onReset={reset}
      shareText={shareText}
      inputs={
        <>
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_200px]">
            <Input
              label="জমির পরিমাণ"
              placeholder="যেমন: ৫"
              suffix={LAND_UNIT_SHORT[unit]}
              hint="বাংলা বা ইংরেজি সংখ্যা — দুটোই লেখা যাবে"
              {...amount.inputProps}
            />
            <Select
              label="একক"
              value={unit}
              onValueChange={(v) => setUnit(v as LandUnit)}
              options={LAND_UNITS.map((u) => ({ value: u, label: LAND_UNIT_LABELS[u] }))}
            />
          </div>
          <Select
            label="এলাকা (কাঠা ও বিঘার মাপ)"
            value={presetId}
            onValueChange={setPresetId}
            options={LAND_PRESETS.map((p) => ({ value: p.id, label: p.label }))}
          />
          {isCustom ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="১ কাঠা = কত বর্গফুট?" suffix="বর্গফুট" {...sqftPerKatha.inputProps} />
              <Input label="১ বিঘা = কত কাঠা?" suffix="কাঠা" {...kathaPerBigha.inputProps} />
            </div>
          ) : null}
          <Disclaimer tone="info">কাঠা ও বিঘার মাপ এলাকাভেদে ভিন্ন, দলিল দেখে নিশ্চিত হোন।</Disclaimer>
        </>
      }
      result={
        results && amount.value !== null ? (
          <>
            <ResultBox
              label={`${f.num(amount.value, { maxDecimals: 4 })} ${LAND_UNIT_SHORT[unit]} সমান`}
              value={`${fmt(unit === "sqft" ? results.shotok : results.sqft)} ${unit === "sqft" ? "শতক" : "বর্গফুট"}`}
            />
            <ul className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2">
              {LAND_UNITS.map((u) => (
                <li
                  key={u}
                  className={cn(
                    "flex flex-col rounded-xl border px-4 py-2.5",
                    u === unit ? "border-primary/40 bg-primary-soft" : "border-border bg-surface-2",
                  )}
                >
                  <span className="text-[14px] text-muted">{LAND_UNIT_LABELS[u]}</span>
                  <span className="tabular break-all text-lg font-bold text-text">{fmt(results[u])}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <ResultEmpty>
            <ArrowRightLeft aria-hidden="true" className="mx-auto mb-2 size-8" />
            জমির পরিমাণ লিখুন — যেমন <strong>৫ শতক</strong>। সঙ্গে সঙ্গে সব এককে রূপান্তর দেখাবে।
          </ResultEmpty>
        )
      }
    />
  );
}
