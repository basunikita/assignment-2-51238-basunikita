import assert from "node:assert/strict";
import test from "node:test";
import { findNested } from "./helpers.mjs";

test("finds a muted child directly inside a surface", () => {
  const html = '<div class="bg-surface"><p class="text-muted">Rest</p></div>';
  assert.equal(findNested(html, "bg-surface", "text-muted").length, 1);
});

test("finds a muted element several levels down", () => {
  const html = '<div class="bg-surface p-4"><div><span class="text-xs text-muted">Rest</span></div></div>';
  assert.equal(findNested(html, "bg-surface", "text-muted").length, 1);
});

test("ignores a muted element beside the surface, not inside it", () => {
  const html = '<div class="bg-surface"></div><p class="text-muted">Rest</p>';
  assert.equal(findNested(html, "bg-surface", "text-muted").length, 0);
});

test("keeps nesting right across void elements like img", () => {
  const html = '<div class="bg-surface"><img src="a.jpg" alt="a"><p class="text-muted">Rest</p></div><p class="text-muted">Out</p>';
  assert.equal(findNested(html, "bg-surface", "text-muted").length, 1);
});

test("matches whole class names only, not variants", () => {
  const html = '<div class="hover:bg-surface"><p class="hover:text-muted">Rest</p></div>';
  assert.equal(findNested(html, "bg-surface", "text-muted").length, 0);
});

test("ignores markup inside scripts", () => {
  const html = '<div class="bg-surface"><script>"<p class=\\"text-muted\\">"</script></div>';
  assert.equal(findNested(html, "bg-surface", "text-muted").length, 0);
});
