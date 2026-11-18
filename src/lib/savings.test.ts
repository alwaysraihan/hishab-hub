import { describe, expect, it } from "vitest";
import { calculateDps, calculateFdr } from "./savings";

describe("calculateFdr", () => {
  it("computes compound interest accurately for yearly and quarterly compounding", () => {
    const yearly = calculateFdr(100_000, 1, 10, "yearly");
    expect(yearly.maturityAmount).toBeCloseTo(110_000, 6);
    expect(yearly.totalProfit).toBeCloseTo(10_000, 6);

    const quarterly = calculateFdr(100_000, 2, 8, "quarterly");
    // 100000 * (1 + 0.02)^8 = 117165.9381
    expect(quarterly.maturityAmount).toBeCloseTo(117165.94, 2);
  });

  it("handles 0% rate", () => {
    const res = calculateFdr(50_000, 3, 0, "monthly");
    expect(res.maturityAmount).toBe(50_000);
    expect(res.totalProfit).toBe(0);
  });

  it("rejects invalid inputs", () => {
    expect(() => calculateFdr(0, 1, 10)).toThrow();
    expect(() => calculateFdr(10_000, -1, 10)).toThrow();
    expect(() => calculateFdr(10_000, 1, -5)).toThrow();
  });
});

describe("calculateDps", () => {
  it("computes monthly compounding equal to standard annuity due", () => {
    // 1 month @ 12% annual = 1% monthly
    const oneMonth = calculateDps(1_000, 1 / 12, 12, "monthly");
    expect(oneMonth.totalDeposited).toBe(1_000);
    expect(oneMonth.maturityAmount).toBeCloseTo(1_010, 6);

    // 5000/month for 5 years (60 months) at 9% quarterly
    const fiveYear = calculateDps(5_000, 5, 9, "quarterly");
    expect(fiveYear.totalDeposited).toBe(300_000);
    expect(fiveYear.totalProfit).toBeGreaterThan(75_000);
    expect(fiveYear.maturityAmount).toBeCloseTo(fiveYear.totalDeposited + fiveYear.totalProfit, 6);
  });

  it("more frequent compounding produces higher maturity for >1 period", () => {
    const y = calculateDps(2_000, 3, 10, "yearly").maturityAmount;
    const q = calculateDps(2_000, 3, 10, "quarterly").maturityAmount;
    const m = calculateDps(2_000, 3, 10, "monthly").maturityAmount;
    expect(m).toBeGreaterThan(q);
    expect(q).toBeGreaterThan(y);
  });

  it("handles 0% interest", () => {
    const res = calculateDps(2_000, 2, 0);
    expect(res.totalDeposited).toBe(48_000);
    expect(res.totalProfit).toBe(0);
    expect(res.maturityAmount).toBe(48_000);
  });

  it("rejects invalid inputs", () => {
    expect(() => calculateDps(0, 2, 8)).toThrow();
    expect(() => calculateDps(1_000, 0, 8)).toThrow();
    expect(() => calculateDps(1_000, 2, -1)).toThrow();
  });
});
