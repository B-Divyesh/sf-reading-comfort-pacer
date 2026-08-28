# Adversarial first-read review 2 — Reading Comfort Pacer

- Verdict: **FAIL**
- Reviewed: 2026-08-28 UTC
- Candidate: `32f2eeadc9c685dd73b82c65b17815dc9ed4bbea`
- Live URL: <https://reading-comfort-pacer.sociobot.in>
- Viewports: fresh Chromium contexts at 390 × 844 and 1440 × 900

The cold first screen and demo now work. The review still fails because public claims remain unlisted or are broader than their tagged tests, two routes have incomplete social metadata, several controls miss the 44 px target minimum, and some copy is still technical or action-ambiguous. There are no failing registered commands, but there are untested claims; therefore a PASS is not permitted.

## 1. Cold first screen

I recorded these answers before scrolling in fresh contexts:

| Question | 390 px | 1440 px | Result |
| --- | --- | --- | --- |
| What does it do? | It schedules screen breaks but waits for a stopping point. | Same. | PASS |
| For whom? | Screen workers with tired eyes. | Same. | PASS |
| What should I click first? | **Try it with sample data**; the adjacent note says it opens a temporary ready reminder. | Same. | PASS |

The decisive text is “Take screen breaks after a stopping point.”, “For screen workers with tired eyes…”, and “Try it with sample data”. All three answers are visible without scrolling at both widths. The mobile first screen also shows the three facts and secondary download link. No console error or third-party request occurred.

## 2. Findings

Findings are ordered by severity. Recurring findings retain their review-1 IDs.

### Blocking

#### F-1-6 — Browser-support claim remains outside the claims registry

- Quote/location: landing first screen and install eyebrow, “Built for Chromium browsers” and “Version 1.0 · For Chromium browsers”; README build output, “the folder to load in a Chromium browser.”
- Evidence: no `claims.json` entry claims browser compatibility. `@claim:download-build` checks the ZIP signature and MV3 manifest but never loads the download in a supported browser. The untagged extension E2E happens to use Chromium; that does not register the public claim.
- Impact: a visitor can rely on browser support without a claim test tied to the promise.
- Fix: add a `chromium-support` claim whose test installs the packaged archive in a fresh supported Chromium profile and completes the primary flow. If Chrome alone is supported, rewrite the first-screen fact to “Works in Chrome” and test that narrower claim.

#### F-1-8 — “Local browser timer” and browser-alarm behavior remain only partly registered

- Quote/location: landing “A local browser timer marks a reminder as ready.”; README “Its background worker keeps the timer state and schedules browser alarms.”
- Evidence: `interval-options` validates accepted numeric settings in a state function. It does not assert a browser alarm, persistence after popup closure, or that the running timer is local. The installed-extension test is not tagged to either public claim.
- Impact: the implementation may work, but the visitor-facing behavior can regress while every registered claim command stays green.
- Fix: register `browser-alarm-timer`; install the packaged extension in a fresh profile, close the popup, fire or observe the alarm, and assert the ready state with no HTTP(S) request.

#### F-1-11 — The untested motion-pause promise was not removed

- Quote/location: landing distance-break section, “You can pause the animation.”
- Evidence: there is no motion-pause claim. `@claim:accessible-demo` only presses the sample’s stopping-point button and checks reduced scroll behavior. The installed-extension E2E checks that motion is hidden after completion, but never presses “Pause gentle motion.” Polish round 1 says untested motion promises were removed; this sentence remains live.
- Impact: this is the same half-fixed claim-governance defect from review 1.
- Fix: add a `pause-animation` claim and tagged installed-extension test that verifies `aria-pressed`, the label change, and stopped animation, or remove the sentence.

#### F-1-12 — The exact extension-storage promise is still untested

- Quotes/locations: landing, “Settings and aggregate break counts remain in extension storage.”; README, “Keeps settings and aggregate break counts in local extension storage.”; privacy page lists interval, break length, vibration, enabled state, reminder time, and aggregate counts.
- Evidence: `demo-isolation` proves only the `demo:pacer` website namespace. `privacy-permissions` inspects manifest permissions. Neither tagged test asserts the extension’s stored key or exact stored fields. The untagged extension E2E reads `pacerState`, but does not establish the promised “only/local” schema.
- Impact: the strongest data-handling promise is not protected by its own observable test.
- Fix: register `extension-storage-schema`; run the full installed-extension flow, assert the exact `chrome.storage.local` keys and fields, and assert zero sync/remote writes.

