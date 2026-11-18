import Link from "next/link";
import type { Metadata } from "next";
import { ENABLED_TOOLS, toolPath } from "@/data/tools";
import { buttonClasses } from "@/components/ui/Button";
import { ToolIcon } from "@/components/ToolIcon";

export const metadata: Metadata = {
  title: "পাতাটি পাওয়া যায়নি (৪০৪)",
  description: "আপনি যে পাতাটি খুঁজছেন তা পাওয়া যায়নি। নিচের তালিকা থেকে আপনার প্রয়োজনীয় বাংলা ক্যালকুলেটরটি বেছে নিন।",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-center">
      <p className="inline-block rounded-full bg-primary-soft px-4 py-1 text-lg font-bold text-primary-text">৪০৪</p>
      <h1 className="mt-4 text-3xl sm:text-4xl">দুঃখিত, এই পাতাটি খুঁজে পাওয়া যায়নি</h1>
      <p className="mx-auto mt-3 max-w-xl text-muted">
        আপনি যে ঠিকানায় এসেছেন সেটি হয়তো বদলে গেছে অথবা ভুলভাবে টাইপ হয়েছে। হোম পেজে ফিরে যান অথবা নিচের যেকোনো ক্যালকুলেটর বেছে নিন।
      </p>
      <div className="mt-6">
        <Link href="/" className={buttonClasses("primary", "md")}>
          হোম পেজে ফিরে যান
        </Link>
      </div>
      <section aria-labelledby="nf-tools" className="mt-12 text-left">
        <h2 id="nf-tools" className="mb-4 text-xl text-center">
          জনপ্রিয় ক্যালকুলেটরসমূহ
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {ENABLED_TOOLS.map((t) => (
            <li key={t.slug}>
              <Link
                href={toolPath(t)}
                className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-soft transition-colors duration-150 hover:border-primary/40"
              >
                <ToolIcon name={t.icon} size="sm" />
                <span>
                  <span className="block font-bold text-text">{t.title}</span>
                  <span className="block text-[14px] text-muted">{t.shortTitle}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
