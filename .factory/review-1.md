# Adversarial first-read review 1 — Reading Comfort Pacer

- Verdict: **FAIL**
- Reviewed: 2026-08-28 UTC
- Candidate: `c03f51ab00fba458769a43a94ab2cf4e1ca752b6`
- Live URL: <https://reading-comfort-pacer.sociobot.in>
- Viewports: fresh Chromium contexts at 390 × 844 and 1440 × 900

The implementation builds and its existing tests pass, but this review cannot accept it. The first screen does not identify the intended user, no one-click sandboxed demo exists, no claim is registered or tested through `.factory/claims.json`, and unknown routes expose the generic Azure 404 page.

## 1. Cold first screen

The answer was the same at both viewports before scrolling:

| Question | First-read answer | Result |
| --- | --- | --- |
| What does this do? | The lede says it is a browser extension whose timer waits for a stopping point and then opens a “distance cue.” The job is partly recoverable, although “distance cue” is unexplained. | Partial |
| For whom? | Cannot answer. “A calmer route through screen work” names a setting, not a person or situation. The visible lede says only “A free browser extension…” | **BLOCKING** |
| What should I click first? | “Download for Chrome.” | Clear, but it skips the mandatory try-first path |

The exact failing copy is “Finish the thought. Then look farther.”, “A calmer route through screen work”, and “A free browser extension that lets the timer wait for your next natural stopping point—then opens one quiet distance cue.” None says “for screen workers who get eye fatigue” or an equivalent audience/situation statement.

## 2. Findings

Findings are ordered by severity. Every unlisted claim below is independently blocking because the required registry is absent and the claim is untested through the required sandbox entry point.

### Blocking

#### F-1-1 — The first screen does not say who the product is for

- Location/quote: landing hero; quotes in the cold-read table above.
- Impact: a first-time visitor cannot answer all three mandatory questions from one phone screen. The headline is a metaphor, and “screen work” does not identify the intended user or problem.
- Fix: use a job headline such as “Take screen breaks after a natural stopping point.” Follow it with: “For screen workers with tired eyes, it waits until you finish a paragraph before starting a distance break.”

#### F-1-2 — There is no one-click demo or isolated demo storage

- Location/quote: the only hero action is “Download for Chrome”; `GET /demo` returns HTTP 404; the repository has no `.factory/demo.md`, sample-data route, demo banner, reset action, start-real action, or `demo:` storage namespace.
- Impact: a visitor must download, unzip, enable developer mode, load an extension, pin it, and wait before seeing the product. The required first post-click screen, realistic sample state, reset behavior, and proof that real data is untouched cannot be tested.
- Fix: add “Try it with sample data” on the first screen. `/demo` should open a working sample in the ready-to-pause state, show “Demo — sample data, nothing is saved”, provide “Reset demo” and “Start for real”, and isolate all writes under `demo:` keys. Add a test that seeds a real-data sentinel, completes and resets the demo, exits it, and confirms the sentinel never changed. Document this in `.factory/demo.md`.

#### F-1-3 — The required claims registry and claim-tagged tests do not exist

- Location: `.factory/claims.json` is absent; `rg '@claim:'` returns no matches.
- Impact: there are no listed tests to run, so none of the public promises can be verified from the mandated clean demo sandbox. Passing broad unit/E2E tests is not equivalent to one tagged test per claim.
- Fix: create `.factory/claims.json`; give each retained claim exactly one `@claim:<id>` test using `/demo` and clean state; remove claims that cannot be tested.

#### F-1-4 — Unlisted boundary-waiting claim

- Quotes: landing, “A free browser extension that lets the timer wait for your next natural stopping point—then opens one quiet distance cue.” and “Pacer quietly marks the break as ready and waits for your signal.” README, “Its timer marks a break as ready, then waits for the user to reach and confirm a natural paragraph or task boundary before opening a calm full-screen distance cue.”
- Impact: this is the central behavior, but it has no claims entry or demo-sandbox test.
- Fix: add a `boundary-wait` claim test that expires the timer, confirms no break page opens, confirms a stopping point, and then verifies the break view opens.

#### F-1-5 — Unlisted price and account claims

