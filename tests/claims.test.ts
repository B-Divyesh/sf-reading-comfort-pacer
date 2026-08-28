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

  it("@claim:asset-license records the local font and original-art provenance", async () => {
    const [design, notices, license] = await Promise.all([readFile(".factory/design.md", "utf8"), readFile("THIRD_PARTY_NOTICES.md", "utf8"), readFile("LICENSE", "utf8")]);
    expect(design).toContain("factory-image");
    expect(notices).toContain("Atkinson Hyperlegible");
    expect(license).toContain("Permission is hereby granted");
  });
});
