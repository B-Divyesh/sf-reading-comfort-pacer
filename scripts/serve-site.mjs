import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const root = join(process.cwd(), "dist/site");
const port = Number(process.env.PORT || 4173);
const types = { ".avif": "image/avif", ".css": "text/css; charset=utf-8", ".html": "text/html; charset=utf-8", ".jpg": "image/jpeg", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp", ".woff2": "font/woff2", ".zip": "application/zip" };
const headers = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy": "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; media-src 'self'"
};

createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url || "/", "http://localhost").pathname);
  const candidate = join(root, normalize(pathname).replace(/^[/\\]+/, ""));
  const file = existsSync(candidate) && statSync(candidate).isFile() ? candidate : existsSync(join(candidate, "index.html")) ? join(candidate, "index.html") : join(root, "404/index.html");
  const missing = file.endsWith("/404/index.html") && !pathname.startsWith("/404/");
  const cache = pathname.startsWith("/assets/") ? "public, max-age=31536000, immutable" : pathname.startsWith("/downloads/") ? "public, max-age=3600" : "no-cache";
  response.writeHead(missing ? 404 : 200, { ...headers, "Cache-Control": cache, "Content-Type": types[extname(file)] || "application/octet-stream" });
  createReadStream(file).pipe(response);
}).listen(port, "127.0.0.1");
