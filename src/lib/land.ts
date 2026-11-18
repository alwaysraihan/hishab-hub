/**
 * Land area conversion for Bangladesh.
 *
 * Fixed facts (given in the project brief):
 *   1 শতক (decimal) = 435.6 sq ft
 *   1 একর = 100 শতক
 *   1 বর্গমিটার = 10.7639 sq ft
 *   1 অযুতাংশ = 0.01 শতক
 * কাঠা and বিঘা vary by region, so they are passed in via `LandConfig`.
 */

export type LandUnit = "shotok" | "katha" | "bigha" | "acre" | "sqft" | "sqm" | "ojutangsho";

export const LAND_UNITS: readonly LandUnit[] = ["shotok", "katha", "bigha", "acre", "sqft", "sqm", "ojutangsho"];

export const LAND_UNIT_LABELS: Record<LandUnit, string> = {
  shotok: "শতক (ডেসিমেল)",
  katha: "কাঠা",
  bigha: "বিঘা",
  acre: "একর",
  sqft: "বর্গফুট",
  sqm: "বর্গমিটার",
  ojutangsho: "অযুতাংশ",
};

/** Short unit labels for input suffixes. */
export const LAND_UNIT_SHORT: Record<LandUnit, string> = {
  shotok: "শতক",
  katha: "কাঠা",
  bigha: "বিঘা",
  acre: "একর",
  sqft: "বর্গফুট",
  sqm: "বর্গমিটার",
  ojutangsho: "অযুতাংশ",
};

export const SQFT_PER_SHOTOK = 435.6;
export const SHOTOK_PER_ACRE = 100;
export const SQFT_PER_SQM = 10.7639;
export const SHOTOK_PER_OJUTANGSHO = 0.01;

/** Region-dependent sizes of কাঠা and বিঘা. */
export interface LandConfig {
  /** Square feet in one কাঠা. */
  sqftPerKatha: number;
  /** কাঠা in one বিঘা. */
  kathaPerBigha: number;
}

/** Default preset from the brief: 1 কাঠা = 720 sq ft, 1 বিঘা = 20 কাঠা. Needs human verification per region. */
export const DEFAULT_LAND_CONFIG: LandConfig = { sqftPerKatha: 720, kathaPerBigha: 20 };

/** Returns true if the config has positive, finite numbers. */
export function isValidLandConfig(cfg: LandConfig): boolean {
  return (
    Number.isFinite(cfg.sqftPerKatha) &&
    Number.isFinite(cfg.kathaPerBigha) &&
    cfg.sqftPerKatha > 0 &&
    cfg.kathaPerBigha > 0
  );
}

/** Square feet contained in one of the given unit. */
export function sqftPerUnit(unit: LandUnit, cfg: LandConfig = DEFAULT_LAND_CONFIG): number {
  switch (unit) {
    case "sqft":
      return 1;
    case "shotok":
      return SQFT_PER_SHOTOK;
    case "acre":
      return SQFT_PER_SHOTOK * SHOTOK_PER_ACRE;
    case "sqm":
      return SQFT_PER_SQM;
    case "ojutangsho":
      return SQFT_PER_SHOTOK * SHOTOK_PER_OJUTANGSHO;
    case "katha":
      return cfg.sqftPerKatha;
    case "bigha":
      return cfg.sqftPerKatha * cfg.kathaPerBigha;
  }
}

/** Converts `value` in `from` units into the target unit. */
export function convertLandUnit(value: number, from: LandUnit, to: LandUnit, cfg: LandConfig = DEFAULT_LAND_CONFIG): number {
  return (value * sqftPerUnit(from, cfg)) / sqftPerUnit(to, cfg);
}

/** Converts a value to every supported unit at once. Throws on an invalid config or negative/NaN value. */
export function convertLandAll(value: number, from: LandUnit, cfg: LandConfig = DEFAULT_LAND_CONFIG): Record<LandUnit, number> {
  if (!Number.isFinite(value) || value < 0) throw new RangeError("value must be a non-negative finite number");
  if (!isValidLandConfig(cfg)) throw new RangeError("invalid land config");
  const sqft = value * sqftPerUnit(from, cfg);
  const out = {} as Record<LandUnit, number>;
  for (const unit of LAND_UNITS) out[unit] = sqft / sqftPerUnit(unit, cfg);
  return out;
}
