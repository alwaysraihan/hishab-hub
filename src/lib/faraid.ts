/**
 * Faraid (Islamic Inheritance) limited MVP calculator.
 *
 * IMPORTANT:
 * - Only primary heirs (husband OR wives[1..4], sons, daughters, father, mother) are supported.
 * - If any other relatives exist, or if the heir combination requires Awl (proportional reduction),
 *   Radd (return of residue when no asaba is present), or Umariyyatayn (spouse + both parents with no children),
 *   this function does NOT guess or compute: it returns `{ status: "consult_scholar" }` with the required message
 *   "এই ক্ষেত্রে আলেম বা আইনজীবীর পরামর্শ নিন".
 * - Flagged off by default (`enabled: false` in `src/data/tools.ts`) until verified by a qualified Islamic scholar.
 *   See `PLAN.md` -> "Needs human verification" for the exact rule table and test cases.
 */

export const CONSULT_SCHOLAR_MESSAGE = "এই ক্ষেত্রে আলেম বা আইনজীবীর পরামর্শ নিন";

export type SpouseType = "none" | "husband" | "wives";

export interface FaraidInput {
  estateAmount: number;
  spouseType: SpouseType;
  /** Number of wives (1..4) when spouseType === "wives"; ignored otherwise. */
  wivesCount: number;
  sons: number;
  daughters: number;
  fatherAlive: boolean;
  motherAlive: boolean;
  /** True if the deceased left any other heirs (grandfather, grandmother, siblings, grandchildren, etc.). */
  hasOtherHeirs: boolean;
}

export type HeirKey = "husband" | "wives" | "sons" | "daughters" | "father" | "mother";

export interface HeirShareRow {
  key: HeirKey;
  label: string;
  count: number;
  /** Exact fraction of the total estate for this group (e.g. "1/8", "2/3"). */
  fractionText: string;
  /** Decimal share of the total estate for this group (0..1). */
  groupShare: number;
  /** Decimal share per individual in this group. */
  eachShare: number;
  /** Total monetary amount for this group. */
  groupAmount: number;
  /** Monetary amount per individual in this group. */
  eachAmount: number;
}

export interface FaraidSuccess {
  status: "ok";
  estateAmount: number;
  shares: readonly HeirShareRow[];
}

export interface FaraidConsult {
  status: "consult_scholar";
  reason: "other_heirs" | "no_heirs" | "invalid_wives_count" | "awl_required" | "radd_required" | "umariyyatayn_case";
  message: string;
}

export type FaraidResult = FaraidSuccess | FaraidConsult;