- Quotes: landing, “Free forever” and “No account”; README calls the extension “free.”
- Impact: visitors may rely on price and access requirements. “Forever” cannot be guaranteed by a current-state test.
- Fix: change “Free forever” to “Free” and register a claim that the demo/install flow has no payment or account gate.

#### F-1-6 — Unlisted browser-support claim

- Quote: landing, “Chrome, Edge, Brave and other Chromium browsers.”
- Impact: compatibility is promised without a browser matrix test.
- Fix: test every named browser/version in CI, or narrow the copy to the browser actually tested, such as “Built for Chromium browsers.”

#### F-1-7 — Unlisted non-observation and permission claims

- Quotes: landing, “It never watches the page, camera, or your behavior.” and “Pacer does not track your eyes, face, tabs, or page content.” README, “It never requests camera, browsing history, page content, identity, or health-data permissions.”
- Impact: these are privacy promises a visitor could rely on. Existing broad E2E coverage is not registered to them.
- Fix: register a privacy claim that inspects the manifest, intercepts all demo traffic, and fails on host/content-script or forbidden permission access.

#### F-1-8 — Unlisted interval and browser-alarm claim

- Quotes: landing, “A small local timer runs in the browser.” and “When the interval ends, finish the paragraph or task.” README, “Persists 10, 20, 30, 45, or 60-minute reading intervals with the browser alarms API.”
- Impact: timer locality, supported values, and persistence are promised without a claim-specific test.
- Fix: register and test every supported interval plus alarm persistence across popup closure and browser restart.

#### F-1-9 — Unlisted toolbar and keyboard claims

- Quotes: landing, “Confirm the boundary from the toolbar or keyboard.” README, “Suggests a keyboard command (`Alt+Shift+R`, or `Command+Shift+Y` on macOS) when a break is ready and reports clearly if the browser leaves it unassigned.”
- Impact: the exact shortcuts and fallback message are relied-on interaction claims.
- Fix: split this into tested toolbar, assigned-shortcut, and unassigned-shortcut claims; test each supported operating system or remove untested platform-specific copy.

#### F-1-10 — Unlisted break-view and duration claim

- Quotes: landing, “A low-visual-load full-screen cue guides attention beyond the display for 20, 30, or 60 seconds.” README, “Starts a 20, 30, or 60-second distance cue only after explicit confirmation.”
- Impact: full-screen behavior, duration choices, and the confirmation gate are unregistered.
- Fix: register one observable claim per behavior and test all three durations from demo state.

#### F-1-11 — Unlisted snooze, vibration, motion, and disable claims

- Quotes: landing, “The cue has optional vibration, a motion pause, and a complete reduced-motion treatment.” and “One setting cancels scheduled reminders while keeping your preferences.” README, “Offers a 10-minute intentional snooze, optional device vibration, a motion-pause control, and full disable.”
- Impact: four distinct behaviors are bundled into untested public promises.
- Fix: separate and register snooze timing, supported-device vibration, motion pause/reduced motion, and disable/preserved-preferences claims.

#### F-1-12 — Unlisted local-storage claim

- Quotes: landing, “Your reading route stays on your device.” and “Timing settings and completed-break counts live in extension storage.” README, “Stores only settings, timer state, and aggregate accepted/snoozed/completed counts in local extension storage.”
- Impact: the word “only” is a strong data-minimization claim with no required interception/storage assertion.
- Fix: register a storage-schema claim; assert the exact keys and fields after the complete demo flow and assert that no real namespace changes.

#### F-1-13 — Unlisted accessibility claim

- Quote: landing, “Keyboard controls, screen-reader labels, high contrast, and reduced motion are built in.”
- Impact: this promises four accessibility outcomes, while the registry has none.
- Fix: split it into keyboard, accessible-name, contrast, and reduced-motion claims with tagged tests, or replace it with non-promissory documentation linked to test evidence.

#### F-1-14 — Unlisted quantitative install-time claim

- Quote: landing heading, “Add it in under a minute.”
- Impact: no test measures installation time, and the four-step developer-mode installation is unlikely to be reproducibly under one minute for a first-time user.
- Fix: remove the time claim. Use “Install the Chrome extension manually.” until a measured, repeatable install path exists.

