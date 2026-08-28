import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { chromium, expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import type { PacerState } from "../../lib/pacer";

test("installed extension opens a boundary-confirmed distance break", async () => {
  test.setTimeout(60_000);
  const extensionPath = resolve("dist/extension/chrome-mv3");
  const userDataDir = await mkdtemp(join(tmpdir(), "pacer-playwright-"));
  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: true,
    channel: "chromium",
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
  });
  const runtimeRequests: string[] = [];
  context.on("request", (request) => runtimeRequests.push(request.url()));

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
      const stored = (await chrome.storage.local.get("pacerState")).pacerState as PacerState;
      await chrome.storage.local.set({ pacerState: { ...stored, phase: "ready", nextDue: null } });
    });
    await popup.reload();
    await expect(popup.getByText("Boundary requested")).toBeVisible();
    await expect(popup.locator("#shortcut")).toHaveText("Alt + Shift + R at a ready boundary");
    const commands = await worker.evaluate(() => chrome.commands.getAll());
    expect(commands.find((command) => command.name === "confirm-boundary")?.shortcut).toBe("Alt+Shift+R");
    await popup.locator(".skip-link").focus();
    const popupSkipBox = await popup.locator(".skip-link").boundingBox();
    expect(popupSkipBox?.width).toBeGreaterThanOrEqual(44);
    expect(popupSkipBox?.height).toBeGreaterThanOrEqual(44);

    const distancePagePromise = context.waitForEvent("page");
    const confirmBoundary = popup.getByRole("button", { name: "I’m at a stopping point" });
    await confirmBoundary.focus();
    await popup.keyboard.press("Enter");
    const distancePage = await distancePagePromise;
    await distancePage.waitForLoadState();
    await expect(distancePage.getByRole("heading", { level: 1, name: "Let your focus travel" })).toBeVisible();
    const distanceSkipBox = await distancePage.locator(".skip-link").boundingBox();
    expect(distanceSkipBox?.width).toBeGreaterThanOrEqual(44);
    expect(distanceSkipBox?.height).toBeGreaterThanOrEqual(44);
    accessibility = await new AxeBuilder({ page: distancePage as never }).analyze();
    expect(accessibility.violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
    await distancePage.getByRole("button", { name: "Finish break" }).click();
    await expect(distancePage.getByRole("heading", { level: 1, name: "Route refreshed" })).toBeVisible();
    await expect(distancePage.locator("#motion")).toBeHidden();
    expect(await distancePage.locator(".ridge-front, .distance-marker").evaluateAll((elements) =>
      elements.map((element) => getComputedStyle(element).animationName)
    )).toEqual(["none", "none"]);

    const stored = await worker.evaluate(async () => (await chrome.storage.local.get("pacerState")).pacerState as PacerState);
    expect(stored.stats.completed).toBe(1);
    expect(stored.phase).toBe("running");

    const staleDistancePage = await context.newPage();
    await staleDistancePage.goto(`chrome-extension://${extensionId}/break.html`);
    await expect(staleDistancePage.getByRole("heading", { level: 1, name: "This route is already complete" })).toBeVisible();
    await expect(staleDistancePage.locator("#motion")).toBeHidden();
    expect(await staleDistancePage.locator(".ridge-front, .distance-marker").evaluateAll((elements) =>
      elements.map((element) => getComputedStyle(element).animationName)
    )).toEqual(["none", "none"]);

    const options = await context.newPage();
    await options.goto(`chrome-extension://${extensionId}/options.html`);
    const optionsSkipBox = await options.locator(".skip-link").boundingBox();
    expect(optionsSkipBox?.width).toBeGreaterThanOrEqual(44);
    expect(optionsSkipBox?.height).toBeGreaterThanOrEqual(44);
    await options.getByRole("checkbox", { name: /Enable boundary requests/ }).uncheck();
    await options.getByRole("button", { name: "Save settings" }).click();
    await expect(options.getByRole("status")).toHaveText("Saved on this device.");
    const disabledPopup = await context.newPage();
    await disabledPopup.goto(`chrome-extension://${extensionId}/popup.html`);
    await expect(disabledPopup.getByText("Pacer disabled")).toBeVisible();
    expect(runtimeRequests.filter((url) => url.startsWith("http://") || url.startsWith("https://"))).toEqual([]);
  } finally {
    await context.close();
  }
});
