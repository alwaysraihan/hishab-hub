import { describe, expect, it } from "vitest";
import { validateNumber } from "./validate";

const rule = { label: "পরিমাণ" };

describe("validateNumber", () => {
  it("accepts Bangla and English digits", () => {
    expect(validateNumber("১২৩", rule)).toEqual({ ok: true, value: 123 });
    expect(validateNumber("1,000", rule)).toEqual({ ok: true, value: 1000 });
  });
  it("treats empty as null unless required", () => {
    expect(validateNumber("", rule)).toEqual({ ok: true, value: null });
    const r = validateNumber("", { ...rule, required: true });
    expect(r.ok).toBe(false);
  });
  it("rejects NaN, negatives, zero when disallowed, huge numbers, decimals for integers", () => {
    expect(validateNumber("abc", rule).ok).toBe(false);
    expect(validateNumber("-5", rule).ok).toBe(false);
    expect(validateNumber("0", { ...rule, allowZero: false }).ok).toBe(false);
    expect(validateNumber("1e20", rule).ok).toBe(false);
    expect(validateNumber("99999999999999999", rule).ok).toBe(false);
    expect(validateNumber("2.5", { ...rule, integer: true }).ok).toBe(false);
    expect(validateNumber("150", { ...rule, max: 100 }).ok).toBe(false);
  });
  it("returns Bangla messages", () => {
    const r = validateNumber("-1", rule);
    if (r.ok) throw new Error("expected error");
    expect(r.error).toContain("পরিমাণ");
  });
});
