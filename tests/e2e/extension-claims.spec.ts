import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { chromium, expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import type { BrowserContext, Locator, Page, Worker } from "playwright";
import type { PacerState } from "../../lib/pacer";

type FocusIndicator = { outlineColor: string; outlineStyle: string; outlineWidth: string; surfaceColor: string };

function rgb(value: string): [number, number, number] {
  const values = value.match(/[\d.]+/g)?.slice(0, 3).map(Number);
  if (!values || values[0] === undefined || values[1] === undefined || values[2] === undefined) throw new Error(`Expected an RGB color, received ${value}.`);
  return [values[0], values[1], values[2]];
}

function luminance(channel: number): number {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(color: string): number {
  const [red, green, blue] = rgb(color);
  return 0.2126 * luminance(red) + 0.7152 * luminance(green) + 0.0722 * luminance(blue);
}

function contrastRatio(first: string, second: string): number {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  return (Math.max(firstLuminance, secondLuminance) + 0.05) / (Math.min(firstLuminance, secondLuminance) + 0.05);
}

async function focusIndicator(control: Locator): Promise<FocusIndicator> {
  return control.evaluate((element) => {
    const visual = element instanceof HTMLInputElement && element.type === "radio" && element.nextElementSibling instanceof HTMLElement
      ? element.nextElementSibling
      : element;
    const opaqueBackground = (start: Element): string => {
      let candidate: Element | null = start;
      while (candidate) {
        const color = getComputedStyle(candidate).backgroundColor;
        const alpha = Number(color.match(/[\d.]+/g)?.[3] ?? "1");
        if (alpha > 0) return color;
        candidate = candidate.parentElement;
      }
      return getComputedStyle(document.documentElement).backgroundColor;
    };
    const style = getComputedStyle(visual);
    return { outlineColor: style.outlineColor, outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth, surfaceColor: opaqueBackground(visual) };
  });
}

async function assertFocusIndicator(control: Locator, label: string): Promise<void> {
  const indicator = await focusIndicator(control);
  expect(indicator.outlineStyle, `${label} outline style`).not.toBe("none");
  expect(Number.parseFloat(indicator.outlineWidth), `${label} outline width`).toBeGreaterThanOrEqual(2);
  expect(contrastRatio(indicator.outlineColor, indicator.surfaceColor), `${label} focus contrast`).toBeGreaterThanOrEqual(3);
}

async function assertKeyboardFocusForEveryControl(page: Page): Promise<void> {
  const controls = page.locator("a[href]:visible, button:not([disabled]):visible, input:not([disabled]):not([type=radio]):visible, input[type=radio]:checked:visible, select:not([disabled]):visible");
  const total = await controls.count();
  expect(total).toBeGreaterThan(0);
  await page.evaluate(() => { document.body.tabIndex = -1; document.body.focus(); });
  for (let index = 0; index < total; index += 1) {
    await page.keyboard.press("Tab");
    const control = controls.nth(index);
    await expect(control).toBeFocused();
    await assertFocusIndicator(control, `control ${index}`);
  }
  const radioGroups = await page.locator("input[type=radio]:visible").evaluateAll((radios) => [...new Set(radios.map((radio) => (radio as HTMLInputElement).name))]);
  for (const name of radioGroups) {
    const radios = page.locator(`input[type=radio][name="${name}"]:visible`);
    const count = await radios.count();
    if (count < 2) continue;
    await page.locator(`input[type=radio][name="${name}"]:checked:visible`).focus();
    for (let index = 0; index < count; index += 1) {
      await page.keyboard.press("ArrowRight");
      const selected = page.locator(`input[type=radio][name="${name}"]:checked:visible`);
      await expect(selected).toBeFocused();
      await assertFocusIndicator(selected, `${name} radio ${index}`);
    }
  }
  await page.evaluate(() => document.body.removeAttribute("tabindex"));
}

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
    await assertKeyboardFocusForEveryControl(popup);
    expect((await new AxeBuilder({ page: popup as never }).analyze()).violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
    const options = await context.newPage();
    await options.goto(`chrome-extension://${id}/options.html`);
    await expect(options.getByRole("checkbox", { name: /Enable boundary requests/ })).toBeVisible();
    await assertKeyboardFocusForEveryControl(options);
    expect((await new AxeBuilder({ page: options as never }).analyze()).violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
    await worker.evaluate(async () => {
      const stored = (await chrome.storage.local.get("pacerState")).pacerState as PacerState;
      await chrome.storage.local.set({ pacerState: { ...stored, phase: "breaking", nextDue: null, breakStarted: Date.now() } });
    });
    const distance = await context.newPage();
    await distance.goto(`chrome-extension://${id}/break.html`);
    await expect(distance.getByRole("button", { name: "Finish break" })).toBeVisible();
    await assertKeyboardFocusForEveryControl(distance);
    expect((await new AxeBuilder({ page: distance as never }).analyze()).violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
    const reducedDistance = await context.newPage();
    await reducedDistance.emulateMedia({ reducedMotion: "reduce" });
    await reducedDistance.goto(`chrome-extension://${id}/break.html`);
    await expect(reducedDistance.getByRole("button", { name: "Pause gentle motion" })).toBeHidden();
    expect(await reducedDistance.locator(".ridge-front, .distance-marker").evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).animationName))).toEqual(["none", "none"]);
    const darkPopup = await context.newPage();
    await darkPopup.emulateMedia({ colorScheme: "dark" });
    await darkPopup.goto(`chrome-extension://${id}/popup.html`);
    await assertKeyboardFocusForEveryControl(darkPopup);
    const darkOptions = await context.newPage();
    await darkOptions.emulateMedia({ colorScheme: "dark" });
    await darkOptions.goto(`chrome-extension://${id}/options.html`);
    await assertKeyboardFocusForEveryControl(darkOptions);
    const darkDistance = await context.newPage();
    await darkDistance.emulateMedia({ colorScheme: "dark" });
    await darkDistance.goto(`chrome-extension://${id}/break.html`);
    await assertKeyboardFocusForEveryControl(darkDistance);
  });
});

test("@claim:offline-extension installed extension completes a distance break without network access", async () => {
  test.setTimeout(60_000);
  await withExtension(async ({ context, worker, id, requests }) => {
    await worker.evaluate(async () => {
      const stored = (await chrome.storage.local.get("pacerState")).pacerState as PacerState;
      await chrome.storage.local.set({ pacerState: { ...stored, phase: "ready", nextDue: null, breakStarted: null } });
      await chrome.alarms.clear("reading-comfort-boundary");
    });
    await context.setOffline(true);
    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${id}/popup.html`);
    await expect(popup.getByText("Boundary requested")).toBeVisible();
    const [distance] = await Promise.all([
      context.waitForEvent("page"),
      popup.getByRole("button", { name: "I’m at a stopping point" }).click()
    ]);
    await distance.waitForLoadState("domcontentloaded");
    await expect(distance.getByRole("heading", { name: "Let your focus travel" })).toBeVisible();
    await distance.getByRole("button", { name: "Finish break" }).click();
    await expect(distance.getByRole("button", { name: "Return to reading" })).toBeVisible();
    const state = await worker.evaluate(async () => (await chrome.storage.local.get("pacerState")).pacerState as PacerState);
    expect(state).toMatchObject({ phase: "running", stats: { accepted: 1, completed: 1 } });
    expect(state.nextDue).toEqual(expect.any(Number));
    expect(requests.filter((url) => /^https?:/.test(url))).toEqual([]);
  });
});