#### F-1-15 — Unlisted download/archive claim

- Quotes: landing, “The archive contains the unpacked Chromium extension.” README output line, “`dist/site/downloads/reading-comfort-pacer-chrome.zip` — packaged extension linked by the site.”
- Impact: the live ZIP happens to return 200, but this public release claim is not tied to a required claim test.
- Fix: register a download claim that fetches the live/demo-linked ZIP, validates it, loads it in a fresh profile, and asserts the expected manifest identity.

#### F-1-16 — Unlisted website privacy/network claim

- Quote: README, “The static Vite landing site has no backend, analytics, cookies, runtime CDN, or external font request.”
- Impact: this is a broad privacy and architecture promise. The normal pages made no foreign requests during this review, but no registered test protects it, and the generic 404 does load third-party Azure scripts and styles.
- Fix: narrow the claim to product-owned routes, add a network/cookie interception test for every route including 404, and serve a same-origin 404.

#### F-1-17 — Unlisted manifest-permission claims

- Quotes: README, “The requested permissions are limited to:” followed by “`storage` for local preferences, state, and aggregate counts” and “`alarms` for a timer that survives popup closure and browser sleep.”
- Impact: visitors can rely on the permission boundary and alarm durability.
- Fix: register manifest-permission and alarm-lifecycle claims; assert the exact permission set and recovery after browser sleep/restart.

#### F-1-18 — Unlisted persistence and rescheduling claim

- Quote: README, “The background worker is the single timer-state authority; it persists state and reschedules alarms after every transition.”
- Impact: this makes a specific state-consistency promise without a tagged claim test.
- Fix: register a transition-table claim and assert persisted state plus scheduled alarms after every transition.

#### F-1-19 — Unlisted security-header and caching claim

- Quote: README, “The included `staticwebapp.config.json` supplies security headers and immutable caching for hashed assets.”
- Impact: the statement can regress independently of unit tests.
- Fix: register a deployed-header claim that checks each promised header and immutable cache behavior on a hashed asset.

#### F-1-20 — Unlisted licensing and asset-provenance claims

- Quotes: README, “Atkinson Hyperlegible Next is self-hosted from the Fontsource package under the SIL Open Font License; all product code and original assets are MIT licensed.” Landing footer, “Original AI-generated landscape; no people or brands depicted.”
- Impact: licensing, self-hosting, and provenance are factual promises without a claims entry.
- Fix: add a repository audit claim for font origin/license, external font requests, LICENSE coverage, and generated-asset provenance; remove the image-content assertion unless it can be reviewed deterministically.

#### F-1-21 — Unlisted development and output claims

- Quotes: README, “Requires Node.js 22 or newer.”, “The exact reproducible production command is:”, and all three output descriptions under “Outputs”.
- Impact: a developer can rely on runtime support, reproducibility, and output paths, but none is registered. `package.json` also lacks an `engines.node` declaration.
- Fix: add `engines.node`, test the supported Node range, and register a release-output claim that runs the documented command and asserts all three artifacts.

#### F-1-22 — Unlisted release/version availability claims

- Quotes: landing, “Version 1.0 · MV3” and “Until the store listing is available, install the signed-off build locally.”
- Impact: version, manifest generation, store availability, and “signed-off” status are presented as facts without a source or test.
- Fix: derive version/MV3 from the packaged manifest, replace “signed-off” with “current”, and register the downloadable-build assertion.

#### F-1-23 — Unlisted comparative behavior claim

- Quote: landing, “Rigid timers become easy to ignore when they land mid-sentence.”
- Impact: this generalizes user behavior without evidence and is not needed to explain the product.
- Fix: replace it with the directly testable behavior: “When the timer ends, the extension waits for you to finish the paragraph or task.”

#### F-1-24 — Unknown routes show a generic, third-party 404

