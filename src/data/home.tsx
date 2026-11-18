import type { AccordionItem } from "@/components/ui/Accordion";

/** Plain-text FAQ for the home page (also used for FAQPage JSON-LD). */
export interface FaqEntry {
  question: string;
  answer: string;
}

export const HOME_FAQ: readonly FaqEntry[] = [
  {
    question: "হিসাব হাব কি সত্যিই ফ্রি?",
    answer:
      "হ্যাঁ, হিসাব হাবের সব ক্যালকুলেটর সম্পূর্ণ ফ্রি। কোনো অ্যাকাউন্ট খুলতে হয় না, কোনো লুকানো চার্জও নেই।",
  },
  {
    question: "আমার দেওয়া তথ্য কি কোথাও জমা থাকে?",
    answer:
      "না। সব হিসাব আপনার ব্রাউজারেই হয়, কোনো সার্ভারে পাঠানো হয় না। শুধু আপনার পছন্দ (ডার্ক মোড, বাংলা/ইংরেজি সংখ্যা) আপনার ডিভাইসে সংরক্ষিত থাকে।",
  },
  {
    question: "বাংলা সংখ্যায় লিখলে কি হিসাব হবে?",
    answer:
      "হবে। প্রতিটি ঘরে বাংলা (১২৩) বা ইংরেজি (123) — যেকোনো সংখ্যা লিখতে পারেন। ফলাফল কোন সংখ্যায় দেখাবে, তা ওপরের টগল থেকে বেছে নিন।",
  },
  {
    question: "এখানকার হিসাব কতটা নির্ভরযোগ্য?",
    answer:
      "প্রতিটি ক্যালকুলেটর প্রচলিত সূত্র মেনে তৈরি এবং পরীক্ষিত। তবে ব্যাংক, এলাকা বা ব্যক্তিগত পরিস্থিতিভেদে নিয়ম আলাদা হতে পারে, তাই ফলাফলকে আনুমানিক ধরে চূড়ান্ত সিদ্ধান্তের আগে সংশ্লিষ্ট প্রতিষ্ঠান বা বিশেষজ্ঞের সঙ্গে মিলিয়ে নিন।",
  },
  {
    question: "মোবাইলে কি ব্যবহার করা যাবে?",
    answer:
      "অবশ্যই। হিসাব হাব মোবাইলের কথা মাথায় রেখেই বানানো — কম ইন্টারনেটেও দ্রুত লোড হয় এবং ছোট স্ক্রিনেও সহজে ব্যবহার করা যায়।",
  },
];

/** Converts plain FAQ entries into Accordion items. */
export function toAccordion(faq: readonly FaqEntry[]): AccordionItem[] {
  return faq.map((f) => ({ question: f.question, answer: <p>{f.answer}</p> }));
}
