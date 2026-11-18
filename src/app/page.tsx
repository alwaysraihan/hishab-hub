import { Gift, Languages, Zap, UserX } from "lucide-react";
import { ENABLED_TOOLS } from "@/data/tools";
import { HOME_FAQ, toAccordion } from "@/data/home";
import { SearchBox } from "@/components/SearchBox";
import { ToolCard } from "@/components/ToolCard";
import { Accordion } from "@/components/ui/Accordion";

const WHY = [
  { icon: Gift, title: "সম্পূর্ণ ফ্রি", text: "সব ক্যালকুলেটর বিনামূল্যে, কোনো লুকানো চার্জ নেই।" },
  { icon: Languages, title: "পুরোপুরি বাংলায়", text: "বাংলা লেখা, বাংলা সংখ্যা আর দেশের প্রচলিত একক।" },
  { icon: Zap, title: "দ্রুত ও হালকা", text: "লিখতে লিখতেই ফলাফল — কম ইন্টারনেটেও চলে।" },
  { icon: UserX, title: "সাইনআপ লাগে না", text: "কোনো অ্যাকাউন্ট নয়, তথ্য থাকে শুধু আপনার ডিভাইসে।" },
] as const;

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-primary-soft/70 to-bg">
        <div className="mx-auto max-w-content px-4 pb-14 pt-12 text-center sm:pt-20">
          <p className="mb-3 inline-block rounded-full bg-surface px-3 py-1 text-[15px] font-semibold text-primary-text shadow-soft">
            বাংলাদেশের জন্য বাংলা ক্যালকুলেটর
          </p>
          <h1 className="mx-auto max-w-3xl text-[2rem] leading-tight sm:text-5xl">
            জমি, লোন, সঞ্চয় আর যাকাতের হিসাব — <span className="text-primary-text">এক জায়গায়, বাংলায়</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            জটিল সূত্র মনে রাখার দরকার নেই। সংখ্যা লিখুন, সঙ্গে সঙ্গে নির্ভুল ফলাফল দেখুন — একদম ফ্রি।
          </p>
          <SearchBox variant="hero" className="mx-auto mt-8 max-w-xl text-left" />
        </div>
      </section>

      {/* Tools */}
      <section aria-labelledby="tools-heading" className="mx-auto max-w-content px-4 py-14">
        <h2 id="tools-heading" className="text-2xl sm:text-3xl">
          সব ক্যালকুলেটর
        </h2>
        <p className="mt-2 text-muted">আপনার দরকারি হিসাবটি বেছে নিন।</p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ENABLED_TOOLS.map((tool) => (
            <li key={tool.slug}>
              <ToolCard tool={tool} />
            </li>
          ))}
        </ul>
      </section>

      {/* Why */}
      <section aria-labelledby="why-heading" className="border-y border-border bg-surface">
        <div className="mx-auto max-w-content px-4 py-14">
          <h2 id="why-heading" className="text-2xl sm:text-3xl">
            কেন হিসাব হাব?
          </h2>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4 lg:flex-col lg:gap-3">
                <span aria-hidden="true" className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-on-accent">
                  <Icon className="size-6" />
                </span>
                <div>
                  <h3 className="text-lg">{title}</h3>
                  <p className="text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-heading" className="mx-auto max-w-3xl px-4 py-14">
        <h2 id="faq-heading" className="mb-6 text-2xl sm:text-3xl">
          সাধারণ প্রশ্ন
        </h2>
        <Accordion items={toAccordion(HOME_FAQ)} />
      </section>
    </main>
  );
}