- Location: `GET /not-a-real-route` returns HTTP 404 with title “Azure Static Web Apps - 404: Not found”, Azure branding, Bootstrap from `ajax.aspnetcdn.com`, and scripts/assets from `appservice.azureedge.net`.
- Impact: routing leaves the product identity, omits a route home, and violates the same-origin/no-third-party surface expected by the site structure and privacy posture. This is explicitly blocking under the review contract.
- Fix: ship a designed topographic 404 with one `h1`, product header/footer, a home link, route-specific metadata, and no third-party assets; configure the host to use it while preserving status 404.

### Minor

#### F-1-25 — Social and install metadata are incomplete

- Location: home, privacy, and terms heads.
- Evidence: all have titles, descriptions, canonicals, and SVG favicon. None has Open Graph or Twitter-card metadata or a 1200 × 630 product image; none has an apple-touch icon. Privacy and terms also omit `theme-color`.
- Impact: shared links lack a deliberate preview, and installed mobile shortcuts lack the required product icon.
- Fix: add route-specific OG/Twitter title and description, the product artwork card, a 180 px apple-touch icon, and theme color to every route.

#### F-1-26 — Header/footer skeleton changes between routes

- Location: home header offers “How it works” and “Download”; legal headers offer only “Download”. All footers omit the product one-liner, “Built by Param Factory”, and a build/version identifier. “Source” and “public issue tracker” also lead off-site without saying so.
- Impact: visitors lose consistent navigation and release context.
- Fix: use one header and footer component on all routes, with the same ≤4 navigation links and the required footer fields. Label the two GitHub links as external.

#### F-1-27 — Route changes do not move focus or announce the new page

- Evidence: after visiting `/privacy/` and going back, `document.activeElement` is `BODY`, not the page `h1`; there is no route-announcement live region.
- Impact: keyboard and screen-reader users do not receive the required route-change cue.
- Fix: focus a `tabindex="-1"` `h1` after navigation and announce the route title through an `aria-live="polite"` region; test forward and back navigation.

#### F-1-28 — The landing skeleton lacks the required try-first explanation, three facts, and product-in-use preview

- Location: hero and first content section.
- Evidence: the hero has only a download action and compact “Free forever · No account · …” line. It does not say what happens after the primary click. The art is a landscape, not a working or realistic product preview.
- Impact: the visitor cannot inspect the actual interaction before installing it.
- Fix: pair “Try it with sample data” with “Opens a temporary ready reminder; nothing is saved.” Show three separate, tested facts and place the working sample UI immediately below the hero.

#### F-1-29 — “A calmer route through screen work” is vague marketing copy

- Location: landing eyebrow.
- Impact: “calmer route” is metaphorical and does not name a result.
- Fix: “Pause after a natural stopping point.”

#### F-1-30 — The headline does not name the job

- Location: “Finish the thought. Then look farther.”
- Impact: heard out of context, it could describe writing, meditation, or travel.
- Fix: “Take screen breaks after a natural stopping point.”

#### F-1-31 — Core terms are inconsistent and metaphor-heavy

- Locations: “natural stopping point”, “natural boundary”, “boundary”, “natural stop”; “distance cue”, “distance view”, and “distance break”; “reading route”, “route logic”, “signal”, and “waypoint icon”.
- Impact: a new visitor must infer whether these are different states or decorative names for the same thing.
- Fix: use “stopping point” for the trigger, “distance break” for the result, “notification” for the ready state, and “extension icon” for the toolbar control everywhere.

#### F-1-32 — Two feature sentences use specialist accessibility/design jargon

- Quotes: “A low-visual-load full-screen cue…” and “a complete reduced-motion treatment.”
- Impact: neither phrase says what the visitor will see or control.
- Fix: “A full-screen timer asks you to look beyond the display for 20, 30, or 60 seconds.” and “You can pause the animation. Your reduced-motion setting turns it off.”

#### F-1-33 — “One horizon. Nothing to dismiss.” is not a standalone heading

- Location: distance-view section heading.
- Impact: in a screen-reader heading list it does not describe the section.
- Fix: “See the distance-break screen.”

#### F-1-34 — The privacy heading is rhetorical rather than descriptive

- Location: “No surveillance disguised as care.”
- Impact: it introduces a tone and accusation before stating the concrete privacy behavior.
- Fix: “The extension does not monitor you.”

