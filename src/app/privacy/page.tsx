import { pageMetadata } from "@/lib/seo";
import { Card } from "@/components/ui/Card";
import { LAST_UPDATED } from "@/config/site";
import { formatBanglaDate } from "@/lib/format";

export const metadata = pageMetadata({
  title: "গোপনীয়তা নীতি",
  description: "হিসাব হাব কোনো ব্যক্তিগত তথ্য, হিসাবের সংখ্যা বা ট্র্যাকিং কুকি সংগ্রহ করে না। সব হিসাব আপনার ব্রাউজারেই হয়।",
  path: "/privacy/",
});

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 space-y-6">
      <h1 className="text-3xl sm:text-4xl">গোপনীয়তা নীতি</h1>
      <Card className="space-y-4 leading-[1.8]">
        <p>
          <strong>হিসাব হাব</strong> আপনার ব্যক্তিগত গোপনীয়তাকে সর্বোচ্চ সম্মান করে। এই ওয়েবসাইটটি এমনভাবে তৈরি করা হয়েছে যাতে আপনার
          আর্থিক বা জমির কোনো তথ্যই আপনার ডিভাইসের বাইরে না যায়।
        </p>
        <h2 className="pt-2 text-2xl">১. আমরা কী তথ্য সংগ্রহ করি?</h2>
        <p>
          সংক্ষেপে—<strong>কোনো ব্যক্তিগত তথ্যই না।</strong> আমাদের কোনো ব্যাকএন্ড ডাটাবেজ, ইউজার অ্যাকাউন্ট বা ফর্ম সাবমিশন সার্ভার নেই।
          আপনি ক্যালকুলেটরে যে সংখ্যাগুলো লেখেন (যেমন লোনের পরিমাণ, জমির মাপ বা যাকাতের সম্পদ), সেগুলো শুধু আপনার ব্রাউজারের মেমোরিতে
          হিসাব হয় এবং পেজ বন্ধ করলেই মুছে যায়।
        </p>
        <h2 className="pt-2 text-2xl">২. কুকিজ ও লোকাল স্টোরেজ</h2>
        <p>
          হিসাব হাব কোনো ট্র্যাকিং কুকি বা বিজ্ঞাপনী কুকি ব্যবহার করে না। শুধু আপনার ব্যবহারের সুবিধার্থে ব্রাউজারের{" "}
          <code>localStorage</code>-এ দুটি পছন্দ সংরক্ষিত থাকে:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>আপনি বাংলা সংখ্যা (১২৩) নাকি ইংরেজি সংখ্যা (123) দেখতে চান</li>
          <li>আপনি লাইট মোড নাকি ডার্ক মোড পছন্দ করেছেন</li>
        </ul>
        <h2 className="pt-2 text-2xl">৩. শেয়ার ও বাহ্যিক লিংক</h2>
        <p>
          আপনি যখন নিজে থেকে &quot;WhatsApp-এ শেয়ার&quot; বা &quot;Facebook-এ শেয়ার&quot; বাটনে ক্লিক করেন, কেবল তখনই সংশ্লিষ্ট ওয়েবসাইট
          নতুন ট্যাবে খোলে। এর আগে পর্যন্ত ওই সাইটগুলোর কোনো স্ক্রিপ্ট বা ট্র্যাকার আমাদের পেজে লোড হয় না।
        </p>
        <p className="pt-2 text-[15px] text-muted">সর্বশেষ হালনাগাদ: {formatBanglaDate(LAST_UPDATED)}</p>
      </Card>
    </main>
  );
}
