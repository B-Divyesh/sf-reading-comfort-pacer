# Adversarial first-read review 4 — Reading Comfort Pacer

- Verdict: **FAIL**
- Reviewed: 2026-08-28 UTC
- Candidate: `0c58126ccb3e5dafdcf2fdf2b744ac2c1e7527ee`
- Live URL: <https://reading-comfort-pacer.sociobot.in>
- Viewports: fresh Chromium contexts at 390 × 844 and 1440 × 900

The live product is clear and usable, the isolated sample works, every registered command exits successfully, and the two round-3 defects are repaired. This review still cannot pass the zero-findings standard. The extension's published reduced-motion claim is not exercised by its own tagged extension test, which reopens historical finding F-1-13. The first-screen fact row also omits the required offline fact and gives no concrete privacy fact.

## Cold first screen

I recorded these answers before scrolling in separate fresh contexts:

| Question | 390 px | 1440 px | Result |
| --- | --- | --- | --- |
| What does it do? | It starts screen breaks after the reader reaches a stopping point. | Same. | Pass |
| For whom? | Screen workers with tired eyes. | Same. | Pass |
| What should I click first? | **Try it with sample data**; the adjacent note says it opens a temporary reminder and saves nothing. | Same. | Pass |

The decisive text is “Take screen breaks after a stopping point.”, “For screen workers with tired eyes, it waits until you finish a paragraph or task before a distance break.”, and “Try it with sample data”. At 390 px, the headline, audience sentence, primary action, outcome note, three facts, and secondary download link were fully visible. At 1440 px, the headline, audience sentence, primary action, outcome note, and three facts were fully visible; only the secondary download link extended below 900 px. Neither cold load produced an application error, foreign request, or horizontal overflow.

## Findings

### Blocking

#### F-1-13 / F-4-1 — The extension reduced-motion claim remains only partly tested

- Exact quote/location: landing distance-break copy, “Your device’s Reduce Motion setting turns it off.”; landing accessibility copy and `.factory/claims.json`, “Extension controls have names, visible focus, and follow your device’s motion setting.”
- Evidence: `npm run test:e2e -- --grep @claim:accessible-extension` passes, but `tests/e2e/extension-claims.spec.ts` never calls `emulateMedia({ reducedMotion: "reduce" })` and never asserts the extension’s reduced-motion result. It checks one popup skip-link outline, selected accessible names, and serious/critical Axe results. The separate `accessible-demo` test emulates reduced motion only on the website sample, not on the installed extension named by this claim.
- Current behavior: manual emulation against the clean built extension found `#motion` hidden and both animated break-view elements at `animation-name: none`. The code contains the expected media rule. The product currently behaves correctly, but the required claim test can pass if that behavior later disappears.
- Why this fails: the claims contract requires the tagged test to assert the observable promise. Review 2 explicitly required reduced-motion coverage across the installed extension; review 3 marked F-1-13 fixed without that assertion. This is therefore a half-fixed historical blocking finding, not a new runtime defect.
- Concrete fix: extend `@claim:accessible-extension` to emulate reduced motion on the installed break page and assert that the motion control is unavailable and all looping animation is disabled. In the same test, tab through each popup, settings, and break control and assert a visible focus indicator with at least 3:1 contrast, rather than sampling only the popup skip link.

### Minor

#### F-4-2 — The first-screen facts omit the required offline fact and a concrete privacy fact

- Exact quote/location: landing hero facts, “Free”, “No account”, “Manual install”.
- Why this matters: the attached plain-words first-screen shape calls for short privacy, offline, and price facts. “Manual install” is useful disclosure, but the row does not tell a cold visitor that the extension works without network requests or name its permission boundary. “No account” is an access fact, not the concrete privacy behavior this product uses elsewhere.
- Concrete fix: use “Free”, “No account or page access”, and “Works offline after install”. Add an `offline-extension` claim that installs the packaged extension in a fresh profile, disables network access, and completes the ready-reminder and distance-break flow. Keep “Manual install” beside the download action instead of in the fact row.

## Copy audit

Counts use whitespace-separated visible words; hyphenated compounds, paths, and URLs count as one word. Inline code is counted as the words a reader sees. No sentence exceeds 22 words. No banned marketing word appears. F-4-2 is the only copy-shape finding.

### Landing-page sentences

