/**
 * Central tool registry — the single source of truth for home cards, search,
 * navigation, related tools and the sitemap.
 */

export type ToolIconName = "land" | "emi" | "savings" | "zakat" | "tax" | "faraid";

export interface Tool {
  /** URL slug (English), e.g. "jomi-converter" -> /jomi-converter/ */
  slug: string;
  /** Full Bangla title */
  title: string;
  /** Short Bangla label for navigation */
  shortTitle: string;
  /** One-line Bangla description for cards */
  description: string;
  /** Search keywords in Bangla and English (lower case for English) */
  keywords: readonly string[];
  icon: ToolIconName;
  /** Feature flag — disabled tools are hidden everywhere and their page is not built into nav/sitemap. */
  enabled: boolean;
}

export const TOOLS: readonly Tool[] = [
  {
    slug: "jomi-converter",
    title: "জমি পরিমাপ কনভার্টার",
    shortTitle: "জমির মাপ",
    description: "শতক, কাঠা, বিঘা, একর, বর্গফুট, বর্গমিটার ও অযুতাংশ — এক ঘরে লিখলেই সব এককে দেখুন।",
    keywords: [
      "জমি",
      "জমির মাপ",
      "শতক",
      "শতাংশ",
      "ডেসিমেল",
      "কাঠা",
      "বিঘা",
      "একর",
      "বর্গফুট",
      "অযুতাংশ",
      "land",
      "jomi",
      "decimal",
      "shotok",
      "katha",
      "bigha",
      "acre",
      "sq ft",
      "square feet",
      "converter",
    ],
    icon: "land",
    enabled: true,
  },
  {
    slug: "loan-emi-calculator",
    title: "লোন ইএমআই ক্যালকুলেটর",
    shortTitle: "লোন ইএমআই",
    description: "লোনের মাসিক কিস্তি, মোট সুদ ও পরিশোধের পূর্ণ তালিকা এক নজরে।",
    keywords: [
      "লোন",
      "ঋণ",
      "কিস্তি",
      "ইএমআই",
      "সুদ",
      "হোম লোন",
      "গাড়ির লোন",
      "পার্সোনাল লোন",
      "loan",
      "emi",
      "installment",
      "interest",
      "home loan",
      "car loan",
    ],
    icon: "emi",
    enabled: true,
  },
  {
    slug: "dps-fdr-calculator",
    title: "ডিপিএস / এফডিআর ক্যালকুলেটর",
    shortTitle: "ডিপিএস / এফডিআর",
    description: "মাসিক সঞ্চয় (ডিপিএস) বা স্থায়ী আমানতে (এফডিআর) মেয়াদ শেষে কত টাকা পাবেন, জেনে নিন।",
    keywords: [
      "ডিপিএস",
      "এফডিআর",
      "সঞ্চয়",
      "আমানত",
      "ফিক্সড ডিপোজিট",
      "মুনাফা",
      "ব্যাংক",
      "dps",
      "fdr",
      "savings",
      "deposit",
      "fixed deposit",
      "profit",
      "bank",
    ],
    icon: "savings",
    enabled: true,
  },
  {
    slug: "zakat-calculator",
    title: "যাকাত ক্যালকুলেটর",
    shortTitle: "যাকাত",
    description: "নগদ টাকা, সোনা-রুপা, ব্যবসার পণ্য থেকে ঋণ বাদ দিয়ে নিসাব অনুযায়ী যাকাত হিসাব করুন।",
    keywords: ["যাকাত", "জাকাত", "নিসাব", "সোনা", "রুপা", "ভরি", "zakat", "zakah", "nisab", "gold", "silver"],
    icon: "zakat",
    enabled: true,
  },
  {
    slug: "income-tax-calculator",
    title: "আয়কর ক্যালকুলেটর",
    shortTitle: "আয়কর",
    description: "বার্ষিক আয় অনুযায়ী আনুমানিক আয়কর হিসাব — এনবিআরের সর্বশেষ হার অনুযায়ী।",
    keywords: ["আয়কর", "ট্যাক্স", "কর", "রিটার্ন", "এনবিআর", "income tax", "tax", "nbr", "return"],
    icon: "tax",
    enabled: true,
  },
  {
    slug: "faraid-calculator",
    title: "ফারায়েজ / উত্তরাধিকার ক্যালকুলেটর",
    shortTitle: "ফারায়েজ",
    description: "স্বামী/স্ত্রী, ছেলে, মেয়ে, বাবা ও মায়ের মধ্যে সম্পত্তি বণ্টনের প্রাথমিক হিসাব।",
    keywords: ["ফারায়েজ", "উত্তরাধিকার", "মিরাস", "সম্পত্তি বণ্টন", "ওয়ারিশ", "faraid", "inheritance", "mirath"],
    icon: "faraid",
    // Hidden until an Islamic scholar verifies the logic (see PLAN.md → Needs human verification).
    enabled: false,
  },
];

/** Tools that are visible on the site. */
export const ENABLED_TOOLS: readonly Tool[] = TOOLS.filter((t) => t.enabled);

/** Finds a tool by slug (including disabled tools). */
export function getTool(slug: string): Tool {
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) throw new Error(`Unknown tool slug: ${slug}`);
  return tool;
}

/** Up to `limit` other enabled tools, used for "related tools". */
export function getRelatedTools(slug: string, limit = 3): Tool[] {
  return ENABLED_TOOLS.filter((t) => t.slug !== slug).slice(0, limit);
}

/** Site path for a tool, matching trailingSlash: true. */
export function toolPath(tool: Pick<Tool, "slug">): string {
  return `/${tool.slug}/`;
}
