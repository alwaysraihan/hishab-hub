import { describe, expect, it } from "vitest";
import { TAX_CONFIG, type TaxConfig } from "@/data/tax-config";
import { calculateIncomeTax, isTaxConfigReady } from "./tax";

/**
 * Small fake config used strictly inside unit tests to verify the progressive tax engine.
 * Real production values in `src/data/tax-config.ts` remain `null` until populated from an official NBR circular.
 */
const FAKE_TEST_CONFIG: TaxConfig = {
  taxYear: "TEST-YEAR",
  taxFreeLimitByCategory: {
    general: 300_000,
    female_or_senior: 350_000,
    disabled: 400_000,
    gazetted_freedom_fighter: 450_000,
    third_gender: 350_000,
  },
  slabs: [
    { upTo: 100_000, rate: 5 },
    { upTo: 300_000, rate: 10 },
    { upTo: Number.POSITIVE_INFINITY, rate: 15 },
  ],
  minimumTax: {
    dhaka_chattagram_city: 5_000,
    other_city_corp: 4_000,
    outside_city_corp: 3_000,
  },
  investmentRebateRules: {
    taxableIncomeRatePercent: 3,
    eligibleInvestmentRatePercent: 15,
    maxRebateCapBdt: 1_000_000,
  },
  sourceUrl: "https://example.test/nbr-circular",
  lastUpdated: "2026-01-01",
};

describe("isTaxConfigReady", () => {
  it("returns false for default placeholder TAX_CONFIG", () => {
    expect(isTaxConfigReady(TAX_CONFIG)).toBe(false);
    const res = calculateIncomeTax(
      { annualTaxableIncome: 500_000, eligibleInvestment: 0, category: "general", zone: "dhaka_chattagram_city" },
      TAX_CONFIG,
    );
    expect(res.status).toBe("config_pending");
  });

  it("returns true for a complete config", () => {
    expect(isTaxConfigReady(FAKE_TEST_CONFIG)).toBe(true);
  });
});

describe("calculateIncomeTax (with fake test config)", () => {
  it("returns 0 tax when income is within tax-free limit", () => {
    const res = calculateIncomeTax(
      { annualTaxableIncome: 300_000, eligibleInvestment: 50_000, category: "general", zone: "dhaka_chattagram_city" },
      FAKE_TEST_CONFIG,
    );
    if (res.status !== "ok") throw new Error("expected ok");
    expect(res.finalTaxPayable).toBe(0);
    expect(res.minimumTaxApplied).toBe(false);
  });

  it("applies minimum tax when taxable income exceeds threshold but computed tax is below minimum", () => {
    const res = calculateIncomeTax(
      { annualTaxableIncome: 320_000, eligibleInvestment: 0, category: "general", zone: "dhaka_chattagram_city" },
      FAKE_TEST_CONFIG,
    );
    if (res.status !== "ok") throw new Error("expected ok");
    // Assessable = 20,000 @ 5% = 1,000 < 5,000 minimum
    expect(res.grossTax).toBe(1_000);
    expect(res.minimumTaxApplied).toBe(true);
    expect(res.finalTaxPayable).toBe(5_000);
  });

  it("calculates progressive slabs and investment rebate", () => {
    const res = calculateIncomeTax(
      { annualTaxableIncome: 800_000, eligibleInvestment: 100_000, category: "general", zone: "other_city_corp" },
      FAKE_TEST_CONFIG,
    );
    if (res.status !== "ok") throw new Error("expected ok");
    // Assessable = 800k - 300k = 500k
    // Slab 1: 100k @ 5% = 5,000
    // Slab 2: 300k @ 10% = 30,000
    // Slab 3: 100k @ 15% = 15,000
    // Gross = 50,000
    expect(res.grossTax).toBe(50_000);
    // Rebate = min(3% of 800k = 24,000, 15% of 100k = 15,000, 1,000,000) = 15,000
    expect(res.investmentRebate).toBe(15_000);
    expect(res.finalTaxPayable).toBe(35_000);
  });
});
