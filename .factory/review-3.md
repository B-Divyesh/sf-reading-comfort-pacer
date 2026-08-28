# Adversarial first-read review 3 — Reading Comfort Pacer

- Verdict: **FAIL**
- Reviewed: 2026-08-28 UTC
- Candidate: `cae6b313f4314006cd1b21380c523db8cb96e5d0`
- Live URL: <https://reading-comfort-pacer.sociobot.in>
- Viewports: fresh Chromium contexts at 390 × 844 and 1440 × 900

The core job is clear and the sample is genuinely usable. This round still fails the zero-findings standard. The previously reported 44 px control requirement is not fixed across the site, and the demo banner has an invalid ARIA role. No product code was changed during this review.

## Cold first screen

Before scrolling, both fresh contexts gave the same answers:

| Question | Answer from the first screen | Result |
| --- | --- | --- |
| What does it do? | It asks a screen worker to take a distance break after they finish a paragraph or task. | Pass |
| For whom? | Screen workers with tired eyes. | Pass |
| What should I click first? | **Try it with sample data**; the adjacent text says it opens a temporary ready reminder and saves nothing. | Pass |

The decisive visible copy is “Take screen breaks after a stopping point.”, “For screen workers with tired eyes, it waits until you finish a paragraph or task before a distance break.”, and “Try it with sample data”. At 390 px the primary action, outcome note, and all three facts were above the fold. At 1440 px the primary action and three facts were also visible. Both loads had no page errors, no third-party requests, and no horizontal overflow.

## Findings

### Blocking

#### F-2-3 / F-3-1 — The 44 px target repair is incomplete on desktop

- Location and evidence: live `/privacy/` at 1440 × 900. The external contact link, “public issue tracker (external)”, measures **219 × 22 CSS px**. The prior finding F-2-3 required every interactive target to meet the 44 px baseline.
- Why this fails: the published site-wide accessibility claim says “Visible site controls are at least 44 pixels tall and wide.” The existing `@claim:touch-targets` test visits only the demo route, so it misses this live control. The historical finding is therefore half-fixed and remains blocking under the review instructions.
- Concrete fix: make inline legal-page links a 44 px minimum touch target without breaking prose flow, then expand `@claim:touch-targets` to check every public route at desktop and 390 px, including the Privacy contact link.

### Minor

#### F-3-2 — The demo banner uses an ARIA role that is not permitted on `<aside>`

- Location and quote: `/demo/?demo=1`, `<aside class="demo-banner" role="status">Demo — sample data, nothing is saved…</aside>`.
- Evidence: Axe 4.13 reports `aria-allowed-role` (minor): “ARIA role status is not allowed for given element.” It reproduces in light and dark mode at 390 px.
- Why this matters: the persistent demo state is important information. Invalid role semantics make the announcement behavior less dependable for assistive technology, even though there are no serious or critical axe findings.
- Concrete fix: use a `<div role="status">` for the live status, or keep the `<aside>` and use a permitted live-region pattern. Add an axe assertion for `/demo/?demo=1` to `@claim:accessible-demo`.

## Copy audit

Counts use whitespace-separated words, with URLs, paths, and hyphenated compounds each counted as one word. The tables list every complete sentence on the landing page and README. Navigation, headings, labels, and buttons were also checked: no heading is contextless; all landing/demo action controls name their result (notably “Try it with sample data”, “Start distance break”, “Finish break”, “Reset demo”, and “Download extension”); and no banned marketing adjective appears.

### Landing page

