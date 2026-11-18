/**
 * DPS (monthly installment savings) and FDR (lump-sum fixed deposit) calculations.
 * Pure functions only.
 */

export type CompoundingFrequency = "monthly" | "quarterly" | "half-yearly" | "yearly";

export const COMPOUNDING_OPTIONS: ReadonlyArray<{ value: CompoundingFrequency; label: string }> = [
  { value: "quarterly", label: "ত্রৈমাসিক (৩ মাস অন্তর)" },
  { value: "monthly", label: "মাসিক (প্রতি মাসে)" },
  { value: "half-yearly", label: "ষাণ্মাসিক (৬ মাস অন্তর)" },
  { value: "yearly", label: "বার্ষিক (বছরে ১ বার)" },
];

export const PERIODS_PER_YEAR: Record<CompoundingFrequency, number> = {
  monthly: 12,
  quarterly: 4,
  "half-yearly": 2,
  yearly: 1,
};

export interface DpsResult {
  totalDeposited: number;
  totalProfit: number;
  maturityAmount: number;
  months: number;
}

export interface FdrResult {
  principal: number;
  totalProfit: number;
  maturityAmount: number;
  years: number;
}

function assertPositive(n: number, name: string): void {
  if (!Number.isFinite(n) || n <= 0) throw new RangeError(`${name} must be > 0`);
}
function assertNonNegative(n: number, name: string): void {
  if (!Number.isFinite(n) || n < 0) throw new RangeError(`${name} must be >= 0`);
}

/**
 * DPS maturity calculation:
 * Deposit is placed at the start of every month for `Math.round(years * 12)` months.
 * Each month accrues simple monthly interest (`annualRate / 12 / 100`) on the running principal,
 * and accrued interest is credited (compounded) every `12 / m` months (and any remainder at maturity).
 */
export function calculateDps(
  monthlyDeposit: number,
  years: number,
  annualRate: number,
  compounding: CompoundingFrequency = "quarterly",
): DpsResult {
  assertPositive(monthlyDeposit, "monthlyDeposit");
  assertPositive(years, "years");
  assertNonNegative(annualRate, "annualRate");

  const months = Math.round(years * 12);
  if (months < 1) throw new RangeError("tenure must be at least 1 month");

  const totalDeposited = monthlyDeposit * months;
  if (annualRate === 0) {
    return { totalDeposited, totalProfit: 0, maturityAmount: totalDeposited, months };
  }

  const m = PERIODS_PER_YEAR[compounding];
  const monthsPerPeriod = 12 / m;
  const monthlyRate = annualRate / 100 / 12;

  let balance = 0;
  let accruedInterest = 0;

  for (let month = 1; month <= months; month++) {
    balance += monthlyDeposit;
    accruedInterest += balance * monthlyRate;
    if (month % monthsPerPeriod === 0) {
      balance += accruedInterest;
      accruedInterest = 0;
    }
  }
  const maturityAmount = balance + accruedInterest;
  const totalProfit = Math.max(maturityAmount - totalDeposited, 0);

  return { totalDeposited, totalProfit, maturityAmount, months };
}

/**
 * FDR maturity calculation using standard compound interest:
 *   M = P × (1 + r / m)^(m × t)
 */
export function calculateFdr(
  principal: number,
  years: number,
  annualRate: number,
  compounding: CompoundingFrequency = "quarterly",
): FdrResult {
  assertPositive(principal, "principal");
  assertPositive(years, "years");
  assertNonNegative(annualRate, "annualRate");

  if (annualRate === 0) {
    return { principal, totalProfit: 0, maturityAmount: principal, years };
  }

  const m = PERIODS_PER_YEAR[compounding];
  const r = annualRate / 100;
  const maturityAmount = principal * Math.pow(1 + r / m, m * years);
  const totalProfit = Math.max(maturityAmount - principal, 0);

  return { principal, totalProfit, maturityAmount, years };
}
