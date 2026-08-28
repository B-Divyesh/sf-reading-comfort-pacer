# Polish round 1 — finding map

Candidate repaired from `c03f51ab00fba458769a43a94ab2cf4e1ca752b6`. “Local evidence” below was run after a clean install; live evidence is added after deployment.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Rewrote the first screen with the screen-worker audience and tired-eyes situation. | `tests/e2e/site.spec.ts`; `/` screenshot after deploy |
| F-1-2 | Added `/demo/?demo=1`, `demo:pacer` isolation, banner, reset, and start-real removal. | `@claim:demo-isolation`; `.factory/demo.md` |
| F-1-3 | Added the registry and one tagged test per listed claim. | `.factory/claims.json`; all listed commands |
| F-1-4 | Added the ready-to-confirm sample flow and boundary claim. | `@claim:boundary-wait` |
| F-1-5 | Replaced “Free forever” with “Free to try”; tested no account/payment gate. | `@claim:no-account` |
| F-1-6 | Narrowed the browser wording to Chromium browsers. | `/` copy review |
| F-1-7 | Registered manifest/network privacy evidence. | `@claim:privacy-permissions` |
| F-1-8 | Registered all documented interval choices. | `@claim:interval-options` |
| F-1-9 | Removed untested platform shortcut marketing from public copy. | README/copy audit |
| F-1-10 | Registered break duration and selected-interval scheduling. | `@claim:break-duration` |
| F-1-11 | Registered snooze/disable behavior; removed untested vibration and motion promises from marketing. | `@claim:snooze-disable` |
| F-1-12 | Kept the precise local-storage statement and registered demo isolation/permission evidence. | `@claim:demo-isolation`, `@claim:privacy-permissions` |
| F-1-13 | Replaced the broad accessibility label with concrete controls and demo keyboard/reduced-motion evidence. | `@claim:accessible-demo`; axe suite |
| F-1-14 | Removed the under-a-minute install claim. | `/` copy audit |
| F-1-15 | Registered the generated ZIP link and MV3 manifest identity. | `@claim:download-build` |
| F-1-16 | Registered same-origin demo requests and designed the own 404 route. | `@claim:privacy-permissions`, `@claim:site-routes` |
| F-1-17 | Registered the exact manifest permission boundary. | `@claim:privacy-permissions` |
| F-1-18 | Existing state-machine transitions remain covered; public architecture copy is now plain. | `tests/pacer.test.ts`; `npm test` |
| F-1-19 | Registered restrictive static header configuration. | `@claim:security-headers` |
| F-1-20 | Added provenance/notice evidence and a derived social card; removed the unverifiable “no people or brands” assertion. | `@claim:asset-license` |
| F-1-21 | Added `engines.node`, retained reproducible output paths, and registered build-archive evidence. | `package.json`; `@claim:download-build` |
| F-1-22 | Changed install wording to “current build” and plain Chromium language. | `/` copy audit; `@claim:download-build` |
| F-1-23 | Replaced the behavioral generalization with the direct boundary behavior. | `/` copy audit |
| F-1-24 | Added designed 404 source, static-host override, title, home link, and same-origin assets. | `@claim:site-routes`; live unknown-route check |
| F-1-25 | Added route-specific OG/Twitter metadata, 1200×630 JPEG, apple touch icon, and theme colors. | `site.spec.ts` metadata test |
| F-1-26 | Unified four-link header and product/build/legal footer across every route. | `site.spec.ts`; live route checks |
| F-1-27 | Focuses each route’s h1 and announces it after navigation and back/forward. | `site routes expose complete metadata and move focus after navigation` |
| F-1-28 | Added try-first explanation, three separate facts, and a working sample path immediately below the hero. | `site.spec.ts`; `/demo/?demo=1` |
| F-1-29 | Replaced vague eyebrow with “Pause after a stopping point.” | `.factory/copy-audit.md` |
| F-1-30 | Replaced metaphor headline with the named job. | `.factory/copy-audit.md` |
| F-1-31 | Standardized stopping point, ready reminder, distance break, and extension icon. | `.factory/copy-audit.md` |
| F-1-32 | Rewrote visual-load and reduced-motion jargon in plain words. | `.factory/copy-audit.md` |
| F-1-33 | Replaced the rhetorical distance heading with a descriptive heading. | `/` axe/heading test |
| F-1-34 | Replaced the rhetorical privacy heading with concrete behavior. | `/` copy audit |
| F-1-35 | Replaced “Fully disableable” with “Turn reminders off.” | `/` copy audit |
| F-1-36 | Replaced “Accessible by design” with concrete keyboard/screen-reader wording. | `/` copy audit |
| F-1-37 | Replaced MV3/signed-off/unpacked/waypoint installation jargon. | `/` copy audit |
| F-1-38 | Split the README behavior introduction into short sentences. | `.factory/copy-audit.md` |
| F-1-39 | Removed the untested platform-shortcut README sentence. | README audit |
| F-1-40 | Split and simplified README licensing language. | README audit; `@claim:asset-license` |
| F-1-41 | Moved technology names into a short explanatory section and simplified surrounding language. | README audit |

## Local verification

- `npm ci` — pass, 0 audit vulnerabilities.
- `npm run check` — pass: typecheck, lint, 17 unit tests, production build.
- `npm run test:e2e` — pass: 16 browser tests, including extension, demo, metadata, route focus, mobile, and axe coverage.
- Every command in `.factory/claims.json` — pass.

## Live verification

- Deployed `d53a8939947617e50ceb751d2316a13f2fa7569e` to <https://reading-comfort-pacer.sociobot.in> using the static work-order deploy script.
- Factory `verify-url.sh` passed: HTTP 200, title/lang/one h1/main/alt checks, and no console or page errors. Evidence: `.factory/evidence/polish-1/verify.json` and `live-final-home-no-focus.png`.
- Cold Chromium checks covered `/`, `/demo/?demo=1`, `/privacy/`, `/terms/`, and `/not-a-real-route` at 390px in light and dark. Every page had one h1/main, no overflow, no foreign request, and no serious/critical axe result.
- The unknown route returned HTTP 404 with title `Page not found — Reading Comfort Pacer` and same-origin assets. Evidence: `.factory/evidence/polish-1/404-headers.txt`.
- The live root `/?demo=1` redirected to `/demo/?demo=1`; after complete/reset, a seeded real `pacerState` sentinel remained unchanged while `demo:pacer` returned to the ready sample.