#### F-1-35 — “Fully disableable” is awkward product jargon

- Location: trust-grid heading.
- Impact: it is harder to parse than the action users take.
- Fix: “Turn reminders off.”

#### F-1-36 — “Accessible by design” is a marketing label

- Location: trust-grid heading.
- Impact: it asks visitors to trust an adjective instead of naming the controls.
- Fix: “Use a keyboard or screen reader.”

#### F-1-37 — Installation copy exposes unexplained implementation terms

- Locations: “Version 1.0 · MV3”, “signed-off build”, “unpacked Chromium extension”, and “waypoint icon”.
- Impact: a first-time installer has to decode release jargon.
- Fix: use “Version 1.0 · For Chromium browsers”, “current build”, “the folder you load in Chrome”, and “extension icon”.

#### F-1-38 — README introduction exceeds the 22-word limit

- Quote: “Its timer marks a break as ready, then waits for the user to reach and confirm a natural paragraph or task boundary before opening a calm full-screen distance cue.” (29 words)
- Impact: the main behavior arrives as one long sentence with three competing state changes.
- Fix: “The timer marks a break as ready. It waits until you finish a paragraph or task, then opens a distance break.”

#### F-1-39 — README keyboard sentence exceeds the 22-word limit

- Quote: “Suggests a keyboard command (`Alt+Shift+R`, or `Command+Shift+Y` on macOS) when a break is ready and reports clearly if the browser leaves it unassigned.” (23 words)
- Impact: the action, two platforms, and fallback are difficult to scan as one bullet.
- Fix: “When a break is ready, press `Alt+Shift+R`. On macOS, press `Command+Shift+Y`. If unavailable, the extension explains where to assign it.”

#### F-1-40 — README licensing sentence exceeds the 22-word limit

- Quote: “Atkinson Hyperlegible Next is self-hosted from the Fontsource package under the SIL Open Font License; all product code and original assets are MIT licensed.” (24 words)
- Impact: two separate licensing facts are buried in one long sentence.
- Fix: “Atkinson Hyperlegible Next is self-hosted and uses the SIL Open Font License. Product code and original assets use the MIT License.”

#### F-1-41 — README architecture copy contains avoidable jargon

- Locations: “Manifest V3”, “WXT”, “single timer-state authority”, “typed messages”, “runtime CDN”, “generated-art provenance”, and `staticwebapp.config.json` are used without plain explanations.
- Impact: the README opens with implementation vocabulary before explaining the install and use path.
- Fix: keep exact technology names in the Architecture section, but define them. For example: “The background worker owns the timer state. Every screen asks it to read or change that state.” Replace “runtime CDN” with “third-party scripts or fonts.”

No landing button violates the result-naming-verb rule: “Download for Chrome” and “Download extension” both name their result. The problem is that download is the only primary path.

## 3. Copy audit

Counts treat hyphenated compounds as one word. Navigation labels, headings, controls, captions, and fragments are included because visitors encounter them as copy. README code commands are excluded because they are executable code, not sentences; their surrounding labels and output descriptions are included.

### Landing page

