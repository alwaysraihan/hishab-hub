import { describe, expect, it } from "vitest";
import { calculateFaraid, CONSULT_SCHOLAR_MESSAGE } from "./faraid";

describe("calculateFaraid — verified fixed and residuary cases", () => {
  it("Case 1: Wife (1), 1 Son, 1 Daughter -> Wife 1/8, Son 7/12, Daughter 7/24", () => {
    const res = calculateFaraid({
      estateAmount: 240_000,
      spouseType: "wives",
      wivesCount: 1,
      sons: 1,
      daughters: 1,
      fatherAlive: false,
      motherAlive: false,
      hasOtherHeirs: false,
    });
    if (res.status !== "ok") throw new Error("expected ok");
    const byKey = Object.fromEntries(res.shares.map((s) => [s.key, s]));
    expect(byKey.wives?.fractionText).toBe("1/8");
    expect(byKey.wives?.groupAmount).toBeCloseTo(30_000, 6);
    expect(byKey.sons?.fractionText).toBe("7/12");
    expect(byKey.sons?.groupAmount).toBeCloseTo(140_000, 6);
    expect(byKey.daughters?.fractionText).toBe("7/24");
    expect(byKey.daughters?.groupAmount).toBeCloseTo(70_000, 6);
  });

  it("Case 2: Husband, Father, Mother, 1 Son -> Husband 1/4, Father 1/6, Mother 1/6, Son 5/12", () => {
    const res = calculateFaraid({
      estateAmount: 120_000,
      spouseType: "husband",
      wivesCount: 0,
      sons: 1,
      daughters: 0,
      fatherAlive: true,
      motherAlive: true,
      hasOtherHeirs: false,
    });
    if (res.status !== "ok") throw new Error("expected ok");
    const byKey = Object.fromEntries(res.shares.map((s) => [s.key, s]));
    expect(byKey.husband?.fractionText).toBe("1/4");
    expect(byKey.father?.fractionText).toBe("1/6");
    expect(byKey.mother?.fractionText).toBe("1/6");
    expect(byKey.sons?.fractionText).toBe("5/12");
  });

  it("Case 3: 1 Daughter and Father -> Daughter 1/2, Father 1/2 (1/6 fixed + 1/3 residue)", () => {
    const res = calculateFaraid({
      estateAmount: 100_000,
      spouseType: "none",
      wivesCount: 0,
      sons: 0,
      daughters: 1,
      fatherAlive: true,
      motherAlive: false,
      hasOtherHeirs: false,
    });
    if (res.status !== "ok") throw new Error("expected ok");
    const byKey = Object.fromEntries(res.shares.map((s) => [s.key, s]));
    expect(byKey.daughters?.fractionText).toBe("1/2");
    expect(byKey.father?.fractionText).toBe("1/2");
  });

  it("Case 4: Father and Mother only -> Mother 1/3, Father 2/3", () => {
    const res = calculateFaraid({
      estateAmount: 90_000,
      spouseType: "none",
      wivesCount: 0,
      sons: 0,
      daughters: 0,
      fatherAlive: true,
      motherAlive: true,
      hasOtherHeirs: false,
    });
    if (res.status !== "ok") throw new Error("expected ok");
    const byKey = Object.fromEntries(res.shares.map((s) => [s.key, s]));
    expect(byKey.mother?.fractionText).toBe("1/3");
    expect(byKey.father?.fractionText).toBe("2/3");
  });
});

describe("calculateFaraid — consult scholar cases (no guessing)", () => {
  it("defers when other heirs are present", () => {
    const res = calculateFaraid({
      estateAmount: 100_000,
      spouseType: "none",
      wivesCount: 0,
      sons: 1,
      daughters: 0,
      fatherAlive: false,
      motherAlive: false,
      hasOtherHeirs: true,
    });
    expect(res.status).toBe("consult_scholar");
    if (res.status === "consult_scholar") {
      expect(res.message).toBe(CONSULT_SCHOLAR_MESSAGE);
      expect(res.reason).toBe("other_heirs");
    }
  });

  it("defers when Awl is required (Husband + 2 Daughters + Mother = 1/4 + 2/3 + 1/6 = 13/12)", () => {
    const res = calculateFaraid({
      estateAmount: 100_000,
      spouseType: "husband",
      wivesCount: 0,
      sons: 0,
      daughters: 2,
      fatherAlive: false,
      motherAlive: true,
      hasOtherHeirs: false,
    });
    expect(res.status).toBe("consult_scholar");
    if (res.status === "consult_scholar") {
      expect(res.reason).toBe("awl_required");
      expect(res.message).toBe(CONSULT_SCHOLAR_MESSAGE);
    }
  });

  it("defers when Radd is required (only 1 Daughter and Mother, no asaba)", () => {
    const res = calculateFaraid({
      estateAmount: 100_000,
      spouseType: "none",
      wivesCount: 0,
      sons: 0,
      daughters: 1,
      fatherAlive: false,
      motherAlive: true,
      hasOtherHeirs: false,
    });
    expect(res.status).toBe("consult_scholar");
    if (res.status === "consult_scholar") {
      expect(res.reason).toBe("radd_required");
    }
  });

  it("defers on Umariyyatayn (Spouse + Father + Mother, no children)", () => {
    const res = calculateFaraid({
      estateAmount: 100_000,
      spouseType: "husband",
      wivesCount: 0,
      sons: 0,
      daughters: 0,
      fatherAlive: true,
      motherAlive: true,
      hasOtherHeirs: false,
    });
    expect(res.status).toBe("consult_scholar");
    if (res.status === "consult_scholar") {
      expect(res.reason).toBe("umariyyatayn_case");
    }
  });
});
