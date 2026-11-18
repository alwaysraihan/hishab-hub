"use client";

import { useId, useRef, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface TabItem {
  id: string;
  label: ReactNode;
}

export interface TabsProps {
  tabs: readonly TabItem[];
  value: string;
  onValueChange: (id: string) => void;
  /** Accessible label for the tab list. */
  label: string;
  /** Panel content for the active tab. */
  children: ReactNode;
  className?: string;
}

/**
 * Accessible tabs (WAI-ARIA pattern): arrow keys / Home / End move between tabs.
 * Only the active panel is rendered.
 */
export function Tabs({ tabs, value, onValueChange, label, children, className }: TabsProps) {
  const baseId = useId();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = -1;
    if (e.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    if (next >= 0) {
      e.preventDefault();
      const tab = tabs[next];
      if (tab) {
        onValueChange(tab.id);
        refs.current[next]?.focus();
      }
    }
  };

  return (
    <div className={className}>
      <div role="tablist" aria-label={label} className="flex gap-1 rounded-2xl border border-border bg-surface-2 p-1">
        {tabs.map((tab, i) => {
          const selected = tab.id === value;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onValueChange(tab.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "min-h-11 flex-1 cursor-pointer rounded-xl px-4 font-semibold transition-colors duration-150",
                selected ? "bg-surface text-primary-text shadow-soft" : "text-muted hover:text-text hover:bg-surface/60",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${value}`}
        className="mt-5"
      >
        {children}
      </div>
    </div>
  );
}
