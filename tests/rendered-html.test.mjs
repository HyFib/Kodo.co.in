import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
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
  assert.match(page, /IntersectionObserver/);
  assert.match(page, /aria-label="Primary navigation"/);
  assert.match(page, /millet-burger\.jpg/);
  assert.match(layout, /title:\s*"KODO — Food that smiles back"/);
  assert.doesNotMatch(
    `${page}\n${layout}\n${packageJson}`,
    /codex-preview|_sites-preview|react-loading-skeleton/i,
  );
});
