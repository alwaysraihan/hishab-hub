import Link from "next/link";
import { cn } from "@/lib/cn";

/** Brand logo: green tile with "হ" + wordmark. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex min-h-11 shrink-0 items-center gap-2.5 rounded-xl", className)}
      aria-label="হিসাব হাব — হোম পেজ"
    >
      <span
        aria-hidden="true"
        className="inline-flex size-10 items-center justify-center rounded-xl bg-primary text-2xl font-bold leading-none text-on-primary shadow-soft"
      >
        হ
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-xl font-bold text-text">হিসাব হাব</span>
        <span className="text-[12px] font-medium tracking-wide text-muted">Hishab Hub</span>
      </span>
    </Link>
  );
}