| Words | Sentence | Flag |
| ---: | --- | --- |
| 7 | Take screen breaks after a stopping point. | — |
| 19 | For screen workers with tired eyes, it waits until you finish a paragraph or task before a distance break. | — |
| 5 | Opens a temporary ready reminder. | — |
| 3 | Nothing is saved. | — |
| 15 | The sample opens at the point where you choose whether to start a distance break. | — |
| 15 | When the timer ends, the extension waits for you to finish the paragraph or task. | — |
| 10 | When the timer ends, it marks a reminder as ready. | — |
| 12 | Use the extension icon to start the break when you are ready. | — |
| 10 | A full-screen timer runs for 20, 30, or 60 seconds. | — |
| 8 | Look at a far object you can see. | — |
| 7 | Pause the gentle motion if you want. | — |
| 8 | Your device’s Reduce Motion setting turns it off. | — |
| 8 | This is an ergonomic prompt, not medical treatment. | — |
| 10 | The extension requests no page, camera, history, or identity permission. | — |
| 9 | It has no camera, history, page-content, or identity permission. | — |
| 9 | Your settings and break totals stay in your browser. | — |
| 9 | You can stop scheduled reminders and keep your settings. | — |
| 11 | Controls have names, visible focus, and follow your device’s motion setting. | — |
| 3 | Download this build. | — |
| 9 | The archive contains the folder you load in Chrome. | — |
| 14 | Reading Comfort Pacer helps screen workers take a distance break after a stopping point. | — |

### README

| Words | Sentence or complete bullet | Flag |
| ---: | --- | --- |
| 7 | Take screen breaks after a stopping point. | — |
| 10 | Reading Comfort Pacer is for screen workers with tired eyes. | — |
| 7 | The timer marks a reminder as ready. | — |
| 14 | It waits until you finish a paragraph or task, then starts a distance break. | — |
| 4 | Live site: https://reading-comfort-pacer.sociobot.in | — |
| 6 | Open https://reading-comfort-pacer.sociobot.in/demo/?demo=1. | — |
| 7 | The sample starts with a ready reminder. | — |
| 6 | It uses only the `demo:pacer` browser-storage key. | Technical verifier detail, appropriate in README. |
| 7 | Resetting returns it to the ready reminder. | — |
| 7 | Starting for real removes that temporary key. | — |
| 8 | Uses 10, 20, 30, 45, or 60-minute intervals. | — |
| 8 | Waits for your confirmation before a distance break. | — |
| 7 | Offers 20, 30, or 60-second distance breaks. | — |
| 9 | Lets you snooze a ready reminder for ten minutes. | — |
| 8 | Lets you turn reminders off while keeping settings. | — |
| 9 | Keeps your settings and break totals in your browser. | — |
| 5 | This is a general ergonomic utility. | — |
| 7 | It is not medical advice or treatment. | — |
| 5 | Requires Node.js 22 or newer. | — |
| 6 | `npm run build` creates these release files: | — |
| 9 | The folder to load from Chrome’s extension page. | — |
| 3 | The static website. | — |
| 4 | The downloadable extension archive. | — |
| 15 | To load the extension, open `chrome://extensions`, enable Developer mode, choose **Load unpacked**, and select `dist/extension/chrome-mv3`. | Necessary Chrome UI labels. |
| 5 | WXT builds the browser extension. | Technical build detail, scoped to its heading. |
| 9 | The extension schedules reminders with the browser’s alarm system. | — |
| 9 | It keeps its settings and break totals in browser storage. | — |
| 6 | The website is a static Vite site. | Technical build detail, scoped to its heading. |
| 11 | It has no account, analytics, cookies, third-party scripts, or third-party fonts. | — |
| 7 | The extension requests only `storage` and `alarms` permissions. | Necessary permission names. |
| 6 | It has no host or content-script permission. | Necessary permission term. |
| 11 | Atkinson Hyperlegible Next is self-hosted under the SIL Open Font License. | Necessary licence name. |
| 9 | Product code and original assets use the MIT License. | — |
| 8 | The visual direction and generated-art provenance are in `.factory/design.md`. | Technical repository reference, scoped to docs. |
| 8 | Deploy the contents of `dist/site/` as a static site. | — |
| 22 | `staticwebapp.config.json` provides security headers, a one-year cache for hashed assets, a one-hour cache for the download, and the designed 404 route. | Technical deploy detail, at the cap but not over it. |
| 8 | Privacy and terms pages are at `/privacy/` and `/terms/`. | — |

No sentence exceeds 22 words. The product consistently uses **stopping point**, **ready reminder**, **distance break**, and **extension icon** for the same concepts.

## Demo and sandbox

Pass. The hero reaches `/demo/?demo=1` in one click. Its first screen shows a realistic ready state: “Sample: you have read a project brief for 20 minutes. The reminder is waiting; it has not interrupted your page.” The persistent banner reads “Demo — sample data, nothing is saved” and exposes both **Reset demo** and **Start for real**.

