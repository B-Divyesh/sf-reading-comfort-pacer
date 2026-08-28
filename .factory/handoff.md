# Reading Comfort Pacer — polish round 1 handoff

## Released repair

Deployed commit `d53a8939947617e50ceb751d2316a13f2fa7569e` to <https://reading-comfort-pacer.sociobot.in>.

This repair resolves every `F-1-1` through `F-1-41` finding in `.factory/review-1.md`. The complete finding-to-change-to-evidence map is in [`.factory/polish-1.md`](polish-1.md).

## What changed

- Rewrote the first screen in plain language for screen workers with tired eyes.
- Added the isolated one-click sample at `/demo/?demo=1` and root `?demo=1`, with a persistent banner, reset, start-real action, and `demo:pacer` storage namespace.
- Added the claims registry, eleven individually runnable claim tests, copy audit, and demo documentation.
- Added complete route metadata, a 1200 × 630 self-hosted social image, apple touch icon, shared navigation/footer, focus announcements, and a designed HTTP 404 route.
- Corrected the final dark-demo banner contrast issue found during live verification.

## Exact verification evidence

Clean clone at `/tmp/reading-comfort-pacer-clean.qi0oER`:

```sh
npm ci
npm run check       # pass: typecheck, lint, 17 unit tests, production build
npm run test:e2e    # pass: 17 Playwright/axe/extension tests
```

All eleven commands in `.factory/claims.json` also passed from that clean clone. `npm audit --audit-level=moderate` reported 0 vulnerabilities. The production build produced `dist/extension`, `dist/site`, and `dist/site/downloads/reading-comfort-pacer-chrome.zip`.

Post-deploy verification:

- `/opt/fleet/lib/verify-url.sh https://reading-comfort-pacer.sociobot.in .factory/evidence/polish-1` passed; `verify.json` records title, `lang=en`, one h1, main, complete image alternatives, and zero console/page errors.
- Cold live Chromium checks covered home, demo, privacy, terms, and an unknown route in light and dark at 390px. All had zero serious/critical axe findings, zero horizontal overflow, and zero third-party requests.
- `https://reading-comfort-pacer.sociobot.in/not-a-real-route` returned HTTP 404 with the product 404 page.
- Live demo isolation was exercised with a seeded real `pacerState` sentinel. Completing and resetting the sample left it unchanged and stored the ready sample only in `demo:pacer`.
- Screenshots and headers are in `.factory/evidence/polish-1/`.

## Run and deploy

```sh
npm ci
npm run check
npm run test:e2e
npm run build
/opt/fleet/lib/deploy-static.sh reading-comfort-pacer dist/site
```

## Known gaps

None. This is a static distribution site plus MV3 extension; no backend, payment, or external account flow is in scope.
