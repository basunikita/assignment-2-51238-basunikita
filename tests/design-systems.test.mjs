import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, test } from "node:test";
import { getSwatch, moodStyle, MOODS } from "../app/moods.ts";
import { contrast, findNested, OUT, readPage, ROOT } from "./helpers.mjs";

const SECTIONS = ["color", "type", "spacing", "components", "control-states", "ui-states"];
const COMPONENTS = [
  "button", "link", "text-input", "select", "radio", "checkbox", "toggle", "tabs", "chips",
  "card", "badge", "list-rows", "detail-panel", "rest-timer", "set-tracker",
];
const STATES = ["rest", "hover", "focus", "pressed", "selected", "disabled"];
// The states each control has; every other cell in its row is marked n/a.
const APPLIES = {
  primary: ["rest", "hover", "focus", "pressed", "disabled"],
  secondary: ["rest", "hover", "focus", "pressed", "disabled"],
  chip: STATES,
  checkbox: ["rest", "hover", "focus", "selected", "disabled"],
  toggle: ["rest", "hover", "focus", "selected", "disabled"],
  tab: ["rest", "hover", "focus", "selected"],
};
const UI_STATES = ["empty", "loading", "error", "success"];

function compiledCss() {
  const dir = `${OUT}/_next/static/chunks`;
  return readdirSync(dir)
    .filter((file) => file.endsWith(".css"))
    .map((file) => readFileSync(`${dir}/${file}`, "utf8"))
    .join("\n");
}