| # | Words | Sentence | Flag |
| ---: | ---: | --- | --- |
| 1 | 7 | Take screen breaks after a stopping point. | — |
| 2 | 19 | For screen workers with tired eyes, it waits until you finish a paragraph or task before a distance break. | — |
| 3 | 5 | Opens a temporary ready reminder. | — |
| 4 | 3 | Nothing is saved. | — |
| 5 | 5 | See a ready reminder now. | — |
| 6 | 15 | The sample opens at the point where you choose whether to start a distance break. | — |
| 7 | 4 | Choose when to pause. | — |
| 8 | 15 | When the timer ends, the extension waits for you to finish the paragraph or task. | — |
| 9 | 10 | When the timer ends, it marks a reminder as ready. | — |
| 10 | 12 | Use the extension icon to start the break when you are ready. | — |
| 11 | 10 | A full-screen timer runs for 20, 30, or 60 seconds. | — |
| 12 | 4 | See the distance-break screen. | — |
| 13 | 8 | Look at a far object you can see. | — |
| 14 | 7 | Pause the gentle motion if you want. | — |
| 15 | 8 | Your device’s Reduce Motion setting turns it off. | F-4-1, test coverage |
| 16 | 8 | It asks for no page or camera permission. | — |
| 17 | 8 | This is an ergonomic prompt, not medical treatment. | — |
| 18 | 10 | The extension requests no page, camera, history, or identity permission. | — |
| 19 | 9 | It has no camera, history, page-content, or identity permission. | — |
| 20 | 9 | Your settings and break totals stay in your browser. | — |
| 21 | 9 | You can stop scheduled reminders and keep your settings. | — |
| 22 | 11 | Controls have names, visible focus, and follow your device’s motion setting. | F-4-1, test coverage |
| 23 | 5 | Install the Chrome extension manually. | — |
| 24 | 3 | Download this build. | — |
| 25 | 9 | The archive contains the folder you load in Chrome. | — |
| 26 | 5 | Download and unzip the extension. | — |
| 27 | 8 | Open chrome://extensions or your browser’s extension page. | Necessary browser UI term |
| 28 | 12 | Turn on Developer mode, choose Load unpacked, and select the unzipped folder. | Necessary browser UI terms |
| 29 | 10 | Pin the extension icon, choose an interval, and keep reading. | — |
| 30 | 14 | Reading Comfort Pacer helps screen workers take a distance break after a stopping point. | — |

Non-sentence navigation, headings, labels, facts, and controls were also checked: “Reading Comfort Pacer” (3), “Demo” (1), “How it works” (3), “Download” (1), “Privacy” (1), “Pause after a stopping point” (5), “Try it with sample data” (5), “Free” (1), “No account” (2), “Manual install” (2), “Download the extension” (3), “Screen → stopping point → distance break” (5), “Try the product first” (4), “Open the sample reminder” (4), “Read without interruption” (3), “Finish your stopping point” (4), “Look beyond the display” (4), “Distance break” (2), “No camera access” (3), “Stored in your browser” (4), “Turn reminders off” (3), “Use a keyboard or screen reader” (6), “Version 1.0.0” (2), “Download extension” (2), “Original AI-generated landscape” (3), “Built by Param Factory” (4), “version 1.0.0” (2), “Terms” (1), and “Source (external)” (2). Headings make sense in context and in the document outline. Landing and demo actions name their result.

### README sentences and complete bullets