#### F-1-13 — The live accessibility promise is broader than its claim

- Quotes/location: landing headings and copy, “Use a keyboard or screen reader” and “Controls have names, focus states, and a reduced-motion option.”
- Evidence: `accessible-demo` covers one keyboard activation and reduced scroll behavior in the website sample. It does not verify screen-reader names across the installed extension or visible focus styling. Axe checks exist only as untagged general tests.
- Impact: all registered claims can pass while the named screen-reader and focus outcomes regress.
- Fix: either narrow the copy to the tested sample behavior or add tagged tests for accessible names, keyboard order/activation, visible focus contrast, and reduced motion across popup, settings, and break views.

#### F-1-16 — Website privacy claims remain broader than the registered network test

- Quotes/locations: README, “It has no account, analytics, cookies, third-party scripts, or third-party fonts.”; privacy page, “This site does not use analytics or cookies.” and “It has no account or telemetry feature.”
- Evidence: `privacy-permissions` intercepts only `/demo/?demo=1` and asserts no foreign request. It does not inspect home/legal/404 pages, cookies, storage, analytics code, or extension telemetry. This review observed no foreign request or cookie on the sampled live routes, but no claims entry protects the broader promises.
- Impact: the statements are true in this run but unlisted and regression-prone.
- Fix: register a `site-privacy` claim that crawls every public route, records requests and responses, and asserts no analytics endpoint, third-party origin, cookie, or unexpected storage write.

#### F-1-18 — Timer-state authority and rescheduling are public but unregistered

- Quote/location: README, “Its background worker keeps the timer state and schedules browser alarms.” and “The popup, settings page, and break page ask that worker to change the state.”
- Evidence: no claim names state authority, cross-page updates, or rescheduling. Unit and general E2E coverage are not linked to a claims entry.
- Impact: maintainers can change this reliability behavior without failing a required public-claim command.
- Fix: add a state-lifecycle claim that checks persisted state and the scheduled alarm after start, snooze, settings change, completion, disable, and browser restart; otherwise make the README architectural rather than behavioral.

#### F-1-19 — The README caching promise is unlisted

- Quote/location: README, “`staticwebapp.config.json` provides security headers, caching rules, and the designed 404 route.”
- Evidence: `security-headers` checks only CSP text and `nosniff`; `site-routes` checks the 404 source/config. No tagged test asserts cache headers. Live inspection found `immutable` on the hashed CSS and one-hour caching on the ZIP, but that manual result is absent from `claims.json`.
- Impact: a stated deployment property is not part of the required regression suite.
- Fix: register `cache-policy` and assert the deployed/preview headers for HTML, a hashed asset, and the ZIP, or remove “caching rules” from the sentence.

#### F-1-20 — The asset/license claim test does not prove all public wording

- Quotes/locations: README, “Atkinson Hyperlegible Next is self-hosted under the SIL Open Font License.” and “Product code and original assets use the MIT License.”; footer, “Original AI-generated landscape”.
- Evidence: `asset-license` only searches three repository files for text. It does not build the site, inspect font URLs/requests, or verify that shipped original assets are covered by the stated license. Live requests were same-origin, but the tagged test can pass if the built page later loads a remote font.
- Impact: the test is a documentation-presence check rather than an observable assertion of the registered self-hosting claim.
- Fix: make `@claim:asset-license` build and load the site, assert every font request is same-origin, and check the shipped asset/provenance inventory against the notices and license.

#### F-1-21 — Node support and release outputs remain unlisted

- Quotes/locations: README, “Requires Node.js 22 or newer.”, “`npm run build` creates these release files”, and the three listed output paths.
- Evidence: `package.json` declares Node `>=22`, and the clean build produced all paths, but no claim entry/tests the supported runtime range or asserts all three artifacts. `download-build` asserts only the archive.
- Impact: developers can rely on build/setup promises that the required claims suite does not cover.
- Fix: register a `release-output` claim that runs on the documented minimum Node version and asserts `dist/extension/chrome-mv3/`, `dist/site/`, and the ZIP.

#### F-1-22 — The displayed version/current-build claim is not derived or tested

