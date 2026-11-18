"use client";

import { useState } from "react";
import { Accordion } from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CopyButton } from "@/components/ui/CopyButton";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { Input } from "@/components/ui/Input";
import { ResultBox } from "@/components/ui/ResultBox";
import { Select } from "@/components/ui/Select";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { Tabs } from "@/components/ui/Tabs";
import { Tooltip } from "@/components/ui/Tooltip";

const swatches = [
  ["primary", "bg-primary"],
  ["primary-hover", "bg-primary-hover"],
  ["accent", "bg-accent"],
  ["bg", "bg-bg"],
  ["surface", "bg-surface"],
  ["text", "bg-text"],
  ["muted", "bg-muted"],
  ["border", "bg-border"],
  ["success", "bg-success"],
  ["danger", "bg-danger"],
] as const;

export function DesignDemo() {
  const [amount, setAmount] = useState("১০০০০০");
  const [rate, setRate] = useState("abc");
  const [unit, setUnit] = useState("shotok");
  const [tab, setTab] = useState("dps");

  return (
    <main className="mx-auto max-w-content space-y-8 px-4 py-10">
      <h1 className="text-3xl">ডিজাইন সিস্টেম (অস্থায়ী পাতা)</h1>

      <Card title="রং">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {swatches.map(([name, cls]) => (
            <div key={name} className="text-[14px]">
              <div className={`h-14 rounded-xl border border-border ${cls}`} />
              <p className="mt-1 text-muted">{name}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="টাইপোগ্রাফি">
        <h2 className="text-2xl">শিরোনাম ২ — জমির হিসাব</h2>
        <h3 className="text-xl">শিরোনাম ৩ — লোনের কিস্তি</h3>
        <p>মূল লেখা ১৭px, লাইন-হাইট ১.৭। বাংলা লেখা যেন সহজে পড়া যায়, সেজন্য পর্যাপ্ত ফাঁকা জায়গা রাখা হয়েছে।</p>
        <p className="text-muted">হালকা রঙের সহায়ক লেখা।</p>
      </Card>

      <Card title="বাটন ও ব্যাজ">
        <div className="flex flex-wrap gap-3">
          <Button>প্রাইমারি</Button>
          <Button variant="secondary">সেকেন্ডারি</Button>
          <Button variant="ghost">ঘোস্ট</Button>
          <Button disabled>নিষ্ক্রিয়</Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge>নতুন</Badge>
          <Badge tone="accent">জনপ্রিয়</Badge>
          <Badge tone="neutral">শীঘ্রই</Badge>
          <Badge tone="success">ফরজ</Badge>
          <Badge tone="danger">ত্রুটি</Badge>
        </div>
      </Card>

      <Card title="ইনপুট">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="লোনের পরিমাণ"
            value={amount}
            onValueChange={setAmount}
            suffix="৳"
            hint="বাংলা বা ইংরেজি সংখ্যা দুটোই চলবে"
            labelExtra={<Tooltip content="যত টাকা লোন নিতে চান, তা লিখুন।" />}
          />
          <Input label="সুদের হার" value={rate} onValueChange={setRate} suffix="%" error="সুদের হার সঠিক সংখ্যায় লিখুন।" />
          <Select
            label="একক"
            value={unit}
            onValueChange={setUnit}
            options={[
              { value: "shotok", label: "শতক" },
              { value: "katha", label: "কাঠা" },
              { value: "bigha", label: "বিঘা" },
            ]}
          />
        </div>
      </Card>

      <Card title="ট্যাব">
        <Tabs
          label="সঞ্চয়ের ধরন"
          tabs={[
            { id: "dps", label: "ডিপিএস" },
            { id: "fdr", label: "এফডিআর" },
          ]}
          value={tab}
          onValueChange={setTab}
        >
          <p>{tab === "dps" ? "ডিপিএস প্যানেল" : "এফডিআর প্যানেল"}</p>
        </Tabs>
      </Card>

      <Card title="ফলাফল">
        <ResultBox label="মাসিক কিস্তি (ইএমআই)" value="৳২১,২৪৭" sub="৬০ মাসের জন্য" />
        <div className="mt-3 grid grid-cols-2 gap-3">
          <ResultBox variant="stat" label="মোট সুদ" value="৳২,৭৪,৮২২" />
          <ResultBox variant="stat" label="মোট পরিশোধ" value="৳১২,৭৪,৮২২" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <CopyButton text="মাসিক কিস্তি ৳২১,২৪৭" />
          <ShareButtons text="মাসিক কিস্তি ৳২১,২৪৭" />
        </div>
      </Card>

      <Disclaimer title="সতর্কতা">এটি আনুমানিক হিসাব। চূড়ান্ত সিদ্ধান্তের আগে বিশেষজ্ঞের পরামর্শ নিন।</Disclaimer>
      <Disclaimer tone="info">কাঠা ও বিঘার মাপ এলাকাভেদে ভিন্ন, দলিল দেখে নিশ্চিত হোন।</Disclaimer>

      <Accordion
        items={[
          { question: "এটি কি ফ্রি?", answer: "হ্যাঁ, সম্পূর্ণ ফ্রি।" },
          { question: "আমার তথ্য কোথায় যায়?", answer: "কোথাও না — সব হিসাব আপনার ব্রাউজারেই হয়।" },
        ]}
      />
    </main>
  );
}
