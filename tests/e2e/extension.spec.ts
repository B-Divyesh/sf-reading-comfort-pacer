import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { chromium, expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("installed extension opens a boundary-confirmed distance break", async () => {
  test.setTimeout(60_000);
  const extensionPath = resolve("dist/extension/chrome-mv3");
  const userDataDir = await mkdtemp(join(tmpdir(), "pacer-playwright-"));
  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: true,
    channel: "chromium",
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
  });

  try {
    let worker = context.serviceWorkers()[0];
    if (!worker) worker = await context.waitForEvent("serviceworker");
    const extensionId = new URL(worker.url()).host;
    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup.html`);
    await expect(popup.getByRole("heading", { level: 1, name: "Reading comfort pacer" })).toBeVisible();
    await expect(popup.getByText("Next boundary request")).toBeVisible();
    let accessibility = await new AxeBuilder({ page: popup as never }).analyze();
    expect(accessibility.violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);

    await worker.evaluate(async () => {
      const stored = (await chrome.storage.local.get("pacerState")).pacerState;
      await chrome.storage.local.set({ pacerState: { ...stored, phase: "ready", nextDue: null } });
    });
    await popup.reload();
    await expect(popup.getByText("Boundary requested")).toBeVisible();

    const distancePagePromise = context.waitForEvent("page");
    await popup.getByRole("button", { name: "I’m at a stopping point" }).click();
    const distancePage = await distancePagePromise;
    await distancePage.waitForLoadState();
    await expect(distancePage.getByRole("heading", { level: 1, name: "Let your focus travel" })).toBeVisible();
    accessibility = await new AxeBuilder({ page: distancePage as never }).analyze();
    expect(accessibility.violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
    await distancePage.getByRole("button", { name: "Finish break" }).click();
    await expect(distancePage.getByRole("heading", { level: 1, name: "Route refreshed" })).toBeVisible();

    const stored = await worker.evaluate(async () => (await chrome.storage.local.get("pacerState")).pacerState);
    expect(stored.stats.completed).toBe(1);
    expect(stored.phase).toBe("running");

    const options = await context.newPage();
    await options.goto(`chrome-extension://${extensionId}/options.html`);
    await options.getByRole("checkbox", { name: /Enable boundary requests/ }).uncheck();
    await options.getByRole("button", { name: "Save settings" }).click();
    await expect(options.getByRole("status")).toHaveText("Saved on this device.");
    const disabledPopup = await context.newPage();
    await disabledPopup.goto(`chrome-extension://${extensionId}/popup.html`);
    await expect(disabledPopup.getByText("Pacer disabled")).toBeVisible();
  } finally {
    await context.close();
  }
});
