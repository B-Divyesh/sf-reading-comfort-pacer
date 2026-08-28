# Handoff — adversarial review 3

Reviewed candidate `cae6b313f4314006cd1b21380c523db8cb96e5d0` without modifying product code. The requested report is `.factory/review-3.md`.

## What was verified

- Fresh live cold reads at 390 × 844 and 1440 × 900: job, audience, and first action are clear above the fold.
- Live demo isolation: `demo:pacer` only, reset works, seeded real-data sentinel remains unchanged, exit deletes only demo data, and the loaded sample changes state while offline.
- Every command in `.factory/claims.json` passed from clean clone `/tmp/reading-comfort-pacer-review3.be649h`; a combined confirmation passed 15 browser and 6 unit/build tagged claims.
- Live routes, metadata, 404, deep-link/back focus, link crawl, same-origin request behavior, and serious/critical axe checks were exercised.

## Known gaps

The review verdict is **FAIL** with two findings:

1. The previously reported 44 px target defect remains on the desktop Privacy page: “public issue tracker (external)” measures 219 × 22 px. The target-size claim test only covers the demo route.
2. Axe reports a minor invalid ARIA role: the demo banner is an `<aside role="status">`.

No deployment was performed. Reproduce the review’s local claim checks with:

```sh
npm ci
npm run test:e2e -- --grep '@claim:'
npm test -- -t '@claim:'
npm run build
npm test -- -t '@claim:release-output'
```
