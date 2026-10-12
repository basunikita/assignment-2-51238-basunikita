import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { OUT, readPage } from "./helpers.mjs";

// Each self-hosted font file mapped to its family, read from the exported @font-face rules.
function fontFamiliesByFile() {
  const families = new Map();
  const dir = `${OUT}/_next/static/chunks`;
  for (const name of readdirSync(dir).filter((file) => file.endsWith(".css"))) {
    const css = readFileSync(`${dir}/${name}`, "utf8");
    for (const [, family, file] of css.matchAll(/@font-face\{font-family:([^;]+);[^}]*?url\(\.\.\/media\/([^)]+)\)/g)) {
      families.set(file, family.replace(/["']/g, ""));
    }
  }
  return families;
}

function preloadedFamilies(route) {
  const families = fontFamiliesByFile();
  const files = [...readPage(route).matchAll(/rel="preload" href="\/_next\/static\/media\/([^"]+)" as="font"/g)];
  return [...new Set(files.map(([, file]) => families.get(file) ?? `unknown file ${file}`))].sort();
}

// The hub shows each mood's display face; each board loads only its own mood's fonts.
const FONTS_BY_PAGE = {
  "/": ["Big Shoulders", "Newsreader", "Nunito"],
  "/mood-boards/sunrise/": ["Nunito"],
  "/mood-boards/editorial/": ["Libre Franklin", "Newsreader"],
  "/mood-boards/plate-room/": ["Archivo", "Big Shoulders", "Big Shoulders Stencil"],
  "/design-systems/sunrise/": ["Nunito"],
  "/design-systems/editorial/": ["Libre Franklin", "Newsreader"],
  "/design-systems/plate-room/": ["Archivo", "Big Shoulders", "Big Shoulders Stencil"],
  "/workout-week/": ["Archivo", "Big Shoulders", "Big Shoulders Stencil"],
};

for (const [route, expected] of Object.entries(FONTS_BY_PAGE)) {
  test(`${route} preloads only the fonts it uses`, () => {
    assert.deepEqual(preloadedFamilies(route), expected);
  });
}
