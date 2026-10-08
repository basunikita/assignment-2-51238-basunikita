import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { describe, test } from "node:test";
import { getSwatch, MOODS } from "../app/moods.ts";
import { contrast, countMatches, findNested, readPage, ROOT } from "./helpers.mjs";

const MINIMUM = { photo: 8, color: 4, type: 3, texture: 3, interface: 5 };
const MAX_PHOTO_BYTES = 400_000;

for (const mood of MOODS) {
  describe(`${mood.name} mood board`, () => {
    const page = () => readPage(`/mood-boards/${mood.slug}/`);
    const source = () => {
      const file = `${ROOT}app/mood-boards/${mood.slug}/artifacts.tsx`;
      assert.ok(existsSync(file), `${file} is missing`);
      return readFileSync(file, "utf8");
    };

    test("has 25 to 30 artifacts", () => {
      const total = countMatches(page(), /data-artifact="(photo|generated)"/g);
      assert.ok(total >= 25 && total <= 30, `found ${total}`);
    });

    test("mixes every kind of artifact", () => {
      const html = page();
      for (const [kind, minimum] of Object.entries(MINIMUM)) {
        const pattern = kind === "photo" ? /data-artifact="photo"/g : new RegExp(`data-kind="${kind}"`, "g");
        const found = countMatches(html, pattern);
        assert.ok(found >= minimum, `${kind}: found ${found}, need ${minimum}`);
      }
    });

    test("marks every generated artifact with ✦", () => {
      const html = page();
      assert.equal(countMatches(html, /data-generated-mark="true"/g), countMatches(html, /data-artifact="generated"/g));
    });

    test("every photo has alt text, a small file in public/, and a credit", () => {
      const html = page();
      const images = html.match(/<img [^>]*>/g) ?? [];
      const sources = images.map((image) => image.match(/src="([^"]*)"/)?.[1] ?? "");
      assert.ok(images.length >= MINIMUM.photo, `found ${images.length} images`);
      assert.equal(new Set(sources).size, sources.length, "a photo is used twice");
      images.forEach((image, index) => {
        const alt = image.match(/alt="([^"]*)"/)?.[1] ?? "";
        const file = `${ROOT}public${sources[index]}`;
        assert.ok(alt.trim().length > 0, `${sources[index]} has no alt text`);
        assert.ok(existsSync(file), `${sources[index]} is not in public/`);
        assert.ok(statSync(file).size < MAX_PHOTO_BYTES, `${sources[index]} is over 400 KB`);
      });
      assert.equal(countMatches(html, /data-credit="true"/g), images.length);
    });

    test("states the artifact count it shows", () => {
      const html = page();
      const stated = Number(html.match(/data-artifact-count="(\d+)"/)?.[1]);
      assert.equal(stated, countMatches(html, /data-artifact="(photo|generated)"/g));
    });

    test("outlines keyboard focus in the focus color, not the accent", () => {
      const html = page();
      assert.ok(html.includes("focus-visible:outline-focus"), "no focus-visible:outline-focus class");
      assert.ok(!html.includes("focus-visible:outline-accent"), "still uses the accent for focus");
    });

    test("has no focusable mock controls", () => {
      assert.deepEqual(page().match(/<button|<input|<select|tabindex=/g) ?? [], []);
    });

    test("uses only palette colors in its artifacts", () => {
      assert.deepEqual(source().match(/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/g) ?? [], []);
    });

    test("never sets muted text on the surface when that pair is too faint", () => {
      const muted = getSwatch(mood, mood.roles.muted).hex;
      const surface = getSwatch(mood, mood.roles.surface).hex;
      if (contrast(muted, surface) >= 4.5) return;
      assert.deepEqual(findNested(page(), "bg-surface", "text-muted"), []);
    });
  });
}