| # | Words | Copy | Flag |
| ---: | ---: | --- | --- |
| 1 | 3 | Reading Comfort Pacer | — |
| 2 | 3 | How it works | — |
| 3 | 1 | Download | — |
| 4 | 6 | A calmer route through screen work | F-1-29 |
| 5 | 3 | Finish the thought. | F-1-30 |
| 6 | 3 | Then look farther. | F-1-30 |
| 7 | 21 | A free browser extension that lets the timer wait for your next natural stopping point—then opens one quiet distance cue. | F-1-1, F-1-31 |
| 8 | 3 | Download for Chrome | — |
| 9 | 2 | Free forever | F-1-5 |
| 10 | 2 | No account | F-1-5 |
| 11 | 7 | Chrome, Edge, Brave and other Chromium browsers | F-1-6 |
| 12 | 6 | Near focus → natural boundary → distance view | F-1-31 |
| 13 | 2 | Route logic | F-1-31 |
| 14 | 2 | Time suggests. | F-1-31 |
| 15 | 4 | You choose the boundary. | F-1-31 |
| 16 | 10 | Rigid timers become easy to ignore when they land mid-sentence. | F-1-23 |
| 17 | 12 | Pacer quietly marks the break as ready and waits for your signal. | F-1-31 |
| 18 | 3 | Read without interruption | — |
| 19 | 8 | A small local timer runs in the browser. | — |
| 20 | 9 | It never watches the page, camera, or your behavior. | — |
| 21 | 4 | Reach a natural stop | F-1-31 |
| 22 | 9 | When the interval ends, finish the paragraph or task. | — |
| 23 | 8 | Confirm the boundary from the toolbar or keyboard. | F-1-31 |
| 24 | 4 | Shift to the distance | F-1-31 |
| 25 | 15 | A low-visual-load full-screen cue guides attention beyond the display for 20, 30, or 60 seconds. | F-1-32 |
| 26 | 2 | Distance view | F-1-31 |
| 27 | 2 | One horizon. | F-1-33 |
| 28 | 3 | Nothing to dismiss. | F-1-33 |
| 29 | 9 | Use the farthest comfortable real-world object you can see. | — |
| 30 | 13 | The cue has optional vibration, a motion pause, and a complete reduced-motion treatment. | F-1-32 |
| 31 | 3 | Private by default | — |
| 32 | 5 | No surveillance disguised as care. | F-1-34 |
| 33 | 12 | This is an ergonomic prompt, not medical treatment or a productivity score. | — |
| 34 | 7 | Your reading route stays on your device. | F-1-31 |
| 35 | 3 | No camera access | — |
| 36 | 11 | Pacer does not track your eyes, face, tabs, or page content. | — |
| 37 | 2 | Local-only storage | F-1-31 |
| 38 | 9 | Timing settings and completed-break counts live in extension storage. | — |
| 39 | 2 | Fully disableable | F-1-35 |
| 40 | 9 | One setting cancels scheduled reminders while keeping your preferences. | — |
| 41 | 3 | Accessible by design | F-1-36 |
| 42 | 12 | Keyboard controls, screen-reader labels, high contrast, and reduced motion are built in. | F-1-36 |
| 43 | 4 | Version 1.0 · MV3 | F-1-37 |
| 44 | 6 | Add it in under a minute. | F-1-14 |
| 45 | 11 | Until the store listing is available, install the signed-off build locally. | F-1-37 |
| 46 | 7 | The archive contains the unpacked Chromium extension. | F-1-37 |
| 47 | 2 | Download extension | — |
| 48 | 5 | Download and unzip the extension. | — |
| 49 | 8 | Open chrome://extensions (or your browser’s extension page). | — |
| 50 | 12 | Turn on Developer mode, choose Load unpacked, and select the unzipped folder. | —; browser UI terms are necessary here |
| 51 | 10 | Pin the waypoint icon, choose an interval, and keep reading. | F-1-37 |
| 52 | 8 | Original AI-generated landscape; no people or brands depicted. | — |
| 53 | 1 | Privacy | — |
| 54 | 1 | Terms | — |
| 55 | 1 | Source | — |

No landing sentence exceeds 22 words. The landing still fails plain words because of audience omission, metaphor, inconsistent terms, vague adjectives, and jargon.

### README

