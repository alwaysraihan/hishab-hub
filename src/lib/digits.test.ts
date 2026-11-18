import { describe, expect, it } from "vitest";
import {
  applyDigitMode,
  normaliseNumericText,
  parseLocalizedNumber,
  toBanglaDigits,
  toEnglishDigits,
} from "./digits";

describe("toBanglaDigits", () => {
  it("converts all ten digits", () => {
    expect(toBanglaDigits("0123456789")).toBe("০১২৩৪৫৬৭৮৯");
  });
  it("accepts numbers and keeps separators", () => {
    expect(toBanglaDigits(1234.5)).toBe("১২৩৪.৫");
    expect(toBanglaDigits("৳10,00,000")).toBe("৳১০,০০,০০০");
  });
});

describe("toEnglishDigits", () => {
  it("converts all ten Bangla digits", () => {
    expect(toEnglishDigits("০১২৩৪৫৬৭৮৯")).toBe("0123456789");
  });
  it("leaves non-digits alone", () => {
    expect(toEnglishDigits("৫ শতক")).toBe("5 শতক");
  });
  it("round trips", () => {
    expect(toEnglishDigits(toBanglaDigits("98765.4321"))).toBe("98765.4321");
  });
});

describe("applyDigitMode", () => {
  it("switches by mode", () => {
    expect(applyDigitMode("12", "bn")).toBe("১২");
    expect(applyDigitMode("১২", "en")).toBe("12");
  });
});

describe("parseLocalizedNumber", () => {
  it("parses English and Bangla digits", () => {
    expect(parseLocalizedNumber("1234")).toBe(1234);
    expect(parseLocalizedNumber("১২৩৪")).toBe(1234);
    expect(parseLocalizedNumber("১২.৫")).toBe(12.5);
  });
  it("ignores commas, spaces and the taka sign", () => {
    expect(parseLocalizedNumber("১০,০০,০০০")).toBe(1000000);
    expect(parseLocalizedNumber(" ৳ 5,000 ")).toBe(5000);
    expect(normaliseNumericText("1 000")).toBe("1000");
  });
  it("handles negatives, empty and garbage", () => {
    expect(parseLocalizedNumber("-5")).toBe(-5);
    expect(parseLocalizedNumber("")).toBeNull();
    expect(parseLocalizedNumber("   ")).toBeNull();
    expect(parseLocalizedNumber("abc")).toBeNaN();
    expect(parseLocalizedNumber("1.2.3")).toBeNaN();
    expect(parseLocalizedNumber("1e5")).toBeNaN();
  });
  it("accepts leading/trailing decimal point", () => {
    expect(parseLocalizedNumber(".5")).toBe(0.5);
    expect(parseLocalizedNumber("5.")).toBe(5);
  });
});
