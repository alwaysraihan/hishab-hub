import { describe, expect, it } from "vitest";
import { amortizationSchedule, calculateEmi, emiSummary, tenureToMonths } from "./emi";

describe("calculateEmi", () => {
  it("৳10,00,000 at 10% for 5 years ≈ ৳21,247", () => {
    const emi = calculateEmi(1_000_000, 10, 60);
    expect(Math.round(emi)).toBe(21247);
    expect(emi).toBeCloseTo(21247.04, 1);
  });
  it("handles 0% interest", () => {
    expect(calculateEmi(120_000, 0, 12)).toBe(10_000);
  });
  it("single month = principal plus one month interest", () => {
    expect(calculateEmi(1000, 12, 1)).toBeCloseTo(1010, 8);
  });
  it("rejects invalid input", () => {
    expect(() => calculateEmi(0, 10, 12)).toThrow();
    expect(() => calculateEmi(1000, -1, 12)).toThrow();
    expect(() => calculateEmi(1000, 10, 0)).toThrow();
    expect(() => calculateEmi(1000, 10, 1.5)).toThrow();
    expect(() => calculateEmi(Number.NaN, 10, 12)).toThrow();
  });
});

describe("emiSummary", () => {
  it("computes totals", () => {
    const s = emiSummary(1_000_000, 10, 60);
    expect(s.totalPayment).toBeCloseTo(s.emi * 60, 6);
    expect(Math.round(s.totalInterest)).toBe(274823);
  });
  it("0% has no interest", () => {
    expect(emiSummary(50_000, 0, 10).totalInterest).toBeCloseTo(0, 10);
  });
});

describe("amortizationSchedule", () => {
  it("ends at zero balance and principal sums to loan", () => {
    const rows = amortizationSchedule(1_000_000, 10, 60);
    expect(rows).toHaveLength(60);
    expect(rows.at(-1)?.balance).toBe(0);
    const totalPrincipal = rows.reduce((a, r) => a + r.principal, 0);
    expect(totalPrincipal).toBeCloseTo(1_000_000, 4);
  });
  it("first month interest = P × r", () => {
    const [first] = amortizationSchedule(1_000_000, 12, 12);
    expect(first?.interest).toBeCloseTo(10_000, 8);
  });
});

describe("tenureToMonths", () => {
  it("converts years", () => {
    expect(tenureToMonths(5, "years")).toBe(60);
    expect(tenureToMonths(2.5, "years")).toBe(30);
    expect(tenureToMonths(18, "months")).toBe(18);
  });
});
