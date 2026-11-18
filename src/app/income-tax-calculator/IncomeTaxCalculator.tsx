"use client";

import { useState } from "react";
import { AlertTriangle, ReceiptText } from "lucide-react";
import { CalculatorPanels, ResultEmpty } from "@/components/calculator/CalculatorPanels";
import { useNumberField } from "@/components/calculator/useNumberField";
import { useFormatters } from "@/components/providers/PreferencesProvider";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { Input } from "@/components/ui/Input";
import { ResultBox } from "@/components/ui/ResultBox";
import { Select } from "@/components/ui/Select";
import {
  LOCATION_ZONE_LABELS,
  TAX_CONFIG,
  TAXPAYER_CATEGORY_LABELS,
  type LocationZone,
  type TaxpayerCategory,
} from "@/data/tax-config";
import { calculateIncomeTax, isTaxConfigReady } from "@/lib/tax";

export function IncomeTaxCalculator() {
  const f = useFormatters();
  const ready = isTaxConfigReady(TAX_CONFIG);

  const [category, setCategory] = useState<TaxpayerCategory>("general");
  const [zone, setZone] = useState<LocationZone>("dhaka_chattagram_city");
  const income = useNumberField("৬,০০,০০০", { label: "বার্ষিক করযোগ্য আয়", max: 1e13 });
  const investment = useNumberField("০", { label: "অনুমোদিত বিনিয়োগ", max: 1e13 });

  const calc =
    ready && income.value !== null && investment.value !== null
      ? calculateIncomeTax(
          {
            annualTaxableIncome: income.value,
            eligibleInvestment: investment.value,
            category,
            zone,
          },
          TAX_CONFIG,
        )
      : { status: "config_pending" as const };

  const ok = calc.status === "ok" ? calc : null;

  const shareText =
    ok && income.value !== null
      ? [
          `আয়কর হিসাব (${TAXPAYER_CATEGORY_LABELS[category]}):`,
          `বার্ষিক করযোগ্য আয়: ${f.taka(income.value)}`,
          `করমুক্ত সীমা: ${f.taka(ok.taxFreeLimit)}`,
          `মোট কর: ${f.taka(ok.grossTax)}`,
          `বিনিয়োগ রেয়াত: ${f.taka(ok.investmentRebate)}`,
          `চূড়ান্ত প্রদেয় কর: ${f.taka(ok.finalTaxPayable)}`,
          "— হিসাব হাব",
        ].join("\n")
      : null;

  const reset = () => {
    setCategory("general");
    setZone("dhaka_chattagram_city");
    income.reset();
    investment.reset();
  };

  return (
    <div className="space-y-6">
      {!ready ? (
        <Disclaimer tone="warning" title="কর হার হালনাগাদ করা হচ্ছে">
          জাতীয় রাজস্ব বোর্ড (এনবিআর)-এর সর্বশেষ সরকারি পরিপত্র অনুযায়ী করমুক্ত সীমা ও ধাপগুলো যাচাই করে যুক্ত করা হচ্ছে। ভুল হিসাব
          এড়াতে যাচাই সম্পন্ন না হওয়া পর্যন্ত ফলাফল গণনা সাময়িকভাবে বন্ধ রাখা হয়েছে।
        </Disclaimer>
      ) : null}

      <CalculatorPanels
        onReset={reset}
        shareText={shareText}
        inputs={
          <>
            <Select
              label="করদাতার ধরন"
              value={category}
              onValueChange={(v) => setCategory(v as TaxpayerCategory)}
              disabled={!ready}
              options={(Object.keys(TAXPAYER_CATEGORY_LABELS) as TaxpayerCategory[]).map((k) => ({
                value: k,
                label: TAXPAYER_CATEGORY_LABELS[k],
              }))}
            />
            <Select
              label="অবস্থান (ন্যূনতম কর নির্ধারণের জন্য)"
              value={zone}
              onValueChange={(v) => setZone(v as LocationZone)}
              disabled={!ready}
              options={(Object.keys(LOCATION_ZONE_LABELS) as LocationZone[]).map((k) => ({
                value: k,
                label: LOCATION_ZONE_LABELS[k],
              }))}
            />
            <Input
              label="বার্ষিক করযোগ্য আয়"
              suffix="৳"
              placeholder="যেমন: ৬,০০,০০০"
              disabled={!ready}
              {...income.inputProps}
            />
            <Input
              label="বার্ষিক অনুমোদিত বিনিয়োগ (ডিপিএস, সঞ্চয়পত্র ইত্যাদি)"
              suffix="৳"
              placeholder="০"
              disabled={!ready}
              {...investment.inputProps}
            />
          </>
        }
        result={
          ok ? (
            <>
              <ResultBox
                label="চূড়ান্ত প্রদেয় আয়কর"
                value={f.taka(ok.finalTaxPayable)}
                sub={ok.minimumTaxApplied ? "এলাকাভিত্তিক ন্যূনতম কর প্রযোজ্য হয়েছে" : "বিনিয়োগ রেয়াত বাদ দেওয়ার পর"}
              />
              <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
                <ResultBox variant="stat" label="করমুক্ত সীমা" value={f.taka(ok.taxFreeLimit)} />
                <ResultBox variant="stat" label="করযোগ্য অংশ" value={f.taka(ok.assessableIncome)} />
                <ResultBox variant="stat" label="মোট কর (রেয়াত পূর্ব)" value={f.taka(ok.grossTax)} />
                <ResultBox variant="stat" label="বিনিয়োগ রেয়াত" value={f.taka(ok.investmentRebate)} />
              </div>
            </>
          ) : (
            <ResultEmpty>
              {!ready ? (
                <>
                  <AlertTriangle aria-hidden="true" className="mx-auto mb-2 size-8 text-accent" />
                  <p className="font-bold text-text">কর হার হালনাগাদ করা হচ্ছে</p>
                  <p className="mt-1 text-[15px]">
                    এনবিআর-এর সরকারি প্রজ্ঞাপন থেকে করের ধাপ কনফিগার ফাইলে যুক্ত হলেই এখানে তাৎক্ষণিক হিসাব দেখা যাবে।
                  </p>
                </>
              ) : (
                <>
                  <ReceiptText aria-hidden="true" className="mx-auto mb-2 size-8" />
                  আপনার বার্ষিক করযোগ্য আয় ও বিনিয়োগের পরিমাণ লিখুন।
                </>
              )}
            </ResultEmpty>
          )
        }
      />
    </div>
  );
}
