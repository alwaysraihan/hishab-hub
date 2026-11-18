import { describe, expect, it } from "vitest";
import { convertLandAll, convertLandUnit, DEFAULT_LAND_CONFIG, isValidLandConfig, sqftPerUnit } from "./land";

describe("land conversions (fixed units)", () => {
  it("5 শতক = 2178 sq ft", () => {
    expect(convertLandUnit(5, "shotok", "sqft")).toBeCloseTo(2178, 10);
  });
  it("1 একর = 100 শতক = 43560 sq ft", () => {
    expect(convertLandUnit(1, "acre", "shotok")).toBeCloseTo(100, 10);
    expect(convertLandUnit(1, "acre", "sqft")).toBeCloseTo(43560, 8);
  });
  it("1 বর্গমিটার = 10.7639 sq ft", () => {
    expect(convertLandUnit(1, "sqm", "sqft")).toBeCloseTo(10.7639, 10);
    expect(convertLandUnit(10.7639, "sqft", "sqm")).toBeCloseTo(1, 10);
  });
  it("1 অযুতাংশ = 0.01 শতক", () => {
    expect(convertLandUnit(1, "ojutangsho", "shotok")).toBeCloseTo(0.01, 12);
    expect(convertLandUnit(1, "shotok", "ojutangsho")).toBeCloseTo(100, 10);
  });
});

describe("regional units (default preset)", () => {
  it("1 কাঠা = 720 sq ft, 1 বিঘা = 20 কাঠা = 14400 sq ft", () => {
    expect(sqftPerUnit("katha")).toBe(720);
    expect(sqftPerUnit("bigha")).toBe(14400);
    expect(convertLandUnit(1, "bigha", "katha")).toBeCloseTo(20, 10);
  });
  it("1 বিঘা ≈ 33.0579 শতক with default preset", () => {
    expect(convertLandUnit(1, "bigha", "shotok")).toBeCloseTo(14400 / 435.6, 10);
  });
  it("uses custom config", () => {
    const cfg = { sqftPerKatha: 1000, kathaPerBigha: 10 };
    expect(convertLandUnit(1, "bigha", "sqft", cfg)).toBe(10000);
    expect(convertLandUnit(2, "katha", "sqft", cfg)).toBe(2000);
  });
});

describe("convertLandAll", () => {
  it("returns all units and round-trips", () => {
    const all = convertLandAll(5, "shotok");
    expect(all.sqft).toBeCloseTo(2178, 10);
    expect(all.shotok).toBeCloseTo(5, 12);
    expect(all.acre).toBeCloseTo(0.05, 12);
    expect(all.ojutangsho).toBeCloseTo(500, 8);
    expect(all.katha).toBeCloseTo(2178 / 720, 10);
    expect(all.sqm).toBeCloseTo(2178 / 10.7639, 8);
  });
  it("handles zero", () => {
    expect(convertLandAll(0, "acre").sqft).toBe(0);
  });
  it("rejects invalid input or config", () => {
    expect(() => convertLandAll(-1, "shotok")).toThrow();
    expect(() => convertLandAll(Number.NaN, "shotok")).toThrow();
    expect(() => convertLandAll(1, "shotok", { sqftPerKatha: 0, kathaPerBigha: 20 })).toThrow();
    expect(isValidLandConfig(DEFAULT_LAND_CONFIG)).toBe(true);
    expect(isValidLandConfig({ sqftPerKatha: 720, kathaPerBigha: -1 })).toBe(false);
  });
});
