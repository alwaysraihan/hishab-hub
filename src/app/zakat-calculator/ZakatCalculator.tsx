"use client";

import { useState } from "react";
import { HeartHandshake } from "lucide-react";
import { CalculatorPanels, ResultEmpty } from "@/components/calculator/CalculatorPanels";
import { useNumberField } from "@/components/calculator/useNumberField";
import { useFormatters } from "@/components/providers/PreferencesProvider";
import { Badge } from "@/components/ui/Badge";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { Input } from "@/components/ui/Input";
import { ResultBox } from "@/components/ui/ResultBox";
import { Segmented } from "@/components/ui/Segmented";
import { Tooltip } from "@/components/ui/Tooltip";
import {
  calculateZakat,
  GOLD_NISAB_VORI,
  SILVER_NISAB_VORI,
  type NisabStandard,
} from "@/lib/zakat";

export function ZakatCalculator() {
  const f = useFormatters();
  const [standard, setStandard] = useState<NisabStandard>("silver");

  // Prices per vori — MUST be entered by user (no default prices)
  const goldPrice = useNumberField("", {
    label: "আজকের সোনার দাম (প্রতি ভরি)",
    allowZero: false,
    max: 1e9,
  });
  const silverPrice = useNumberField("", {
    label: "আজকের রুপার দাম (প্রতি ভরি)",
    allowZero: false,
    max: 1e9,
  });

  // Assets & liabilities
  const cash = useNumberField("৫০,০০০", { label: "হাতে নগদ টাকা", max: 1e13 });
  const bank = useNumberField("১,৫০,০০০", { label: "ব্যাংক ও মোবাইল ওয়ালেট ব্যালেন্স", max: 1e13 });
  const goldVori = useNumberField("০", { label: "সোনার পরিমাণ", max: 1e6 });
  const silverVori = useNumberField("০", { label: "রুপার পরিমাণ", max: 1e7 });
  const inventory = useNumberField("০", { label: "ব্যবসার পণ্য / মজুদ মাল", max: 1e13 });
  const receivables = useNumberField("০", { label: "আদায়যোগ্য পাওনা টাকা", max: 1e13 });
  const debts = useNumberField("০", { label: "তাৎক্ষণিক পরিশোধযোগ্য ঋণ / দেনা", max: 1e13 });

  const hasFieldError = Boolean(
    goldPrice.error ||
      silverPrice.error ||
      cash.error ||
      bank.error ||
      goldVori.error ||
      silverVori.error ||
      inventory.error ||
      receivables.error ||
      debts.error,
  );

  const goldV = goldVori.value ?? 0;
  const silverV = silverVori.value ?? 0;
  const needGoldPrice = standard === "gold" || goldV > 0;
  const needSilverPrice = standard === "silver" || silverV > 0;

  const goldPriceReady = !needGoldPrice || (goldPrice.value !== null && goldPrice.value > 0);
  const silverPriceReady = !needSilverPrice || (silverPrice.value !== null && silverPrice.value > 0);

  const result =
    !hasFieldError && goldPriceReady && silverPriceReady
      ? calculateZakat({
          cash: cash.value ?? 0,
          bankBalance: bank.value ?? 0,
          goldVori: goldV,
          silverVori: silverV,
          goldPricePerVori: goldPrice.value ?? 0,
          silverPricePerVori: silverPrice.value ?? 0,
          businessInventory: inventory.value ?? 0,
          receivables: receivables.value ?? 0,
          debtsDue: debts.value ?? 0,
          nisabStandard: standard,
        })
      : null;

  const shareText = result
    ? [
        `যাকাত হিসাব (${standard === "silver" ? "রুপার নিসাব ৫২.৫ ভরি" : "সোনার নিসাব ৭.৫ ভরি"}):`,
        `নিসাব সীমা: ${f.taka(result.nisabAmount)}`,
        `মোট যাকাতযোগ্য সম্পদ: ${f.taka(result.totalAssets)}`,
        `বাদ: ঋণ/দেনা: ${f.taka(result.debtsDue)}`,
        `নিট সম্পদ: ${f.taka(result.netWealth)}`,
        result.isEligible ? `প্রদেয় যাকাত (২.৫%): ${f.taka(result.zakatPayable)}` : "ফলাফল: যাকাত ফরজ নয়",
        "— হিসাব হাব",
      ].join("\n")
    : null;

  const reset = () => {
    setStandard("silver");
    goldPrice.reset();
    silverPrice.reset();
    cash.reset();
    bank.reset();
    goldVori.reset();
    silverVori.reset();
    inventory.reset();
    receivables.reset();
    debts.reset();
  };

  return (
    <CalculatorPanels
      onReset={reset}
      shareText={shareText}
      inputs={
        <>
          <Segmented
            label="নিসাবের মানদণ্ড নির্বাচন করুন"
            value={standard}
            onValueChange={setStandard}
            options={[
              { value: "silver", label: `রুপা (${f.num(SILVER_NISAB_VORI)} ভরি)` },
              { value: "gold", label: `সোনা (${f.num(GOLD_NISAB_VORI)} ভরি)` },
            ]}
          />

          <div className="rounded-xl border border-primary/30 bg-primary-soft/50 p-4 space-y-4">
            <p className="text-[15px] font-semibold text-text">
              আজকের বাজারদর লিখুন (বাজুস বা স্থানীয় জুয়েলার্সের দর অনুযায়ী)
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="আজকের রুপার দাম (প্রতি ভরি)"
                suffix="৳"
                placeholder="যেমন: ২,৫০০"
                hint={needSilverPrice ? "রুপার নিসাব বা রুপার হিসাবের জন্য আবশ্যক" : "ঐচ্ছিক"}
                {...silverPrice.inputProps}
              />
              <Input
                label="আজকের সোনার দাম (প্রতি ভরি)"
                suffix="৳"
                placeholder="যেমন: ১,৪০,০০০"
                hint={needGoldPrice ? "সোনার নিসাব বা সোনার হিসাবের জন্য আবশ্যক" : "ঐচ্ছিক"}
                {...goldPrice.inputProps}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="হাতে নগদ টাকা" suffix="৳" placeholder="০" {...cash.inputProps} />
            <Input label="ব্যাংক / বিকাশ / নগদ ব্যালেন্স" suffix="৳" placeholder="০" {...bank.inputProps} />
            <Input
              label="সোনার পরিমাণ"
              suffix="ভরি"
              placeholder="০"
              labelExtra={<Tooltip content="যাকাতযোগ্য সোনার মোট ওজন ভরিতে লিখুন।" />}
              {...goldVori.inputProps}
            />
            <Input
              label="রুপার পরিমাণ"
              suffix="ভরি"
              placeholder="০"
              labelExtra={<Tooltip content="যাকাতযোগ্য রুপার মোট ওজন ভরিতে লিখুন।" />}
              {...silverVori.inputProps}
            />
            <Input label="ব্যবসার পণ্য / মজুদ মাল" suffix="৳" placeholder="০" {...inventory.inputProps} />
            <Input label="আদায়যোগ্য পাওনা টাকা" suffix="৳" placeholder="০" {...receivables.inputProps} />
          </div>

          <Input
            label="বাদ: তাৎক্ষণিক পরিশোধযোগ্য ঋণ / দেনা"
            suffix="৳"
            placeholder="০"
            hint="যাকাত বর্ষে পরিশোধযোগ্য ঋণ বা বকেয়া খরচ"
            {...debts.inputProps}
          />

          <Disclaimer tone="warning">বিশেষ মাসআলার ক্ষেত্রে আলেমের পরামর্শ নিন।</Disclaimer>
        </>
      }
      result={
        result ? (
          <>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[15px] text-muted">
                নিসাব সীমা ({standard === "silver" ? `${f.num(SILVER_NISAB_VORI)} ভরি রুপা` : `${f.num(GOLD_NISAB_VORI)} ভরি সোনা`}):
              </span>
              <span className="tabular font-bold text-text">{f.taka(result.nisabAmount)}</span>
            </div>

            {result.isEligible ? (
              <ResultBox
                label="প্রদেয় যাকাত (২.৫%)"
                value={f.taka(result.zakatPayable)}
                sub="নিট সম্পদ নিসাব সীমা অতিক্রম করেছে"
              />
            ) : (
              <div
                aria-live="polite"
                className="rounded-2xl border border-border bg-surface-2 px-5 py-5"
              >
                <Badge tone="neutral">নিসাব পূর্ণ হয়নি</Badge>
                <p className="mt-2 text-2xl font-bold text-text">যাকাত ফরজ নয়</p>
                <p className="mt-1 text-[15px] text-muted">
                  আপনার নিট সম্পদ ({f.taka(result.netWealth)}) নির্বাচিত নিসাব সীমার ({f.taka(result.nisabAmount)}) চেয়ে কম।
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
              <ResultBox variant="stat" label="মোট সম্পদ" value={f.taka(result.totalAssets)} />
              <ResultBox variant="stat" label="বাদ: ঋণ/দেনা" value={f.taka(result.debtsDue)} />
            </div>
            <ResultBox variant="stat" label="নিট যাকাতযোগ্য সম্পদ" value={f.taka(result.netWealth)} />
          </>
        ) : (
          <ResultEmpty>
            <HeartHandshake aria-hidden="true" className="mx-auto mb-2 size-8" />
            নিসাব হিসাব করতে উপরে{" "}
            <strong>
              {!silverPriceReady && !goldPriceReady
                ? "আজকের সোনা ও রুপার ভরি প্রতি দাম"
                : !silverPriceReady
                  ? "আজকের রুপার ভরি প্রতি দাম"
                  : "আজকের সোনার ভরি প্রতি দাম"}
            </strong>{" "}
            লিখুন।
          </ResultEmpty>
        )
      }
    />
  );
}
