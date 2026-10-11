import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import { getSwatch, MOODS } from "../app/moods.ts";
import { contrast } from "./helpers.mjs";

test("contrast matches known WCAG values", () => {
  assert.equal(contrast("#000000", "#FFFFFF").toFixed(1), "21.0");
  assert.equal(contrast("#FFD400", "#FFFFFF").toFixed(1), "1.4");
});

test("there are three moods in hub order", () => {
  assert.deepEqual(
    MOODS.map((mood) => mood.slug),
    ["sunrise", "editorial", "plate-room"],
  );
});

for (const mood of MOODS) {
  test(`${mood.name}: every role names one of its swatches`, () => {
    for (const token of Object.values(mood.roles)) getSwatch(mood, token);
  });

  test(`${mood.name}: core role pairs reach 4.5:1`, () => {
    const { roles } = mood;
    const pairs = [
      [roles.ink, roles.bg],
      [roles.muted, roles.bg],
      [roles.ink, roles.surface],
      [roles["on-accent"], roles.accent],
    ];
    for (const [text, background] of pairs) {
      const ratio = contrast(getSwatch(mood, text).hex, getSwatch(mood, background).hex);
      assert.ok(ratio >= 4.5, `${text} on ${background} is ${ratio.toFixed(2)}:1`);
    }
  });

  test(`${mood.name}: the keyboard focus ring reaches 3:1 against the page`, () => {
    const ratio = contrast(getSwatch(mood, mood.roles.focus).hex, getSwatch(mood, mood.roles.bg).hex);
    assert.ok(ratio >= 3, `focus ${mood.roles.focus} on ${mood.roles.bg} is ${ratio.toFixed(2)}:1`);
  });

  test(`${mood.name}: control outlines reach 3:1 against the page`, () => {
    const ratio = contrast(getSwatch(mood, mood.roles.control).hex, getSwatch(mood, mood.roles.bg).hex);
    assert.ok(ratio >= 3, `control ${mood.roles.control} on ${mood.roles.bg} is ${ratio.toFixed(2)}:1`);
  });

  test(`${mood.name}: every text pair its recipe uses is declared and reaches 4.5:1`, async () => {
    const file = new URL(`../app/design-system/recipes/${mood.slug}.ts`, import.meta.url);
    assert.ok(existsSync(file), `no recipe for ${mood.name} yet`);
    const [recipe] = Object.values(await import(file.href));
    const declared = new Set(mood.textPairs.map(([text, background]) => `${text}/${background}`));
    for (const [text, background] of recipe.textPairs) {
      assert.ok(declared.has(`${text}/${background}`), `${text} on ${background} is not in ${mood.name}'s textPairs`);
      const ratio = contrast(getSwatch(mood, text).hex, getSwatch(mood, background).hex);
      assert.ok(ratio >= 4.5, `${text} on ${background} is ${ratio.toFixed(2)}:1`);
    }
  });

  test(`${mood.name}: every declared text pair reaches 4.5:1`, () => {
    for (const [text, background] of mood.textPairs) {
      const ratio = contrast(getSwatch(mood, text).hex, getSwatch(mood, background).hex);
      assert.ok(ratio >= 4.5, `${text} on ${background} is ${ratio.toFixed(2)}:1`);
    }
  });
}
