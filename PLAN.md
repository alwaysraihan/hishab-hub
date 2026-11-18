# Hishab Hub (হিসাব হাব) — Build Plan

If interrupted: read this file first and continue from the first unchecked item.

## Phases

- [x] 1. Project setup, config, Vitest, PLAN.md
- [ ] 2. Design system tokens + ui components + /design page
- [ ] 3. Digits, format utilities + tests
- [ ] 4. Layout: header, footer, dark mode, digit toggle, tool registry
- [ ] 5. Home page + search
- [ ] 6. CalculatorLayout template
- [ ] 7. Jomi converter
- [ ] 8. Loan EMI
- [ ] 9. DPS / FDR
- [ ] 10. Zakat
- [ ] 11. Income tax (config placeholders only)
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
- "এলাকা" default preset for land: 1 কাঠা = 720 বর্গফুট, 1 বিঘা = 20 কাঠা (as given in the brief).
- Zakat: 1 ভরি is treated as one unit; user enters price per ভরি, so no gram conversion is needed.
- DPS: deposits are made at the start of each month; interest is credited at each compounding period on the
  balance (monthly deposits earn simple interest within a period until credited). This is an estimate.
- Gold/silver nisab thresholds (7.5 / 52.5 ভরি) are taken from the brief, not from memory.
- Static export cannot generate dynamic OG images at runtime, so a static SVG + PNG OG image is placed in /public.

## Needs human verification

(filled during phases 7, 11, 12)