| # | Words | Sentence or complete bullet | Flag |
| ---: | ---: | --- | --- |
| 1 | 7 | Take screen breaks after a stopping point. | — |
| 2 | 10 | Reading Comfort Pacer is for screen workers with tired eyes. | — |
| 3 | 7 | The timer marks a reminder as ready. | — |
| 4 | 14 | It waits until you finish a paragraph or task, then starts a distance break. | — |
| 5 | 2 | Live site: https://reading-comfort-pacer.sociobot.in | — |
| 6 | 2 | Open https://reading-comfort-pacer.sociobot.in/demo/?demo=1. | — |
| 7 | 7 | The sample starts with a ready reminder. | — |
| 8 | 7 | It uses only the `demo:pacer` browser-storage key. | Technical verifier detail |
| 9 | 7 | Resetting returns it to the ready reminder. | — |
| 10 | 7 | Starting for real removes that temporary key. | — |
| 11 | 8 | Uses 10, 20, 30, 45, or 60-minute intervals. | — |
| 12 | 8 | Waits for your confirmation before a distance break. | — |
| 13 | 7 | Offers 20, 30, or 60-second distance breaks. | — |
| 14 | 9 | Lets you snooze a ready reminder for ten minutes. | — |
| 15 | 8 | Lets you turn reminders off while keeping settings. | — |
| 16 | 9 | Keeps your settings and break totals in your browser. | — |
| 17 | 6 | This is a general ergonomic utility. | — |
| 18 | 7 | It is not medical advice or treatment. | — |
| 19 | 5 | Requires Node.js 22 or newer. | Technical setup detail |
| 20 | 7 | `npm run build` creates these release files: | Technical build detail |
| 21 | 9 | The folder to load from Chrome’s extension page. | — |
| 22 | 3 | The static website. | — |
| 23 | 4 | The downloadable extension archive. | — |
| 24 | 15 | To load the extension, open `chrome://extensions`, enable Developer mode, choose **Load unpacked**, and select `dist/extension/chrome-mv3`. | Necessary Chrome UI labels |
| 25 | 5 | WXT builds the browser extension. | Technical build detail |
| 26 | 9 | The extension schedules reminders with the browser’s alarm system. | — |
| 27 | 9 | It keeps its settings and break totals in browser storage. | — |
| 28 | 6 | The website is a static Vite site. | Technical build detail |
| 29 | 11 | It has no account, analytics, cookies, third-party scripts, or third-party fonts. | — |
| 30 | 8 | The extension requests only `storage` and `alarms` permissions. | Necessary permission names |
| 31 | 7 | It has no host or content-script permission. | Necessary permission term |
| 32 | 11 | Atkinson Hyperlegible Next is self-hosted under the SIL Open Font License. | Necessary licence name |
| 33 | 9 | Product code and original assets use the MIT License. | — |
| 34 | 9 | The visual direction and generated-art provenance are in `.factory/design.md`. | Technical documentation pointer |
| 35 | 9 | Deploy the contents of `dist/site/` as a static site. | — |
| 36 | 21 | `staticwebapp.config.json` provides security headers, a one-year cache for hashed assets, a one-hour cache for the download, and the designed 404 route. | Technical deploy detail |
| 37 | 9 | Privacy and terms pages are at `/privacy/` and `/terms/`. | — |

README headings (“Try it first”, “What it does”, “Run and verify”, “How it is built”, and “Deploy”) are meaningful out of context. Fenced shell commands are executable syntax rather than sentences and are excluded from word counts. Terminology is consistent: **stopping point**, **ready reminder**, **distance break**, and **extension icon**.

## Demo and sandbox

| Check | Result | Evidence |
| --- | --- | --- |
| One-click entry | Pass | Hero action opens `/demo/?demo=1` |
| Product already in use | Pass | First screen is a ready reminder after a realistic 20-minute project-brief session |
| Persistent banner | Pass | “Demo — sample data, nothing is saved” remains through the flow |
| Reset | Pass | Restores the ready reminder and initial sample heading |
| Start for real | Pass | Removes only `demo:pacer` and opens `/#install` |
| Real data untouched | Pass | Seeded `real:pacer-sentinel=keep` and `unrelated=keep-too` survived start, finish, reset, and exit |
| Storage isolation | Pass | The only demo write was `demo:pacer` |
| Offline behavior exercised | Pass, not a public offline claim | After the initial load, offline mode still changed the ready sample to the distance break |
| Network privacy | Pass | No foreign request, cookie, console error, or page error during the complete flow |

## Registered claims

I cloned the candidate to `/tmp/reading-comfort-pacer-review4.RM3Gcy`, ran `npm ci`, then ran every exact command in `.factory/claims.json` independently. All 21 commands exited zero.

