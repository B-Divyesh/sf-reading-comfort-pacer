import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("release configuration", () => {
  it("packages the installable extension in the standalone site build", async () => {
    const packageJson = JSON.parse(await readFile("package.json", "utf8")) as { scripts: Record<string, string> };
    expect(packageJson.scripts["build:site"]).toContain("build:extension");
    expect(packageJson.scripts["build:site"]).toContain("package:extension");
  });

  it("ships a restrictive site content security policy", async () => {
    const config = JSON.parse(await readFile("site/public/staticwebapp.config.json", "utf8")) as {
      globalHeaders: Record<string, string>;
    };
    const policy = config.globalHeaders["Content-Security-Policy"];
    expect(policy).toContain("default-src 'self'");
    expect(policy).toContain("object-src 'none'");
    expect(policy).toContain("frame-ancestors 'none'");
  });
});
