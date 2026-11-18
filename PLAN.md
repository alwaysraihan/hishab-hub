# Hishab Hub (à¦¹à¦¿à¦¸à¦¾à¦¬ à¦¹à¦¾à¦¬) â€” Build Plan

If interrupted: read this file first and continue from the first unchecked item.

## Phases

- [x] 1. Project setup, config, Vitest, PLAN.md
- [x] 2. Design system tokens + ui components + /design page
- [x] 3. Digits, format utilities + tests
- [x] 4. Layout: header, footer, dark mode, digit toggle, tool registry
- [x] 5. Home page + search
- [x] 6. CalculatorLayout template
- [x] 7. Jomi converter
- [x] 8. Loan EMI
- [x] 9. DPS / FDR
- [x] 10. Zakat
- [x] 11. Income tax (config placeholders only)
- [x] 12. Faraid (flagged off by default)
- [x] 13. Static pages (about, privacy, disclaimer, 404)
- [x] 14. SEO (meta, JSON-LD, sitemap, robots, OG image)
- [x] 15. Quality pass (mobile, a11y, contrast, performance, validation)
- [x] 16. Cloudflare config + DEPLOY.md, delete /design page, final build, push

## Assumptions

- GitHub CLI (`gh`) is not installed on the build machine and no git remote exists, so commits are made
  locally on `main`. Push with `git remote add origin <url> && git push -u origin main` (or install `gh` and run
  `gh repo create hishab-hub --public --source=. --remote=origin --push`).
- Tailwind CSS v4 (CSS-first config) is used; dark mode uses the class strategy via `@custom-variant dark`.
- Site URL defaults to `https://hishab-hub.workers.dev` in `src/config/site.ts` and can be overridden with
  `NEXT_PUBLIC_SITE_URL` at build time.
- "à¦à¦²à¦¾à¦•à¦¾" default preset for land: 1 à¦•à¦¾à¦ à¦¾ = 720 à¦¬à¦°à§à¦—à¦«à§à¦Ÿ, 1 à¦¬à¦¿à¦˜à¦¾ = 20 à¦•à¦¾à¦ à¦¾ (as given in the brief).
- Zakat: 1 à¦­à¦°à¦¿ is treated as one unit; user enters price per à¦­à¦°à¦¿, so no gram conversion is needed.
- DPS: deposits are made at the start of each month; interest is credited at each compounding period on the
  balance (monthly deposits earn simple interest within a period until credited). This is an estimate.
- Gold/silver nisab thresholds (7.5 / 52.5 à¦­à¦°à¦¿) are taken from the brief, not from memory.
- Static export cannot generate dynamic OG images at runtime, so a static SVG + PNG OG image is placed in /public.

## Needs human verification

### Land (জমি) presets — `src/data/land-presets.ts`, `src/lib/land.ts`
- [ ] Default কাঠা/বিঘা preset (1 কাঠা = 720 বর্গফুট, 1 বিঘা = 20 কাঠা) — taken from the brief; confirm it is
      the right default for the target audience.
- [ ] Add verified regional presets (district-wise কাঠা/বিঘা sizes) from official land-office/survey sources.
      Currently only "default" and "custom" exist; no regional values were invented.

### Income Tax config — `src/data/tax-config.ts`
- [ ] Fill `taxYear`, `taxFreeLimitByCategory`, `slabs`, `minimumTax`, `investmentRebateRules`, `sourceUrl`, and
      `lastUpdated` from the official NBR Income Tax Paripatra / Finance Act. Until filled, `/income-tax-calculator/`
      shows the banner `"কর হার হালনাগাদ করা হচ্ছে"` and disables calculation.

### Faraid (ফারায়েজ) rules & test cases — `src/lib/faraid.ts`, `src/lib/faraid.test.ts`
`enabled: false` is set in `src/data/tools.ts` so Faraid is hidden from navigation, home cards, search, and sitemap
until an Islamic scholar verifies the following implemented rules and test cases:
- [ ] Supported heirs only: husband or wives (1..4), sons, daughters, father, mother. Any other heir combination,
      or any case requiring Awl, Radd, or Umariyyatayn (spouse + both parents + no children), returns
      `"এই ক্ষেত্রে আলেম বা আইনজীবীর পরামর্শ নিন"` without calculating.
- [ ] Fixed shares implemented:
      - Husband: 1/2 (no children) or 1/4 (with children)
      - Wives (shared equally among 1..4): 1/4 (no children) or 1/8 (with children)
      - Mother: 1/3 (no children) or 1/6 (with children)
      - Father: 1/6 fixed when children exist; plus residue when no sons exist
      - Daughters (when no sons): 1/2 for 1 daughter; 2/3 shared equally for 2+ daughters
- [ ] Residuary (Asaba) rules implemented:
      - When sons >= 1: sons and daughters share residue in 2:1 male-to-female ratio
      - When sons == 0 and father is alive: father takes residue (in addition to 1/6 fixed if daughters exist)
- [ ] Test cases in `src/lib/faraid.test.ts` to review:
      1. Wife (1), 1 Son, 1 Daughter -> Wife 1/8, Son 7/12, Daughter 7/24
      2. Husband, Father, Mother, 1 Son -> Husband 1/4, Father 1/6, Mother 1/6, Son 5/12
      3. 1 Daughter, Father -> Daughter 1/2, Father 1/2 (1/6 fixed + 1/3 residue)
      4. Father, Mother (no spouse, no children) -> Mother 1/3, Father 2/3
      5. Husband + 2 Daughters + Mother (sum 13/12 -> Awl) -> shows consult message
      6. 1 Daughter + Mother only (sum 2/3, no asaba -> Radd) -> shows consult message
      7. Husband + Father + Mother, no children (Umariyyatayn) -> shows consult message
