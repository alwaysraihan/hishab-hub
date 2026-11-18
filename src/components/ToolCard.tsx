import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Tool } from "@/data/tools";
import { toolPath } from "@/data/tools";
import { ToolIcon } from "./ToolIcon";

/** Card linking to a tool; the whole card is clickable. */
export function ToolCard({ tool, headingLevel = "h3" }: { tool: Tool; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <Link
      href={toolPath(tool)}
      className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-surface p-5 shadow-soft transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift"
    >
      <ToolIcon name={tool.icon} />
      <Heading className="text-lg">{tool.title}</Heading>
      <p className="flex-1 text-[16px] leading-relaxed text-muted">{tool.description}</p>
      <span className="inline-flex items-center gap-1 font-semibold text-primary-text">
        হিসাব করুন
        <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
