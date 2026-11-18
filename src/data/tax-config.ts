/**
 * Income Tax Configuration for Bangladesh (NBR).
 *
 * IMPORTANT: No tax slab, rate, rebate, or limit is written from memory.
 * Fill every `null` (TODO) placeholder below from the official National Board of Revenue (NBR)
 * Finance Act / Income Tax Paripatra before enabling live tax calculation.
 */

export type TaxpayerCategory =
  | "general"
  | "female_or_senior"
  | "disabled"
  | "gazetted_freedom_fighter"
  | "third_gender";

export type LocationZone = "dhaka_chattagram_city" | "other_city_corp" | "outside_city_corp";

export interface TaxSlabConfig {
  /**
   * Width (amount) of this tax bracket in BDT (e.g. next 1,00,000), or `Infinity` for the top bracket.
   * Keep `null` until filled from official NBR circular.
   */
  upTo: number | null;
  /**
   * Tax rate for this slab as a percentage (e.g. 5 for 5%).
   * Keep `null` until filled from official NBR circular.
   */
  rate: number | null;
}

export interface InvestmentRebateRulesConfig {
  /** Percentage of taxable income allowed as rebateable ceiling. Fill from official NBR circular. */
  taxableIncomeRatePercent: number | null;
  /** Percentage of eligible actual investment allowed as rebate. Fill from official NBR circular. */
  eligibleInvestmentRatePercent: number | null;
  /** Absolute maximum rebate cap in BDT. Fill from official NBR circular. */
  maxRebateCapBdt: number | null;
}

export interface TaxConfig {
  /** Assessment / tax year label in Bangla. Fill from official NBR circular. */
  taxYear: string | null;
  /** Tax-free annual income threshold (BDT) for each taxpayer category. Fill from official NBR circular. */
  taxFreeLimitByCategory: Record<TaxpayerCategory, number | null>;
  /** Progressive tax slabs above the tax-free threshold. Fill from official NBR circular. */
  slabs: readonly TaxSlabConfig[];
  /** Minimum tax (BDT) when taxable income exceeds the tax-free limit, by location zone. Fill from official NBR circular. */
  minimumTax: Record<LocationZone, number | null>;
  /** Investment tax credit / rebate rules. Fill from official NBR circular. */
  investmentRebateRules: InvestmentRebateRulesConfig;
  /** Official NBR circular URL. Fill from official NBR circular. */
  sourceUrl: string | null;
  /** ISO date when this config was verified against the official NBR circular. */
  lastUpdated: string | null;
}

export const TAXPAYER_CATEGORY_LABELS: Record<TaxpayerCategory, string> = {
  general: "সাধারণ করদাতা",
  female_or_senior: "নারী ও ৬৫+ বছর বয়সী নাগরিক",
  disabled: "প্রতিবন্ধী ব্যক্তি",
  gazetted_freedom_fighter: "গেজেটভুক্ত যুদ্ধাহত মুক্তিযোদ্ধা",
  third_gender: "তৃতীয় লিঙ্গের করদাতা",
};

export const LOCATION_ZONE_LABELS: Record<LocationZone, string> = {
  dhaka_chattagram_city: "ঢাকা ও চট্টগ্রাম সিটি কর্পোরেশন",
  other_city_corp: "অন্যান্য সিটি কর্পোরেশন",
  outside_city_corp: "সিটি কর্পোরেশনের বাইরে",
};

/**
 * Official NBR configuration placeholder.
 * TODO: Fill from official NBR circular before enabling calculation.
 */
export const TAX_CONFIG: TaxConfig = {
  // TODO: Fill from official NBR circular (e.g. "২০২৫-২০২৬")
  taxYear: null,

  taxFreeLimitByCategory: {
    // TODO: Fill from official NBR circular
    general: null,
    // TODO: Fill from official NBR circular
    female_or_senior: null,
    // TODO: Fill from official NBR circular
    disabled: null,
    // TODO: Fill from official NBR circular
    gazetted_freedom_fighter: null,
    // TODO: Fill from official NBR circular
    third_gender: null,
  },

  slabs: [
    // TODO: Fill from official NBR circular
    { upTo: null, rate: null },
  ],

  minimumTax: {
    // TODO: Fill from official NBR circular
    dhaka_chattagram_city: null,
    // TODO: Fill from official NBR circular
    other_city_corp: null,
    // TODO: Fill from official NBR circular
    outside_city_corp: null,
  },

  investmentRebateRules: {
    // TODO: Fill from official NBR circular
    taxableIncomeRatePercent: null,
    // TODO: Fill from official NBR circular
    eligibleInvestmentRatePercent: null,
    // TODO: Fill from official NBR circular
    maxRebateCapBdt: null,
  },

  // TODO: Fill from official NBR circular (e.g. "https://nbr.gov.bd/...")
  sourceUrl: null,
  // TODO: Fill from official NBR circular (ISO date, e.g. "2026-07-01")
  lastUpdated: null,
};