| Claim id | Result | Evidence checked by its tagged test |
| --- | --- | --- |
| `demo-isolation` | Pass | Sentinel, reset, exit, and demo namespace |
| `boundary-wait` | Pass | Ready state remains until explicit confirmation |
| `no-account` | Pass | Landing and sample contain no account/payment gate |
| `privacy-permissions` | Pass | Exact manifest permissions and same-origin demo requests |
| `download-build` | Pass | Download path, ZIP signature, local MV3 manifest, and displayed version |
| `site-routes` | Pass | Real unknown route, HTTP 404, product page, and same-origin assets |
| `accessible-demo` | Pass | Keyboard activation, reduced motion, and zero Axe violations |
| `interval-options` | Pass | All documented interval and duration values |
| `snooze-disable` | Pass | Ten-minute snooze and retained settings after disable |
| `break-duration` | Pass | Selected interval is scheduled after completion |
| `security-headers` | Pass | Restrictive CSP and `nosniff` configuration |
| `browser-alarm-timer` | Pass | Browser alarm, persisted due time, and no HTTP request |
| `extension-storage-schema` | Pass | Exact initial local key/schema and no HTTP request |
| `pause-animation` | Pass | Pause state, changed label, and paused animations |
| `accessible-extension` | **Command passes; claim incomplete** | Names/Axe smoke checks and one popup focus ring; extension reduced motion is not tested (F-4-1) |
| `site-privacy` | Pass | Public-route cookies, storage, analytics, and foreign requests |
| `cache-policy` | Pass | One-year asset and one-hour download configuration |
| `asset-license` | Pass | Self-hosted font request, notices, provenance, and MIT licence file |
| `release-output` | Pass | Node 22 and all three build outputs |
| `route-metadata` | Pass | Per-route title, canonical target, and sharing metadata |
| `touch-targets` | Pass | Every visible link/button on all public routes at both widths |

The live landing and README otherwise map their observable promises to registry entries. No separate unlisted claim was found. F-4-1 is an assertion gap inside a listed claim, so there remains one untested public promise despite the green command.

## Historical finding audit

Every earlier review, polish record, and handoff was read. “Fixed” below means confirmed in the current code and live deployment, not copied from a prior status.

| Earlier id | Round-4 result | Current evidence |
| --- | --- | --- |
| F-1-1 | Fixed | Cold job and audience copy is visible at both widths. |
| F-1-2 | Fixed | One-click isolated demo, banner, reset, and exit work live. |
| F-1-3 | Fixed | Registry has 21 unique tags; every command passes independently. |
| F-1-4 | Fixed | Ready reminder waits for explicit “Start distance break”. |
| F-1-5 | Fixed | “Free forever” is gone; no account/payment gate appears. |
| F-1-6 | Fixed | Broad Chromium compatibility marketing remains removed. |
| F-1-7 | Fixed | Manifest has only storage/alarms and no host/content script. |
| F-1-8 | Fixed | Installed extension alarm/no-network test passes. |
| F-1-9 | Fixed | Untested shortcut marketing remains absent. |
| F-1-10 | Fixed | All documented durations and confirmation gate are tested. |
| F-1-11 | Fixed | Installed distance-view pause behavior is tagged and tested. |
| F-1-12 | Fixed | Exact local extension schema claim passes. |
| F-1-13 | **Half-fixed / BLOCKING** | Names and sampled focus pass; installed-extension reduced motion remains outside its tagged assertion (F-4-1). |
| F-1-14 | Fixed | No installation-time promise remains. |
| F-1-15 | Fixed | Live ZIP is 200; extracted payload exactly matches the clean build. |
| F-1-16 | Fixed | Live and tagged crawls find no cookies, analytics, or foreign requests. |
| F-1-17 | Fixed | Exact manifest permission set is asserted. |
| F-1-18 | Fixed | Internal authority claim remains removed; observable alarm behavior is tested. |
| F-1-19 | Fixed | Header/cache configuration is tagged; live headers match it. |
| F-1-20 | Fixed | Font is self-hosted; notices, MIT file, and art provenance are present. |
| F-1-21 | Fixed | Node 22 clean build creates extension, site, and archive. |
| F-1-22 | Fixed | Version is generated from the package and matches the live archive manifest. |
| F-1-23 | Fixed | Unsupported comparative behavior copy remains removed. |
| F-1-24 | Fixed | Unknown live path returns the designed same-origin page with HTTP 404. |
| F-1-25 | Fixed | Every route has canonical, OG/Twitter, favicon, touch icon, and a 1200 × 630 image. |
| F-1-26 | Fixed | Shared header/footer and required legal/factory/version links appear on every route. |
| F-1-27 | Fixed | Forward and Back focus the receiving h1 and update the polite announcement. |
| F-1-28 | Fixed | First screen has sample outcome, fact row, and immediate product path. |
| F-1-29 | Fixed | Eyebrow is the concrete “Pause after a stopping point”. |
| F-1-30 | Fixed | Headline names the screen-break job. |
| F-1-31 | Fixed | Core terms remain consistent. |
| F-1-32 | Fixed | Earlier visual-load and reduced-motion jargon is gone. |
| F-1-33 | Fixed | Distance-break heading is descriptive. |
| F-1-34 | Fixed | Privacy heading states the permission boundary. |
| F-1-35 | Fixed | “Turn reminders off” remains plain action copy. |
| F-1-36 | Fixed | Concrete keyboard/screen-reader heading remains. |
| F-1-37 | Fixed | Install copy uses necessary Chrome terms with plain instructions. |
| F-1-38 | Fixed | README behavior is split below 22 words. |
| F-1-39 | Fixed | Platform-shortcut sentence remains removed. |
| F-1-40 | Fixed | Licence statements remain separate and below the cap. |
| F-1-41 | Fixed | Technology terms stay within build/deploy documentation. |
| F-2-1 | Fixed | Deletion guidance is browser-qualified rather than guaranteed. |
| F-2-2 | Fixed | Tagged test requests an unknown path through the configured host. |
| F-2-3 | Fixed | Every visible target is at least 44 × 44 px at 390 and 1440 px. |
| F-2-4 | Fixed | Demo action says “Start distance break”. |
| F-2-5 | Fixed | Visitor copy uses “break totals” and “your browser”. |
| F-2-6 | Fixed | Copy names the device Reduce Motion setting plainly. |
| F-2-7 | Fixed | First-screen price fact says “Free”. |
| F-3-1 | Fixed | Privacy issue-tracker link measures at least 44 px on desktop and mobile. |
| F-3-2 | Fixed | Demo uses a permitted `role="status"` child inside the labelled aside; live Axe is clean. |

