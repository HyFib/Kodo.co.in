/**
 * Exports the built vinext app as a static site for GitHub Pages.
 *
 * - Copies dist/client (hashed assets + public files) into dist-pages.
 * - Server-renders each route through the built worker and writes plain
 *   HTML files.
 * - When BASE_PATH is set (project pages, e.g. "/Kodo.co.in"), rewrites
 *   references so the site works under that subpath. Keep it unset for
 *   custom-domain or root hosting.
 *
 * The rewrite must be surgical: the RSC payload embedded in the HTML and
 * the framework runtime both use root-relative strings ("/", "/menu") as
 * ROUTE IDS — rewriting those crashes hydration (vinext validates
 * __layoutIds/__rootLayout and React blanks the page). Only two kinds of
 * references are safe to prefix:
 *   1. Known public-asset paths (distinct prefixes that cannot collide
 *      with route ids) — in HTML, CSS, JS and the RSC payload.
 *   2. href="..." attributes in the raw server-rendered HTML (the escaped
 *      payload form href\":\" never matches this pattern).
 * Route navigation under the subpath is handled at runtime by a small
 * capture-phase click handler injected into <head>: it turns internal
 * link clicks into plain page loads with the base prefix, bypassing the
 * client router (whose .rsc fetches cannot work on a static host).
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

// Top-level public files/dirs plus the built assets dir. These prefixes are
// distinct from every route id, so they are safe to rewrite anywhere.
const ASSET_PREFIXES = [
  "assets/",
  "brand/",
  "burger-layers/",
  "food/",
  "menu-assets/",
  "favicon.svg",
  "og.png",
  "file.svg",
  "globe.svg",
  "window.svg",
];
const ASSET_ALTERNATION = ASSET_PREFIXES.map((p) => p.replace(".", "\\.")).join("|");
// Preceded by a quote (raw or payload-escaped), = or ( delimiter, or a
// srcset separator — never a colon, which route-id keys like "page:/" use.
const ASSET_REF_PATTERN = new RegExp(
  `(\\\\?["'\`=(]|,\\s|srcset=)/(${ASSET_ALTERNATION})`,
  "g",
);
// Raw HTML link attributes only. The RSC payload's escaped form
// (href\":\"/menu\") does not contain `href="` so route ids stay intact.
const HREF_ATTR_PATTERN = /href="\//g;

function rewriteAssets(text) {
  return text.replace(ASSET_REF_PATTERN, `$1${BASE_PATH}/$2`);
}

function rewriteHtml(html) {
  return rewriteAssets(html.replace(HREF_ATTR_PATTERN, `href="${BASE_PATH}/`));
}

// Neutralizes client-side routing: internal link clicks become plain
// navigations with the base prefix. Runs in capture phase so it beats the
// router's delegated handlers; stopPropagation keeps Link from hijacking.
const CLICK_FIXER = `<script>(function(){var B=${JSON.stringify(BASE_PATH)};document.addEventListener("click",function(e){if(e.defaultPrevented)return;var a=e.target&&e.target.closest?e.target.closest("a[href]"):null;if(!a)return;var h=a.getAttribute("href");if(!h||h.charAt(0)!=="/")return;e.stopPropagation();if(h===B||h.indexOf(B+"/")===0)return;e.preventDefault();window.location.assign(B+h)},true)})();</script>`;

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
    if (path.endsWith(".html")) {
      const html = rewriteHtml(await readFile(path, "utf8"));
      await writeFile(path, html.replace("<head>", `<head>${CLICK_FIXER}`));
    } else if (/\.(css|js)$/.test(path)) {
      await writeFile(path, rewriteAssets(await readFile(path, "utf8")));
    }
  }
}

// Sanity checks. These guard the two failure modes seen in production:
// unrewritten asset refs (404s) and rewritten route ids (hydration crash).
const escapedBase = BASE_PATH.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
for await (const path of walk(OUT_DIR)) {
  if (path.endsWith(".html")) {
    const html = await readFile(path, "utf8");
    const badRefs = [...html.matchAll(/(?:src|href)="(\/[^"]*)"/g)]
      .map((m) => m[1])
      .filter((ref) => BASE_PATH && !ref.startsWith(`${BASE_PATH}/`));
    if (badRefs.length > 0) {
      throw new Error(`Unrewritten refs in ${path}: ${badRefs.join(", ")}`);
    }
    if (BASE_PATH && new RegExp(`(__rootLayout|layout|page)(\\\\?":\\\\?"|:)${escapedBase}`).test(html)) {
      throw new Error(`Route ids were rewritten in ${path} — this breaks hydration`);
    }
  } else if (BASE_PATH && /\.(js|css)$/.test(path)) {
    const text = await readFile(path, "utf8");
    for (const match of text.matchAll(new RegExp(`${escapedBase}/([^"'\`)\\s]*)`, "g"))) {
      if (!ASSET_PREFIXES.some((p) => match[1].startsWith(p) || p.startsWith(match[1]))) {
        throw new Error(
          `Suspicious rewrite in ${path}: "${match[0].slice(0, 60)}" — only asset prefixes may be rewritten in JS/CSS`,
        );
      }
    }
  }
}

console.log(`Static export written to dist-pages (BASE_PATH="${BASE_PATH}")`);
