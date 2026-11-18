"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { ENABLED_TOOLS, toolPath } from "@/data/tools";
import { searchTools } from "@/lib/search";
import { cn } from "@/lib/cn";
import { ToolIcon } from "./ToolIcon";

export interface SearchBoxProps {
  /** "hero" = large search on the home page; "compact" = header. */
  variant?: "hero" | "compact";
  className?: string;
  /** Called after navigating to a result (e.g. to close the mobile menu). */
  onNavigate?: () => void;
}

/**
 * Accessible combobox search over the tool registry (Bangla + English keywords).
 * Arrow keys move through results, Enter opens, Escape closes.
 */
export function SearchBox({ variant = "compact", className, onNavigate }: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const router = useRouter();
  const listId = useId();
  const inputId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchTools(ENABLED_TOOLS, query), [query]);
  const showList = open && query.trim().length > 0;

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const go = (path: string) => {
    setOpen(false);
    setQuery("");
    onNavigate?.();
    router.push(path);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      const target = results[active];
      if (target) {
        e.preventDefault();
        go(toolPath(target));
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const hero = variant === "hero";

  return (
    <div ref={wrapRef} className={cn("relative", className)} role="search">
      <label htmlFor={inputId} className="sr-only">
        ক্যালকুলেটর খুঁজুন
      </label>
      <div
        className={cn(
          "flex items-center rounded-xl border border-border bg-surface transition-colors duration-150",
          "hover:border-primary/50 focus-within:border-primary focus-within:ring-3 focus-within:ring-ring/30",
          hero ? "min-h-14 rounded-2xl px-4 shadow-lift" : "min-h-11 px-3",
        )}
      >
        <Search aria-hidden="true" className={cn("shrink-0 text-muted", hero ? "size-6" : "size-5")} />
        <input
          id={inputId}
          type="search"
          data-no-ring=""
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && results[active] ? `${listId}-${results[active].slug}` : undefined}
          autoComplete="off"
          placeholder={hero ? "কী হিসাব করবেন? (জমি, লোন, যাকাত…)" : "খুঁজুন… (যেমন: বিঘা, EMI)"}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className={cn(
            "w-full min-w-0 bg-transparent px-3 text-text outline-none placeholder:text-muted focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden",
            hero ? "text-lg" : "text-base",
          )}
        />
        {query ? (
          <button
            type="button"
            aria-label="খোঁজা মুছুন"
            onClick={() => setQuery("")}
            className="-mr-1 inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted hover:text-text"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        ) : null}
      </div>

      {showList ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="খোঁজার ফলাফল"
          className="absolute inset-x-0 top-full z-40 mt-2 max-h-[70vh] overflow-auto rounded-2xl border border-border bg-surface p-2 shadow-lift"
        >
          {results.length === 0 ? (
            <li className="px-3 py-3 text-muted" role="option" aria-selected={false} aria-disabled="true">
              কোনো ক্যালকুলেটর পাওয়া যায়নি। অন্য শব্দে চেষ্টা করুন — যেমন &quot;জমি&quot; বা &quot;loan&quot;।
            </li>
          ) : (
            results.map((tool, i) => (
              <li key={tool.slug} id={`${listId}-${tool.slug}`} role="option" aria-selected={i === active}>
                <Link
                  href={toolPath(tool)}
                  tabIndex={-1}
                  onClick={() => {
                    setOpen(false);
                    setQuery("");
                    onNavigate?.();
                  }}
                  onMouseEnter={() => setActive(i)}
                  className={cn(
                    "flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 transition-colors duration-150",
                    i === active ? "bg-primary-soft" : "hover:bg-surface-2",
                  )}
                >
                  <ToolIcon name={tool.icon} size="sm" />
                  <span className="min-w-0">
                    <span className="block font-semibold text-text">{tool.title}</span>
                    <span className="block truncate text-[14px] text-muted">{tool.description}</span>
                  </span>
                </Link>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