/** Rational fraction helper: n / d in lowest terms. */
interface Frac {
  n: number;
  d: number;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function frac(n: number, d: number): Frac {
  if (n === 0) return { n: 0, d: 1 };
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}

function addFrac(a: Frac, b: Frac): Frac {
  return frac(a.n * b.d + b.n * a.d, a.d * b.d);
}

function subFrac(a: Frac, b: Frac): Frac {
  return frac(a.n * b.d - b.n * a.d, a.d * b.d);
}

function mulFrac(a: Frac, b: Frac): Frac {
  return frac(a.n * b.n, a.d * b.d);
}

function toText(f: Frac): string {
  return f.n === 0 ? "0" : `${f.n}/${f.d}`;
}

function toNumber(f: Frac): number {
  return f.n / f.d;
}

/**
 * Computes fixed shares and residuary (asaba) distribution for supported primary heirs.
 * Defers to `consult_scholar` whenever Awl, Radd, Umariyyatayn, or unsupported heirs arise.
 */
export function calculateFaraid(input: FaraidInput): FaraidResult {
  if (!Number.isFinite(input.estateAmount) || input.estateAmount < 0) {
    throw new RangeError("estateAmount must be a non-negative finite number");
  }
  if (!Number.isInteger(input.sons) || input.sons < 0 || !Number.isInteger(input.daughters) || input.daughters < 0) {
    throw new RangeError("sons and daughters must be non-negative integers");
  }

  if (input.hasOtherHeirs) {
    return { status: "consult_scholar", reason: "other_heirs", message: CONSULT_SCHOLAR_MESSAGE };
  }

  const wivesCount = input.spouseType === "wives" ? input.wivesCount : 0;
  if (input.spouseType === "wives" && (!Number.isInteger(wivesCount) || wivesCount < 1 || wivesCount > 4)) {
    return { status: "consult_scholar", reason: "invalid_wives_count", message: CONSULT_SCHOLAR_MESSAGE };
  }

  const hasHusband = input.spouseType === "husband";
  const hasWives = input.spouseType === "wives" && wivesCount >= 1;
  const hasChildren = input.sons > 0 || input.daughters > 0;
  const totalHeirs =
    (hasHusband ? 1 : 0) +
    wivesCount +
    input.sons +
    input.daughters +
    (input.fatherAlive ? 1 : 0) +
    (input.motherAlive ? 1 : 0);

  if (totalHeirs === 0) {
    return { status: "consult_scholar", reason: "no_heirs", message: CONSULT_SCHOLAR_MESSAGE };
  }

  // Special case: spouse + both parents + no children (Umariyyatayn — mother takes 1/3 of remainder after spouse).
  // Deferred to scholar review rather than simplified.
  if (!hasChildren && (hasHusband || hasWives) && input.fatherAlive && input.motherAlive) {
    return { status: "consult_scholar", reason: "umariyyatayn_case", message: CONSULT_SCHOLAR_MESSAGE };
  }

  // 1. Fixed shares (Ashab al-Furud)
  let husbandFixed = frac(0, 1);
  let wivesFixed = frac(0, 1);
  let daughtersFixed = frac(0, 1);
  let fatherFixed = frac(0, 1);
  let motherFixed = frac(0, 1);

  if (hasHusband) {
    husbandFixed = hasChildren ? frac(1, 4) : frac(1, 2);
  } else if (hasWives) {
    wivesFixed = hasChildren ? frac(1, 8) : frac(1, 4);
  }

  if (input.motherAlive) {
    motherFixed = hasChildren ? frac(1, 6) : frac(1, 3);
  }

  if (input.fatherAlive && hasChildren) {
    // With children, father gets a fixed 1/6 (and if there are only daughters, father also takes any residue).
    fatherFixed = frac(1, 6);
  }

  if (input.sons === 0 && input.daughters > 0) {
    // Without sons, 1 daughter gets fixed 1/2; 2 or more daughters share fixed 2/3.
    daughtersFixed = input.daughters === 1 ? frac(1, 2) : frac(2, 3);
  }

  const totalFixed = addFrac(
    addFrac(addFrac(husbandFixed, wivesFixed), addFrac(daughtersFixed, fatherFixed)),
    motherFixed,
  );

  // If fixed shares exceed 1, Awl is required -> consult scholar.
  if (totalFixed.n > totalFixed.d) {
    return { status: "consult_scholar", reason: "awl_required", message: CONSULT_SCHOLAR_MESSAGE };
  }

  const residue = subFrac(frac(1, 1), totalFixed);

  // 2. Residuary distribution (Asaba)
  let sonsShare = frac(0, 1);
  let daughtersShare = daughtersFixed;
  let fatherShare = fatherFixed;

  if (residue.n > 0) {
    if (input.sons > 0) {
      // Sons (with daughters, if any) take the residue in a 2:1 male-to-female ratio.
      const totalParts = 2 * input.sons + input.daughters;
      sonsShare = mulFrac(residue, frac(2 * input.sons, totalParts));
      if (input.daughters > 0) {
        daughtersShare = mulFrac(residue, frac(input.daughters, totalParts));
      }
    } else if (input.fatherAlive) {
      // No sons: father is the residuary (in addition to his 1/6 fixed share if daughters exist).
      fatherShare = addFrac(fatherFixed, residue);
    } else {
      // Residue remains with no asaba (Radd required, or only spouse present) -> consult scholar.
      return { status: "consult_scholar", reason: "radd_required", message: CONSULT_SCHOLAR_MESSAGE };
    }
  } else if (input.sons > 0) {
    // Sons exist, so daughters had no fixed share; residue cannot be 0 when sons exist under supported heirs,
    // but guard defensively.
    return { status: "consult_scholar", reason: "awl_required", message: CONSULT_SCHOLAR_MESSAGE };
  }

  const rows: HeirShareRow[] = [];
  const pushRow = (key: HeirKey, label: string, count: number, groupFrac: Frac) => {
    if (count <= 0 || groupFrac.n <= 0) return;
    const eachFrac = mulFrac(groupFrac, frac(1, count));
    const groupShare = toNumber(groupFrac);
    const eachShare = toNumber(eachFrac);
    rows.push({
      key,
      label,
      count,
      fractionText: toText(groupFrac),
      groupShare,
      eachShare,
      groupAmount: input.estateAmount * groupShare,
      eachAmount: input.estateAmount * eachShare,
    });
  };

  if (hasHusband) pushRow("husband", "স্বামী", 1, husbandFixed);
  if (hasWives) pushRow("wives", wivesCount === 1 ? "স্ত্রী" : `স্ত্রী (${wivesCount} জন)`, wivesCount, wivesFixed);
  if (input.fatherAlive) pushRow("father", "বাবা", 1, fatherShare);
  if (input.motherAlive) pushRow("mother", "মা", 1, motherFixed);
  if (input.sons > 0) pushRow("sons", input.sons === 1 ? "ছেলে" : `ছেলে (${input.sons} জন)`, input.sons, sonsShare);
  if (input.daughters > 0) {
    pushRow("daughters", input.daughters === 1 ? "মেয়ে" : `মেয়ে (${input.daughters} জন)`, input.daughters, daughtersShare);
  }

  return {
    status: "ok",
    estateAmount: input.estateAmount,
    shares: rows,
  };
}
