import { describe, expect, it } from "vitest";
import { calculateZakat, computeNisabAmount, GOLD_NISAB_VORI, SILVER_NISAB_VORI } from "./zakat";

describe("computeNisabAmount", () => {
  it("computes silver nisab (52.5 ভরি) and gold nisab (7.5 ভরি)", () => {
    expect(computeNisabAmount("silver", 0, 2_000)).toBe(SILVER_NISAB_VORI * 2_000);
    expect(computeNisabAmount("gold", 120_000, 0)).toBe(GOLD_NISAB_VORI * 120_000);
  });

  it("throws when selected standard price is missing", () => {
    expect(() => computeNisabAmount("silver", 120_000, 0)).toThrow();
    expect(() => computeNisabAmount("gold", 0, 2_000)).toThrow();
  });
});

describe("calculateZakat", () => {
  it("computes 2.5% zakat when net wealth >= nisab", () => {
    const res = calculateZakat({
      cash: 50_000,
      bankBalance: 150_000,
      goldVori: 2,
      silverVori: 10,
      goldPricePerVori: 100_000,
      silverPricePerVori: 2_000,
      businessInventory: 80_000,
      receivables: 20_000,
      debtsDue: 20_000,
      nisabStandard: "silver",
    });

    // Gold: 200k, Silver: 20k, Cash+Bank+Inv+Rec: 300k => totalAssets 520k, netWealth 500k
    expect(res.totalAssets).toBe(520_000);
    expect(res.netWealth).toBe(500_000);
    expect(res.nisabAmount).toBe(105_000); // 52.5 * 2000
    expect(res.isEligible).toBe(true);
    expect(res.zakatPayable).toBeCloseTo(12_500, 6);
  });

  it("marks not eligible when net wealth < nisab", () => {
    const res = calculateZakat({
      cash: 50_000,
      bankBalance: 0,
      goldVori: 0,
      silverVori: 0,
      goldPricePerVori: 100_000,
      silverPricePerVori: 2_000,
      businessInventory: 0,
      receivables: 0,
      debtsDue: 10_000,
      nisabStandard: "silver",
    });
    expect(res.netWealth).toBe(40_000);
    expect(res.isEligible).toBe(false);
    expect(res.zakatPayable).toBe(0);
  });

  it("switches eligibility when gold nisab standard is selected", () => {
    const res = calculateZakat({
      cash: 200_000,
      bankBalance: 0,
      goldVori: 0,
      silverVori: 0,
      goldPricePerVori: 100_000, // nisab = 750,000
      silverPricePerVori: 2_000,
      businessInventory: 0,
      receivables: 0,
      debtsDue: 0,
      nisabStandard: "gold",
    });
    expect(res.nisabAmount).toBe(750_000);
    expect(res.isEligible).toBe(false);
    expect(res.zakatPayable).toBe(0);
  });

  it("requires gold price when goldVori > 0", () => {
    expect(() =>
      calculateZakat({
        cash: 100_000,
        bankBalance: 0,
        goldVori: 1,
        silverVori: 0,
        goldPricePerVori: 0,
        silverPricePerVori: 2_000,
        businessInventory: 0,
        receivables: 0,
        debtsDue: 0,
        nisabStandard: "silver",
      }),
    ).toThrow();
  });
});