In a fresh live context, I seeded `real:pacer-sentinel=keep`, entered the demo, started and finished the sample break, reset it, then exited it. Demo writes appeared only under `demo:pacer`; the real sentinel stayed `keep`; **Start for real** removed only `demo:pacer`. With the context offline after initial load, **Start distance break** still changed the ready sample to the in-progress sample. Whole-flow request interception found no third-party origin and no console error.

## Claims

I cloned the candidate cleanly to `/tmp/reading-comfort-pacer-review3.be649h`, ran `npm ci`, then ran every exact command listed in `.factory/claims.json` individually. The sequence reached the `release-output` build with `|| exit 1`; a final combined tagged run independently confirmed all 15 browser claims and all 6 unit/build claims.

| Claim id | Result | Evidence |
| --- | --- | --- |
| demo-isolation | Pass | Fresh demo sentinel/reset/exit test |
| boundary-wait | Pass | Fresh ready → explicit start test |
| no-account | Pass | Landing and demo gate inspection |
| privacy-permissions | Pass | Built manifest and request interception |
| download-build | Pass | Built ZIP/MV3/version assertion |
| site-routes | Pass | Unknown-route 404 assertion |
| accessible-demo | Pass | Keyboard and reduced-motion test |
| interval-options | Pass | All documented interval/duration combinations |
| snooze-disable | Pass | Ten-minute snooze and retained setting |
| break-duration | Pass | Selected interval rescheduled after completion |
| security-headers | Pass | Static configuration assertion |
| browser-alarm-timer | Pass | Fresh installed extension alarm/no-network assertion |
| extension-storage-schema | Pass | Fresh installed extension schema assertion |
| pause-animation | Pass | Installed break-view pause assertion |
| accessible-extension | Pass | Installed popup/options/break accessibility assertion |
| site-privacy | Pass | Fresh public-route cookie/storage/request crawl |
| cache-policy | Pass | Static cache configuration assertion |
| asset-license | Pass | Built self-hosted font and provenance assertion |
| release-output | Pass | Node 22 build and all three artifacts |
| route-metadata | Pass | Five-route title/canonical/share metadata assertion |
| touch-targets | Pass, but incomplete | Only tests the demo route; the live Privacy desktop counterexample is F-2-3 / F-3-1. |

The live landing and README promises map to registered entries: boundary behavior, account/payment gate, permissions, intervals, snooze/disable, browser-local settings/totals, motion, accessibility, privacy, self-hosted assets, build outputs, metadata, and cache behavior. No additional unlisted claim was found.

## Earlier-finding verification

I read both earlier reviews, both polish records, and the prior handoff. The table records live/code evidence rather than trusting their “fixed” labels.

