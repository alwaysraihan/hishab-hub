"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ENABLED_TOOLS, toolPath } from "@/data/tools";
import { cn } from "@/lib/cn";
import { SearchBox } from "@/components/SearchBox";
import { ToolIcon } from "@/components/ToolIcon";
import { Logo } from "./Logo";
import { DigitToggle, ThemeToggle } from "./Toggles";

/** Sticky site header with nav, search, theme + digit toggles and a mobile menu. */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu on navigation and with Escape.
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="mx-auto flex h-16 max-w-content items-center gap-3 px-4">
        <Logo />

        <nav aria-label="প্রধান মেনু" className="ml-4 hidden xl:block">
          <ul className="flex items-center gap-1">
            {ENABLED_TOOLS.map((tool) => {
              const current = pathname === toolPath(tool);
              return (
                <li key={tool.slug}>
                  <Link
                    href={toolPath(tool)}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "inline-flex min-h-11 items-center rounded-xl px-3 text-[16px] font-medium transition-colors duration-150",
                      current ? "bg-primary-soft text-primary-text" : "text-muted hover:bg-surface-2 hover:text-text",
                    )}
                  >
                    {tool.shortTitle}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <SearchBox className="hidden w-60 lg:block" />
          <div className="hidden sm:block">
            <DigitToggle />
          </div>
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-xl text-text transition-colors duration-150 hover:bg-surface-2 xl:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X aria-hidden="true" className="size-6" /> : <Menu aria-hidden="true" className="size-6" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div id="mobile-menu" className="border-t border-border bg-surface xl:hidden">
          <div className="mx-auto max-w-content space-y-4 px-4 py-4">
            <SearchBox className="lg:hidden" onNavigate={() => setMenuOpen(false)} />
            <nav aria-label="মোবাইল মেনু">
              <ul className="grid gap-1 sm:grid-cols-2">
                {ENABLED_TOOLS.map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      href={toolPath(tool)}
                      onClick={() => setMenuOpen(false)}
                      aria-current={pathname === toolPath(tool) ? "page" : undefined}
                      className="flex min-h-12 items-center gap-3 rounded-xl px-2 font-medium text-text transition-colors duration-150 hover:bg-surface-2"
                    >
                      <ToolIcon name={tool.icon} size="sm" />
                      {tool.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex flex-col gap-2 border-t border-border pt-4 sm:hidden">
              <p className="text-[15px] font-semibold text-muted">সংখ্যা দেখাবে</p>
              <DigitToggle full />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
