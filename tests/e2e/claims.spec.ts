import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("@claim:demo-isolation demo data is isolated and resettable", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("pacerState", "real-data-sentinel"));
  await page.goto("/?demo=1");
  await expect(page).toHaveURL(/\/demo\/\?demo=1$/);
  await page.getByRole("button", { name: "Start distance break" }).click();
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
  await page.getByRole("button", { name: "Start distance break" }).click();
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

test("@claim:privacy-permissions extension permissions are minimal", async ({ page }) => {
  const foreign: string[] = [];
  page.on("request", (request) => { if (new URL(request.url()).origin !== "http://127.0.0.1:4173") foreign.push(request.url()); });
  await page.goto("/demo/?demo=1");
  await page.getByRole("button", { name: "Start distance break" }).click();
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
  const manifest = JSON.parse(await readFile("dist/extension/chrome-mv3/manifest.json", "utf8")) as { manifest_version: number; name: string; version: string };
  const packageJson = JSON.parse(await readFile("package.json", "utf8")) as { version: string };
  expect(manifest).toMatchObject({ manifest_version: 3, name: "Reading Comfort Pacer", version: packageJson.version });
  await expect(page.locator("#install .eyebrow")).toHaveText(`Version ${packageJson.version}`);
  await expect(page.locator("footer")).toContainText(`version ${packageJson.version}`);
});

test("@claim:site-routes serves a designed same-origin unknown route", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  const response = await page.goto("/not-a-real-route-claim");
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle("Page not found — Reading Comfort Pacer");
  await expect(page.getByRole("heading", { name: "This page is not on the map." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Return home" })).toHaveAttribute("href", "/");
  expect(requests.every((url) => new URL(url).origin === "http://127.0.0.1:4173")).toBe(true);
  const config = JSON.parse(await readFile("site/public/staticwebapp.config.json", "utf8")) as { responseOverrides: { "404": { rewrite: string; statusCode: number } } };
  expect(config.responseOverrides["404"]).toEqual({ rewrite: "/404/index.html", statusCode: 404 });
});

test("@claim:accessible-demo works by keyboard and honors reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/demo/?demo=1");
  await expect(page.getByRole("status")).toHaveText("Demo — sample data, nothing is saved");
  await expect(page.locator("h1")).not.toBeFocused();
  await page.getByRole("button", { name: "Start distance break" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Distance break in progress")).toBeVisible();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations).toEqual([]);
});

test("@claim:site-privacy public routes use no cookies, analytics, or third-party requests", async ({ browser }) => {
  const requests: string[] = [];
  for (const route of ["/", "/demo/?demo=1", "/privacy/", "/terms/", "/unknown-privacy-check"]) {
    const context = await browser.newContext();
    const page = await context.newPage();
    page.on("request", (request) => requests.push(request.url()));
    await page.goto(route);
    if (route.startsWith("/demo")) {
      await expect(page.getByText("Break is ready")).toBeVisible();
      await page.getByRole("button", { name: "Start distance break" }).click();
    }
    expect(await context.cookies()).toEqual([]);
    expect(await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) }))).toEqual(route.startsWith("/demo") ? { local: ["demo:pacer"], session: [] } : { local: [], session: [] });
    await context.close();
  }
  expect(requests.every((url) => new URL(url).origin === "http://127.0.0.1:4173")).toBe(true);
});

test("@claim:asset-license ships a self-hosted font and records original-art provenance", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto("/");
  await expect(page.locator("body")).toHaveCSS("font-family", /Atkinson Hyperlegible/);
  expect(requests.filter((url) => /\.(woff2?|ttf)(\?|$)/.test(url)).every((url) => new URL(url).origin === "http://127.0.0.1:4173")).toBe(true);
  const [design, notices, license] = await Promise.all([readFile(".factory/design.md", "utf8"), readFile("THIRD_PARTY_NOTICES.md", "utf8"), readFile("LICENSE", "utf8")]);
  expect(design).toContain("factory-image");
  expect(notices).toContain("Atkinson Hyperlegible");
  expect(license).toContain("Permission is hereby granted");
});

test("@claim:route-metadata gives every route its own share metadata", async ({ page }) => {
  for (const [route, title, canonical] of [["/", "Reading Comfort Pacer — breaks after stopping points", "https://reading-comfort-pacer.sociobot.in/"], ["/demo/", "Demo — Reading Comfort Pacer", "https://reading-comfort-pacer.sociobot.in/demo/"], ["/privacy/", "Privacy — Reading Comfort Pacer", "https://reading-comfort-pacer.sociobot.in/privacy/"], ["/terms/", "Terms — Reading Comfort Pacer", "https://reading-comfort-pacer.sociobot.in/terms/"], ["/404/", "Page not found — Reading Comfort Pacer", "https://reading-comfort-pacer.sociobot.in/404/"]] as const) {
    await page.goto(route);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", canonical);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", title);
  }
});

test("@claim:touch-targets visible site controls are at least 44 pixels on every route", async ({ page }) => {
  const routes = ["/", "/demo/?demo=1", "/privacy/", "/terms/", "/not-a-real-route-touch-targets"];
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    for (const route of routes) {
      await page.goto(route);
      const targets = await page.locator("a:visible, button:visible").evaluateAll((elements) => elements.map((element) => {
        const rect = element.getBoundingClientRect();
        return { label: element.getAttribute("aria-label") ?? element.textContent?.trim(), width: rect.width, height: rect.height };
      }));
      expect(targets.length, `${route} at ${viewport.width}px`).toBeGreaterThan(0);
      expect(targets.every(({ width, height }) => width >= 44 && height >= 44), `${route} at ${viewport.width}px: ${JSON.stringify(targets)}`).toBe(true);
    }
  }
});
