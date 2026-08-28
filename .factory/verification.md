# Independent product verification — FAIL

- Work order: `reading-comfort-pacer-verify-1`
- Candidate: `184d8c70f1fdbe0ffed0af6196340e0ccaf68ae3`
- Branch/remote at start: `main`, `origin/main` at the candidate
- Live URL: <https://reading-comfort-pacer.sociobot.in>
- Verified: 2026-08-28 UTC
- Environment: Node 22.23.2, npm 10.9.8, Playwright 1.58.2, Chromium/Chrome for Testing 145.0.7632.6

## Verdict

**FAIL.** The candidate's static pages are deployed, but the live product cannot be installed: both download links target `/downloads/reading-comfort-pacer-chrome.zip`, which returns HTTP 404. The candidate also fails the clean-checkout test/type gate, has a serious dark-mode contrast violation, and does not receive its advertised default keyboard shortcut in a fresh Chromium profile.

## Defects by severity

### Critical

1. **The live extension download is missing.** `GET` and `HEAD https://reading-comfort-pacer.sociobot.in/downloads/reading-comfort-pacer-chrome.zip` return `404 text/html`. Both primary live calls to action point to this URL. There is no browser-store alternative, so a new user cannot install the product or perform its job-to-be-done. The locally built archive is valid (133,518 bytes; final verification-build SHA-256 `23948786a0728050a01cfd471315be694248faa6e1cb1d153af997d26162dbc4`).

### High

2. **Dark mode has a serious WCAG contrast failure.** Axe 4.13 on the live home page with `prefers-color-scheme: dark` reports `color-contrast` on `#cue-title`: foreground `#101815` against `#070d0a`, ratio **1.08:1**, below the 3:1 requirement for this large text. The heading “One horizon. Nothing to dismiss.” is effectively unreadable. Light mode has no serious/critical axe findings.

3. **The advertised keyboard command is not assigned in a fresh browser profile.** The built manifest suggests `Alt+Shift+B`, but `chrome.commands.getAll()` returned `shortcut: ""` for `confirm-boundary` in both headless and headed Chromium with a clean profile. Pressing `Alt+Shift+B` while the extension was in the ready phase did not open the distance view. The popup still falsely displays “Alt + Shift + B at a ready boundary.” Toolbar controls remain keyboard operable, but the promised direct boundary command is unavailable.

### Medium

4. **Clean-checkout quality gates are order-dependent and initially fail.** Immediately after `npm ci`, `npm run check` exited 2 because `.wxt/tsconfig.json` did not exist and TypeScript reported WXT/browser declaration errors. A direct `npm test` then exited 1 with zero tests because Vite could not load `.wxt/tsconfig.json`. `npm run build` generates `.wxt`; only after that did `npx tsc --noEmit`, `npm test` (7/7), and `npm run check` pass. This contradicts the documented clean-checkout workflow and the required local quality gate.

5. **Completed/stale distance views do not actually hide the motion control.** The script sets `motion.hidden = true`, but the author `.button { display: inline-flex; }` rule overrides the browser's `[hidden]` rule. A stale/completed route still displays “Pause gentle motion”; the stale view also continues both decorative animations. This makes the recovery state misleading and adds avoidable motion.

### Low

6. **Malformed local state is not sanitized.** Injecting invalid stored values (`intervalMinutes: -1`, `breakSeconds: 0`, `completed: -3`, and wrong primitive types) leaves them intact after `normalizeState`, changes the phase to ready, and renders “-3 breaks completed.” Normal users cannot create these values through the constrained form, but storage corruption or schema drift does not recover safely.

7. **Several mobile touch targets are below 44×44 CSS px.** At 390px, footer links measured about 45–50×21px; skip links measured 30–41px high across site/extension pages. The primary controls meet the target-size requirement.

8. **No Content-Security-Policy response header is present on the public site.** HSTS, `X-Content-Type-Options`, `Referrer-Policy`, and a restrictive camera/microphone/geolocation `Permissions-Policy` are present. The missing CSP is defense-in-depth for this static site, not the cause of the release failure.

## Build and automated checks

| Check | Result |
| --- | --- |
| Clean checkout / candidate identity | PASS — clean tree at exact candidate; `origin/main` also pointed to it |
| `npm ci` | PASS — 237 packages installed; 0 vulnerabilities |
| `npm audit --audit-level=moderate` | PASS — 0 vulnerabilities |
| `npm run check` immediately after install | **FAIL** — missing `.wxt/tsconfig.json` plus TypeScript declaration errors |
| `npm test` immediately after install | **FAIL** — 0 tests run; missing `.wxt/tsconfig.json` |
| Exact `npm run build` | PASS — extension, site, and ZIP produced |
| `npx tsc --noEmit` after build | PASS |
| `npm test` after build | PASS — 7/7 |
| `npm run check` after WXT generation | PASS — typecheck, 7/7 tests, exact build |
| `npm run test:e2e` | PASS — 5/5 built-extension/site Playwright tests |
| Lint | N/A — no lint script/configuration is provided |

