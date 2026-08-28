# Reading Comfort Pacer

Reading Comfort Pacer is a free Manifest V3 browser extension for screen workers who want distance breaks without being interrupted mid-thought. Its timer marks a break as ready, then waits for the user to reach and confirm a natural paragraph or task boundary before opening a calm full-screen distance cue.

Live site: <https://reading-comfort-pacer.sociobot.in>

## What it does

- Persists 10, 20, 30, 45, or 60-minute reading intervals with the browser alarms API.
- Requests a boundary without covering or inspecting the current page.
- Starts a 20, 30, or 60-second distance cue only after explicit confirmation.
- Suggests a keyboard command (`Alt+Shift+R`, or `Command+Shift+Y` on macOS) when a break is ready and reports clearly if the browser leaves it unassigned.
- Offers a 10-minute intentional snooze, optional device vibration, a motion-pause control, and full disable.
- Stores only settings, timer state, and aggregate accepted/snoozed/completed counts in local extension storage.

This is a general ergonomic utility, not medical advice or treatment. It never requests camera, browsing history, page content, identity, or health-data permissions.

## Develop

Requires Node.js 22 or newer.

```sh
npm install
npm run dev              # WXT extension development
npm run dev:site         # landing site development
npm test                 # state-machine unit tests
npm run lint             # static source checks
npm run test:e2e         # installed-extension + site/axe browser tests
npm run check            # typecheck, unit test, and production build
npm run build:site       # standalone deployable site build, including the extension ZIP
```

The exact reproducible production command is:

```sh
npm ci
npm run build
```

Outputs:

- `dist/extension/chrome-mv3/` — unpacked Chromium MV3 extension
- `dist/site/` — deployable static site (with `index.html` at its root)
- `dist/site/downloads/reading-comfort-pacer-chrome.zip` — packaged extension linked by the site

To try the extension locally, open `chrome://extensions`, enable Developer mode, choose **Load unpacked**, and select `dist/extension/chrome-mv3`.

## Architecture

WXT owns the MV3 background worker and extension pages. The background worker is the single timer-state authority; it persists state and reschedules alarms after every transition. Popup, settings, and break pages send typed messages to it. The static Vite landing site has no backend, analytics, cookies, runtime CDN, or external font request.

The requested permissions are limited to:

- `storage` for local preferences, state, and aggregate counts
- `alarms` for a timer that survives popup closure and browser sleep

The product direction, palette, motion policy, and generated-art provenance are in [`.factory/design.md`](.factory/design.md). Atkinson Hyperlegible Next is self-hosted from the Fontsource package under the SIL Open Font License; all product code and original assets are MIT licensed.

## Deploy

Deploy the contents of `dist/site/` as a static site. The included `staticwebapp.config.json` supplies security headers and immutable caching for hashed assets. Infrastructure, DNS, store publication, and billing are intentionally outside this repository.

## Privacy and terms

User-facing policies ship at `/privacy/` and `/terms/`. See [the privacy page](site/privacy/index.html) for the exact local data fields and deletion path.