| # | Words | Copy | Flag |
| ---: | ---: | --- | --- |
| 1 | 3 | Reading Comfort Pacer | — |
| 2 | 21 | Reading Comfort Pacer is a free Manifest V3 browser extension for screen workers who want distance breaks without being interrupted mid-thought. | F-1-41 |
| 3 | 29 | Its timer marks a break as ready, then waits for the user to reach and confirm a natural paragraph or task boundary before opening a calm full-screen distance cue. | F-1-38 |
| 4 | 6 | Live site: https://reading-comfort-pacer.sociobot.in | — |
| 5 | 3 | What it does | — |
| 6 | 14 | Persists 10, 20, 30, 45, or 60-minute reading intervals with the browser alarms API. | F-1-41 |
| 7 | 10 | Requests a boundary without covering or inspecting the current page. | F-1-31 |
| 8 | 12 | Starts a 20, 30, or 60-second distance cue only after explicit confirmation. | F-1-31 |
| 9 | 23 | Suggests a keyboard command (`Alt+Shift+R`, or `Command+Shift+Y` on macOS) when a break is ready and reports clearly if the browser leaves it unassigned. | F-1-39 |
| 10 | 14 | Offers a 10-minute intentional snooze, optional device vibration, a motion-pause control, and full disable. | F-1-31 |
| 11 | 15 | Stores only settings, timer state, and aggregate accepted/snoozed/completed counts in local extension storage. | F-1-41 |
| 12 | 11 | This is a general ergonomic utility, not medical advice or treatment. | — |
| 13 | 12 | It never requests camera, browsing history, page content, identity, or health-data permissions. | — |
| 14 | 1 | Develop | — |
| 15 | 6 | Requires Node.js 22 or newer. | — |
| 16 | 6 | The exact reproducible production command is: | — |
| 17 | 1 | Outputs: | — |
| 18 | 7 | `dist/extension/chrome-mv3/` — unpacked Chromium MV3 extension | F-1-37 |
| 19 | 11 | `dist/site/` — deployable static site (with `index.html` at its root) | — |
| 20 | 11 | `dist/site/downloads/reading-comfort-pacer-chrome.zip` — packaged extension linked by the site | — |
| 21 | 19 | To try the extension locally, open `chrome://extensions`, enable Developer mode, choose **Load unpacked**, and select `dist/extension/chrome-mv3`. | —; browser UI terms are necessary here |
| 22 | 1 | Architecture | — |
| 23 | 9 | WXT owns the MV3 background worker and extension pages. | F-1-41 |
| 24 | 17 | The background worker is the single timer-state authority; it persists state and reschedules alarms after every transition. | F-1-41 |
| 25 | 10 | Popup, settings, and break pages send typed messages to it. | F-1-41 |
| 26 | 16 | The static Vite landing site has no backend, analytics, cookies, runtime CDN, or external font request. | F-1-41 |
| 27 | 6 | The requested permissions are limited to: | — |
| 28 | 8 | `storage` for local preferences, state, and aggregate counts | F-1-41 |
| 29 | 11 | `alarms` for a timer that survives popup closure and browser sleep | — |
| 30 | 14 | The product direction, palette, motion policy, and generated-art provenance are in `.factory/design.md`. | F-1-41 |
| 31 | 24 | Atkinson Hyperlegible Next is self-hosted from the Fontsource package under the SIL Open Font License; all product code and original assets are MIT licensed. | F-1-40 |
| 32 | 1 | Deploy | — |
| 33 | 10 | Deploy the contents of `dist/site/` as a static site. | — |
| 34 | 14 | The included `staticwebapp.config.json` supplies security headers and immutable caching for hashed assets. | F-1-41 |
| 35 | 11 | Infrastructure, DNS, store publication, and billing are intentionally outside this repository. | — |
| 36 | 3 | Privacy and terms | — |
| 37 | 7 | User-facing policies ship at `/privacy/` and `/terms/`. | — |
| 38 | 13 | See the privacy page for the exact local data fields and deletion path. | — |

README sentences over 22 words: rows 3, 9, and 31. No banned word from the supplied list appears. The flagged jargon and inconsistent terminology remain plain-language failures even where the sentences are short.

## 4. Demo and sandbox evidence

| Check | Result | Evidence |
| --- | --- | --- |
| Visible “Try it with sample data” within one click | **FAIL** | No such link or button on the page |
| Direct `/demo` entry | **FAIL** | HTTP 404 |
| Realistic sample already visible after entry | **FAIL** | No entry exists |
| Persistent demo banner | **FAIL** | No demo implementation |
| Reset demo | **FAIL** | No demo implementation |
| Start for real | **FAIL** | No demo implementation |
| Separate storage namespace | **FAIL / untestable** | No demo storage or `.factory/demo.md` exists |
| Real data untouched | **FAIL / untestable** | There is no demo flow against which to place a sentinel |

## 5. Claims and test evidence

