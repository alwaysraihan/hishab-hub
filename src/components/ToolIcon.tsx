import { HandCoins, HeartHandshake, LandPlot, PiggyBank, ReceiptText, Scale, type LucideIcon } from "lucide-react";
import type { ToolIconName } from "@/data/tools";
import { cn } from "@/lib/cn";

const ICONS: Record<ToolIconName, LucideIcon> = {
  land: LandPlot,
  emi: HandCoins,
  savings: PiggyBank,
  zakat: HeartHandshake,
  tax: ReceiptText,
  faraid: Scale,
};

/** Distinct icon for each tool, shown in a soft rounded tile. */
export function ToolIcon({ name, className, size = "md" }: { name: ToolIconName; className?: string; size?: "sm" | "md" | "lg" }) {
  const Icon = ICONS[name];
  const box = size === "lg" ? "size-14 rounded-2xl" : size === "sm" ? "size-9 rounded-xl" : "size-12 rounded-2xl";
  const icon = size === "lg" ? "size-7" : size === "sm" ? "size-5" : "size-6";
  return (
    <span aria-hidden="true" className={cn("inline-flex shrink-0 items-center justify-center bg-primary-soft text-primary-text", box, className)}>
      <Icon className={icon} strokeWidth={2} />
    </span>
  );
}