| Earlier id | Status in round 3 | Current evidence |
| --- | --- | --- |
| F-1-1 | Fixed | Audience and job copy visible cold at both widths. |
| F-1-2 | Fixed | One-click `demo:` sandbox, banner, reset, exit, and sentinel check. |
| F-1-3 | Fixed | 21-entry registry; every tag passes from a clean clone. |
| F-1-4 | Fixed | `boundary-wait` checks ready before explicit start. |
| F-1-5 | Fixed | “Free forever” removed; no account/payment gate claim passes. |
| F-1-6 | Fixed | Broad browser-support promise removed. |
| F-1-7 | Fixed | Manifest has only storage/alarms; same-origin demo flow. |
| F-1-8 | Fixed | Installed extension alarm/no-network claim passes. |
| F-1-9 | Fixed | Untestable shortcut marketing removed. |
| F-1-10 | Fixed | Documented durations and boundary behavior are tested. |
| F-1-11 | Fixed | Installed distance-view pause claim passes. |
| F-1-12 | Fixed | Exact local extension schema claim passes. |
| F-1-13 | Fixed | Extension axe/name/focus coverage and demo keyboard/motion coverage pass. |
| F-1-14 | Fixed | No installation-time promise remains. |
| F-1-15 | Fixed | Live ZIP is 200 and packaged-build claim passes. |
| F-1-16 | Fixed | Fresh public-route privacy crawl passes; live requests are same-origin. |
| F-1-17 | Fixed | Exact manifest permission test passes. |
| F-1-18 | Fixed | Internal worker authority promise was removed in favor of observable behavior. |
| F-1-19 | Fixed | Header and cache claims pass; live CSP and cache headers are present. |
| F-1-20 | Fixed | Built font request/provenance/license claim passes. |
| F-1-21 | Fixed | Node 22/release-output claim passes. |
| F-1-22 | Fixed | Download claim compares manifest/package/displayed version. |
| F-1-23 | Fixed | Comparative behavioral assertion removed. |
| F-1-24 | Fixed | Unknown live path is same-origin designed 404 with HTTP 404. |
| F-1-25 | Fixed | Route-specific OG/Twitter title and `og:url` pass on five routes. |
| F-1-26 | Fixed | Shared header/footer include Privacy, Terms, factory credit, and version. |
| F-1-27 | Fixed | Forward/back moves focus to each h1 and updates the polite announcement. |
| F-1-28 | Fixed | First screen has sample outcome, facts, and live-preview path. |
| F-1-29 | Fixed | Eyebrow is the concrete “Pause after a stopping point”. |
| F-1-30 | Fixed | Headline names the screen-break job. |
| F-1-31 | Fixed | Core terminology is consistent. |
| F-1-32 | Fixed | Earlier design/accessibility jargon removed or made plain. |
| F-1-33 | Fixed | Distance-break heading is descriptive. |
| F-1-34 | Fixed | Privacy heading states the permission boundary. |
| F-1-35 | Fixed | “Turn reminders off” is plain action copy. |
| F-1-36 | Fixed | Concrete keyboard/screen-reader heading replaces marketing label. |
| F-1-37 | Fixed | Installation copy uses needed Chrome labels and plain explanations. |
| F-1-38 | Fixed | README behavior is split below the cap. |
| F-1-39 | Fixed | Platform shortcut sentence removed. |
| F-1-40 | Fixed | Licence statements are split below the cap. |
| F-1-41 | Fixed | Technology terms are confined to build/deploy context. |
| F-2-1 | Fixed | Privacy text now gives browser-qualified removal guidance. |
| F-2-2 | Fixed | Claim test requests an actual unknown path through the configured 404 host. |
| F-2-3 | **UNRESOLVED / BLOCKING** | Desktop Privacy contact link remains 22 px tall; see F-3-1. |
| F-2-4 | Fixed | Demo control says “Start distance break”. |
| F-2-5 | Fixed | Visitor copy says “break totals” and “your browser”. |
| F-2-6 | Fixed | Visitor copy names the device Reduce Motion setting. |
| F-2-7 | Fixed | First-screen fact says “Free”. |

## Structure, accessibility, links, and identity

- Pass: `/`, `/demo/?demo=1`, `/privacy/`, `/terms/`, and an unknown path have the expected distinct titles, one h1, one main, `lang=en`, descriptions, canonical URLs, OG/Twitter metadata, favicon, and apple-touch icon.
- Pass: the unknown path returns HTTP 404 with “This page is not on the map.” and a working home link. The browser’s expected network-level 404 console message is not an application exception.
- Pass: home → privacy → back focused the receiving h1 and announced the route title. Deep links reload correctly.
- Pass: all discovered internal links, ZIP download, repository link, and issue-tracker link returned HTTP 200; only the deliberately unknown path returned 404.
- Pass: Axe 4.13 found zero serious/critical violations on home, demo, privacy, terms, and 404 in light and dark 390 px contexts. The demo’s one minor violation is F-3-2.
- Fail: desktop target sizing is F-2-3 / F-3-1.
- Pass: the map-paper palette, contour treatment, vermilion marker, Atkinson type, and generated ridge form a distinct topographic-cartography identity rather than a generic SaaS template. It matches `.factory/design.md`.

## Missed leverage

No finding. The brief does not imply AI, import/export, or sync; adding any of those to a local timer would be decorative rather than valuable. No runtime AI feature or provider key is present.

## What would make this perfect

Repair the Privacy page’s desktop contact hit area, broaden the target-size claim test to every route and both required layouts, correct the demo banner’s invalid ARIA role, and add an axe assertion for the demo. Re-run this complete cold-read, demo-isolation, claim, history, route, copy, and accessibility review. A PASS requires zero remaining findings.
