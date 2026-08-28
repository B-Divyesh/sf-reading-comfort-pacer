# Reading Comfort Pacer

Take screen breaks after a stopping point. Reading Comfort Pacer is for screen workers with tired eyes.

The timer marks a reminder as ready. It waits until you finish a paragraph or task, then starts a distance break.

Live site: <https://reading-comfort-pacer.sociobot.in>

## Try it first

Open <https://reading-comfort-pacer.sociobot.in/demo/?demo=1>. The sample starts with a ready reminder. It uses only the `demo:pacer` browser-storage key. Resetting returns it to the ready reminder. Starting for real removes that temporary key.

## What it does

- Uses 10, 20, 30, 45, or 60-minute intervals.
- Waits for your confirmation before a distance break.
- Offers 20, 30, or 60-second distance breaks.
- Lets you snooze a ready reminder for ten minutes.
- Lets you turn reminders off while keeping settings.
- Keeps your settings and break totals in your browser.

This is a general ergonomic utility. It is not medical advice or treatment.

## Run and verify

Requires Node.js 22 or newer.

```sh
npm ci
npm test
npm run build
npm run check
npm run test:e2e
```

`npm run build` creates these release files:

- `dist/extension/chrome-mv3/` — the folder to load from Chrome’s extension page.
- `dist/site/` — the static website.
- `dist/site/downloads/reading-comfort-pacer-chrome.zip` — the downloadable extension archive.

To load the extension, open `chrome://extensions`, enable Developer mode, choose **Load unpacked**, and select `dist/extension/chrome-mv3`.

## How it is built

WXT builds the browser extension. The extension schedules reminders with the browser’s alarm system. It keeps its settings and break totals in browser storage.

The website is a static Vite site. It has no account, analytics, cookies, third-party scripts, or third-party fonts. The extension requests only `storage` and `alarms` permissions. It has no host or content-script permission.

Atkinson Hyperlegible Next is self-hosted under the SIL Open Font License. Product code and original assets use the MIT License. The visual direction and generated-art provenance are in [`.factory/design.md`](.factory/design.md).

## Deploy

Deploy the contents of `dist/site/` as a static site. `staticwebapp.config.json` provides security headers, a one-year cache for hashed assets, a one-hour cache for the download, and the designed 404 route. Privacy and terms pages are at `/privacy/` and `/terms/`.
