import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { describe, test } from "node:test";
import { getSwatch, MOODS } from "../app/moods.ts";
import { contrast, findNested, readPage, ROOT } from "./helpers.mjs";

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

test("recipes use only palette colors", () => {
  const dir = `${ROOT}app/design-system/recipes`;
  const defaults = /\b(?:bg|text|border|outline|ring|fill|stroke|decoration|divide)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)\b/g;
  for (const file of readdirSync(dir)) {
    const source = readFileSync(`${dir}/${file}`, "utf8");
    assert.deepEqual(source.match(/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/g) ?? [], [], `${file}: color literal`);
    assert.deepEqual(source.match(defaults) ?? [], [], `${file}: Tailwind default palette`);
  }
});
