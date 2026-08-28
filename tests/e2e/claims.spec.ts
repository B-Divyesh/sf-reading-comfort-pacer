import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

test("@claim:demo-isolation demo data is isolated and resettable", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("pacerState", "real-data-sentinel"));
  await page.goto("/?demo=1");
  await expect(page).toHaveURL(/\/demo\/\?demo=1$/);
  await page.getByRole("button", { name: "I’m at a stopping point" }).click();
  await page.getByRole("button", { name: "Finish break" }).click();
  await page.getByRole("button", { name: "Reset demo" }).first().click();
  await expect(page.getByText("Break is ready")).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("pacerState"))).toBe("real-data-sentinel");
  expect(await page.evaluate(() => localStorage.getItem("demo:pacer"))).toContain("ready");
  await page.getByRole("link", { name: "Start for real" }).click();
  expect(await page.evaluate(() => localStorage.getItem("pacerState"))).toBe("real-data-sentinel");
  expect(await page.evaluate(() => localStorage.getItem("demo:pacer"))).toBeNull();
});

test("@claim:boundary-wait sample waits for confirmation", async ({ page }) => {
  await page.goto("/demo/?demo=1");
  await expect(page.getByText("Break is ready")).toBeVisible();
  await expect(page.getByText("Distance break in progress")).toHaveCount(0);
  await page.getByRole("button", { name: "I’m at a stopping point" }).click();
  await expect(page.getByText("Distance break in progress")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Look beyond the display/ })).toBeVisible();
});

test("@claim:no-account sample and download do not contain a gate", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Try it with sample data" })).toBeVisible();
  await expect(page.locator("input[type=password], input[name*=email i], [data-payment]")).toHaveCount(0);
  await page.goto("/demo/?demo=1");
  await expect(page.locator("input, form, [data-payment]")).toHaveCount(0);
});

test("@claim:privacy-permissions demo stays same-origin and manifest is minimal", async ({ page }) => {
  const foreign: string[] = [];
  page.on("request", (request) => { if (new URL(request.url()).origin !== "http://127.0.0.1:4173") foreign.push(request.url()); });
  await page.goto("/demo/?demo=1");
  await page.getByRole("button", { name: "I’m at a stopping point" }).click();
  expect(foreign).toEqual([]);
  const manifest = JSON.parse(await readFile("dist/extension/chrome-mv3/manifest.json", "utf8")) as Record<string, unknown>;
  expect(manifest.permissions).toEqual(["storage", "alarms"]);
  expect(manifest.host_permissions ?? []).toEqual([]);
  expect(manifest.content_scripts ?? []).toEqual([]);
});

test("@claim:download-build download is a packaged MV3 archive", async ({ page }) => {
  await page.goto("/");
  const download = page.getByRole("link", { name: "Download the extension" });
  await expect(download).toHaveAttribute("href", "/downloads/reading-comfort-pacer-chrome.zip");
  const response = await page.request.get("/downloads/reading-comfort-pacer-chrome.zip");
  expect(response.ok()).toBe(true);
  const body = await response.body();
  expect(body.subarray(0, 4).toString("utf8")).toBe("PK\u0003\u0004");
  expect(body.byteLength).toBeGreaterThan(100_000);
  const manifest = JSON.parse(await readFile("dist/extension/chrome-mv3/manifest.json", "utf8")) as { manifest_version: number; name: string };
  expect(manifest).toMatchObject({ manifest_version: 3, name: "Reading Comfort Pacer" });
});

test("@claim:site-routes ships a designed not-found route", async ({ page }) => {
  await page.goto("/404/");
  await expect(page).toHaveTitle("Page not found — Reading Comfort Pacer");
  await expect(page.getByRole("heading", { name: "This page is not on the map." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Return home" })).toHaveAttribute("href", "/");
  const config = JSON.parse(await readFile("site/public/staticwebapp.config.json", "utf8")) as { responseOverrides: { "404": { rewrite: string; statusCode: number } } };
  expect(config.responseOverrides["404"]).toEqual({ rewrite: "/404/index.html", statusCode: 404 });
});

test("@claim:accessible-demo works by keyboard and honors reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/demo/?demo=1");
  await page.getByRole("button", { name: "I’m at a stopping point" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Distance break in progress")).toBeVisible();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
});
