import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { Card } from "@/components/ui/Card";
import { ENABLED_TOOLS, toolPath } from "@/data/tools";

export const metadata = pageMetadata({
  title: "আমাদের সম্পর্কে",
  description: "হিসাব হাব — বাংলাদেশের মানুষের জন্য সহজ, ফ্রি এবং বিজ্ঞাপন ও ট্র্যাকিংমুক্ত বাংলা ক্যালকুলেটর ওয়েবসাইট।",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 space-y-6">
      <h1 className="text-3xl sm:text-4xl">আমাদের সম্পর্কে</h1>
      <Card className="space-y-4 leading-[1.8]">
        <p>
          <strong>হিসাব হাব (Hishab Hub)</strong> বাংলাদেশের মানুষের দৈনন্দিন আর্থিক, জমি-জমা ও প্রয়োজনীয় হিসাব সহজ বাংলায় করার
          একটি ফ্রি ওয়েবসাইট। জমির দলিলের শতক-কাঠা মেলানো, ব্যাংকের লোন ইএমআই বা ডিপিএস-এফডিআরের মুনাফা বোঝা কিংবা যাকাতের নিসাব
          হিসাব করা—এসব কাজে যেন কাউকে জটিল ইংরেজি সূত্র বা ভারী অ্যাপের ওপর নির্ভর করতে না হয়, সেজন্যই হিসাব হাব তৈরি।
        </p>
        <h2 className="pt-2 text-2xl">আমাদের লক্ষ্য ও নীতি</h2>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>সহজ বাংলা ও দেশীয় একক:</strong> শতক, কাঠা, বিঘা, ভরি, লাখ-কোটি ও টাকার (৳) প্রচলিত ফরম্যাটে সব ফলাফল দেখানো হয়।
          </li>
          <li>
            <strong>গোপনীয়তা সবার আগে:</strong> আপনার দেওয়া কোনো সংখ্যা বা তথ্য আমাদের কোনো সার্ভারে যায় না। সব হিসাব সরাসরি আপনার
            ফোন বা কম্পিউটারের ব্রাউজারেই সম্পন্ন হয়।
          </li>
          <li>
            <strong>সম্পূর্ণ ফ্রি ও হালকা:</strong> কোনো অ্যাকাউন্ট খোলা বা সাইনআপের ঝামেলা নেই। কম গতির মোবাইল ইন্টারনেটেও যেন দ্রুত
            কাজ করে, সেভাবেই পুরো সাইটটি তৈরি।
          </li>
          <li>
            <strong>স্বচ্ছতা:</strong> প্রতিটি ক্যালকুলেটরের নিচে কোন সূত্রে হিসাব করা হয়েছে এবং কোথায় বিশেষজ্ঞের পরামর্শ নেওয়া উচিত তা
            স্পষ্টভাবে লেখা থাকে।
          </li>
        </ul>
        <h2 className="pt-2 text-2xl">বর্তমানে চালু ক্যালকুলেটরসমূহ</h2>
        <ul className="ml-5 list-disc space-y-1">
          {ENABLED_TOOLS.map((t) => (
            <li key={t.slug}>
              <Link href={toolPath(t)} className="font-semibold text-primary-text hover:underline">
                {t.title}
              </Link>{" "}
              — {t.description}
            </li>
          ))}
        </ul>
      </Card>
    </main>
  );
}
