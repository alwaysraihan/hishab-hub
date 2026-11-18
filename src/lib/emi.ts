/**
 * Loan EMI (Equated Monthly Installment) maths.
 *
 *   EMI = P · r · (1 + r)^n / ((1 + r)^n − 1)
 *   where r = annualRate / 12 / 100 and n = number of months.
 * When the rate is 0, EMI = P / n.
 */

export interface AmortizationRow {
  /** 1-based month number */
  month: number;
  emi: number;
  principal: number;
  interest: number;
  /** Outstanding balance after this payment */
  balance: number;
}

export interface EmiResult {
  emi: number;
  totalPayment: number;
  totalInterest: number;
  months: number;
}

function assertInputs(principal: number, annualRate: number, months: number): void {
  if (!Number.isFinite(principal) || principal <= 0) throw new RangeError("principal must be > 0");
  if (!Number.isFinite(annualRate) || annualRate < 0) throw new RangeError("annualRate must be >= 0");
  if (!Number.isInteger(months) || months <= 0) throw new RangeError("months must be a positive integer");
}

/** Monthly installment (unrounded). */
export function calculateEmi(principal: number, annualRate: number, months: number): number {
  assertInputs(principal, annualRate, months);
  const r = annualRate / 12 / 100;
  if (r === 0) return principal / months;
  const pow = Math.pow(1 + r, months);
  return (principal * r * pow) / (pow - 1);
}

/** EMI plus totals. */
export function emiSummary(principal: number, annualRate: number, months: number): EmiResult {
  const emi = calculateEmi(principal, annualRate, months);
  const totalPayment = emi * months;
  return { emi, totalPayment, totalInterest: totalPayment - principal, months };
}

/**
 * Month-by-month schedule. Interest = balance × r; principal = EMI − interest.
 * The final balance is clamped to exactly 0 to remove floating-point dust.
 */
export function amortizationSchedule(principal: number, annualRate: number, months: number): AmortizationRow[] {
  const emi = calculateEmi(principal, annualRate, months);
  const r = annualRate / 12 / 100;
  const rows: AmortizationRow[] = [];
  let balance = principal;
  for (let month = 1; month <= months; month++) {
    const interest = balance * r;
    let principalPart = emi - interest;
    if (month === months) principalPart = balance; // settle any rounding remainder
    balance = Math.max(balance - principalPart, 0);
    if (balance < 1e-6) balance = 0;
    rows.push({ month, emi: principalPart + interest, principal: principalPart, interest, balance });
  }
  return rows;
}

/** Converts a tenure in years or months to whole months. */
export function tenureToMonths(value: number, unit: "years" | "months"): number {
  return unit === "years" ? Math.round(value * 12) : Math.round(value);
}
