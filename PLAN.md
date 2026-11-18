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
- [ ] 12. Faraid (flagged off by default)
- [ ] 13. Static pages (about, privacy, disclaimer, 404)
- [ ] 14. SEO (meta, JSON-LD, sitemap, robots, OG image)
- [ ] 15. Quality pass (mobile, a11y, contrast, performance, validation)
- [ ] 16. Cloudflare config + DEPLOY.md, delete /design page, final build, push

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