- Quotes/locations: landing and every footer, “Version 1.0” / “version 1.0”; install copy, “Download the current build.”
- Evidence: the live ZIP manifest says `1.0.0`, so the statement is true today. `download-build` does not assert `manifest.version`, compare the archive payload to the candidate, or derive the displayed version from it.
- Impact: stale HTML can call an older archive “current” while all registered tests pass.
- Fix: derive the displayed version from package/manifest data and extend a registered download claim to compare the linked archive manifest and payload with the candidate build.

#### F-1-25 — Route social metadata is still only partly route-specific

- Locations: `/demo/`, `/privacy/`, `/terms/`, and the designed 404.
- Evidence: demo and 404 Twitter titles are only “Reading Comfort Pacer”; both reuse “A private timer for distance breaks at stopping points.” rather than route-specific descriptions. All non-home pages also omit `og:url`. This contradicts polish round 1’s statement that route-specific OG/Twitter metadata was added.
- Impact: shared demo, legal, and missing-page URLs can present the wrong page identity.
- Fix: set route-specific Twitter title/description and `og:url` on every route, then crawl and assert exact values.

#### F-2-1 — Removing the extension is an unlisted data-deletion claim

- Quote/location: privacy page, “Remove the extension to remove its local storage.”
- Evidence: no `claims.json` entry installs, stores data, uninstalls, and verifies deletion in a fresh browser profile.
- Impact: deletion is a material privacy promise and currently untested.
- Fix: add an `uninstall-deletes-storage` claim/test if the browser test environment can observe it; otherwise rewrite to browser-qualified guidance and link to exact manual deletion steps.

#### F-2-2 — The registered 404 test does not exercise its stated sandbox

- Location: `site-routes` in `.factory/claims.json`; sandbox says “including unknown route.”
- Evidence: `@claim:site-routes` opens `/404/` directly and reads configuration. It never requests an unknown URL and never checks that all 404 resources are same-origin. Manual live verification passed for `/definitely-missing-review-2`, but the required tagged test does not prove the claim.
- Impact: a hosting regression can restore a generic platform 404 while the claim test remains green.
- Fix: have the tagged test request a unique unknown path against a server that applies the deployment fallback, assert HTTP 404, product title/h1/home link, and same-origin requests.

### Minor

#### F-2-3 — Several interactive targets are below 44 px

- Locations/evidence at 390 px: header “Demo” measured about 43 × 44 px; “Download the extension” about 181 × 21 px; demo “Reset demo” about 110 × 40 px; demo “Start for real” about 121 × 40 px.
- Impact: these links/actions have less touch area than the attached accessibility and site-structure baseline. Polish evidence said all live targets met 44 px, but these controls do not.
- Fix: give every interactive element a minimum 44 × 44 px hit box and add a test over all visible links/buttons, not only skip/footer links.

#### F-2-4 — The demo’s main button does not name its result

- Quote/location: demo, “I’m at a stopping point”.
- Impact: it describes the visitor’s state rather than saying that activation starts the distance break.
- Fix: change it to “Start distance break”. Keep the stopping-point instruction immediately above it.

#### F-2-5 — “Aggregate” and “extension storage” are avoidable jargon

- Quotes/locations: landing, “Settings and aggregate break counts remain in extension storage.”; README and privacy page use the same terms.
- Impact: a non-technical first-time visitor must decode both the type of count and the storage mechanism.
- Fix: use “Your settings and break totals stay in your browser.” In the privacy page, list the exact totals beneath that plain summary.

#### F-2-6 — “Reduced-motion” is not plain first-read copy

- Quotes/location: landing, “Reduced-motion settings turn it off.” and “a reduced-motion option.”
- Impact: this accessibility term is meaningful to specialists but does not tell every visitor where the setting comes from.
- Fix: use “Your device’s Reduce Motion setting turns the animation off.” and “Controls show keyboard focus and follow your device’s motion setting.”

#### F-2-7 — “Free to try” leaves the actual price unclear

- Quote/location: first-screen fact, “Free to try”.
- Impact: the brief says the product is free, while this wording can imply a later charge. No paid tier or price explanation follows.
- Fix: use “Free” and keep the tested “No account” fact beside it.

## 3. Copy audit

Counts treat hyphenated compounds, URLs, and paths as one word. Headings, navigation, controls, captions, and fragments are included because the plain-words rules explicitly cover them. There are no sentences over 22 words and no banned marketing adjectives. Flags point to findings above; “—” means no copy finding.

### Landing page