for (const mood of MOODS) {
  describe(`${mood.name} design system`, () => {
    const page = () => readPage(`/design-systems/${mood.slug}/`);

    test("has the six sections in order", () => {
      assert.deepEqual([...page().matchAll(/data-section="([^"]+)"/g)].map(([, id]) => id), SECTIONS);
    });

    test("shows every component", () => {
      const html = page();
      for (const id of COMPONENTS) assert.ok(html.includes(`data-component="${id}"`), `missing ${id}`);
    });

    test("shows each control in every state that applies and marks the rest n/a", () => {
      const html = page();
      for (const [control, applies] of Object.entries(APPLIES)) {
        for (const state of STATES) {
          const cell = html.match(new RegExp(`<li[^>]*data-cell="${control}-${state}"[^>]*>`))?.[0];
          assert.ok(cell, `missing cell ${control}-${state}`);
          assert.equal(cell.includes("data-na"), !applies.includes(state), `${control}-${state}`);
        }
      }
    });

    // Roving tabindex only ever focuses the selected tab, so that's the focus state worth showing.
    test("freezes the tab's focus state on the selected tab", () => {
      const cell = page().match(/<li[^>]*data-cell="tab-focus"[^>]*>[\s\S]*?<\/li>/)?.[0] ?? "";
      assert.match(cell, /role="tab"[^>]*aria-selected="true"/);
    });

    test("shows the accent's ratio on the background as well as with its text", () => {
      const accent = page().match(/<li[^>]*data-role="accent"[^>]*>[\s\S]*?<\/li>/)?.[0] ?? "";
      const ratio = contrast(getSwatch(mood, mood.roles.accent).hex, getSwatch(mood, mood.roles.bg).hex);
      assert.ok(accent.includes(`${ratio.toFixed(1)}:1 on background`), `accent role doesn't show ${ratio.toFixed(1)}:1 on background`);
    });

    test("keeps the frozen samples out of the tab order", () => {
      assert.match(page(), /data-section="control-states"[\s\S]*?<div inert=""/);
    });

    test("shows the four UI states", () => {
      assert.deepEqual([...page().matchAll(/data-ui-state="([^"]+)"/g)].map(([, kind]) => kind), UI_STATES);
    });

    test("marks up switches, tabs and the panel for assistive tech", () => {
      const html = page();
      const switches = html.match(/<button[^>]*role="switch"[^>]*>/g) ?? [];
      assert.ok(switches.length > 0, "no switch");
      for (const element of switches) {
        assert.match(element, /aria-checked="(true|false)"/);
        assert.match(element, /aria-labelledby="/);
      }
      assert.match(html, /role="tablist"/);
      assert.match(html, /role="tab"[^>]*aria-selected="true"/);
      assert.match(html, /role="tabpanel"/);
      assert.match(html, /<dialog\b/);
    });

    test("labels every input and select", () => {
      const html = page();
      const fields = html.match(/<(?:input|select)\b[^>]*>/g) ?? [];
      assert.ok(fields.length > 0, "no fields");
      for (const field of fields) {
        const id = field.match(/\bid="([^"]+)"/)?.[1];
        assert.ok(id, `field without an id: ${field}`);
        assert.ok(html.includes(`for="${id}"`), `no label for ${id}`);
      }
    });

    test("gives every button a name", () => {
      for (const [, attributes, inner] of page().matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)) {
        const text = inner.replace(/<[^>]+>/g, "").trim();
        assert.ok(text || /aria-label(?:ledby)?="/.test(attributes), `unnamed button: ${attributes}`);
      }
    });

    // `@theme inline` doesn't emit --color-* variables, so a recipe may only read the ones moodStyle sets.
    test("its recipe reads only CSS variables the page sets", () => {
      const source = readFileSync(`${ROOT}app/design-system/recipes/${mood.slug}.ts`, "utf8");
      const defined = new Set(Object.keys(moodStyle(mood)));
      const used = [...source.matchAll(/(?:var\(|-\()(--[a-z0-9-]+)/g)].map(([, name]) => name);
      assert.deepEqual(used.filter((name) => !defined.has(name)), []);
    });

    for (const role of ["muted", "accent"]) {
      test(`never sets ${role} text on the surface when that pair is too faint`, () => {
        const text = getSwatch(mood, mood.roles[role]).hex;
        const surface = getSwatch(mood, mood.roles.surface).hex;
        if (contrast(text, surface) >= 4.5) return;
        // An element that paints its own background (e.g. Sunrise's warm-white Skip button) isn't on the surface.
        const ownBackground = /\bclass="(?:[^"]*\s)?bg-(?!surface\b)[^"\s]+/;
        const offenders = findNested(page(), "bg-surface", `text-${role}`).filter((tag) => !ownBackground.test(tag));
        assert.deepEqual(offenders, []);
      });
    }
  });
}

// Without the media query a tapped control keeps its hover style on a phone.
test("hover styles apply only on devices that can hover", () => {
  const css = compiledCss();
  let outsideHoverMedia = "";
  for (let index = 0; index < css.length; ) {
    const media = css.slice(index).match(/^@media\s*\(hover:\s*hover\)\s*\{/);
    if (!media) {
      outsideHoverMedia += css[index++];
      continue;
    }
    let depth = 1;
    index += media[0].length;
    while (depth > 0) depth += { "{": 1, "}": -1 }[css[index++]] ?? 0;
  }
  assert.ok(css.includes("[data-state~=hover]"), "no hover-state rules compiled");
  assert.deepEqual(outsideHoverMedia.match(/[^{}]*:hover[^{}]*\{/g) ?? [], []);
});

// Tailwind's bare `transition` animates outline-color, so a focus ring fades in from the text color.
test("recipes never use the bare transition utility", () => {
  const dir = `${ROOT}app/design-system/recipes`;
  for (const file of readdirSync(dir)) {
    const source = readFileSync(`${dir}/${file}`, "utf8");
    assert.deepEqual(source.match(/(?<![\w:-])transition(?![\w-])/g) ?? [], [], file);
  }
});

// The specs and plans quote class names no page uses, e.g. the Plate Room shadow's old --color-ink.
test("the CSS doesn't ship classes that only appear in docs/", () => {
  assert.equal(compiledCss().includes("var\\(--color-ink\\)"), false);
});

test("recipes use only palette colors", () => {
  const dir = `${ROOT}app/design-system/recipes`;
  const defaults = /\b(?:bg|text|border|outline|ring|fill|stroke|decoration|divide)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)\b/g;
  for (const file of readdirSync(dir)) {
    const source = readFileSync(`${dir}/${file}`, "utf8");
    assert.deepEqual(source.match(/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/g) ?? [], [], `${file}: color literal`);
    assert.deepEqual(source.match(defaults) ?? [], [], `${file}: Tailwind default palette`);
  }
});
