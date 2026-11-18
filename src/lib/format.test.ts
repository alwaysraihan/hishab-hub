import { describe, expect, it } from "vitest";
import { formatBanglaDate, formatNumber, formatPercent, formatTaka, groupLakhCrore } from "./format";

describe("groupLakhCrore", () => {
  it("groups in lakh-crore style", () => {
    expect(groupLakhCrore("1")).toBe("1");
    expect(groupLakhCrore("999")).toBe("999");
    expect(groupLakhCrore("1000")).toBe("1,000");
    expect(groupLakhCrore("100000")).toBe("1,00,000");
    expect(groupLakhCrore("1000000")).toBe("10,00,000");
    expect(groupLakhCrore("10000000")).toBe("1,00,00,000");
    expect(groupLakhCrore("123456789")).toBe("12,34,56,789");
  });
});

describe("formatNumber", () => {
  it("uses Bangla digits by default", () => {
    expect(formatNumber(1000000)).toBe("১০,০০,০০০");
  });
  it("supports English digits", () => {
    expect(formatNumber(1000000, { digits: "en" })).toBe("10,00,000");
  });
  it("rounds and trims decimals", () => {
    expect(formatNumber(2178.0, { digits: "en" })).toBe("2,178");
    expect(formatNumber(1.005, { digits: "en", maxDecimals: 1 })).toBe("1");
    expect(formatNumber(1234.567, { digits: "en" })).toBe("1,234.57");
    expect(formatNumber(1234.5, { digits: "en", minDecimals: 2 })).toBe("1,234.50");
  });
  it("handles negatives, zero and non-finite", () => {
    expect(formatNumber(-1500, { digits: "en" })).toBe("-1,500");
    expect(formatNumber(-0.001, { digits: "en" })).toBe("0");
    expect(formatNumber(Number.NaN)).toBe("—");
    expect(formatNumber(Number.POSITIVE_INFINITY)).toBe("—");
  });
});

describe("formatTaka", () => {
  it("adds the taka symbol with 0 decimals by default", () => {
    expect(formatTaka(1000000, { digits: "en" })).toBe("৳10,00,000");
    expect(formatTaka(21247.04, { digits: "en" })).toBe("৳21,247");
    expect(formatTaka(1000000)).toBe("৳১০,০০,০০০");
  });
  it("places minus before symbol", () => {
    expect(formatTaka(-500, { digits: "en" })).toBe("-৳500");
  });
  it("supports decimals", () => {
    expect(formatTaka(99.5, { digits: "en", maxDecimals: 2, minDecimals: 2 })).toBe("৳99.50");
  });
});

describe("formatPercent / formatBanglaDate", () => {
  it("formats percent", () => {
    expect(formatPercent(2.5)).toBe("২.৫%");
  });
  it("formats dates in Bangla", () => {
    expect(formatBanglaDate("2026-11-19")).toBe("১৯ নভেম্বর ২০২৬");
    expect(formatBanglaDate("2026-01-05", "en")).toBe("5 জানুয়ারি 2026");
    expect(formatBanglaDate("bad")).toBe("bad");
  });
});
