/**
 * Exports the built vinext app as a static site for GitHub Pages.
 *
 * - Copies dist/client (hashed assets + public files) into dist-pages.
 * - Server-renders each route through the built worker and writes plain
 *   HTML files (client-side RSC navigation falls back to full page loads
 *   on static hosts, so no .rsc payloads are needed).
 * - When BASE_PATH is set (project pages, e.g. "/Kodo.co.in"), rewrites
 *   root-absolute asset and route references in HTML/CSS/JS output so the
 *   site works under that subpath. Keep it unset for custom-domain hosting.
 *
 * Usage: node scripts/export-static.mjs   (after `vinext build`)
 */
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ROUTES = ["/", "/menu"];
const OUT_DIR = new URL("../dist-pages/", import.meta.url).pathname;
const CLIENT_DIR = new URL("../dist/client/", import.meta.url).pathname;
const BASE_PATH = (process.env.BASE_PATH ?? "").replace(/\/$/, "");

async function render(path) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  if (response.status !== 200) {
    throw new Error(`Rendering ${path} returned HTTP ${response.status}`);
  }
  return response.text();
}

// Top-level public files/dirs plus built assets and app routes. Matched only
// after a delimiter so bare prose containing slashes is left alone.
const PREFIXES =
  "assets/|brand/|burger-layers/|food/|menu-assets/|favicon\\.svg|og\\.png|file\\.svg|globe\\.svg|window\\.svg|menu(?![\\w-])";
const REF_PATTERN = new RegExp(`(\\\\?["'\`=(]|,\\s|srcset=)/(${PREFIXES})`, "g");
const ROOT_LINK_PATTERN = /(\\?["'`])\/(\\?["'`])/g;

function rewriteBase(text) {
  return text
    .replace(REF_PATTERN, `$1${BASE_PATH}/$2`)
    .replace(ROOT_LINK_PATTERN, `$1${BASE_PATH}/$2`);
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

await rm(OUT_DIR, { recursive: true, force: true });
await cp(CLIENT_DIR, OUT_DIR, {
  recursive: true,
  filter: (src) => !src.endsWith("/_headers"),
});
await writeFile(join(OUT_DIR, ".nojekyll"), "");

for (const route of ROUTES) {
  const html = await render(route);
  const dir = join(OUT_DIR, route);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "index.html"), html);
}

if (BASE_PATH) {
  for await (const path of walk(OUT_DIR)) {
    if (!/\.(html|css|js)$/.test(path)) continue;
    await writeFile(path, rewriteBase(await readFile(path, "utf8")));
  }
}

// Sanity check: no root-absolute references may remain outside BASE_PATH.
for await (const path of walk(OUT_DIR)) {
  if (!path.endsWith(".html")) continue;
  const html = await readFile(path, "utf8");
  const refs = [...html.matchAll(/(?:src|href)="(\/[^"]*)"/g)]
    .map((m) => m[1])
    .filter((ref) => BASE_PATH && !ref.startsWith(`${BASE_PATH}/`));
  if (refs.length > 0) {
    throw new Error(`Unrewritten root-absolute refs in ${path}: ${refs.join(", ")}`);
  }
}

console.log(`Static export written to dist-pages (BASE_PATH="${BASE_PATH}")`);