| # | Words | Copy | Flag |
| ---: | ---: | --- | --- |
| 1 | 3 | Reading Comfort Pacer | — |
| 2 | 1 | Demo | — |
| 3 | 3 | How it works | — |
| 4 | 1 | Download | — |
| 5 | 1 | Privacy | — |
| 6 | 5 | Pause after a stopping point | — |
| 7 | 7 | Take screen breaks after a stopping point. | — |
| 8 | 19 | For screen workers with tired eyes, it waits until you finish a paragraph or task before a distance break. | — |
| 9 | 5 | Try it with sample data | — |
| 10 | 5 | Opens a temporary ready reminder. | — |
| 11 | 3 | Nothing is saved. | — |
| 12 | 3 | Free to try | F-2-7 |
| 13 | 2 | No account | — |
| 14 | 4 | Built for Chromium browsers | F-1-6; “Chromium” is also technical first-screen copy |
| 15 | 3 | Download the extension | — |
| 16 | 5 | Screen → stopping point → distance break | — |
| 17 | 4 | Try the product first | — |
| 18 | 5 | See a ready reminder now. | — |
| 19 | 15 | The sample opens at the point where you choose whether to start a distance break. | — |
| 20 | 4 | Open the sample reminder | — |
| 21 | 3 | How it works | — |
| 22 | 4 | Choose when to pause. | — |
| 23 | 15 | When the timer ends, the extension waits for you to finish the paragraph or task. | — |
| 24 | 3 | Read without interruption | — |
| 25 | 9 | A local browser timer marks a reminder as ready. | F-1-8 |
| 26 | 4 | Finish your stopping point | — |
| 27 | 12 | Use the extension icon to start the break when you are ready. | — |
| 28 | 4 | Look beyond the display | — |
| 29 | 10 | A full-screen timer runs for 20, 30, or 60 seconds. | — |
| 30 | 2 | Distance break | — |
| 31 | 4 | See the distance-break screen. | — |
| 32 | 8 | Look at a far object you can see. | — |
| 33 | 5 | You can pause the animation. | F-1-11 |
| 34 | 5 | Reduced-motion settings turn it off. | F-2-6 |
| 35 | 1 | Privacy | — |
| 36 | 6 | The extension does not monitor you. | — |
| 37 | 8 | This is an ergonomic prompt, not medical treatment. | — |
| 38 | 10 | The extension does not inspect your page, camera, or behavior. | — |
| 39 | 3 | No camera access | — |
| 40 | 9 | It has no camera, history, page-content, or identity permission. | — |
| 41 | 4 | Stored in your browser | — |
| 42 | 9 | Settings and aggregate break counts remain in extension storage. | F-1-12, F-2-5 |
| 43 | 3 | Turn reminders off | — |
| 44 | 9 | You can stop scheduled reminders and keep your settings. | — |
| 45 | 6 | Use a keyboard or screen reader | F-1-13 |
| 46 | 9 | Controls have names, focus states, and a reduced-motion option. | F-1-13, F-2-6 |
| 47 | 5 | Version 1.0 · For Chromium browsers | F-1-6, F-1-22 |
| 48 | 5 | Install the Chrome extension manually. | — |
| 49 | 4 | Download the current build. | F-1-22 |
| 50 | 9 | The archive contains the folder you load in Chrome. | — |
| 51 | 2 | Download extension | — |
| 52 | 5 | Download and unzip the extension. | — |
| 53 | 8 | Open chrome://extensions or your browser’s extension page. | Necessary browser UI term |
| 54 | 12 | Turn on Developer mode, choose Load unpacked, and select the unzipped folder. | Necessary browser UI terms |
| 55 | 10 | Pin the extension icon, choose an interval, and keep reading. | — |
| 56 | 14 | Reading Comfort Pacer helps screen workers take a distance break after a stopping point. | — |
| 57 | 3 | Original AI-generated landscape | — |
| 58 | 4 | Built by Param Factory | — |
| 59 | 2 | version 1.0 | F-1-22 |
| 60 | 1 | Privacy | — |
| 61 | 1 | Terms | — |
| 62 | 2 | Source (external) | — |

All landing-page action links use result-naming verbs. The demo’s main state button is separately flagged as F-2-4.

### README

