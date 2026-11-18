"use client";

import type { ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { ShareButtons } from "@/components/ui/ShareButtons";

export interface CalculatorPanelsProps {
  /** Input fields. */
  inputs: ReactNode;
  /** Result content (ResultBox etc.). */
  result: ReactNode;
  /** Plain-text summary used by Copy / Share. Null disables the actions (e.g. invalid input). */
  shareText: string | null;
  /** Restores default values. */
  onReset: () => void;
  /** Heading for the input panel. */
  inputsTitle?: string;
  /** Extra content shown below the two panels (e.g. amortization table). */
  below?: ReactNode;
}

/**
 * Two-column calculator body: inputs on the left, sticky result card on the right (desktop);
 * stacked on mobile with the result below the inputs.
 */
export function CalculatorPanels({ inputs, result, shareText, onReset, inputsTitle = "তথ্য দিন", below }: CalculatorPanelsProps) {
  return (
    <>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)]">
        <section aria-labelledby="inputs-heading" className="rounded-2xl border border-border bg-surface p-5 shadow-soft sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 id="inputs-heading" className="text-xl">
              {inputsTitle}
            </h2>
            <Button variant="ghost" size="sm" onClick={onReset}>
              <RotateCcw aria-hidden="true" className="size-4" />
              রিসেট
            </Button>
          </div>
          <div className="space-y-5">{inputs}</div>
        </section>

        <section
          aria-labelledby="result-heading"
          className="rounded-2xl border border-border bg-surface p-5 shadow-soft sm:p-6 lg:sticky lg:top-20"
        >
          <h2 id="result-heading" className="mb-4 text-xl">
            ফলাফল
          </h2>
          <div className="space-y-3">{result}</div>
          <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-5">
            {shareText ? (
              <>
                <CopyButton text={shareText} />
                <ShareButtons text={shareText} />
              </>
            ) : (
              <p className="text-[15px] text-muted">সঠিক তথ্য দিলে ফলাফল কপি ও শেয়ার করতে পারবেন।</p>
            )}
          </div>
        </section>
      </div>
      {below ? <div className="mt-6">{below}</div> : null}
    </>
  );
}

/** Friendly empty state shown in the result card before valid input. */
export function ResultEmpty({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface-2 px-5 py-8 text-center text-muted">{children}</div>
  );
}
