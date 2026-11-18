/**
 * Zakat calculation based on parameters specified in the project brief:
 *   - Nisab thresholds: 52.5 ভরি silver OR 7.5 ভরি gold (user selectable)
 *   - User enters today's gold/silver price per ভরি (no default prices hardcoded)
 *   - If net wealth >= nisab, zakat = 2.5% of net wealth; else zakat is not obligatory.
 */

export const SILVER_NISAB_VORI = 52.5;
export const GOLD_NISAB_VORI = 7.5;
export const ZAKAT_RATE = 0.025;

export type NisabStandard = "silver" | "gold";

export interface ZakatInputs {
  cash: number;
  bankBalance: number;
  goldVori: number;
  silverVori: number;
  goldPricePerVori: number;
  silverPricePerVori: number;
  businessInventory: number;
  receivables: number;
  debtsDue: number;
  nisabStandard: NisabStandard;
}

export interface ZakatResult {
  goldValue: number;
  silverValue: number;
  totalAssets: number;
  debtsDue: number;
  netWealth: number;
  nisabStandard: NisabStandard;
  nisabAmount: number;
  isEligible: boolean;
  zakatPayable: number;
}

function assertNonNegative(n: number, name: string): void {
  if (!Number.isFinite(n) || n < 0) throw new RangeError(`${name} must be a non-negative finite number`);
}

/**
 * Computes nisab amount from the selected standard and today's price per ভরি.
 * Throws if the required price per ভরি for the chosen standard is <= 0.
 */
export function computeNisabAmount(
  standard: NisabStandard,
  goldPricePerVori: number,
  silverPricePerVori: number,
): number {
  if (standard === "silver") {
    if (!Number.isFinite(silverPricePerVori) || silverPricePerVori <= 0) {
      throw new RangeError("silverPricePerVori must be > 0 for silver nisab");
    }
    return SILVER_NISAB_VORI * silverPricePerVori;
  }
  if (!Number.isFinite(goldPricePerVori) || goldPricePerVori <= 0) {
    throw new RangeError("goldPricePerVori must be > 0 for gold nisab");
  }
  return GOLD_NISAB_VORI * goldPricePerVori;
}

/** Calculates net zakatable wealth, nisab threshold, eligibility and 2.5% zakat payable. */
export function calculateZakat(input: ZakatInputs): ZakatResult {
  assertNonNegative(input.cash, "cash");
  assertNonNegative(input.bankBalance, "bankBalance");
  assertNonNegative(input.goldVori, "goldVori");
  assertNonNegative(input.silverVori, "silverVori");
  assertNonNegative(input.goldPricePerVori, "goldPricePerVori");
  assertNonNegative(input.silverPricePerVori, "silverPricePerVori");
  assertNonNegative(input.businessInventory, "businessInventory");
  assertNonNegative(input.receivables, "receivables");
  assertNonNegative(input.debtsDue, "debtsDue");

  if (input.goldVori > 0 && input.goldPricePerVori <= 0) {
    throw new RangeError("goldPricePerVori must be > 0 when goldVori > 0");
  }
  if (input.silverVori > 0 && input.silverPricePerVori <= 0) {
    throw new RangeError("silverPricePerVori must be > 0 when silverVori > 0");
  }

  const nisabAmount = computeNisabAmount(
    input.nisabStandard,
    input.goldPricePerVori,
    input.silverPricePerVori,
  );

  const goldValue = input.goldVori * input.goldPricePerVori;
  const silverValue = input.silverVori * input.silverPricePerVori;
  const totalAssets =
    input.cash +
    input.bankBalance +
    goldValue +
    silverValue +
    input.businessInventory +
    input.receivables;

  const netWealth = totalAssets - input.debtsDue;
  const isEligible = netWealth >= nisabAmount;
  const zakatPayable = isEligible ? netWealth * ZAKAT_RATE : 0;

  return {
    goldValue,
    silverValue,
    totalAssets,
    debtsDue: input.debtsDue,
    netWealth,
    nisabStandard: input.nisabStandard,
    nisabAmount,
    isEligible,
    zakatPayable,
  };
}
