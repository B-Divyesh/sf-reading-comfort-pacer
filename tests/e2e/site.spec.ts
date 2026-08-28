import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const path of ["/", "/privacy/", "/terms/"]) {
  test(`${path} has semantic structure and no serious accessibility violations`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
    await page.goto(path);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page).toHaveTitle(/Reading Comfort Pacer/);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });
}

test("landing page stays usable at 390px and exposes a real download", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const download = page.getByRole("link", { name: /Download for Chrome/ });
  await expect(download).toHaveAttribute("href", "/downloads/reading-comfort-pacer-chrome.zip");
  const response = await page.request.get("/downloads/reading-comfort-pacer-chrome.zip");
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toMatch(/application\/(zip|octet-stream)/);
  expect((await response.body()).byteLength).toBeGreaterThan(100_000);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);

  await page.locator(".skip-link").focus();
  const targets = await page.locator(".skip-link, .footer-links a").evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return { label: element.textContent?.trim(), width: rect.width, height: rect.height };
    })
  );
  expect(targets.every(({ width, height }) => width >= 44 && height >= 44), JSON.stringify(targets)).toBe(true);
});

test("landing page remains readable and axe-clean in dark mode", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  const cue = page.locator("#cue-title");
  await expect(cue).toBeVisible();
  expect(await cue.evaluate((element) => getComputedStyle(element).color)).toBe("rgb(245, 240, 229)");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
});
