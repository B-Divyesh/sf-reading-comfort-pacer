import { resolve } from "node:path";
import { readFileSync } from "node:fs";
import { defineConfig } from "vite";

const productVersion = JSON.parse(readFileSync(resolve(import.meta.dirname, "package.json"), "utf8")) as { version: string };

export default defineConfig({
  root: "site",
  publicDir: "public",
  build: {
    outDir: "../dist/site",
    emptyOutDir: true,
    target: "es2022",
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, "site/index.html"),
        privacy: resolve(import.meta.dirname, "site/privacy/index.html"),
        terms: resolve(import.meta.dirname, "site/terms/index.html"),
        demo: resolve(import.meta.dirname, "site/demo/index.html"),
        notFound: resolve(import.meta.dirname, "site/404/index.html")
      }
    }
  },
  plugins: [{
    name: "release-version",
    transformIndexHtml(html) { return html.replaceAll("__PACER_VERSION__", productVersion.version); }
  }]
});
