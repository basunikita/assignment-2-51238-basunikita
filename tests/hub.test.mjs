import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import { OUT, readPage } from "./helpers.mjs";

const PAGES = [
  "/mood-boards/sunrise/",
  "/mood-boards/editorial/",
  "/mood-boards/plate-room/",
  "/design-systems/sunrise/",
  "/design-systems/editorial/",
  "/design-systems/plate-room/",
  "/workout-week/",
];

test("the hub links to all seven pages", () => {
  const hub = readPage("/");
  for (const page of PAGES) assert.ok(hub.includes(`href="${page}"`), `no link to ${page}`);
});

test("every page the hub links to is exported", () => {
  for (const page of PAGES) readPage(page);
});

test("old routes the hub replaced are gone", () => {
  for (const page of ["/moods/1/", "/systems/1/", "/site/", "/mood-boards/calm/", "/design-systems/calm/"]) {
    assert.ok(!existsSync(`${OUT}${page}index.html`), `${page} still exists`);
  }
});

test("every page links back to the hub", () => {
  for (const page of PAGES) assert.ok(readPage(page).includes('href="/"'), `${page} has no hub link`);
});

test("every hub link shows a keyboard focus outline", () => {
  const links = readPage("/").match(/<a [^>]*>/g) ?? [];
  assert.ok(links.length >= PAGES.length, `found ${links.length} links`);
  for (const link of links) assert.ok(link.includes("focus-visible:outline"), `no focus style: ${link}`);
});

test("the hub shows each mood's type sample", () => {
  assert.equal((readPage("/").match(/>Aa</g) ?? []).length, 3);
});
