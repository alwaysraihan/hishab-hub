import { describe, expect, it } from "vitest";
import { normaliseQuery, searchTools } from "./search";
import { ENABLED_TOOLS, TOOLS } from "@/data/tools";

describe("normaliseQuery", () => {
  it("lowercases and trims punctuation", () => {
    expect(normaliseQuery("  DPS / FDR ")).toBe("dps fdr");
    expect(normaliseQuery("১২৩")).toBe("123");
  });
});

describe("searchTools", () => {
  it("returns nothing for empty query", () => {
    expect(searchTools(TOOLS, "   ")).toEqual([]);
  });
  it("matches Bangla keywords", () => {
    expect(searchTools(ENABLED_TOOLS, "কাঠা")[0]?.slug).toBe("jomi-converter");
    expect(searchTools(ENABLED_TOOLS, "কিস্তি")[0]?.slug).toBe("loan-emi-calculator");
    expect(searchTools(ENABLED_TOOLS, "যাকাত")[0]?.slug).toBe("zakat-calculator");
  });
  it("matches English keywords case-insensitively", () => {
    expect(searchTools(ENABLED_TOOLS, "EMI")[0]?.slug).toBe("loan-emi-calculator");
    expect(searchTools(ENABLED_TOOLS, "fdr")[0]?.slug).toBe("dps-fdr-calculator");
    expect(searchTools(ENABLED_TOOLS, "bigha")[0]?.slug).toBe("jomi-converter");
  });
  it("requires all words to match", () => {
    expect(searchTools(ENABLED_TOOLS, "zakat bigha")).toEqual([]);
  });
  it("does not return disabled tools when searching the enabled list", () => {
    expect(searchTools(ENABLED_TOOLS, "faraid")).toEqual([]);
  });
});
