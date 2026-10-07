import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const ROOT = fileURLToPath(new URL("../", import.meta.url));
export const OUT = `${ROOT}out`;

// route starts and ends with "/", e.g. "/mood-boards/calm/".
export function readPage(route) {
  const file = `${OUT}${route}index.html`;
  assert.ok(existsSync(file), `${route} was not exported (looked for ${file})`);
  return readFileSync(file, "utf8");
}

export function countMatches(text, pattern) {
  return (text.match(pattern) ?? []).length;
}

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((start) => {
    const channel = parseInt(hex.slice(start, start + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// WCAG 2 contrast ratio between two #RRGGBB colors.
export function contrast(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}
