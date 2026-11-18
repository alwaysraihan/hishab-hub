import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface AccordionItem {
  question: string;
  answer: ReactNode;
}

export interface AccordionProps {
  items: readonly AccordionItem[];
  className?: string;
  /** Heading level for questions (default h3), for correct document outline. */
  headingLevel?: "h3" | "h4";
}

/**
 * FAQ accordion built on native <details>/<summary>: keyboard accessible and works without JavaScript.
 */
export function Accordion({ items, className, headingLevel = "h3" }: AccordionProps) {
  const Heading = headingLevel;
  return (
    <div className={cn("divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface", className)}>
      {items.map((item) => (
        <details key={item.question} className="group">
          <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 px-5 py-3 transition-colors duration-150 hover:bg-surface-2 focus-visible:-outline-offset-3">
            <Heading className="text-[17px] font-semibold">{item.question}</Heading>
            <ChevronDown
              aria-hidden="true"
              className="size-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
            />
          </summary>
          <div className="px-5 pb-5 text-muted">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}
