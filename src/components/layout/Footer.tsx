import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { ENABLED_TOOLS, toolPath } from "@/data/tools";
import { LAST_UPDATED } from "@/config/site";
import { formatBanglaDate } from "@/lib/format";
import { Logo } from "./Logo";

const linkCls = "inline-flex min-h-11 items-center text-muted transition-colors duration-150 hover:text-primary-text";

/** Site footer: tool links, info pages, last-updated note and trust statement. */
export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-content gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-3">
          <Logo />
          <p className="flex gap-2 text-muted">
            <ShieldCheck aria-hidden="true" className="mt-1 size-5 shrink-0 text-primary-text" />
            <span>
              হিসাব হাব সম্পূর্ণ ফ্রি। কোনো সাইনআপ, কুকি-ট্র্যাকিং বা সার্ভার নেই — আপনার দেওয়া সব তথ্য আপনার ফোন বা
              কম্পিউটারেই থাকে।
            </span>
          </p>
        </div>

        <nav aria-label="ক্যালকুলেটর">
          <h2 className="mb-2 text-base font-bold">ক্যালকুলেটর</h2>
          <ul>
            {ENABLED_TOOLS.map((tool) => (
              <li key={tool.slug}>
                <Link href={toolPath(tool)} className={linkCls}>
                  {tool.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="তথ্য">
          <h2 className="mb-2 text-base font-bold">তথ্য</h2>
          <ul>
            <li>
              <Link href="/about/" className={linkCls}>
                আমাদের সম্পর্কে
              </Link>
            </li>
            <li>
              <Link href="/privacy/" className={linkCls}>
                গোপনীয়তা নীতি
              </Link>
            </li>
            <li>
              <Link href="/disclaimer/" className={linkCls}>
                দায়মুক্তি
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-content flex-col gap-1 px-4 py-5 text-[15px] text-muted sm:flex-row sm:justify-between">
          <p>© {formatBanglaDate(LAST_UPDATED).split(" ").pop()} হিসাব হাব। সব হিসাব আনুমানিক — গুরুত্বপূর্ণ সিদ্ধান্তের আগে যাচাই করুন।</p>
          <p>সর্বশেষ আপডেট: {formatBanglaDate(LAST_UPDATED)}</p>
        </div>
      </div>
    </footer>
  );
}
