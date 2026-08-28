# Reading Comfort Pacer — build handoff

Work order: `reading-comfort-pacer-build-1`

Completed: 2026-08-28

Artifact: WXT + TypeScript Manifest V3 extension and Vite static landing site

## What shipped

- Persistent local-first timer using MV3 `alarms` and `storage` only.
- Four explicit phases: running, boundary ready, distance break, and fully disabled.
- Natural-boundary confirmation in the popup plus the `Alt+Shift+B` / `Command+Shift+B` ready-state shortcut.
- Intentional 10-minute snooze and a manual early distance break.
- Full-screen distance cue with configurable 20/30/60-second countdown, early finish, optional vibration, pausable motion, and reduced-motion fallback.
- Settings page with 10/20/30/45/60-minute intervals and local completed-break count.
- Recovery for elapsed alarms and abandoned break pages; alarm and badge state are resynchronized after every transition.
- Responsive topographic-cartography landing site, 390px treatment, install instructions, packaged Chrome download, privacy and terms pages.
- Original factory-generated ridge illustration with committed prompt/provenance plus AVIF and WebP responsive variants.
- Self-hosted Atkinson Hyperlegible Next; no runtime CDN, analytics, cookies, accounts, or remote APIs.

## Build and outputs

From a clean checkout:

```sh
npm ci
npm run build
```

The build produces:

- `dist/extension/chrome-mv3/manifest.json`
- `dist/site/index.html`
- `dist/site/downloads/reading-comfort-pacer-chrome.zip`

The deploy root is exactly `dist/site/`. The packaged extension archive is 134 KB; the unpacked extension is 149 KB total.

## Verification performed

- `npx tsc --noEmit` — passed.
- `npm test` — 7/7 state-machine tests passed.
- `npm run build` — passed from a clean `dist`; WXT extension, Vite site, and downloadable zip all produced.
- `npm run test:e2e` — 5/5 Playwright tests passed:
  - loads the built MV3 extension in Chromium 1.58.2;
  - verifies elapsed/ready → user-confirmed boundary → distance view → completed/local state;
  - verifies the full-disable path;
  - runs axe against the popup, distance view, home, privacy, and terms pages with no serious/critical violations;
  - checks titles, `lang`, single `h1`, `main`, a 390px viewport, download availability, and console errors.
- `npm audit --audit-level=moderate` — 0 production or development vulnerabilities.
- Manual generated-image review — no text, brands, people, seams, or malformed elements.
- Manual 390×844 and 1440×1000 visual review — no clipping, horizontal overflow, or illegible states.

Lighthouse 12.8.2 mobile against the production build:

| Category / metric | Result |
| --- | ---: |
| Performance | 98 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| Largest Contentful Paint | 1.4 s |
| Total Blocking Time | 0 ms |
| Cumulative Layout Shift | 0.088 |

Static budgets: initial site JS 0.89 KB, CSS 8.07 KB, font files 53.08 KB total, mobile hero AVIF 20.56 KB / WebP 40.40 KB, all within the contract.

## Known gaps and next steps

- The factory still needs to publish the extension to browser stores. V1 therefore links a directly downloadable Chromium zip with honest sideload instructions.
- Firefox metadata is present, but this work order packages and tests Chrome MV3 only, as requested by the stack decision.
- `navigator.vibrate` is device/browser dependent and silently degrades when unsupported.
- MV3 alarms may resume slightly late after a sleeping device; the state normalizer immediately marks an overdue boundary ready on the next extension wake.
- No longitudinal success telemetry is collected by design. The user can see the local completed count, but the 14-day aggregate success measure cannot be observed centrally without changing the privacy contract.
