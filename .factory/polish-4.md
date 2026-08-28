# Polish round 4 — complete finding map

Repaired from candidate `0c58126ccb3e5dafdcf2fdf2b744ac2c1e7527ee` and review commit `32e872a9c26f0a5f8e28898f7cf82258344ede8e`.

The deployed repair is implementation commit `63484ce`, deployment `311a2b9f-9756-427a-a6fd-47973e8b6423`, at <https://reading-comfort-pacer.sociobot.in>. All screenshots and machine evidence named below are in `.factory/evidence/polish-4/`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the direct job and tired-eyes audience on the first screen. | `@claim:boundary-wait`; live `/`; `live-home-mobile.png` |
| F-1-2 | Kept direct `?demo=1` entry, isolated `demo:pacer`, persistent banner, reset, and exit. | `@claim:demo-isolation`; live `/demo/?demo=1`; `live-audit.json` |
| F-1-3 | Registry now has 22 unique claim IDs, each with exactly one tagged test. | clean-clone claim loop; `.factory/claims.json` |
| F-1-4 | Kept the ready-reminder confirmation gate before the sample break. | `@claim:boundary-wait`; live demo audit |
| F-1-5 | Made the first-screen price fact explicitly **Free** and asserted it with the no-gate flow. | `@claim:no-account`; live `/`; `live-home-mobile.png` |
| F-1-6 | Kept untested broad browser-support marketing removed. | copy audit; live `/` |
| F-1-7 | Kept the exact minimal permission and no-page-access boundary. | `@claim:privacy-permissions`; live `/privacy/` |
| F-1-8 | Kept installed-extension browser-alarm and no-network assertion. | `@claim:browser-alarm-timer` |
| F-1-9 | Kept untestable platform-shortcut marketing out of visitor copy. | copy audit; live `/` |
| F-1-10 | Kept explicit confirmation and all 20/30/60-second break options tested. | `@claim:interval-options`, `@claim:break-duration` |
| F-1-11 | Kept snooze, disable, and pause-motion behavior covered by installed-extension tests. | `@claim:snooze-disable`, `@claim:pause-animation` |
| F-1-12 | Kept plain browser-storage wording and exact extension schema coverage. | `@claim:extension-storage-schema`; live `/privacy/` |
| F-1-13 | Expanded the installed-extension accessibility test to keyboard-tab every control, exercise radio arrows, test 3:1 focus contrast in both themes, and emulate Reduce Motion. | `@claim:accessible-extension`; live `live-axe.json` |
| F-1-14 | Kept the untestable install-time promise removed. | copy audit; live `/` |
| F-1-15 | Kept package download, ZIP structure, manifest, and deployed-byte checks. | `@claim:download-build`; `live-integrity.json` |
| F-1-16 | Kept all public routes free of analytics, cookies, and third-party requests. | `@claim:site-privacy`; `live-audit.json` |
| F-1-17 | Kept manifest coverage for exactly `storage` and `alarms`. | `@claim:privacy-permissions`; `live-integrity.json` |
| F-1-18 | Kept untestable internal-worker claims out of visitor copy; observable behavior remains tested. | `@claim:browser-alarm-timer`; copy audit |
| F-1-19 | Kept security and cache configuration covered and checked live. | `@claim:security-headers`, `@claim:cache-policy`; live header files |
| F-1-20 | Kept self-hosted font, license, and art-provenance evidence. | `@claim:asset-license`; live `/` |
| F-1-21 | Kept Node 22 and every build output covered. | `@claim:release-output`; `npm run check` |
| F-1-22 | Kept displayed version tied to the packaged manifest. | `@claim:download-build`; `live-integrity.json` |
| F-1-23 | Kept unsupported comparative behavior copy removed. | copy audit; live `/` |
| F-1-24 | Kept the designed same-origin HTTP-404 page. | `@claim:site-routes`; live unknown route; `live-404-mobile.png` |
| F-1-25 | Kept exact per-route canonical, OG/Twitter, favicon, and touch metadata. | `@claim:route-metadata`; `live-audit.json` |
| F-1-26 | Kept shared header, footer, legal links, factory credit, and version. | site route suite; live `/privacy/`; `live-privacy-desktop.png` |
| F-1-27 | Kept forward/back heading focus and polite route announcement. | site route-focus test; live route audit |
| F-1-28 | Kept first-screen action outcome, three facts, and working sample preview. | mobile suite; live `/`; `live-home-mobile.png` |
| F-1-29 | Kept concrete stopping-point eyebrow copy. | `.factory/copy-audit.md`; live `/` |
| F-1-30 | Kept job-naming headline copy. | `.factory/copy-audit.md`; live `/` |
| F-1-31 | Kept stopping point, ready reminder, distance break, and extension icon terms consistent. | `.factory/copy-audit.md`; live demo |
| F-1-32 | Kept plain full-screen break and device Reduce Motion wording. | `.factory/copy-audit.md`; live `/` |
| F-1-33 | Kept descriptive distance-break heading. | site Axe suite; live `/` |
| F-1-34 | Kept concrete privacy-permission heading. | `.factory/copy-audit.md`; live `/` |
| F-1-35 | Kept plain **Turn reminders off** action. | `.factory/copy-audit.md`; live `/` |
| F-1-36 | Kept concrete keyboard/screen-reader wording backed by extension coverage. | `@claim:accessible-extension`; live `/` |
| F-1-37 | Kept plain Chrome installation wording. | `.factory/copy-audit.md`; live `/` |
| F-1-38 | Kept short README behavior sentences. | `.factory/copy-audit.md`; README |
| F-1-39 | Kept platform-specific shortcut marketing removed. | `.factory/copy-audit.md`; README |
| F-1-40 | Kept split, plain license statements. | `@claim:asset-license`; README |
| F-1-41 | Kept technology terms limited to explained build/deploy context. | `.factory/copy-audit.md`; README |
| F-2-1 | Kept browser-qualified data-removal guidance. | privacy route suite; live `/privacy/` |
| F-2-2 | Kept unknown-path coverage through the configured 404 host. | `@claim:site-routes`; live unknown route |
| F-2-3 | Kept every visible public target at least 44 px across routes and widths. | `@claim:touch-targets`; `live-audit.json` |
| F-2-4 | Kept result-naming **Start distance break** demo control. | `@claim:boundary-wait`; `live-demo-mobile.png` |
| F-2-5 | Kept plain **break totals** and **your browser** storage language. | `.factory/copy-audit.md`; live `/privacy/` |
| F-2-6 | Kept plain device Reduce Motion wording. | `@claim:accessible-demo`, `@claim:accessible-extension` |
| F-2-7 | Kept unambiguous **Free** copy. | `@claim:no-account`; `live-home-mobile.png` |
| F-3-1 | Kept 44 px legal-page contact targets and route-wide target inventory. | `@claim:touch-targets`; live `/privacy/` |
| F-3-2 | Kept the valid labelled aside plus permitted child status pattern. | `@claim:accessible-demo`; `live-axe.json` |
| F-4-1 | Repaired the missing installed-extension reduced-motion and full keyboard/focus assertions. | `@claim:accessible-extension`; `live-axe.json` |
| F-4-2 | Replaced the hero’s access/install facts with tested price, privacy, and offline facts; moved manual install beside download. | `@claim:no-account`, `@claim:privacy-permissions`, `@claim:offline-extension`; `live-home-mobile.png` |

## Final verification

- Fresh clone `/tmp/reading-comfort-pacer-polish4-final-clean.W5RZl8`: `npm ci`, then every exact command from the 22-entry claim registry independently: pass.
- `npm run check`: pass (TypeScript, lint, 18 unit tests, extension/site/ZIP build).
- `npm run test:e2e -- --workers=1`: pass (26 browser tests).
- Work-order deployment `311a2b9f-9756-427a-a6fd-47973e8b6423`: pass.
- `verify-url.sh`: pass; `verify.json` records the expected title, language, `h1`, `main`, alt text, and zero application errors.
- Live cold audit: 20 route × viewport × theme checks passed. Five live mobile Axe scans have no violations. The unknown path’s expected network-level HTTP-404 message is recorded but excluded from application errors.
- Live Lighthouse mobile: performance 99, accessibility 100, LCP 1.14 s, CLS 0.068.
