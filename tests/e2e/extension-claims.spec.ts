import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { chromium, expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import type { BrowserContext, Worker } from "playwright";
import type { PacerState } from "../../lib/pacer";

async function withExtension(check: (input: { context: BrowserContext; worker: Worker; id: string; requests: string[] }) => Promise<void>) {
  const userDataDir = await mkdtemp(join(tmpdir(), "pacer-claim-"));
  const context = await chromium.launchPersistentContext(userDataDir, { headless: true, channel: "chromium", args: [`--disable-extensions-except=${resolve("dist/extension/chrome-mv3")}`, `--load-extension=${resolve("dist/extension/chrome-mv3")}`] });
  const requests: string[] = [];
  context.on("request", (request) => requests.push(request.url()));
  try {
    let worker = context.serviceWorkers()[0];
    if (!worker) worker = await context.waitForEvent("serviceworker");
    const id = new URL(worker.url()).host;
    const bootstrap = await context.newPage();
    await bootstrap.goto(`chrome-extension://${id}/popup.html`);
    await expect(bootstrap.getByRole("heading", { name: "Reading comfort pacer" })).toBeVisible();
    await bootstrap.close();
    await check({ context, worker, id, requests });
  } finally { await context.close(); }
}

test("@claim:browser-alarm-timer installed extension stores a local schedule in browser alarms", async () => {
  test.setTimeout(60_000);
  await withExtension(async ({ worker, requests }) => {
    const scheduled = await worker.evaluate(async () => {
      const state = (await chrome.storage.local.get("pacerState")).pacerState as PacerState;
      const alarm = await chrome.alarms.get("reading-comfort-boundary");
      return { state, alarm };
    });
    expect(scheduled.state.phase).toBe("running");
    expect(scheduled.state.nextDue).toEqual(expect.any(Number));
    expect(scheduled.alarm?.scheduledTime).toEqual(expect.any(Number));
    expect(requests.filter((url) => /^https?:/.test(url))).toEqual([]);
  });
});

test("@claim:extension-storage-schema installed extension keeps only the documented local state", async () => {
  test.setTimeout(60_000);
  await withExtension(async ({ worker, requests }) => {
    const stored = await worker.evaluate(async () => await chrome.storage.local.get(null));
    expect(Object.keys(stored)).toEqual(["pacerState"]);
    expect(stored.pacerState).toMatchObject({ phase: "running", settings: { intervalMinutes: 20, breakSeconds: 20, vibration: false }, stats: { completed: 0, snoozed: 0, accepted: 0 } });
    expect(Object.keys(stored.pacerState as object).sort()).toEqual(["breakStarted", "nextDue", "phase", "settings", "stats"]);
    expect(requests.filter((url) => /^https?:/.test(url))).toEqual([]);
  });
});

test("@claim:pause-animation distance view pauses gentle motion on command", async () => {
  test.setTimeout(60_000);
  await withExtension(async ({ context, worker, id }) => {
    await worker.evaluate(async () => {
      const stored = (await chrome.storage.local.get("pacerState")).pacerState as PacerState;
      await chrome.storage.local.set({ pacerState: { ...stored, phase: "breaking", nextDue: null, breakStarted: Date.now() } });
    });
    const page = await context.newPage();
    await page.goto(`chrome-extension://${id}/break.html`);
    const motion = page.getByRole("button", { name: "Pause gentle motion" });
    await motion.click();
    await expect(page.locator("#motion")).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#motion")).toHaveText("Resume gentle motion");
    expect(await page.locator(".ridge-front, .distance-marker").evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).animationPlayState))).toEqual(["paused", "paused"]);
  });
});

test("@claim:accessible-extension installed popup, settings, and break view expose controls and visible focus", async () => {
  test.setTimeout(60_000);
  await withExtension(async ({ context, worker, id }) => {
    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${id}/popup.html`);
    await expect(popup.getByRole("heading", { name: "Reading comfort pacer" })).toBeVisible();
    await popup.locator(".skip-link").focus();
    expect(await popup.locator(".skip-link").evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe("none");
    expect((await new AxeBuilder({ page: popup as never }).analyze()).violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
    const options = await context.newPage();
    await options.goto(`chrome-extension://${id}/options.html`);
    await expect(options.getByRole("checkbox", { name: /Enable boundary requests/ })).toBeVisible();
    expect((await new AxeBuilder({ page: options as never }).analyze()).violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
    await worker.evaluate(async () => {
      const stored = (await chrome.storage.local.get("pacerState")).pacerState as PacerState;
      await chrome.storage.local.set({ pacerState: { ...stored, phase: "breaking", nextDue: null, breakStarted: Date.now() } });
    });
    const distance = await context.newPage();
    await distance.goto(`chrome-extension://${id}/break.html`);
    await expect(distance.getByRole("button", { name: "Finish break" })).toBeVisible();
    expect((await new AxeBuilder({ page: distance as never }).analyze()).violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
  });
});