| # | Words | Copy | Flag |
| ---: | ---: | --- | --- |
| 1 | 3 | Reading Comfort Pacer | — |
| 2 | 7 | Take screen breaks after a stopping point. | — |
| 3 | 10 | Reading Comfort Pacer is for screen workers with tired eyes. | — |
| 4 | 7 | The timer marks a reminder as ready. | — |
| 5 | 14 | It waits until you finish a paragraph or task, then starts a distance break. | — |
| 6 | 4 | Live site: https://reading-comfort-pacer.sociobot.in | — |
| 7 | 3 | Try it first | — |
| 8 | 6 | Open https://reading-comfort-pacer.sociobot.in/demo/?demo=1. | — |
| 9 | 7 | The sample starts with a ready reminder. | — |
| 10 | 8 | It uses only the `demo:pacer` browser-storage key. | Technical verifier detail; exact key is appropriate here |
| 11 | 7 | Resetting returns it to the ready reminder. | — |
| 12 | 7 | Starting for real removes that temporary key. | — |
| 13 | 3 | What it does | — |
| 14 | 8 | Uses 10, 20, 30, 45, or 60-minute intervals. | — |
| 15 | 8 | Waits for your confirmation before a distance break. | — |
| 16 | 7 | Offers 20, 30, or 60-second distance breaks. | — |
| 17 | 9 | Lets you snooze a ready reminder for ten minutes. | — |
| 18 | 8 | Lets you turn reminders off while keeping settings. | — |
| 19 | 10 | Keeps settings and aggregate break counts in local extension storage. | F-1-12, F-2-5 |
| 20 | 6 | This is a general ergonomic utility. | — |
| 21 | 7 | It is not medical advice or treatment. | — |
| 22 | 3 | Run and verify | — |
| 23 | 5 | Requires Node.js 22 or newer. | F-1-21 |
| 24 | 7 | `npm run build` creates these release files: | F-1-21 |
| 25 | 11 | `dist/extension/chrome-mv3/` — the folder to load in a Chromium browser. | F-1-6, F-1-21 |
| 26 | 5 | `dist/site/` — the static website. | F-1-21 |
| 27 | 8 | `dist/site/downloads/reading-comfort-pacer-chrome.zip` — the downloadable extension archive. | — |
| 28 | 18 | To load the extension, open `chrome://extensions`, enable Developer mode, choose Load unpacked, and select `dist/extension/chrome-mv3`. | Necessary browser UI terms |
| 29 | 4 | How it is built | — |
| 30 | 5 | WXT builds the browser extension. | Technical section; WXT’s role is stated |
| 31 | 11 | Its background worker keeps the timer state and schedules browser alarms. | F-1-8, F-1-18 |
| 32 | 14 | The popup, settings page, and break page ask that worker to change the state. | F-1-18 |
| 33 | 7 | The website is a static Vite site. | Technical section; Vite’s role is stated |
| 34 | 11 | It has no account, analytics, cookies, third-party scripts, or third-party fonts. | F-1-16 |
| 35 | 8 | The extension requests only `storage` and `alarms` permissions. | —; exact permission names are necessary |
| 36 | 7 | It has no host or content-script permission. | —; exact permission type is necessary |
| 37 | 11 | Atkinson Hyperlegible Next is self-hosted under the SIL Open Font License. | F-1-20 |
| 38 | 9 | Product code and original assets use the MIT License. | F-1-20 |
| 39 | 10 | The visual direction and generated-art provenance are in `.factory/design.md`. | Technical documentation pointer; “provenance” means how the artwork was made |
| 40 | 1 | Deploy | — |
| 41 | 10 | Deploy the contents of `dist/site/` as a static site. | — |
| 42 | 11 | `staticwebapp.config.json` provides security headers, caching rules, and the designed 404 route. | F-1-19; exact filename is necessary |
| 43 | 9 | Privacy and terms pages are at `/privacy/` and `/terms/`. | — |

README commands inside fenced code blocks are executable commands rather than sentences and are not counted. No heading is nonsensical out of context, and no banned marketing word appears.

## 4. Demo and sandbox

| Check | Result | Evidence |
| --- | --- | --- |
| One-click first-screen entry | PASS | Hero link opens `/demo/?demo=1` |
| Product already in use | PASS | First state is a ready reminder after a realistic 20-minute project-brief session |
| Persistent banner | PASS | “Demo — sample data, nothing is saved” remains through ready, breaking, and complete states |
| Reset | PASS | Restores “Break is ready” and the initial h1 |
| Start for real | PASS | Removes only `demo:pacer` and navigates to `/#install` |
| Real data untouched | PASS | Seeded `pacerState=real-sentinel` and unrelated data survived complete/reset/exit |
| Namespace | PASS | Demo writes only `demo:pacer` |
| Network privacy | PASS | No third-party request or console error during the full live demo flow |