## Independent end-to-end exercise

The archive from the exact production build was unzipped into a temporary directory and loaded into clean headed and headless Chromium profiles.

- Real `chrome.alarms` firing moved running → ready, cleared the alarm, and set the `PAUSE` badge.
- Ready-state boundary confirmation opened the distance view; manual and countdown-driven completion returned to running and incremented local completion counts.
- Intentional snooze scheduled approximately 10 minutes and incremented only the snooze count.
- Boundary settings `10 min / 60 sec` and `60 min / 20 sec`, vibration on, save persistence, disable, and keyboard re-enable all worked.
- An abandoned break older than twice its configured length recovered to running; direct stale-break navigation showed the recovery copy.
- The motion pause toggled `aria-pressed`; reduced-motion emulation removed ridge/marker animation and hid that control.
- Popup, options, and distance pages had `lang=en`, one `h1`, one `main`, no horizontal overflow, no console/page errors, visible 3px focus, and no serious/critical axe issues in the sampled normal light states.
- Extension requests were exclusively `chrome-extension:` resources. The manifest requests only `storage` and `alarms`; it has no host/content-script permissions.
- No camera, microphone, history, page-content, account, analytics, cookie, telemetry, or remote API behavior was observed. Settings/state/counts remained in `chrome.storage.local`.

The repository's existing E2E test also covered ready → confirmed boundary → distance view → completion, disable, site semantics, console errors, 390px layout, and axe checks. It did not catch the live 404, dark theme, unassigned shortcut, stale motion control, or clean-order failure.

## Live deployment identity and browser checks

- Home, privacy, and terms HTML byte-match the candidate production build. SHA-256 for live/local home is `afd0b5328123b6837db57ac2be01edf6621c0bf30cb938b55db1c48e4fb16ffb`.
- All 14 expected public non-download artifacts (HTML, hashed JS/CSS/fonts/images, favicon, robots, sitemap) returned 200 and byte-matched the candidate. The required ZIP alone is absent, so the deployment does **not** fully match the candidate.
- Desktop 1440×1000 and mobile 390×844 had no horizontal overflow, broken images, console exceptions, or failed page-resource requests. The responsive AVIF decoded at 1280px desktop and 768px mobile. Manual screenshot review found no clipping or overlap.
- Live browsing made no third-party runtime request. No cookies or `Set-Cookie` headers were observed. Privacy and terms routes return 200.
- HTTP redirects to HTTPS. TLS certificate is valid from 2026-08-28 through 2027-02-28. HSTS, `nosniff`, referrer, and permissions policies are present.
- Hashed assets use `Cache-Control: public, max-age=31536000, immutable` and conditional requests return 304. HTML uses `public, must-revalidate, max-age=30`. The missing download has no successful cache policy to assess.

## Accessibility, responsiveness, and performance

- Axe 4.13, light mode: 0 serious/critical findings on live home/privacy/terms at 1440×1000 and 390×844; 0 in sampled extension states.
- Axe 4.13, dark mode: **1 serious finding** on the live home page (defect 2).
- Keyboard: skip links receive a visible 3px focus ring; forms and state actions operate with Tab/Enter/Space. The direct extension command fails as described in defect 3.
- Reduced motion: media query matched, site animations/transitions were effectively disabled, and extension distance animation was removed.
- Lighthouse 12.8.2 mobile, live: Performance **98**, Accessibility **100** (default light scheme), Best Practices **100**, SEO **100**; FCP **1.054 s**, LCP **1.129 s**, TBT **0 ms**, CLS **0.0876**.
- Production budgets pass: site initial JS 0.89 KB, CSS 8.07 KB, fonts 53.08 KB total, mobile AVIF 20.56 KB, and unpacked extension build 149.34 KB.

## Applicability notes

This is a browser extension plus static distribution site, not a library, CLI, PWA, or backend. Consumer installation of the locally produced ZIP was tested. Service-worker offline/update, backend concurrency/persistence/health identity, and library/CLI packaging checks do not apply.

## Required release actions

1. Deploy and verify the exact ZIP at the URL used by both calls to action.
2. Fix dark-mode cue-heading contrast and rerun axe under both color schemes.
3. Choose a reliably assignable command shortcut or detect/report the unassigned state; verify in a fresh headed Chrome profile.
4. Make `npm test` and `npm run check` self-initialize WXT types on a clean checkout.
5. Honor `hidden` for completed/stale controls, validate persisted state, enlarge undersized touch targets, and add a CSP.
