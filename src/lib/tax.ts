/**
 * Pure income tax calculation reading strictly from a `TaxConfig` object.
 * If any required config field is still `null` (TODO placeholder), `isTaxConfigReady` returns false
 * and `calculateIncomeTax` returns `{ status: "config_pending" }` instead of guessing numbers.
 */
import type { LocationZone, TaxConfig, TaxpayerCategory } from "@/data/tax-config";

export interface ValidatedTaxSlab {
  upTo: number;
  rate: number;
}

export interface ReadyTaxConfig {
  taxYear: string;
  taxFreeLimitByCategory: Record<TaxpayerCategory, number>;
  slabs: readonly ValidatedTaxSlab[];
  minimumTax: Record<LocationZone, number>;
  investmentRebateRules: {
    taxableIncomeRatePercent: number;
    eligibleInvestmentRatePercent: number;
    maxRebateCapBdt: number;
  };
  sourceUrl: string;
  lastUpdated: string;
}

export interface TaxInput {
  annualTaxableIncome: number;
  eligibleInvestment: number;
  category: TaxpayerCategory;
  zone: LocationZone;
}

export interface SlabBreakdownRow {
  slabAmount: number;
  rate: number;
  tax: number;
}

export interface TaxCalculationSuccess {
  status: "ok";
  taxFreeLimit: number;
  assessableIncome: number;
  grossTax: number;
  investmentRebate: number;
  netTaxBeforeMinimum: number;
  minimumTaxApplied: boolean;
  finalTaxPayable: number;
  breakdown: readonly SlabBreakdownRow[];
}

export interface TaxCalculationPending {
  status: "config_pending";
}

export type TaxCalculationResult = TaxCalculationSuccess | TaxCalculationPending;

/** Type guard verifying that every required field in `TaxConfig` has been populated with valid numbers. */
export function isTaxConfigReady(config: TaxConfig): config is ReadyTaxConfig {
  if (!config.taxYear || !config.sourceUrl || !config.lastUpdated) return false;

  const limits = Object.values(config.taxFreeLimitByCategory);
  if (limits.length === 0 || limits.some((v) => v === null || !Number.isFinite(v) || v < 0)) return false;

  if (config.slabs.length === 0) return false;
  for (const s of config.slabs) {
    if (s.upTo === null || s.rate === null) return false;
    if (!(Number.isFinite(s.upTo) || s.upTo === Number.POSITIVE_INFINITY) || s.upTo <= 0) return false;
    if (!Number.isFinite(s.rate) || s.rate < 0) return false;
  }

  const mins = Object.values(config.minimumTax);
  if (mins.length === 0 || mins.some((v) => v === null || !Number.isFinite(v) || v < 0)) return false;

  const r = config.investmentRebateRules;
  if (
    r.taxableIncomeRatePercent === null ||
    r.eligibleInvestmentRatePercent === null ||
    r.maxRebateCapBdt === null ||
    !Number.isFinite(r.taxableIncomeRatePercent) ||
    !Number.isFinite(r.eligibleInvestmentRatePercent) ||
    !Number.isFinite(r.maxRebateCapBdt) ||
    r.taxableIncomeRatePercent < 0 ||
    r.eligibleInvestmentRatePercent < 0 ||
    r.maxRebateCapBdt < 0
  ) {
    return false;
  }

  return true;
}

/**
 * Calculates progressive income tax, investment rebate, and minimum tax floor using only the passed config.
 */
export function calculateIncomeTax(input: TaxInput, config: TaxConfig): TaxCalculationResult {
  if (!Number.isFinite(input.annualTaxableIncome) || input.annualTaxableIncome < 0) {
    throw new RangeError("annualTaxableIncome must be a non-negative finite number");
  }
  if (!Number.isFinite(input.eligibleInvestment) || input.eligibleInvestment < 0) {
    throw new RangeError("eligibleInvestment must be a non-negative finite number");
  }

  if (!isTaxConfigReady(config)) {
    return { status: "config_pending" };
  }

  const taxFreeLimit = config.taxFreeLimitByCategory[input.category];
  const assessableIncome = Math.max(input.annualTaxableIncome - taxFreeLimit, 0);

  if (assessableIncome === 0) {
    return {
      status: "ok",
      taxFreeLimit,
      assessableIncome: 0,
      grossTax: 0,
      investmentRebate: 0,
      netTaxBeforeMinimum: 0,
      minimumTaxApplied: false,
      finalTaxPayable: 0,
      breakdown: [],
    };
  }

  let remaining = assessableIncome;
  let grossTax = 0;
  const breakdown: SlabBreakdownRow[] = [];

  for (const slab of config.slabs) {
    if (remaining <= 0) break;
    const slabAmount = slab.upTo === Number.POSITIVE_INFINITY ? remaining : Math.min(remaining, slab.upTo);
    const tax = (slabAmount * slab.rate) / 100;
    grossTax += tax;
    breakdown.push({ slabAmount, rate: slab.rate, tax });
    remaining -= slabAmount;
  }

  const rules = config.investmentRebateRules;
  const rawRebate =
    input.eligibleInvestment > 0
      ? Math.min(
          (input.annualTaxableIncome * rules.taxableIncomeRatePercent) / 100,
          (input.eligibleInvestment * rules.eligibleInvestmentRatePercent) / 100,
          rules.maxRebateCapBdt,
        )
      : 0;
  const investmentRebate = Math.min(rawRebate, grossTax);
  const netTaxBeforeMinimum = Math.max(grossTax - investmentRebate, 0);

  const minTax = config.minimumTax[input.zone];
  const minimumTaxApplied = netTaxBeforeMinimum < minTax;
  const finalTaxPayable = Math.max(netTaxBeforeMinimum, minTax);

  return {
    status: "ok",
    taxFreeLimit,
    assessableIncome,
    grossTax,
    investmentRebate,
    netTaxBeforeMinimum,
    minimumTaxApplied,
    finalTaxPayable,
    breakdown,
  };
}