The sample is useful and immediate. F-2-4 concerns only the main action’s wording, not demo operation.

## 5. Registered claims

All commands were run individually after `npm ci` in clean clone `/tmp/reading-comfort-pacer-review2.AlCnkh` at the candidate commit.

| Claim | Command result | What the tagged test established |
| --- | --- | --- |
| `demo-isolation` | PASS | Sentinel survives complete/reset/exit; only demo key changes |
| `boundary-wait` | PASS | Distance state appears only after confirmation |
| `no-account` | PASS | No account/payment form on landing or demo |
| `privacy-permissions` | PASS | Exact manifest permission set; demo has no foreign request |
| `download-build` | PASS | Linked response is a >100 KB ZIP; manifest is named MV3 product |
| `site-routes` | PASS, incomplete | Direct `/404/` and config checked; unknown route/same-origin behavior not exercised (F-2-2) |
| `accessible-demo` | PASS, narrower than copy | One keyboard action and reduced scroll behavior checked (F-1-13) |
| `interval-options` | PASS | All documented interval/duration values normalize |
| `snooze-disable` | PASS | Ten-minute state result; settings survive disable |
| `break-duration` | PASS | Completion schedules selected interval |
| `security-headers` | PASS | CSP contains same-origin connection rule; `nosniff` configured |
| `asset-license` | PASS, incomplete | Documentation strings exist; built self-hosting not asserted (F-1-20) |

Summary: 12/12 commands exit zero, with exactly one tagged test per registered ID. The findings above are unlisted claims or gaps between claim text and observable assertions; they are not command failures.

## 6. Earlier-finding verification

Every finding in `.factory/review-1.md` was checked against current code and the live site. `.factory/polish-1.md` and the prior handoff were read but not accepted as evidence by themselves.

| Earlier finding | Status in round 2 | Evidence |
| --- | --- | --- |
| F-1-1 | FIXED | Audience and tired-eyes situation are visible in both cold first screens |
| F-1-2 | FIXED | One-click isolated demo works live |
| F-1-3 | FIXED | 12-entry registry; one tag per ID; all commands run |
| F-1-4 | FIXED | Ready state waits for confirmation |
| F-1-5 | FIXED for account gate | No account/payment gate; price wording has new F-2-7 |
| F-1-6 | **UNRESOLVED / BLOCKING** | Compatibility wording remains outside registry |
| F-1-7 | FIXED | Manifest has only storage/alarms; no host/content script; live demo same-origin |
| F-1-8 | **HALF-FIXED / BLOCKING** | Values tested; actual local browser alarm/persistence claim is not |
| F-1-9 | FIXED | Public shortcut promise removed; installed flow test reports assigned shortcut |
| F-1-10 | FIXED | All three durations registered and tested |
| F-1-11 | **HALF-FIXED / BLOCKING** | Motion-pause promise remains without a tagged test |
| F-1-12 | **HALF-FIXED / BLOCKING** | Demo namespace tested; extension storage schema is not |
| F-1-13 | **HALF-FIXED / BLOCKING** | Sample keyboard/reduced motion tested; screen-reader/focus copy is broader |
| F-1-14 | FIXED | Under-a-minute claim removed |
| F-1-15 | FIXED | Live ZIP is valid and tagged download test passes |
| F-1-16 | **HALF-FIXED / BLOCKING** | Demo request privacy tested; all-site cookie/analytics/font claim is not |
| F-1-17 | FIXED | Exact manifest permission set is tagged and observed |
| F-1-18 | **HALF-FIXED / BLOCKING** | Architecture copy remains a public unregistered behavior claim |
| F-1-19 | **HALF-FIXED / BLOCKING** | Headers registered; caching statement is not |
| F-1-20 | **HALF-FIXED / BLOCKING** | Documentation checked; shipped self-hosting/license scope is not fully asserted |
| F-1-21 | **HALF-FIXED / BLOCKING** | Build works; minimum Node and all release outputs are unregistered |
| F-1-22 | **HALF-FIXED / BLOCKING** | Version is true live but hard-coded and not asserted by download claim |
| F-1-23 | FIXED | Comparative behavior statement removed |
| F-1-24 | FIXED | Unknown live URL returns the designed product 404 with status 404 |
| F-1-25 | **HALF-FIXED / BLOCKING** | Demo/404 Twitter metadata is generic; non-home `og:url` is missing |
| F-1-26 | FIXED | Shared four-link header and required footer appear on every route |
| F-1-27 | FIXED | Privacy navigation and browser back focus h1 and update live region |
| F-1-28 | FIXED | Hero has demo outcome, three facts, and immediate product preview path |
| F-1-29 | FIXED | Plain eyebrow now says “Pause after a stopping point” |
| F-1-30 | FIXED | Headline names the job |
| F-1-31 | FIXED | Core terms are consistently stopping point, ready reminder, distance break, extension icon |
| F-1-32 | FIXED | Low-visual-load jargon removed; remaining reduced-motion term is new F-2-6 |
| F-1-33 | FIXED | Distance section heading is descriptive |
| F-1-34 | FIXED | Privacy heading is concrete |
| F-1-35 | FIXED | “Turn reminders off” replaces “Fully disableable” |
| F-1-36 | FIXED as heading | Concrete heading replaces marketing label; claim breadth is F-1-13 |
| F-1-37 | FIXED | Install copy explains folder, current build, browser page, and extension icon |
| F-1-38 | FIXED | README introduction is split and under 22 words per sentence |
| F-1-39 | FIXED | Platform shortcut sentence removed from README |
| F-1-40 | FIXED for length | License statements are split; test coverage remains F-1-20 |
| F-1-41 | FIXED | Technical names are confined to build/deploy sections and their roles are stated |