`.factory/claims.json` does not exist. Therefore the number of listed claim tests is zero, and every public promise in F-1-4 through F-1-23 is unlisted. There was no valid claims command to run.

Supplementary clean-clone checks at the exact candidate:

| Check | Result |
| --- | --- |
| `npm ci` | PASS; 240 packages, 0 vulnerabilities |
| `npm test` | PASS; 12/12 |
| `npm run build` | PASS; `dist/extension`, `dist/site`, and ZIP produced |
| `npm run check` | PASS; typecheck, lint, unit tests, build |
| `npm run test:e2e` | PASS; 6/6 |
| Live normal-page network interception | PASS; no foreign requests, cookies, localStorage, sessionStorage, console errors, or page errors |
| Live axe, 3 routes × 2 viewports × 2 color schemes | PASS; 0 serious/critical findings in all 12 runs |
| Live download | PASS; HTTP 200, 133,933 bytes; extracted payload exactly matches the clean build |

These are useful regression checks, but none is tagged and registered as required claim evidence, and none can prove demo isolation while `/demo` is absent.

## 6. History audit

No earlier `.factory/review-*.md` or `.factory/polish-*.md` exists. The only earlier handoff is `.factory/handoff.md`, which points to the two verification reports. I rechecked every defect from the earlier failing verification rather than accepting the later PASS label.

| Earlier defect | Live/code confirmation | Result |
| --- | --- | --- |
| Download returned 404 | Live ZIP returns 200 and byte-matches the fresh build payload | Fixed |
| Dark cue heading contrast | Live axe in light/dark at 390 and 1440 reports 0 serious/critical issues | Fixed |
| Shortcut not assigned | Clean installed-extension E2E verifies `Alt+Shift+R` and visible matching copy; live ZIP matches that build | Fixed |
| Clean-checkout gates depended on build order | Fresh clone `npm ci` then `npm test` passes before a build; `npm run check` passes | Fixed |
| Completed/stale view exposed motion | Installed-extension E2E verifies hidden control and `animationName: none` | Fixed |
| Malformed storage was not normalized | Installed-extension E2E verifies repaired defaults | Fixed |
| Touch targets below 44 px | Current site E2E passes its target assertions; prior full inventory is consistent with current byte-matched code | Fixed |
| Missing CSP | Live response has a restrictive same-origin CSP | Fixed |

None of those eight prior defects regressed. The current blocking findings concern first-read clarity, demo/claims compliance, and route structure that the prior verification did not evaluate against the attached review skills.

## 7. Structure, links, and identity

| Check | Result |
| --- | --- |
| Titles | PASS on `/`, `/privacy/`, `/terms/`; each follows the required pattern and is under 60 characters |
| One `h1`, `main`, `lang=en` | PASS on the three product routes |
| Meta description and canonical | PASS on the three product routes |
| OG/Twitter/apple-touch/theme metadata | FAIL; F-1-25 |
| Designed 404 | **BLOCKING FAIL**; F-1-24 |
| Deep links and browser back | Partial; URLs and back work, route focus/announcement fails per F-1-27 |
| Dead-link crawl | PASS; every discovered internal link/resource and both GitHub links returned 200 |
| Consistent header/footer | FAIL; F-1-26 |
| Landing information order | FAIL; F-1-28 and F-1-2 |
| Distinct visual identity | PASS; the topographic map palette, contour motif, waypoint shape, typography, art, and restrained motion are product-specific rather than a generic SaaS template |
| Accessibility smoke checks | PASS for sampled routes/themes/viewports; 0 serious/critical axe findings, no mobile horizontal overflow, visible skip/focus treatment |

## What would make this perfect

Resolve every finding, then rerun this review from a fresh context. The shortest complete route is: replace the hero with explicit job/audience copy; add a real `/demo` with banner, reset, start-real action, sample state, and isolated storage; create `.factory/demo.md` and `.factory/claims.json`; give every retained claim one tagged sandbox test; remove untestable or overbroad claims; ship the designed same-origin 404; complete route metadata and shared navigation; implement route focus/announcements; and apply every proposed copy rewrite. “Perfect” here means a subsequent review produces zero findings and zero untested claims, not merely that the existing test suite remains green.
