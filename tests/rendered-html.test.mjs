import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the KODO experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>KODO — Food that smiles back<\/title>/i);
  assert.match(html, /Food that/);
  assert.match(html, /smiles back\./);
  assert.match(html, /Meet the/);
  assert.match(html, /mood food\./);
  assert.match(html, /SCROLL TO STACK/);
  assert.match(html, /built bite by bite\./);
  assert.match(html, /The Grainfather/);
  assert.match(html, /Smiling Momo-ments/);
  assert.match(html, /Smilin’ Wraps/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("keeps KODO motion accessible and the starter removed", async () => {
  const [css, page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /--scroll-progress/);
  assert.match(css, /\.burger-build[\s\S]*height:\s*470svh/);
  assert.match(css, /\.burger-build-sticky[\s\S]*position:\s*sticky/);
  assert.match(css, /@media \(max-width:\s*760px\)/);
  assert.match(css, /touch-action:\s*manipulation/);
  assert.match(css, /safe-area-inset-top/);
  assert.match(page, /IntersectionObserver/);
  assert.match(page, /requestAnimationFrame/);
  assert.match(page, /data-burger-layer/);
  assert.match(page, /burger-layers\/\$\{layer\.slug\}\.png/);
  assert.match(page, /aria-label="Primary navigation"/);
  assert.match(page, /millet-burger\.jpg/);
  assert.match(layout, /title:\s*"KODO — Food that smiles back"/);
  assert.match(layout, /viewportFit:\s*"cover"/);
  assert.doesNotMatch(
    `${page}\n${layout}\n${packageJson}`,
    /codex-preview|_sites-preview|react-loading-skeleton/i,
  );
});

test("includes a dedicated price-free menu experience", async () => {
  const [menuPage, menuData, menuCss] = await Promise.all([
    readFile(new URL("../app/menu/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/menu/menu-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/menu/menu.css", import.meta.url), "utf8"),
  ]);

  assert.match(menuPage, /KODO Menu — The Millet Way/);
  assert.match(menuPage, /NEXT_PUBLIC_SWIGGY_ORDER_URL/);
  assert.match(menuPage, /Swiggy link coming soon/);
  assert.match(menuData, /Steamed Chicken Burger/);
  assert.match(menuData, /Veg Momos Steamed/);
  assert.match(menuData, /Ragi Hot Chocolate/);
  for (const asset of [
    "kodo-crust-pizza.webp",
    "multi-millet-sandwich.webp",
    "guilt-free-munchies.webp",
    "millet-pasta.webp",
    "nachos.webp",
    "pearl-millet-mushroom-soup.webp",
    "quick-brew.webp",
    "cold-coffee.webp",
    "tea.webp",
    "quick-sip.webp",
    "smileo.webp",
    "hot-beverage.webp",
  ]) {
    assert.match(menuData, new RegExp(`/menu-assets/${asset}`));
  }
  assert.doesNotMatch(menuData, /sandwich[\s\S]*millet-wraps\.jpg/i);
  assert.doesNotMatch(`${menuPage}\n${menuData}`, /₹|\bprice\b/i);
  assert.match(menuCss, /perspective:\s*1600px/);
  assert.match(menuCss, /\.menu-card\s*\{[\s\S]*min-width:\s*0/);
  assert.match(
    menuCss,
    /\.menu-card-image\s*\{[\s\S]*margin:\s*30px 0 34px/,
  );
  assert.doesNotMatch(menuCss, /translateZ\(48px\)/);
  assert.match(menuCss, /@media \(max-width:\s*760px\)/);
  assert.match(menuCss, /grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(menuCss, /\.category-rail a[\s\S]*min-height:\s*44px/);
  assert.match(menuCss, /safe-area-inset-bottom/);
});

test("server-renders the dedicated menu route", async () => {
  const response = await render("/menu");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Pick your/);
  assert.match(html, /Kodo Crust Pizza/);
  assert.match(html, /Soft Momo-ments/);
  assert.match(html, /Swiggy link coming soon/);
  assert.doesNotMatch(html, /₹/);
});