## 7. Structure, accessibility, links, and visual identity

- PASS: home title is 52 characters and follows “Product — what it does”; demo, privacy, terms, and 404 have route-specific document titles.
- PASS: all five checked routes have `lang=en`, one h1, one main, description, canonical, favicon, apple-touch icon, OG image, and no horizontal overflow.
- FAIL: route social metadata is incomplete as F-1-25 describes.
- PASS: the unknown live URL returns HTTP 404 with the topographic product page and a working home link.
- PASS: privacy navigation and browser Back restore the correct URL, focus the h1, and update the polite announcement.
- PASS: all crawled internal links, ZIP, source repository, and issue tracker returned 200. The intentionally unknown route returned 404.
- PASS: header/footer structure is consistent and includes Privacy, Terms, “Built by Param Factory”, and version.
- PASS: live axe checks found zero serious/critical issues on home, demo, privacy, terms, and 404 at both viewports in light and dark modes.
- FAIL: target sizes listed in F-2-3 do not meet the attached 44 px baseline.
- PASS: at 200% text size on 390 px there was no horizontal overflow.
- PASS: reduced-motion emulation leaves only the effectively-zero `0.00001s` fallback durations.
- PASS: the topographic cartography, restrained vermilion marker, paper/ink palette, self-hosted Atkinson type, contour treatment, and ridge artwork form a recognisable product-specific identity rather than a generic SaaS template.
- PASS: the landing order follows the required skeleton: header, first screen, live sample path, three-step explanation, privacy/limits, free install, footer.

## 8. Missed leverage

No missed-leverage finding. The brief does not imply AI; adding it would be decorative and would weaken the local privacy model. Import/export and sync are not obviously valuable for a timer with a handful of settings and modest aggregate counts. Optional vibration already exists in the extension, and no provider key is embedded.

## 9. Additional verification

- `npm run check`: PASS — typecheck, lint, 17/17 unit tests, extension/site build, and ZIP creation.
- `npm run test:e2e`: PASS — 17/17 tests, including installed extension, demo, metadata, routes, axe, and claims.
- Live ZIP: `200 application/zip`, 133,933 bytes; `unzip -t` found no errors; manifest is MV3 version `1.0.0` with only `storage` and `alarms` permissions.
- Live headers: CSP, HSTS, `nosniff`, referrer policy, permissions policy; hashed CSS has one-year immutable caching and ZIP has one-hour caching.
- Live network: no third-party requests in cold home/demo checks; no demo console errors.
- Offline: no offline claim is made, so reload-offline behavior is not scored.

## What would make this perfect

Close every claim-registry gap with observable tagged tests, derive release/version copy from the packaged artifact, complete route-specific social metadata, enlarge every hit target to 44 px, rename the demo action to its result, replace the remaining technical visitor copy, and state the actual free price. Then rerun the full cold-read, demo isolation, claim, route, copy, accessibility, and history checks from a clean clone. At that point there should be zero findings—not merely no blocking defects.
