# Polish round 2 — complete finding map

Candidate repaired from `32f2eeadc9c685dd73b82c65b17815dc9ed4bbea` using both adversarial reviews.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1, F-1-28–F-1-31 | Kept direct job/audience copy and the first-screen sample action. | `@claim:boundary-wait`; live `/` cold check |
| F-1-2 | Preserved isolated `demo:pacer`, banner, reset, and Start for real; renamed the action. | `@claim:demo-isolation` |
| F-1-3–F-1-5 | Expanded registry to 21 one-tag claim tests; no payment/account gate remains. | all claim commands |
| F-1-6 | Removed broad Chromium-support promise; packaged archive remains tested. | `@claim:download-build` |
| F-1-7, F-1-17 | Permission copy matches manifest boundary. | `@claim:privacy-permissions` |
| F-1-8 | Added installed-extension browser-alarm/no-network coverage. | `@claim:browser-alarm-timer` |
| F-1-9 | Kept untestable shortcut marketing out of public copy. | extension browser suite |
| F-1-10 | Retained tested 20/30/60 distance-break behavior. | `@claim:interval-options`, `@claim:break-duration` |
| F-1-11 | Added real pause-motion assertion. | `@claim:pause-animation` |
| F-1-12 | Rewrote storage copy and asserted exact installed extension schema. | `@claim:extension-storage-schema` |
| F-1-13 | Added accessible-name, focus, axe, and motion coverage. | `@claim:accessible-extension`, `@claim:accessible-demo` |
| F-1-14 | Time-to-install wording remains removed. | copy audit |
| F-1-15, F-1-22 | Download test validates ZIP, MV3 identity, package version, and displayed version. | `@claim:download-build` |
| F-1-16 | Added fresh-context crawl for cookies, storage, analytics, and foreign requests. | `@claim:site-privacy` |
| F-1-18 | Replaced internal worker detail with observable alarm/storage behavior. | alarm and storage claims |
| F-1-19 | Documented exact cache durations and added a test. | `@claim:cache-policy` |
| F-1-20 | Asset test loads built page and checks self-hosted font/provenance/license. | `@claim:asset-license` |
| F-1-21 | Added Node 22/current artifact claim. | `@claim:release-output` |
| F-1-23, F-1-32–F-1-41 | Kept prior plain-language repairs; updated motion/storage wording and copy audit. | `.factory/copy-audit.md` |
| F-1-24, F-2-2 | Test host applies configured 404 override; unknown URL is asserted. | `@claim:site-routes` |
| F-1-25 | Added `og:url` and route-specific Twitter metadata. | `@claim:route-metadata` |
| F-1-26, F-1-27 | Kept shared nav/footer, skip link, route focus, and announcement. | `tests/e2e/site.spec.ts` |
| F-2-1 | Replaced deletion guarantee with browser-qualified removal guidance. | live privacy check |
| F-2-3 | Enforced and tested 44px site hit areas. | `@claim:touch-targets` |
| F-2-4 | Changed demo action to “Start distance break.” | `@claim:boundary-wait` |
| F-2-5 | Replaced storage jargon with “break totals” and “your browser.” | copy audit |
| F-2-6 | Replaced specialist motion wording. | `@claim:accessible-demo` |
| F-2-7 | Replaced “Free to try” with “Free.” | `@claim:no-account` |

## Verification

- Every command in `.factory/claims.json` passed individually after `npm ci` in clean clone `/tmp/reading-comfort-pacer-clean.bAtSFW`.
- `npm run check` passed typecheck, lint, 18 unit tests, and production build.
- `npm run test:e2e -- --workers=1` passed 25 browser tests including axe, extension, routes, metadata, privacy, and mobile coverage.
- Deployed live evidence passed: `.factory/evidence/polish-2/verify.json`, `live-home-mobile.png`, `live-demo-mobile.png`, and `unknown-headers.txt`.