## Structure, accessibility, links, and identity

- Pass: home uses `Reading Comfort Pacer — breaks after stopping points`; demo, Privacy, Terms, and 404 use route-specific titles. All are under 60 characters.
- Pass: all five routes have `lang="en"`, one h1, one main, ordered headings, descriptions, canonicals, route-specific OG/Twitter data, SVG favicon, apple-touch icon, and the 1200 × 630 product image.
- Pass: an unknown URL returns HTTP 404 with the designed topographic page and a working “Return home” action.
- Pass: deep links load directly; home → Privacy → Back focused each receiving h1 and announced it.
- Pass: all discovered internal pages, anchors, ZIP, repository, issue tracker, metadata assets, `robots.txt`, and `sitemap.xml` resolve. The deliberate unknown path is the only 404.
- Pass: headers and footers are structurally consistent and include Privacy, Terms, Param Factory, version, and externally labelled repository links.
- Pass: 20 live Axe runs (five routes × two viewports × light/dark) found zero violations. There was no overflow, foreign request, cookie, application error, or sub-44 px visible control.
- Pass: the factory verifier reports HTTP 200, title, `lang`, one h1, main, complete image alt text, no unlabeled button, and no console error.
- Pass: the built first-load JavaScript is 1.46 kB gzip, below the 150 kB site limit.
- Pass: the paper/night palette, contour field, vermilion route marker, Atkinson type, map caption, and original ridge art make the site recognisably topographic rather than a generic SaaS template. The implementation matches `.factory/design.md`.
- Finding: the hero fact categories are incomplete as F-4-2 describes.

## Missed leverage

No finding. The brief does not imply AI, import/export, or sync. Adding model calls to a local reminder would be decorative and would weaken its no-network posture. No provider key or runtime AI endpoint is present.

## Additional verification

- `npm run check`: pass — typecheck, lint, 18 unit tests, clean extension/site build, and archive creation.
- `npm run test:e2e -- --workers=1`: pass — 25/25 browser tests.
- Live package: HTTP 200; manifest version `1.0.0`; only `storage` and `alarms`; no host permission or content script. Its extracted files exactly match the clean build.
- Live security: CSP, HSTS, `nosniff`, referrer policy, permissions policy, one-year hashed-asset cache, and one-hour archive cache are present.
- Live reduced-motion spot check: the installed clean/live-equivalent extension hides the motion control and reports `animation-name: none`; F-4-1 concerns the missing tagged regression assertion.

## What would make this perfect

Close F-4-1 by making the registered extension accessibility test prove reduced-motion behavior and complete focus visibility across its controls. Close F-4-2 by showing price, concrete privacy, and tested offline behavior in the first-screen facts. Then rerun every claim command, the full browser suite, the live two-viewport/two-theme route audit, the sandbox sentinel flow, and the complete historical checklist. A subsequent PASS requires zero findings and no untested promise.
