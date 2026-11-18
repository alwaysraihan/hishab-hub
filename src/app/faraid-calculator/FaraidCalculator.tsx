"use client";

import { useState } from "react";
import { Scale } from "lucide-react";
import { CalculatorPanels, ResultEmpty } from "@/components/calculator/CalculatorPanels";
import { useNumberField } from "@/components/calculator/useNumberField";
import { useFormatters } from "@/components/providers/PreferencesProvider";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { Input } from "@/components/ui/Input";
import { ResultBox } from "@/components/ui/ResultBox";
import { Segmented } from "@/components/ui/Segmented";
import { Select } from "@/components/ui/Select";
import { calculateFaraid, CONSULT_SCHOLAR_MESSAGE, type SpouseType } from "@/lib/faraid";

export function FaraidCalculator() {
  const f = useFormatters();
  const estate = useNumberField("১২,০০,০০০", { label: "মোট বণ্টনযোগ্য সম্পত্তি", allowZero: false, max: 1e14 });
  const [spouseType, setSpouseType] = useState<SpouseType>("wives");
  const [wivesCount, setWivesCount] = useState("1");
  const sons = useNumberField("১", { label: "ছেলের সংখ্যা", integer: true, max: 30 });
  const daughters = useNumberField("১", { label: "মেয়ের সংখ্যা", integer: true, max: 30 });
  const [fatherAlive, setFatherAlive] = useState<"yes" | "no">("no");
  const [motherAlive, setMotherAlive] = useState<"yes" | "no">("no");
  const [hasOtherHeirs, setHasOtherHeirs] = useState<"yes" | "no">("no");

  const valid = estate.value !== null && sons.value !== null && daughters.value !== null;

  const result =
    valid && estate.value !== null && sons.value !== null && daughters.value !== null
      ? calculateFaraid({
          estateAmount: estate.value,
          spouseType,
          wivesCount: Number(wivesCount),
          sons: sons.value,
          daughters: daughters.value,
          fatherAlive: fatherAlive === "yes",
          motherAlive: motherAlive === "yes",
          hasOtherHeirs: hasOtherHeirs === "yes",
        })
      : null;

  const shareText =
    result && result.status === "ok"
      ? [
          `ফারায়েজ হিসাব (মোট সম্পত্তি ${f.taka(result.estateAmount)}):`,
          ...result.shares.map(
            (s) =>
              `• ${s.label}: অংশ ${f.d(s.fractionText)} = ${f.taka(s.groupAmount)}${
                s.count > 1 ? ` (প্রতিজন ${f.taka(s.eachAmount)})` : ""
              }`,
          ),
          "— হিসাব হাব (চূড়ান্ত বণ্টনের আগে আলেমের পরামর্শ নিন)",
        ].join("\n")
      : null;

  const reset = () => {
    estate.reset();
    setSpouseType("wives");
    setWivesCount("1");
    sons.reset();
    daughters.reset();
    setFatherAlive("no");
    setMotherAlive("no");
    setHasOtherHeirs("no");
  };

  return (
    <div className="space-y-6">
      <Disclaimer tone="warning" title="গুরুত্বপূর্ণ শরয়ী ও আইনগত সতর্কবার্তা">
        দাফন-কাফনের খরচ, মৃত ব্যক্তির ঋণ এবং বৈধ ওসিয়ত (সর্বোচ্চ এক-তৃতীয়াংশ) আদায়ের পর অবশিষ্ট সম্পত্তির ওপর ফারায়েজ প্রযোজ্য হয়।
        এই ক্যালকুলেটরটি শুধু প্রাথমিক ধারণার জন্য এবং বর্তমানে আলেমের চূড়ান্ত যাচাইয়ের অপেক্ষায় রয়েছে। যেকোনো পারিবারিক বা আইনগত
        বণ্টনের আগে অবশ্যই একজন বিজ্ঞ মুফতি বা আইনজীবীর পরামর্শ নিন।
      </Disclaimer>

      <CalculatorPanels
        onReset={reset}
        shareText={shareText}
        inputs={
          <>
            <Input
              label="মোট বণ্টনযোগ্য সম্পত্তি (ঋণ ও ওসিয়ত বাদে)"
              suffix="৳"
              placeholder="যেমন: ১২,০০,০০০"
              {...estate.inputProps}
            />

            <Select
              label="জীবিত স্বামী বা স্ত্রী"
              value={spouseType}
              onValueChange={(v) => setSpouseType(v as SpouseType)}
              options={[
                { value: "none", label: "কেউ নেই" },
                { value: "husband", label: "স্বামী জীবিত" },
                { value: "wives", label: "স্ত্রী জীবিত" },
              ]}
            />

            {spouseType === "wives" ? (
              <Select
                label="জীবিত স্ত্রীর সংখ্যা"
                value={wivesCount}
                onValueChange={setWivesCount}
                options={[
                  { value: "1", label: "১ জন" },
                  { value: "2", label: "২ জন" },
                  { value: "3", label: "৩ জন" },
                  { value: "4", label: "৪ জন" },
                ]}
              />
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="জীবিত ছেলের সংখ্যা" suffix="জন" placeholder="০" {...sons.inputProps} />
              <Input label="জীবিত মেয়ের সংখ্যা" suffix="জন" placeholder="০" {...daughters.inputProps} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Segmented
                label="বাবা কি জীবিত?"
                value={fatherAlive}
                onValueChange={setFatherAlive}
                options={[
                  { value: "no", label: "না" },
                  { value: "yes", label: "হ্যাঁ" },
                ]}
              />
              <Segmented
                label="মা কি জীবিত?"
                value={motherAlive}
                onValueChange={setMotherAlive}
                options={[
                  { value: "no", label: "না" },
                  { value: "yes", label: "হ্যাঁ" },
                ]}
              />
            </div>

            <Segmented
              label="অন্য কোনো ওয়ারিশ (দাদা-দাদি, ভাই-বোন, নাতি-নাতনি ইত্যাদি) আছেন কি?"
              value={hasOtherHeirs}
              onValueChange={setHasOtherHeirs}
              options={[
                { value: "no", label: "না" },
                { value: "yes", label: "হ্যাঁ" },
              ]}
            />
          </>
        }
        result={
          result ? (
            result.status === "ok" ? (
              <>
                <ResultBox
                  label="মোট বণ্টনযোগ্য সম্পত্তি"
                  value={f.taka(result.estateAmount)}
                  sub={`${f.num(result.shares.length)} শ্রেণির ওয়ারিশের মধ্যে বণ্টিত`}
                />
                <div className="overflow-hidden rounded-xl border border-border">
                  <table className="tabular w-full text-left text-[15px]">
                    <thead className="bg-surface-2 text-muted">
                      <tr>
                        <th scope="col" className="px-3 py-2 font-semibold">ওয়ারিশ</th>
                        <th scope="col" className="px-3 py-2 text-right font-semibold">অংশ</th>
                        <th scope="col" className="px-3 py-2 text-right font-semibold">প্রাপ্য টাকা</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {result.shares.map((s) => (
                        <tr key={s.key}>
                          <th scope="row" className="px-3 py-2.5 font-semibold text-text">
                            {s.label}
                            {s.count > 1 ? (
                              <span className="block text-[13px] font-normal text-muted">
                                প্রতিজন: {f.taka(s.eachAmount)}
                              </span>
                            ) : null}
                          </th>
                          <td className="px-3 py-2.5 text-right font-medium text-text">
                            {f.d(s.fractionText)} ({f.pct(s.groupShare * 100, { maxDecimals: 2 })})
                          </td>
                          <td className="px-3 py-2.5 text-right font-bold text-primary-text">
                            {f.taka(s.groupAmount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <Disclaimer tone="warning" title={CONSULT_SCHOLAR_MESSAGE}>
                আপনার নির্বাচিত ওয়ারিশদের ক্ষেত্রে বিশেষ শরয়ী বিধান (যেমন আউল, রাদ্দ, উমারিয়্যাতাইন বা অন্যান্য ওয়ারিশের অংশ) প্রযোজ্য
                হওয়ায় এখানে স্বয়ংক্রিয় হিসাব দেখানো হচ্ছে না। অনুগ্রহ করে একজন বিজ্ঞ মুফতি, দারুল ইফতা বা আইনজীবীর পরামর্শ নিন।
              </Disclaimer>
            )
          ) : (
            <ResultEmpty>
              <Scale aria-hidden="true" className="mx-auto mb-2 size-8" />
              মোট সম্পত্তির পরিমাণ ও ওয়ারিশদের সংখ্যা লিখুন।
            </ResultEmpty>
          )
        }
      />
    </div>
  );
}
