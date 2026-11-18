import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, CalendarClock } from "lucide-react";
import type { Tool } from "@/data/tools";
import { getRelatedTools } from "@/data/tools";
import type { FaqEntry } from "@/data/home";
import { toAccordion } from "@/data/home";
import { LAST_UPDATED } from "@/config/site";
import { formatBanglaDate } from "@/lib/format";
import { Accordion } from "@/components/ui/Accordion";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { ToolCard } from "@/components/ToolCard";
import { ToolIcon } from "@/components/ToolIcon";

export interface CalculatorLayoutProps {
  tool: Tool;
  /** One or two sentence Bangla intro under the H1. */
  intro: string;
  /** The interactive calculator (a client component that renders <CalculatorPanels>). */
  children: ReactNode;
  /** Optional banner shown above the calculator (e.g. "rates being updated"). */
  notice?: ReactNode;
  /** "কীভাবে হিসাব হয়" section content. */
  howItWorks: ReactNode;
  faq: readonly FaqEntry[];
  /** Page specific disclaimer text. */
  disclaimer: ReactNode;
  /** Override for last-updated date (ISO), defaults to the site date. */
  lastUpdated?: string;
  /** Optional structured data (JSON-LD objects) rendered into the page. */
  jsonLd?: readonly object[];
}

/**
 * Shared template for every tool page:
 * breadcrumb + title, calculator (inputs left / sticky result right), explanation, FAQ,
 * related tools, last-updated date and disclaimer.
 */
export function CalculatorLayout({
  tool,
  intro,
  children,
  notice,
  howItWorks,
  faq,
  disclaimer,
  lastUpdated = LAST_UPDATED,
  jsonLd = [],
}: CalculatorLayoutProps) {
  const related = getRelatedTools(tool.slug, 3);

  return (
    <main className="mx-auto max-w-content px-4 pb-8 pt-6 sm:pt-8">
      {jsonLd.map((data, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
      ))}

      <nav aria-label="ব্রেডক্রাম্ব" className="mb-4 text-[15px] text-muted">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="inline-flex min-h-11 items-center hover:text-primary-text">
              হোম
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-4" />
          </li>
          <li aria-current="page" className="font-medium text-text">
            {tool.title}
          </li>
        </ol>
      </nav>

      <header className="mb-6 flex items-start gap-4">
        <ToolIcon name={tool.icon} size="lg" className="hidden sm:inline-flex" />
        <div>
          <h1 className="text-[1.75rem] leading-tight sm:text-4xl">{tool.title}</h1>
          <p className="mt-2 max-w-3xl text-lg text-muted">{intro}</p>
        </div>
      </header>

      {notice ? <div className="mb-6">{notice}</div> : null}

      {children}

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-12">
          <section aria-labelledby="how-heading">
            <h2 id="how-heading" className="mb-4 text-2xl">
              কীভাবে হিসাব হয়
            </h2>
            <div className="space-y-4 text-[17px] leading-[1.8] [&_h3]:mt-6 [&_h3]:text-xl [&_li]:ml-5 [&_li]:list-disc [&_ol>li]:list-decimal [&_strong]:text-text">
              {howItWorks}
            </div>
          </section>

          <section aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="mb-4 text-2xl">
              সাধারণ প্রশ্ন
            </h2>
            <Accordion items={toAccordion(faq)} />
          </section>

          <Disclaimer title="দায়মুক্তি">{disclaimer}</Disclaimer>

          <p className="flex items-center gap-2 text-[15px] text-muted">
            <CalendarClock aria-hidden="true" className="size-4" />
            সর্বশেষ আপডেট: {formatBanglaDate(lastUpdated)}
          </p>
        </div>

        {related.length > 0 ? (
          <aside aria-labelledby="related-heading">
            <h2 id="related-heading" className="mb-4 text-xl">
              আরও ক্যালকুলেটর
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {related.map((t) => (
                <li key={t.slug}>
                  <ToolCard tool={t} />
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
      </div>
    </main>
  );
}
