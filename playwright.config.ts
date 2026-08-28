import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  use: { baseURL: "http://127.0.0.1:4173", viewport: { width: 390, height: 844 } },
  webServer: {
    command: "npm run build && node scripts/serve-site.mjs",
    port: 4173,
    reuseExistingServer: false,
    timeout: 120_000
  }
});
