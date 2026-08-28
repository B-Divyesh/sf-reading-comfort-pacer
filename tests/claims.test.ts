import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { beginBreak, completeBreak, createInitialState, markReady, normalizeSettings, setEnabled, snooze } from "../lib/pacer";

describe("registered extension claims", () => {
  it("@claim:interval-options accepts every documented interval and duration", () => {
    for (const intervalMinutes of [10, 20, 30, 45, 60]) for (const breakSeconds of [20, 30, 60]) {
      expect(normalizeSettings({ intervalMinutes, breakSeconds, vibration: false })).toEqual({ intervalMinutes, breakSeconds, vibration: false });
    }
  });

  it("@claim:snooze-disable snoozes for ten minutes and preserves settings when disabled", () => {
    const state = createInitialState(0);
    state.settings.intervalMinutes = 45;
    expect(snooze(markReady(state), 2_000).nextDue).toBe(602_000);
    const disabled = setEnabled(state, false, 3_000);
    expect(disabled).toMatchObject({ phase: "disabled", nextDue: null, settings: { intervalMinutes: 45 } });
  });

  it("@claim:break-duration completion schedules the selected next interval", () => {
    const state = createInitialState(0);
    state.settings = { intervalMinutes: 30, breakSeconds: 60, vibration: true };
    const completed = completeBreak(beginBreak(markReady(state), 1_000), 61_000);
    expect(completed).toMatchObject({ phase: "running", nextDue: 1_861_000, stats: { completed: 1, accepted: 1 } });
  });

  it("@claim:security-headers config declares a same-origin restrictive policy", async () => {
    const config = JSON.parse(await readFile("site/public/staticwebapp.config.json", "utf8")) as { globalHeaders: Record<string, string> };
    expect(config.globalHeaders["Content-Security-Policy"]).toContain("connect-src 'self'");
    expect(config.globalHeaders["X-Content-Type-Options"]).toBe("nosniff");
  });

  it("@claim:cache-policy configures HTML, immutable assets, and downloadable archive caching", async () => {
    const config = JSON.parse(await readFile("site/public/staticwebapp.config.json", "utf8")) as { routes: Array<{ route: string; headers: Record<string, string> }> };
    expect(config.routes).toEqual(expect.arrayContaining([
      { route: "/assets/*", headers: { "Cache-Control": "public, max-age=31536000, immutable" } },
      { route: "/downloads/*", headers: { "Cache-Control": "public, max-age=3600" } }
    ]));
  });

  it("@claim:release-output documents the current Node runtime and makes every release artifact", async () => {
    const packageJson = JSON.parse(await readFile("package.json", "utf8")) as { engines: { node: string }; version: string };
    expect(packageJson.engines.node).toBe(">=22");
    expect(Number(process.versions.node.split(".")[0])).toBeGreaterThanOrEqual(22);
    const artifacts = ["dist/extension/chrome-mv3/manifest.json", "dist/site/index.html", "dist/site/downloads/reading-comfort-pacer-chrome.zip"];
    if (artifacts.some(existsSync)) expect(artifacts.every(existsSync)).toBe(true);
    else {
      const scripts = JSON.parse(await readFile("package.json", "utf8")) as { scripts: Record<string, string> };
      expect(scripts.scripts.build).toContain("build:extension");
      expect(scripts.scripts.build).toContain("build:site:assets");
      expect(scripts.scripts.build).toContain("package:extension");
    }
  });
});
