# Polish round 3 — complete finding map

Repaired from `cae6b313f4314006cd1b21380c523db8cb96e5d0`; final product commit: `83518da`.

Every historical and current finding was rechecked from a fresh final clone and on the live product. `evidence/polish-3/live-audit.json` records the shared production check: five routes × two viewports × light/dark, one `h1` and `main`, no overflow, same-origin requests, all visible controls at least 44 × 44 px, and zero Axe violations. Bare evidence filenames in the table are under `.factory/evidence/polish-3/`; “live demo” is <https://reading-comfort-pacer.sociobot.in/demo/?demo=1>. The expected browser network message for an intentionally requested HTTP-404 route is not an application error.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept direct job/audience/tired-eyes first-screen copy. | `@claim:boundary-wait`; `live-home-mobile.png`; live `/` |
| F-1-2 | Kept one-click `?demo=1`, isolated `demo:pacer`, banner, reset, and exit. | `@claim:demo-isolation`; `live-demo-mobile.png`, `live-offline-demo.json`; live `/demo/?demo=1` |
| F-1-3 | Kept 21 claims with one tagged test per claim. | `clean-claim-results.json`; live `/` |
| F-1-4 | Kept ready → explicit confirmation → distance-break behavior. | `@claim:boundary-wait`; `live-demo-mobile.png`; live demo |
| F-1-5 | Kept “Free” and no account/payment gate. | `@claim:no-account`; `live-home-mobile.png`; live `/` |
| F-1-6 | Removed untested broad browser-support marketing. | copy audit; `live-home-mobile.png`; live `/` |
| F-1-7 | Kept minimal permission and same-origin demo behavior. | `@claim:privacy-permissions`; `live-demo-mobile.png`; live `/privacy/` |
| F-1-8 | Kept tested browser alarm and interval behavior. | `@claim:browser-alarm-timer`, `@claim:interval-options`; `live-home-mobile.png`; live `/` |
| F-1-9 | Kept untestable shortcut marketing out of public copy. | extension browser suite; `live-home-mobile.png`; live `/` |
| F-1-10 | Kept tested confirmation-gated 20/30/60-second breaks. | `@claim:interval-options`, `@claim:break-duration`; `live-demo-mobile.png`; live demo |
| F-1-11 | Kept tested snooze, disable, and motion-pause behavior. | `@claim:snooze-disable`, `@claim:pause-animation`; `live-demo-mobile.png`; live `/` |
| F-1-12 | Kept plain browser-storage wording and exact schema test. | `@claim:extension-storage-schema`; `live-privacy-desktop.png`; live `/privacy/` |
| F-1-13 | Kept concrete accessibility wording and strengthened demo Axe to zero violations. | `@claim:accessible-demo`, `@claim:accessible-extension`; `live-demo-mobile.png`; live demo |
| F-1-14 | Kept untestable install-time wording removed. | copy audit; `live-home-mobile.png`; live `/` |
| F-1-15 | Kept package-download assertion and deployed byte match. | `@claim:download-build`; `live-headers-integrity.json`; live ZIP |
| F-1-16 | Kept no-cookie/no-third-party public-route coverage and same-origin 404. | `@claim:site-privacy`; `live-audit.json`; live unknown route |
| F-1-17 | Kept exact `storage`/`alarms` manifest coverage. | `@claim:privacy-permissions`; `live-home-mobile.png`; live `/privacy/` |
| F-1-18 | Kept worker internals out of visitor copy; observable alarm/state remains tested. | `@claim:browser-alarm-timer`; `live-home-mobile.png`; live `/` |
| F-1-19 | Kept header/cache configuration and checked it in production. | `@claim:security-headers`, `@claim:cache-policy`; `live-headers-integrity.json`; live `/` |
| F-1-20 | Kept self-hosted-font, licence, and art-provenance evidence. | `@claim:asset-license`; `live-home-desktop.png`; live `/` |
| F-1-21 | Kept Node 22 and all release-artifact coverage. | `@claim:release-output`; `clean-claim-results.json`; live ZIP |
| F-1-22 | Kept version checked against the packaged build. | `@claim:download-build`; `live-home-mobile.png`; live `/` |
| F-1-23 | Kept unsupported comparative copy removed. | copy audit; `live-home-mobile.png`; live `/` |
| F-1-24 | Kept designed same-origin 404 with HTTP 404 status. | `@claim:site-routes`; `live-404-mobile.png`; live unknown route |
| F-1-25 | Kept per-route canonical, social, favicon, and touch metadata. | `@claim:route-metadata`; `live-audit.json`; live `/privacy/`, `/terms/`, `/demo/`, `/404/` |
| F-1-26 | Kept shared header and complete footer on every route. | site route suite; `live-privacy-desktop.png`; live `/privacy/` |
| F-1-27 | Kept route/back heading focus and polite announcement. | route-focus browser test; `live-home-desktop.png`; live `/` |
| F-1-28 | Kept first-screen outcome, facts, and sample preview path. | mobile site suite; `live-home-mobile.png`; live `/` |
| F-1-29 | Kept concrete stopping-point eyebrow. | copy audit; `live-home-mobile.png`; live `/` |
| F-1-30 | Kept job-naming headline. | copy audit; `live-home-mobile.png`; live `/` |
| F-1-31 | Kept consistent stopping point, ready reminder, distance break, and extension icon terms. | copy audit; `live-demo-mobile.png`; live demo |
| F-1-32 | Kept plain full-screen break and motion wording. | copy audit; `live-home-mobile.png`; live `/` |
| F-1-33 | Kept descriptive distance-break heading. | site Axe suite; `live-home-mobile.png`; live `/` |
| F-1-34 | Kept concrete permission-boundary privacy heading. | copy audit; `live-home-mobile.png`; live `/` |
| F-1-35 | Kept plain “Turn reminders off” action. | copy audit; `live-home-mobile.png`; live `/` |
| F-1-36 | Kept concrete keyboard/screen-reader wording. | `@claim:accessible-demo`; `live-home-mobile.png`; live `/` |
| F-1-37 | Kept Chrome-install UI terms in plain language. | copy audit; `live-home-mobile.png`; live `/` |
| F-1-38 | Kept short README behavior sentences. | copy audit; `live-home-mobile.png`; live `/` |
| F-1-39 | Kept platform-shortcut README marketing removed. | copy audit; `live-home-mobile.png`; live `/` |
| F-1-40 | Kept split plain licence statements. | `@claim:asset-license`; `live-home-desktop.png`; live `/` |
| F-1-41 | Kept technology names confined to explained build/deploy context. | copy audit; `live-home-mobile.png`; live `/` |
| F-2-1 | Kept browser-qualified data-removal guidance. | privacy route suite; `live-privacy-desktop.png`; live `/privacy/` |
| F-2-2 | Kept unknown-path test through configured host. | `@claim:site-routes`; `live-404-mobile.png`; live unknown route |
| F-2-3 | Extended target coverage to every public route at 390 and 1440 px. | `@claim:touch-targets`; `live-audit.json`; live `/privacy/` |
| F-2-4 | Kept result-naming “Start distance break” demo control. | `@claim:boundary-wait`; `live-demo-mobile.png`; live demo |
| F-2-5 | Kept “break totals” and “your browser” wording. | copy audit; `live-privacy-desktop.png`; live `/privacy/` |
| F-2-6 | Kept device Reduce Motion wording. | `@claim:accessible-demo`; `live-home-mobile.png`; live `/` |
| F-2-7 | Kept unambiguous “Free” first-screen fact. | `@claim:no-account`; `live-home-mobile.png`; live `/` |
| F-3-1 | Made the Privacy contact link a 44px inline target and test all controls on all routes/viewports. | `@claim:touch-targets`; `live-privacy-desktop.png`, `live-audit.json`; live `/privacy/` |
| F-3-2 | Replaced invalid `<aside role="status">` with a labelled aside containing a valid status region; Axe is now clean. | `@claim:accessible-demo`; `live-demo-mobile.png`, `live-audit.json`; live demo |

## Final verification

- Fresh remote clone `/tmp/reading-comfort-pacer-polish3-final-clean`: `npm ci`, then every exact command in `.factory/claims.json` independently. All 21 passed; committed record: `evidence/polish-3/clean-claim-results.json`.
- `npm run check` passed (typecheck, lint, 18 unit tests, production build); `npm run test:e2e -- --workers=1` passed (25 browser tests).
- Static work-order deployment `8d6659f5-47b5-43aa-a380-81c12719241c` succeeded for <https://reading-comfort-pacer.sociobot.in>.
- Factory verifier: `evidence/polish-3/verify.json`. Cold production audit: `live-audit.json`; link crawl: `live-links.json`; header/cache/ZIP integrity: `live-headers-integrity.json`.
- Mobile Lighthouse: performance 100, accessibility 100, LCP 1.1 s, CLS 0.04: `lighthouse-mobile.json`.
