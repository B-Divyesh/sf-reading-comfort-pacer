# Handoff — polish round 3

Final product commit: `83518da` (`fix: avoid focus ring on cold demo entry`). Earlier repair commit: `87bc675` (`fix: complete site accessibility polish`). Both are pushed to `origin/main`.

## Completed work

- Fixed F-3-1/F-2-3: the Privacy contact link now has a 44 × 44 px inline target. The `touch-targets` claim measures every visible link and button on home, demo, Privacy, Terms, and a real unknown route at 390 × 844 and 1440 × 900.
- Fixed F-3-2: the demo’s live text is a valid `role="status"` child of a labelled `<aside>`, not an invalid role on `<aside>`. The `accessible-demo` claim requires a completely clean Axe result.
- Removed the direct-entry demo heading focus ring. In-site navigation and demo state changes retain heading focus; cold `/demo/?demo=1` does not show it.
- Preserved and reverified every prior repair: direct first-screen wording, isolated demo namespace/banner/reset/exit, claims registry, metadata, routing/focus/404, legal links, privacy, download package, mobile layout, and the topographic-cartography identity.
- Updated the catalog description: “Take screen breaks after a natural stopping point with a browser reminder.”

## Verification

- Fresh remote clone `/tmp/reading-comfort-pacer-polish3-final-clean`: `npm ci`, then all 21 exact `.factory/claims.json` commands individually. Pass record: `.factory/evidence/polish-3/clean-claim-results.json`.
- `npm run check`: passed typecheck, lint, 18 unit tests, and production build.
- `npm run test:e2e -- --workers=1`: 25/25 passed, including extension, demo, Axe, metadata, privacy, routes, mobile, and all claims.
- Deployed with `/opt/fleet/lib/deploy-static.sh reading-comfort-pacer dist/site`; final deployment ID `8d6659f5-47b5-43aa-a380-81c12719241c`.
- Live <https://reading-comfort-pacer.sociobot.in> cold check passed via `/opt/fleet/lib/verify-url.sh`; evidence: `.factory/evidence/polish-3/verify.json` and screenshots.
- Final live audit covered home, demo, Privacy, Terms, and a real unknown route in light/dark at 390 and 1440 px: zero Axe violations, all controls ≥44px, no overflow, one h1/main, same-origin requests, and no application errors. Evidence: `.factory/evidence/polish-3/live-audit.json`.
- Live demo sentinel/start/finish/reset/exit passed: only `demo:pacer` changed; the real sentinel remained intact and exit removed demo data. Evidence: `live-audit.json`.
- The product makes no offline-reload promise. Its already-loaded demo still starts a distance break with the browser context offline; evidence: `live-offline-demo.json`.
- All seven discovered links returned HTTP 200; the deployed ZIP SHA-256 equals the local build; production CSP/cache/404 headers are in `live-links.json` and `live-headers-integrity.json`.
- Mobile Lighthouse: performance 100, accessibility 100, LCP 1.1 s, CLS 0.04. Evidence: `lighthouse-mobile.json`.

## Run and deploy

```sh
npm ci
npm run check
npm run test:e2e -- --workers=1
npm run build:site
/opt/fleet/lib/deploy-static.sh reading-comfort-pacer dist/site
```

The demo entry is `/demo/?demo=1`; see `.factory/demo.md`. The static deployment root is `dist/site/`.

## Known gaps

None. The browser’s expected network-level console message for a deliberately requested HTTP-404 route is excluded from the application-error audit; the designed product 404 itself passed.
