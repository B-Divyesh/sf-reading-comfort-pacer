import { createWriteStream } from "node:fs";
import { mkdir, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { ZipArchive } from "archiver";

const extensionDir = resolve(process.cwd(), "dist/extension/chrome-mv3");
const downloadDir = resolve(process.cwd(), "dist/site/downloads");
const outputPath = resolve(downloadDir, "reading-comfort-pacer-chrome.zip");

await stat(resolve(extensionDir, "manifest.json"));
await mkdir(downloadDir, { recursive: true });

await new Promise((resolveArchive, reject) => {
  const output = createWriteStream(outputPath);
  const archive = new ZipArchive({ zlib: { level: 9 } });
  output.on("close", resolveArchive);
  output.on("error", reject);
  archive.on("error", reject);
  archive.pipe(output);
  archive.directory(extensionDir, false);
  void archive.finalize();
});

console.log(`Packaged ${outputPath}`);
