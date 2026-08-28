# Handoff — polish round 4

The release candidate is repaired and deployed. The implementation commit is `63484ce` (`fix: verify offline and motion accessibility`); the static work-order deployment is `311a2b9f-9756-427a-a6fd-47973e8b6423`.

## What changed

- The first screen now gives the required price, privacy, and offline facts: **Free**, **No account or page access**, and **Works offline after install**. Manual installation remains beside the download link.
- Added the `offline-extension` claim. It loads the packaged MV3 extension in a fresh profile, disables network access, starts a ready reminder, completes a distance break, and verifies the next local schedule.
- Expanded `accessible-extension` to tab through every popup, settings, and distance-break control, including radio-arrow navigation. It asserts a visible focus indicator with at least 3:1 contrast in light and dark modes. It also emulates Reduce Motion on the installed distance view and proves the motion control and both looping animations are removed.
- Corrected focus-outline contrast on skip links and primary controls without changing the topographic-cartography visual system.
- Updated the catalog description and copy audit. The catalog sentence is verb-first and 66 characters long.

## Verification

- Fresh clone `/tmp/reading-comfort-pacer-polish4-final-clean.W5RZl8`: `npm ci`, then all 22 exact commands in `.factory/claims.json` independently: pass.
- `npm run check`: pass — TypeScript, lint, 18 unit tests, extension build, static site build, and packaged ZIP.
- `npm run test:e2e -- --workers=1`: pass — 26 browser tests, including all claims, installed-extension behavior, route focus, mobile layout, privacy, and Playwright Axe checks.
- Live factory verifier: pass. See `evidence/polish-4/verify.json`.
- Live cold audit: 20 route/theme/viewport checks, every route had its expected title, one `h1`, one `main`, no overflow, no foreign requests, no app errors, and no undersized visible controls. The intentional HTTP-404 produces the browser's expected network message only. See `evidence/polish-4/live-audit.json`.
- Live Axe: zero violations on `/`, `/demo/?demo=1`, `/privacy/`, `/terms/`, and an unknown route. See `evidence/polish-4/live-axe.json`.
- Live ZIP SHA-256 exactly matches the local package; it is MV3 `1.0.0` with only `storage` and `alarms` permissions. See `evidence/polish-4/live-integrity.json`.
- Live mobile Lighthouse: performance 99, accessibility 100, LCP 1.14 s, CLS 0.068. See `evidence/polish-4/lighthouse-mobile.json`.

## Live evidence

- Landing: `live-home-mobile.png`, `live-home-desktop.png`
- Demo: `live-demo-mobile.png`
- Privacy: `live-privacy-desktop.png`
- Designed 404: `live-404-mobile.png`, `live-404-headers.txt`
- Security/cache headers: `live-headers.txt`, `live-asset-headers.txt`, and `live-zip-headers.txt`

## Run or deploy

```sh
npm ci
npm run check
npm run test:e2e -- --workers=1
npm run build:site
```

Deploy `dist/site/` as the static artifact. The extension folder is `dist/extension/chrome-mv3/`; the downloadable ZIP is under `dist/site/downloads/`.

## Known gaps

None.
