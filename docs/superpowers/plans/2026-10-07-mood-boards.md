# Mood Boards and Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the scaffold's placeholder routes with the brief's hub and build the Calm, Editorial and Plate Room mood boards, each reviewed by Nikita in the browser before the next one starts.

**Architecture:** `app/moods.ts` is the single source for each mood's palette, color roles, fonts and contrast pairs. One shared `MoodBoard` component renders any mood by setting `--swatch-*` and `--mood-*` CSS variables on its root; Tailwind 4 theme tokens (`bg-bg`, `text-ink`, `font-display`, `rounded-tile`, …) read those variables, so the same markup takes on each mood. Each board is a list of artifacts: Unsplash photos stored in `public/`, plus generated React pieces.

**Tech Stack:** Next.js 16.3.8 (App Router, `output: "export"`), React 19, Tailwind CSS 4, `next/font/google`, Node 24's built-in `node:test` for checks, `curl` + macOS `sips` for photos, Claude in Chrome for browser checks.

**Spec:** `docs/superpowers/specs/2026-10-07-mood-boards-design.md`

## Global Constraints

- Static export only: `output: "export"`, `trailingSlash: true`, `images.unoptimized: true` (already in `next.config.ts`). No database, accounts, APIs or storage.
- No new npm packages. Tests use `node:test` and `node:assert`, which ship with Node 24.
- Run npm with `npm_config_registry=https://imc-npm-proxy.trading.imc.intra/repository/npm-proxy/` and `NODE_OPTIONS=--use-system-ca` set for that one command. Never write `~/.npmrc`. `package-lock.json` keeps `registry.npmjs.org` URLs.
- In the sandbox, `next build` needs the hosts `fonts.googleapis.com` and `fonts.gstatic.com`; the photo script needs `unsplash.com` and `images.unsplash.com`.
- Text contrast meets WCAG AA: 4.5:1 for text.
- Each board works at 390 px and 1440 px wide, with no horizontal page scroll.
- Each board has 25 to 30 artifacts: about 9 Unsplash photos, about 5 color swatches, about 4 type specimens, about 4 textures, about 6 interface pieces.
- Photos are free Unsplash photos (never Unsplash+), stored in `public/mood-boards/<mood>/`, at most 1200 px wide.
- Every generated artifact carries a ✦; every photographer is credited.
- All artifact text comes from the workout week (table below). Never lorem ipsum.
- Board artifacts use palette colors only, through `--swatch-*` variables and role classes. No hex, `rgb()` or `hsl()` literals in a board's `artifacts.tsx`.
- Mock controls on a board are pictures of controls: `<span>`/`<div>`, never `<button>`, `<input>`, `<select>` or `tabindex`.
- Commits are authored `Nikita Basu <nbasu@uchicago.edu>` (already the repo's local config) and end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Never push.
- Nikita reviews each board in the browser and approves it before the next board starts.

### The workout week used on the boards

| Day | Workout |
|---|---|
| Mon | Lower body at the gym: goblet squat 3 × 10, Romanian deadlift 3 × 10, leg press 3 × 12, plank 3 × 30 s |
| Tue | Easy run outside, 20 minutes; walking breaks are fine |
| Wed | Upper body at the gym: lat pulldown 3 × 10, dumbbell bench press 3 × 10, seated cable row 3 × 12, shoulder press 3 × 10 |
| Thu | StairMaster 15 minutes, then treadmill incline walk 15 minutes |
| Fri | Full body at the gym |
| Sat | Bike ride outside, 45 minutes easy |
| Sun | Rest |

### Where this plan differs from the spec

- Google now ships Big Shoulders as one family. `Big_Shoulders` (with its `opsz` axis) replaces "Big Shoulders Display", and `Big_Shoulders_Stencil` replaces "Big Shoulders Stencil Display". At display sizes they render the Display cut.
- Text on the action color uses a palette color instead of pure white, so no palette gains a color. Calm uses warm white on dusk (4.7:1), Editorial uses paper on red (5.4:1). Both pass AA.
- Mood data lives in `app/moods.ts` instead of `app/sections.ts`, because both the hub and the boards use it. `sections.ts` is deleted.
- Each board splits its list into `photos.ts` (data printed by the photo script) and `artifacts.tsx` (the collage order and generated pieces).
- Unsplash resizes each photo to 1000 px wide on download (`w=1000`). `sips` only reads the dimensions.

## Review Focus

1. **Tiles are only about 170 px wide on a 390 px phone.** A big number or long word in a display size can be clipped inside its tile even when the page itself doesn't scroll sideways. The 390 px browser check in Tasks 3–5 lists clipped tiles; it must return none.
2. **Muted text on Calm's peach surface is 4.0:1, which fails AA.** No Calm element may combine `bg-surface` with `text-muted`. `tests/boards.test.mjs` checks this for every mood whose muted-on-surface pair fails (Task 3).
3. **Mock controls must not be focusable.** A keyboard user tabbing through a board should reach only the hub link and the photo credits. `tests/boards.test.mjs` fails if a board contains `<button`, `<input`, `<select` or `tabindex` (Task 3).
4. **A photo used twice, or a heavy file, slows the phone view.** `tests/boards.test.mjs` fails on a repeated photo or a file over 400 KB (Task 3).
5. **Every hub link needs a visible keyboard focus.** `tests/hub.test.mjs` fails if any hub link lacks a `focus-visible:outline` class (Task 2), and Task 6 tabs through the hub in the browser.

---

### Task 1: Mood data, fonts and theme tokens

**Files:**
- Create: `app/moods.ts`
- Create: `app/fonts.ts`
- Modify: `app/globals.css` (append a second `@theme inline` block)
- Modify: `package.json` (add a `test` script)
- Create: `tests/helpers.mjs`
- Test: `tests/contrast.test.mjs`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `type MoodSlug = "calm" | "editorial" | "plate-room"`
  - `type Swatch = { token: string; name: string; hex: string; role: string }`
  - `type Mood = { slug; name; tagline; swatches: Swatch[]; roles: Record<"bg" | "surface" | "ink" | "muted" | "line" | "accent" | "on-accent", string>; fonts: Record<"display" | "body" | "label" | "numbers", string>; radius: string; titleClass: string; tileClass: string; textPairs: [string, string][] }`
  - `MOODS: Mood[]` in the order Calm, Editorial, Plate Room
  - `getMood(slug: MoodSlug): Mood`, `getSwatch(mood: Mood, token: string): Swatch` (both throw on unknown input)
  - `moodStyle(mood: Mood): Record<string, string>`: sets `--swatch-<token>`, `--mood-<role>`, `--mood-font-<role>` and `--mood-radius`
  - `MOOD_FONT_CLASSES: Record<MoodSlug, string>` from `app/fonts.ts`: the next/font variable classes a mood needs
  - Tailwind tokens: colors `bg`, `surface`, `ink`, `muted`, `line`, `accent`, `on-accent`; fonts `display`, `body`, `label`, `numbers`; radius `tile`
  - `tests/helpers.mjs`: `ROOT`, `OUT`, `readPage(route)`, `countMatches(text, pattern)`, `contrast(hexA, hexB)`

- [ ] **Step 1: Write the test helpers**

Create `tests/helpers.mjs`:

```js
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
```

- [ ] **Step 2: Write the failing contrast test**

Create `tests/contrast.test.mjs`:

```js
import assert from "node:assert/strict";
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
    ["calm", "editorial", "plate-room"],
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

  test(`${mood.name}: every declared text pair reaches 4.5:1`, () => {
    for (const [text, background] of mood.textPairs) {
      const ratio = contrast(getSwatch(mood, text).hex, getSwatch(mood, background).hex);
      assert.ok(ratio >= 4.5, `${text} on ${background} is ${ratio.toFixed(2)}:1`);
    }
  });
}
```

- [ ] **Step 3: Run it to make sure it fails**

Run: `node --test tests/contrast.test.mjs`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `app/moods.ts`.

- [ ] **Step 4: Write the mood data**

Create `app/moods.ts`. It must import nothing, because the Node tests load it directly.

```ts
export type MoodSlug = "calm" | "editorial" | "plate-room";

export type Swatch = {
  token: string;
  name: string;
  hex: string;
  role: string;
};

type ColorRole = "bg" | "surface" | "ink" | "muted" | "line" | "accent" | "on-accent";
type FontRole = "display" | "body" | "label" | "numbers";

export type Mood = {
  slug: MoodSlug;
  name: string;
  tagline: string;
  // The hub shows the first four swatches as a strip and the first three as dots.
  swatches: Swatch[];
  // The brief's color roles, each naming a swatch token.
  roles: Record<ColorRole, string>;
  // CSS font-family values; the variables come from app/fonts.ts.
  fonts: Record<FontRole, string>;
  radius: string;
  // Weight and case for the board's title.
  titleClass: string;
  // Extra classes for every collage tile.
  tileClass: string;
  // [text token, background token] pairs the board sets text in; each must reach 4.5:1.
  textPairs: [string, string][];
};

export const MOODS: Mood[] = [
  {
    slug: "calm",
    name: "Calm",
    tagline: "Calm · Matte · Dawn",
    swatches: [
      { token: "peach", name: "Peach", hex: "#F6D3BF", role: "Warm tint" },
      { token: "apricot", name: "Apricot", hex: "#EBA587", role: "Warm accent" },
      { token: "sky", name: "Sky", hex: "#C4D8E8", role: "Cool tint" },
      { token: "dusk", name: "Dusk", hex: "#56718C", role: "Action" },
      { token: "warm-white", name: "Warm white", hex: "#FBF6F0", role: "Background" },
      { token: "ink", name: "Ink", hex: "#2E2933", role: "Text" },
      { token: "muted", name: "Muted", hex: "#6E6470", role: "Muted text" },
    ],
    roles: {
      bg: "warm-white",
      surface: "peach",
      ink: "ink",
      muted: "muted",
      line: "peach",
      accent: "dusk",
      "on-accent": "warm-white",
    },
    fonts: {
      display: "var(--font-nunito)",
      body: "var(--font-nunito)",
      label: "var(--font-nunito)",
      numbers: "var(--font-nunito)",
    },
    radius: "18px",
    titleClass: "font-extrabold",
    tileClass: "",
    textPairs: [
      ["ink", "warm-white"],
      ["muted", "warm-white"],
      ["dusk", "warm-white"],
      ["warm-white", "dusk"],
      ["ink", "peach"],
      ["ink", "apricot"],
      ["ink", "sky"],
      ["warm-white", "ink"],
    ],
  },
  {
    slug: "editorial",
    name: "Editorial",
    tagline: "Editorial · Ink · Grid",
    swatches: [
      { token: "paper", name: "Paper", hex: "#F7F4EE", role: "Background" },
      { token: "ink", name: "Ink", hex: "#141414", role: "Text" },
      { token: "red", name: "Red", hex: "#C8102E", role: "Accent" },
      { token: "graphite", name: "Graphite", hex: "#5C5A55", role: "Muted text" },
      { token: "newsprint", name: "Newsprint", hex: "#EDE8DF", role: "Surface" },
      { token: "rule", name: "Rule", hex: "#D9D3C7", role: "Border" },
    ],
    roles: {
      bg: "paper",
      surface: "newsprint",
      ink: "ink",
      muted: "graphite",
      line: "rule",
      accent: "red",
      "on-accent": "paper",
    },
    fonts: {
      display: "var(--font-newsreader)",
      body: "var(--font-newsreader)",
      label: "var(--font-libre-franklin)",
      numbers: "var(--font-libre-franklin)",
    },
    radius: "0px",
    titleClass: "font-semibold tracking-tight",
    tileClass: "",
    textPairs: [
      ["ink", "paper"],
      ["graphite", "paper"],
      ["red", "paper"],
      ["paper", "red"],
      ["ink", "newsprint"],
      ["graphite", "newsprint"],
      ["red", "newsprint"],
      ["paper", "ink"],
      ["paper", "graphite"],
      ["ink", "rule"],
    ],
  },
  {
    slug: "plate-room",
    name: "Plate Room",
    tagline: "Plate Room · Steel · Signal",
    swatches: [
      { token: "safety", name: "Safety", hex: "#FFD400", role: "Action" },
      { token: "ink", name: "Ink", hex: "#121212", role: "Text" },
      { token: "red", name: "Red", hex: "#D7262D", role: "Legs" },
      { token: "blue", name: "Blue", hex: "#1F5FBF", role: "Upper body" },
      { token: "green", name: "Green", hex: "#187A43", role: "Cardio" },
      { token: "concrete", name: "Concrete", hex: "#E9E8E4", role: "Background" },
      { token: "panel", name: "Panel", hex: "#FFFFFF", role: "Surface" },
      { token: "steel", name: "Steel", hex: "#BDBBB4", role: "Border" },
      { token: "muted", name: "Muted", hex: "#55534E", role: "Muted text" },
    ],
    roles: {
      bg: "concrete",
      surface: "panel",
      ink: "ink",
      muted: "muted",
      line: "steel",
      accent: "safety",
      "on-accent": "ink",
    },
    fonts: {
      display: "var(--font-big-shoulders)",
      body: "var(--font-archivo)",
      label: "var(--font-archivo)",
      numbers: "var(--font-big-shoulders-stencil)",
    },
    radius: "0px",
    titleClass: "font-black uppercase",
    tileClass: "border-2 border-ink",
    textPairs: [
      ["ink", "concrete"],
      ["ink", "panel"],
      ["muted", "panel"],
      ["muted", "concrete"],
      ["ink", "safety"],
      ["panel", "red"],
      ["panel", "blue"],
      ["panel", "green"],
      ["panel", "ink"],
      ["ink", "steel"],
    ],
  },
];

export function getMood(slug: MoodSlug): Mood {
  const mood = MOODS.find((candidate) => candidate.slug === slug);
  if (!mood) throw new Error(`Unknown mood: ${slug}`);
  return mood;
}

export function getSwatch(mood: Mood, token: string): Swatch {
  const swatch = mood.swatches.find((candidate) => candidate.token === token);
  if (!swatch) throw new Error(`${mood.name} has no swatch "${token}"`);
  return swatch;
}

// CSS variables for a board's root element; app/globals.css maps them to Tailwind tokens.
export function moodStyle(mood: Mood): Record<string, string> {
  const vars: Record<string, string> = { "--mood-radius": mood.radius };
  for (const swatch of mood.swatches) vars[`--swatch-${swatch.token}`] = swatch.hex;
  for (const [role, token] of Object.entries(mood.roles)) vars[`--mood-${role}`] = `var(--swatch-${token})`;
  for (const [role, family] of Object.entries(mood.fonts)) vars[`--mood-font-${role}`] = family;
  return vars;
}
```

- [ ] **Step 5: Run the test to make sure it passes**

Run: `node --test tests/contrast.test.mjs`
Expected: PASS, 11 tests, 0 failures.

- [ ] **Step 6: Add the fonts**

Create `app/fonts.ts`:

```ts
import {
  Archivo,
  Big_Shoulders,
  Big_Shoulders_Stencil,
  Libre_Franklin,
  Newsreader,
  Nunito,
} from "next/font/google";
import type { MoodSlug } from "./moods";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-newsreader",
});
const libreFranklin = Libre_Franklin({ subsets: ["latin"], variable: "--font-libre-franklin" });
const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-big-shoulders",
});
const bigShouldersStencil = Big_Shoulders_Stencil({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-big-shoulders-stencil",
});
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo" });

// Put a mood's classes on any element whose children use that mood's fonts.
export const MOOD_FONT_CLASSES: Record<MoodSlug, string> = {
  calm: nunito.variable,
  editorial: `${newsreader.variable} ${libreFranklin.variable}`,
  "plate-room": `${bigShoulders.variable} ${bigShouldersStencil.variable} ${archivo.variable}`,
};
```

- [ ] **Step 7: Map the mood variables to Tailwind tokens**

Append to `app/globals.css`, after the existing `body { … }` rule:

```css
/* Mood tokens: a board sets --mood-* on its root (moodStyle in app/moods.ts). */
@theme inline {
  --color-bg: var(--mood-bg);
  --color-surface: var(--mood-surface);
  --color-ink: var(--mood-ink);
  --color-muted: var(--mood-muted);
  --color-line: var(--mood-line);
  --color-accent: var(--mood-accent);
  --color-on-accent: var(--mood-on-accent);
  --font-display: var(--mood-font-display);
  --font-body: var(--mood-font-body);
  --font-label: var(--mood-font-label);
  --font-numbers: var(--mood-font-numbers);
  --radius-tile: var(--mood-radius);
}
```

- [ ] **Step 8: Add the test script**

In `package.json`, add to `"scripts"` after `"lint"`:

```json
    "test": "rm -rf out && next build && node --test 'tests/*.test.mjs'"
```

The `build` must come first because later tests read the exported HTML in `out/`.

- [ ] **Step 9: Run the full checks**

Run: `npm test` (sandbox: allow `fonts.googleapis.com`, `fonts.gstatic.com`), then `npm run lint`.
Expected: build succeeds; 11 tests pass; lint prints nothing.

- [ ] **Step 10: Commit**

```bash
git add app/moods.ts app/fonts.ts app/globals.css package.json tests/helpers.mjs tests/contrast.test.mjs
git commit -F - <<'EOF'
Add mood palettes, fonts and contrast checks

Put each mood's palette, color roles, fonts and contrast pairs in
app/moods.ts, and map them to Tailwind tokens so one layout can take
on any mood. A node:test suite checks every text pair reaches 4.5:1.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 2: Routes and hub

**Files:**
- Modify: `app/page.tsx` (rewrite)
- Modify: `app/layout.tsx:15-18` (title template)
- Delete: `app/sections.ts`, `app/moods/`, `app/systems/`, `app/site/`
- Create: `app/mood-boards/calm/page.tsx`, `app/mood-boards/editorial/page.tsx`, `app/mood-boards/plate-room/page.tsx` (placeholders)
- Create: `app/design-systems/calm/page.tsx`, `app/design-systems/editorial/page.tsx`, `app/design-systems/plate-room/page.tsx`
- Create: `app/workout-week/page.tsx`
- Modify: `README.md` (layout table, `npm test`)
- Test: `tests/hub.test.mjs`

**Interfaces:**
- Consumes: `MOODS`, `Mood` from `app/moods.ts`; `MOOD_FONT_CLASSES` from `app/fonts.ts`; `Placeholder` (default export of `app/placeholder.tsx`, props `{ title: string }`).
- Produces: routes `/mood-boards/<slug>/`, `/design-systems/<slug>/`, `/workout-week/`; the root layout's title template `"%s · A Week of Workouts"`.

- [ ] **Step 1: Write the failing hub test**

Create `tests/hub.test.mjs`:

```js
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import { OUT, readPage } from "./helpers.mjs";

const PAGES = [
  "/mood-boards/calm/",
  "/mood-boards/editorial/",
  "/mood-boards/plate-room/",
  "/design-systems/calm/",
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

test("the scaffold routes the hub replaced are gone", () => {
  for (const page of ["/moods/1/", "/systems/1/", "/site/"]) {
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
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `npm test`
Expected: contrast tests PASS; hub tests FAIL, starting with "no link to /mood-boards/calm/".

- [ ] **Step 3: Remove the scaffold routes**

```bash
git rm -q -r app/sections.ts app/moods app/systems app/site
```

- [ ] **Step 4: Add the placeholder pages**

Create `app/mood-boards/calm/page.tsx`:

```tsx
import type { Metadata } from "next";
import Placeholder from "../../placeholder";

export const metadata: Metadata = { title: "Calm mood board" };

export default function CalmMoodBoard() {
  return <Placeholder title="Calm mood board" />;
}
```

Create `app/mood-boards/editorial/page.tsx`:

```tsx
import type { Metadata } from "next";
import Placeholder from "../../placeholder";

export const metadata: Metadata = { title: "Editorial mood board" };

export default function EditorialMoodBoard() {
  return <Placeholder title="Editorial mood board" />;
}
```

Create `app/mood-boards/plate-room/page.tsx`:

```tsx
import type { Metadata } from "next";
import Placeholder from "../../placeholder";

export const metadata: Metadata = { title: "Plate Room mood board" };

export default function PlateRoomMoodBoard() {
  return <Placeholder title="Plate Room mood board" />;
}
```

Create `app/design-systems/calm/page.tsx`:

```tsx
import type { Metadata } from "next";
import Placeholder from "../../placeholder";

export const metadata: Metadata = { title: "Calm design system" };

export default function CalmDesignSystem() {
  return <Placeholder title="Calm design system" />;
}
```

Create `app/design-systems/editorial/page.tsx`:

```tsx
import type { Metadata } from "next";
import Placeholder from "../../placeholder";

export const metadata: Metadata = { title: "Editorial design system" };

export default function EditorialDesignSystem() {
  return <Placeholder title="Editorial design system" />;
}
```

Create `app/design-systems/plate-room/page.tsx`:

```tsx
import type { Metadata } from "next";
import Placeholder from "../../placeholder";

export const metadata: Metadata = { title: "Plate Room design system" };

export default function PlateRoomDesignSystem() {
  return <Placeholder title="Plate Room design system" />;
}
```

Create `app/workout-week/page.tsx`:

```tsx
import type { Metadata } from "next";
import Placeholder from "../placeholder";

export const metadata: Metadata = { title: "My week" };

export default function WorkoutWeek() {
  return <Placeholder title="A Week of Workouts" />;
}
```

- [ ] **Step 5: Add the title template**

In `app/layout.tsx`, replace the `metadata` object with:

```ts
export const metadata: Metadata = {
  title: { default: "A Week of Workouts", template: "%s · A Week of Workouts" },
  description: "Three mood boards, three design systems, and a site for a week of workouts.",
};
```

- [ ] **Step 6: Write the hub**

Replace `app/page.tsx` with:

```tsx
import Link from "next/link";
import type { ReactNode } from "react";
import { MOOD_FONT_CLASSES } from "./fonts";
import { MOODS } from "./moods";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-zinc-100";
const CARD = `flex items-center justify-between gap-3 rounded-xl border border-zinc-300 px-4 py-3 transition-colors hover:border-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:border-zinc-100 dark:hover:bg-zinc-900 ${FOCUS}`;
const SWATCH_EDGE = "ring-1 ring-inset ring-zinc-900/15 dark:ring-zinc-100/25";

function HubSection({ step, title, children }: { step: number; title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-zinc-900 text-[11px] text-white dark:bg-zinc-100 dark:text-zinc-900">
          {step}
        </span>
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-8 sm:py-16">
      <p className="text-sm text-zinc-500">MPCS 51238 · UI/UX &amp; Visual Design</p>
      <h1 className="mt-1 text-4xl font-semibold tracking-tight">A Week of Workouts</h1>
      <p className="mt-3 max-w-prose text-zinc-600 dark:text-zinc-400">
        A beginner&apos;s week of gym strength work and cardio: three moods, a design system built from
        each, and the site.
      </p>

      <HubSection step={1} title="Mood boards">
        <ul className="grid gap-3 sm:grid-cols-3">
          {MOODS.map((mood) => (
            <li key={mood.slug}>
              <Link href={`/mood-boards/${mood.slug}/`} className={CARD}>
                <span className="flex" aria-hidden="true">
                  {mood.swatches.slice(0, 4).map((swatch) => (
                    <span
                      key={swatch.token}
                      className={`h-7 w-7 first:rounded-l-md last:rounded-r-md ${SWATCH_EDGE}`}
                      style={{ background: swatch.hex }}
                    />
                  ))}
                </span>
                <span className="font-medium">
                  {mood.name} <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </HubSection>

      <HubSection step={2} title="Design systems">
        <ul className="grid gap-3 sm:grid-cols-3">
          {MOODS.map((mood) => (
            <li key={mood.slug}>
              <Link href={`/design-systems/${mood.slug}/`} className={CARD}>
                <span className={`flex items-center gap-2 ${MOOD_FONT_CLASSES[mood.slug]}`} aria-hidden="true">
                  <span className="text-2xl leading-none" style={{ fontFamily: mood.fonts.display }}>
                    Aa
                  </span>
                  {mood.swatches.slice(0, 3).map((swatch) => (
                    <span
                      key={swatch.token}
                      className={`h-3 w-3 rounded-full ${SWATCH_EDGE}`}
                      style={{ background: swatch.hex }}
                    />
                  ))}
                </span>
                <span className="font-medium">
                  {mood.name} <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-sm text-zinc-500">Each one built from its mood board.</p>
      </HubSection>

      <HubSection step={3} title="Your site">
        <Link
          href="/workout-week/"
          className={`inline-flex rounded-full bg-zinc-900 px-5 py-3 font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 ${FOCUS}`}
        >
          Open A Week of Workouts <span aria-hidden="true">&nbsp;→</span>
        </Link>
      </HubSection>
    </main>
  );
}
```

- [ ] **Step 7: Run the tests to make sure they pass**

Run: `npm test`
Expected: all contrast and hub tests PASS.

- [ ] **Step 8: Update the README**

In `README.md`, replace the whole `## Layout` table with:

```markdown
| Route | Source | What it is |
|---|---|---|
| `/` | `app/page.tsx` | The hub. Each mood's palette, roles, fonts and contrast pairs live in `app/moods.ts`; fonts load in `app/fonts.ts` |
| `/mood-boards/<mood>/` | `app/mood-boards/<mood>/` | Mood boards: `calm`, `editorial`, `plate-room`. Shared layout in `app/mood-boards/_components/` |
| `/design-systems/<mood>/` | `app/design-systems/<mood>/page.tsx` | Design system *mood*, built from its mood board (placeholder for now) |
| `/workout-week/` | `app/workout-week/page.tsx` | The final site (placeholder for now) |
```

In `## Commands`, add a line after `npm run lint`:

```bash
npm test        # clean static build, then the checks in tests/
```

- [ ] **Step 9: Look at the hub in the browser**

Start a static server in the background: `python3 -m http.server 4173 --directory out`.
Load the Claude in Chrome tools in one ToolSearch call (`select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__resize_window,mcp__claude-in-chrome__javascript_tool`), call `tabs_context_mcp`, open a new tab, and navigate to `http://localhost:4173/`.
Take a screenshot at 1440 × 900. Check that the three mood cards show four swatches each (paper and warm white have a visible edge), the design-system cards show "Aa" in Nunito, Newsreader and Big Shoulders, and the site button is dark.

- [ ] **Step 10: Commit**

```bash
git add -A app README.md tests/hub.test.mjs
git commit -F - <<'EOF'
Build the hub and move to the brief's routes

Replace the numbered placeholder routes with /mood-boards/<mood>,
/design-systems/<mood> and /workout-week, and turn the home page into
the brief's hub: swatch cards for the mood boards, type samples for the
design systems, and one button for the site.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 3: Shared board layout, photo script and the Calm board

**Files:**
- Create: `app/mood-boards/_components/artifact.ts`
- Create: `app/mood-boards/_components/Swatch.tsx`
- Create: `app/mood-boards/_components/Specimen.tsx`
- Create: `app/mood-boards/_components/MoodBoard.tsx`
- Create: `scripts/unsplash.sh`
- Create: `app/mood-boards/calm/photos.ts`
- Create: `app/mood-boards/calm/artifacts.tsx`
- Modify: `app/mood-boards/calm/page.tsx` (replace the placeholder)
- Create: `public/mood-boards/calm/*.jpg` (9 photos)
- Modify: `README.md` (photo section)
- Test: `tests/boards.test.mjs`

**Interfaces:**
- Consumes: `getMood`, `getSwatch`, `moodStyle`, `Mood`, `Swatch` from `app/moods.ts`; `MOOD_FONT_CLASSES` from `app/fonts.ts`; Tailwind tokens from Task 1.
- Produces (Tasks 4 and 5 use these):
  - `type Photo = { kind: "photo"; src: string; width: number; height: number; alt: string; photographer: string; photoUrl: string; className?: string }`
  - `type Generated = { kind: "color" | "type" | "texture" | "interface"; id: string; node: ReactNode }`
  - `type Artifact = Photo | Generated`
  - `MoodBoard` (default export), props `{ mood: Mood; artifacts: Artifact[] }`
  - `Swatch` (default export), props `{ swatch: Swatch; textToken: string; className?: string }`
  - `Specimen` (default export), props `{ caption: string; children: ReactNode; className?: string }`
  - `scripts/unsplash.sh search "<query>"` and `scripts/unsplash.sh get <mood> <photo-id> <file-name>`; `get` prints one line `  <camelName>: { kind: "photo", … },`
  - Each board exports `PHOTOS` from `photos.ts` and `<MOOD>_ARTIFACTS: Artifact[]` from `artifacts.tsx`
  - Board HTML markers: `data-artifact="photo|generated"`, `data-kind="<kind>"`, `data-generated-mark`, `data-credit`, `data-artifact-count="<n>"`

- [ ] **Step 1: Write the failing board tests**

Create `tests/boards.test.mjs`:

```js
import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { describe, test } from "node:test";
import { getSwatch, MOODS } from "../app/moods.ts";
import { contrast, countMatches, readPage, ROOT } from "./helpers.mjs";

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
      assert.equal(countMatches(html, /data-generated-mark/g), countMatches(html, /data-artifact="generated"/g));
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
      assert.equal(countMatches(html, /data-credit/g), images.length);
    });

    test("states the artifact count it shows", () => {
      const html = page();
      const stated = Number(html.match(/data-artifact-count="(\d+)"/)?.[1]);
      assert.equal(stated, countMatches(html, /data-artifact="(photo|generated)"/g));
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
      const classLists = source().match(/className=(?:"[^"]*"|\{`[^`]*`\})/g) ?? [];
      const offenders = classLists.filter((classes) => classes.includes("bg-surface") && classes.includes("text-muted"));
      assert.deepEqual(offenders, []);
    });
  });
}
```

- [ ] **Step 2: Run it to make sure Calm fails**

Run: `npm test`
Expected: the contrast and hub tests PASS. The three "mood board" suites FAIL, starting with "has 25 to 30 artifacts: found 0". The Editorial and Plate Room suites stay red until Tasks 4 and 5.

- [ ] **Step 3: Write the artifact types and shared pieces**

Create `app/mood-boards/_components/artifact.ts`:

```ts
import type { ReactNode } from "react";

export type Photo = {
  kind: "photo";
  src: string;
  width: number;
  height: number;
  alt: string;
  photographer: string;
  photoUrl: string;
  className?: string;
};

export type Generated = {
  kind: "color" | "type" | "texture" | "interface";
  id: string;
  node: ReactNode;
};

export type Artifact = Photo | Generated;
```

Create `app/mood-boards/_components/Swatch.tsx`:

```tsx
import type { Swatch as SwatchData } from "@/app/moods";

export default function Swatch({
  swatch,
  textToken,
  className = "h-36",
}: {
  swatch: SwatchData;
  textToken: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col justify-end p-3 font-label ${className}`}
      style={{ background: swatch.hex, color: `var(--swatch-${textToken})` }}
    >
      <p className="text-sm font-bold">{swatch.name}</p>
      <p className="text-xs">
        {swatch.hex} · {swatch.role}
      </p>
    </div>
  );
}
```

Create `app/mood-boards/_components/Specimen.tsx`:

```tsx
import type { ReactNode } from "react";

export default function Specimen({
  caption,
  children,
  className = "",
}: {
  caption: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`p-5 ${className}`}>
      {children}
      <p className="mt-4 font-label text-[11px] uppercase tracking-[0.14em] text-muted">{caption}</p>
    </div>
  );
}
```

- [ ] **Step 4: Write the shared board layout**

Create `app/mood-boards/_components/MoodBoard.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";
import { Fragment, type CSSProperties } from "react";
import { MOOD_FONT_CLASSES } from "@/app/fonts";
import { moodStyle, type Mood } from "@/app/moods";
import type { Artifact, Photo } from "./artifact";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

export default function MoodBoard({ mood, artifacts }: { mood: Mood; artifacts: Artifact[] }) {
  const photos = artifacts.filter((artifact): artifact is Photo => artifact.kind === "photo");
  const tile = `mb-3 break-inside-avoid overflow-hidden rounded-tile ${mood.tileClass}`;

  return (
    <div
      className={`${MOOD_FONT_CLASSES[mood.slug]} flex-1 bg-bg font-body text-ink`}
      style={moodStyle(mood) as CSSProperties}
    >
      <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-8 sm:py-12">
        <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <Link href="/" className={`font-label text-sm underline underline-offset-4 ${FOCUS}`}>
              ← Hub
            </Link>
            <h1 className={`mt-4 font-display text-5xl leading-none sm:text-7xl ${mood.titleClass}`}>{mood.name}</h1>
            <p className="mt-3 font-label text-xs uppercase tracking-[0.16em] text-muted">{mood.tagline}</p>
          </div>
          <p className="font-label text-sm text-muted">
            <span aria-hidden="true">✦</span> generated by my agent
          </p>
        </header>

        <ul aria-label={`${mood.name} mood board`} className="mt-8 columns-2 gap-3 md:columns-3 lg:columns-4 xl:columns-5">
          {artifacts.map((artifact) =>
            artifact.kind === "photo" ? (
              <li key={artifact.src} data-artifact="photo" className={tile}>
                <Image
                  src={artifact.src}
                  alt={artifact.alt}
                  width={artifact.width}
                  height={artifact.height}
                  className={`block h-auto w-full ${artifact.className ?? ""}`}
                />
              </li>
            ) : (
              <li key={artifact.id} data-artifact="generated" data-kind={artifact.kind} className={`relative ${tile}`}>
                {artifact.node}
                <span
                  data-generated-mark
                  className="absolute top-2 right-2 rounded-full bg-bg/85 px-1.5 text-xs leading-5 text-ink"
                >
                  <span aria-hidden="true">✦</span>
                  <span className="sr-only">Generated by my agent</span>
                </span>
              </li>
            ),
          )}
        </ul>

        <footer className="mt-10 border-t border-line pt-6 font-label text-sm text-muted">
          <p data-artifact-count={artifacts.length}>
            {artifacts.length} artifacts: photos, type, color, texture and interface pieces
          </p>
          <p className="mt-2">
            Photos from Unsplash by{" "}
            {photos.map((photo, index) => (
              <Fragment key={photo.src}>
                {index > 0 && ", "}
                <a data-credit href={photo.photoUrl} className={`underline underline-offset-2 hover:text-ink ${FOCUS}`}>
                  {photo.photographer}
                </a>
              </Fragment>
            ))}
            .
          </p>
        </footer>
      </main>
    </div>
  );
}
```

- [ ] **Step 5: Write the photo script**

Create `scripts/unsplash.sh`:

```bash
#!/usr/bin/env bash
# Find and download free Unsplash photos for the mood boards.
#   scripts/unsplash.sh search "<query>"
#       Lists free photos (never Unsplash+): id | size | photographer | description
#   scripts/unsplash.sh get <mood> <photo-id> <file-name>
#       Saves public/mood-boards/<mood>/<file-name>.jpg, 1000 px wide, and prints
#       the entry to paste into app/mood-boards/<mood>/photos.ts
set -euo pipefail

api="https://unsplash.com/napi"

case "${1:-}" in
  search)
    query=$(node -p 'encodeURIComponent(process.argv[1])' "$2")
    curl -sSf "$api/search/photos?query=$query&per_page=30" | node -e '
      let body = "";
      process.stdin.on("data", (chunk) => (body += chunk)).on("end", () => {
        for (const photo of JSON.parse(body).results) {
          if (photo.premium || photo.plus) continue;
          console.log([photo.id, `${photo.width}x${photo.height}`, photo.user.name, photo.alt_description].join(" | "));
        }
      });'
    ;;
  get)
    mood=$2 id=$3 name=$4
    dir="public/mood-boards/$mood"
    mkdir -p "$dir"
    info=$(curl -sSf "$api/photos/$id")
    raw=$(node -e '
      const photo = JSON.parse(process.argv[1]);
      if (photo.premium || photo.plus) { console.error("Unsplash+ photo: not free to use"); process.exit(1); }
      console.log(photo.urls.raw);' "$info")
    curl -sSf -o "$dir/$name.jpg" "$raw&w=1000&q=70&fm=jpg&fit=max"
    width=$(sips -g pixelWidth "$dir/$name.jpg" | awk '/pixelWidth/ { print $2 }')
    height=$(sips -g pixelHeight "$dir/$name.jpg" | awk '/pixelHeight/ { print $2 }')
    node -e '
      const [photo, src, name, width, height] = [JSON.parse(process.argv[1]), ...process.argv.slice(2)];
      const key = name.replace(/-(\w)/g, (_, letter) => letter.toUpperCase());
      const entry = {
        kind: "photo", src, width: Number(width), height: Number(height),
        alt: photo.alt_description ?? "", photographer: photo.user.name, photoUrl: photo.links.html,
      };
      const fields = Object.entries(entry).map(([field, value]) => `${field}: ${JSON.stringify(value)}`);
      console.log(`  ${key}: { ${fields.join(", ")} },`);' "$info" "/mood-boards/$mood/$name.jpg" "$name" "$width" "$height"
    ;;
  *)
    echo "usage: $0 search <query> | get <mood> <photo-id> <file-name>" >&2
    exit 2
    ;;
esac
```

Run: `chmod +x scripts/unsplash.sh && scripts/unsplash.sh search "sunrise run" | head -5` (sandbox: allow `unsplash.com`, `images.unsplash.com`).
Expected: five lines like `JnoNcfFwrNA | 4336x3040 | lucas Favre | silhouette photo of a person running on road`.

- [ ] **Step 6: Pick and download the nine Calm photos**

Calm's photos are soft and warm: low contrast, peach, sky and morning light. Mix portrait and landscape, with at least three portrait. Avoid logos or a close-up face as the main subject.

For each row, run `scripts/unsplash.sh search "<query>"`, choose one photo that fits, then run `scripts/unsplash.sh get calm <id> <file-name>`. Open each saved file with the Read tool to confirm it looks right. If it doesn't, delete it and pick another. Keep every printed line.

| Key | File name | Query |
|---|---|---|
| `sunriseRoad` | `sunrise-road` | use id `JnoNcfFwrNA` (runner in silhouette on a road) |
| `dawnPath` | `dawn-path` | `running path sunrise` |
| `morningGym` | `morning-gym` | `empty gym morning light` |
| `stretching` | `stretching` | `stretching morning light` |
| `treadmillWindow` | `treadmill-window` | `treadmill window` |
| `bikeDawn` | `bike-dawn` | `cycling sunrise` |
| `shoesLaced` | `shoes-laced` | `lacing running shoes` |
| `pastelSky` | `pastel-sky` | `pastel sunrise sky` |
| `stairClimber` | `stair-climber` | `stair climber machine` |

Create `app/mood-boards/calm/photos.ts` from the nine printed lines, in the table's order. Rewrite each `alt` in plain words, under 15 words, describing what a sighted person sees. For example, `sunriseRoad` becomes:

```ts
import type { Photo } from "../_components/artifact";

// Printed by `scripts/unsplash.sh get calm <id> <name>`; alt text rewritten by hand.
export const PHOTOS = {
  sunriseRoad: { kind: "photo", src: "/mood-boards/calm/sunrise-road.jpg", width: 1000, height: 701, alt: "A runner in silhouette on an empty road at sunrise", photographer: "lucas Favre", photoUrl: "https://unsplash.com/photos/silhouette-photo-of-a-person-running-on-road-JnoNcfFwrNA" },
  // …the other eight printed lines, keys exactly as in the table
} satisfies Record<string, Photo>;
```

Use the `width` and `height` the script printed; `701` above is only right for that one photo.

- [ ] **Step 7: Write the Calm artifacts**

Create `app/mood-boards/calm/artifacts.tsx`:

```tsx
import { getMood, getSwatch } from "@/app/moods";
import type { Artifact } from "../_components/artifact";
import Specimen from "../_components/Specimen";
import Swatch from "../_components/Swatch";
import { PHOTOS } from "./photos";

const calm = getMood("calm");
const SPECIMEN = "rounded-tile border border-line";
const CARD = "rounded-tile border border-line p-4";
const PRIMARY = "inline-block rounded-full bg-accent px-5 py-2.5 font-bold text-on-accent";
const LABEL = "text-xs font-bold uppercase tracking-[0.14em]";

const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const UPPER_BODY = [
  ["Lat pulldown", "3 × 10"],
  ["Dumbbell bench press", "3 × 10"],
  ["Seated cable row", "3 × 12"],
  ["Shoulder press", "3 × 10"],
];

export const CALM_ARTIFACTS: Artifact[] = [
  PHOTOS.sunriseRoad,
  {
    kind: "type",
    id: "type-display",
    node: (
      <Specimen caption="Nunito 800 · Display" className={SPECIMEN}>
        <p className="text-6xl font-extrabold leading-none">Day 2</p>
      </Specimen>
    ),
  },
  { kind: "color", id: "color-peach", node: <Swatch swatch={getSwatch(calm, "peach")} textToken="ink" className="h-44" /> },
  PHOTOS.stretching,
  {
    kind: "interface",
    id: "ui-buttons",
    node: (
      <div className={`${CARD} flex flex-wrap items-center gap-3`}>
        <span className={PRIMARY}>Start workout</span>
        <span className="rounded-full border-2 border-accent px-5 py-2 font-bold text-accent">Skip today</span>
      </div>
    ),
  },
  {
    kind: "texture",
    id: "texture-dawn",
    node: (
      <div
        role="img"
        aria-label="Dawn gradient from sky to apricot"
        className="h-64 bg-linear-to-b from-(--swatch-sky) via-(--swatch-peach) to-(--swatch-apricot)"
      />
    ),
  },
  PHOTOS.treadmillWindow,
  { kind: "color", id: "color-sky", node: <Swatch swatch={getSwatch(calm, "sky")} textToken="ink" className="h-28" /> },
  {
    kind: "interface",
    id: "ui-days",
    node: (
      <div className={CARD}>
        <p className="font-bold">This week</p>
        <div className="mt-3 flex flex-wrap gap-1.5 text-sm">
          {WEEK.map((day) => (
            <span
              key={day}
              className={
                day === "Tue"
                  ? "rounded-full bg-accent px-3 py-1 font-bold text-on-accent"
                  : "rounded-full border border-line px-3 py-1"
              }
            >
              {day}
            </span>
          ))}
        </div>
      </div>
    ),
  },
  PHOTOS.morningGym,
  {
    kind: "type",
    id: "type-heading",
    node: (
      <Specimen caption="Nunito 700 · Heading" className={SPECIMEN}>
        <p className="text-2xl font-bold leading-snug">Easy run, 20 minutes</p>
      </Specimen>
    ),
  },
  {
    kind: "texture",
    id: "texture-grain",
    node: (
      <svg viewBox="0 0 200 160" role="img" aria-label="Paper grain" className="block h-auto w-full bg-bg">
        <filter id="calm-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="200" height="160" filter="url(#calm-grain)" opacity="0.25" />
      </svg>
    ),
  },
  PHOTOS.bikeDawn,
  { kind: "color", id: "color-apricot", node: <Swatch swatch={getSwatch(calm, "apricot")} textToken="ink" className="h-36" /> },
  {
    kind: "interface",
    id: "ui-timer",
    node: (
      <div className="grid place-items-center bg-surface p-6">
        <svg viewBox="0 0 120 120" role="img" aria-label="Rest timer at one minute thirty" className="h-36 w-36">
          <circle cx="60" cy="60" r="52" fill="none" strokeWidth="8" className="stroke-bg" />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="327"
            strokeDashoffset="109"
            transform="rotate(-90 60 60)"
            className="stroke-accent"
          />
          <text x="60" y="68" textAnchor="middle" className="fill-ink text-[26px] font-extrabold">
            1:30
          </text>
        </svg>
        <p className={`mt-2 ${LABEL}`}>Rest · set 2 of 3</p>
      </div>
    ),
  },
  PHOTOS.pastelSky,
  {
    kind: "type",
    id: "type-body",
    node: (
      <Specimen caption="Nunito 400 · Body" className={SPECIMEN}>
        <p className="text-base leading-relaxed">
          Go at a pace where you could still hold a conversation. Walking breaks are fine.
        </p>
      </Specimen>
    ),
  },
  { kind: "color", id: "color-dusk", node: <Swatch swatch={getSwatch(calm, "dusk")} textToken="warm-white" className="h-40" /> },
  PHOTOS.dawnPath,
  {
    kind: "interface",
    id: "ui-reps",
    node: (
      <div className={`${CARD} flex items-center justify-between gap-3`}>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-accent text-xl font-bold text-accent">
          −
        </span>
        <div className="text-center">
          <p className="text-4xl font-extrabold leading-none">10</p>
          <p className={`mt-1 text-muted ${LABEL}`}>Reps · set 2 of 3</p>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-xl font-bold text-on-accent">
          +
        </span>
      </div>
    ),
  },
  {
    kind: "texture",
    id: "texture-horizon",
    node: (
      <div role="img" aria-label="A blurred sun rising over a soft horizon" className="relative h-44 overflow-hidden bg-(--swatch-sky)">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-surface" />
        <div className="absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/3 rounded-full bg-(--swatch-apricot) blur-xl" />
      </div>
    ),
  },
  PHOTOS.shoesLaced,
  { kind: "color", id: "color-ink", node: <Swatch swatch={getSwatch(calm, "ink")} textToken="warm-white" className="h-32" /> },
  {
    kind: "interface",
    id: "ui-card",
    node: (
      <div className="bg-surface p-5">
        <p className={LABEL}>Wednesday</p>
        <p className="mt-1 text-2xl font-extrabold">Upper body</p>
        <p className="text-sm">4 exercises · about 40 min</p>
        <ul className="mt-4 divide-y divide-(--swatch-apricot) text-sm">
          {UPPER_BODY.map(([exercise, sets]) => (
            <li key={exercise} className="flex justify-between gap-2 py-2">
              <span>{exercise}</span>
              <span className="font-bold">{sets}</span>
            </li>
          ))}
        </ul>
        <span className={`${PRIMARY} mt-4`}>Start workout</span>
      </div>
    ),
  },
  {
    kind: "type",
    id: "type-numbers",
    node: (
      <Specimen caption="Nunito 800 · Numbers" className={SPECIMEN}>
        <p className="text-5xl font-extrabold leading-none">3 × 10</p>
        <p className={`mt-2 text-muted ${LABEL}`}>Rest 90 s</p>
      </Specimen>
    ),
  },
  PHOTOS.stairClimber,
  {
    kind: "texture",
    id: "texture-lines",
    node: (
      <div
        role="img"
        aria-label="Thin warm lines"
        className="h-36 bg-bg"
        style={{ backgroundImage: "repeating-linear-gradient(180deg, var(--swatch-apricot) 0 1px, transparent 1px 12px)" }}
      />
    ),
  },
  {
    kind: "interface",
    id: "ui-streak",
    node: (
      <div className={`${CARD} flex items-center gap-3`}>
        <svg viewBox="0 0 40 40" aria-hidden="true" className="h-11 w-11 shrink-0">
          {[-60, -30, 0, 30, 60].map((angle) => (
            <line
              key={angle}
              x1="20"
              y1="12"
              x2="20"
              y2="6"
              strokeWidth="2.5"
              strokeLinecap="round"
              transform={`rotate(${angle} 20 26)`}
              className="stroke-(--swatch-apricot)"
            />
          ))}
          <circle cx="20" cy="26" r="9" className="fill-(--swatch-apricot)" />
          <line x1="4" y1="34" x2="36" y2="34" strokeWidth="2" strokeLinecap="round" className="stroke-ink" />
        </svg>
        <div>
          <p className="font-extrabold">4 days in a row</p>
          <p className="text-sm text-muted">Keep it gentle.</p>
        </div>
      </div>
    ),
  },
];
```

- [ ] **Step 8: Replace the Calm placeholder**

Replace `app/mood-boards/calm/page.tsx` with:

```tsx
import type { Metadata } from "next";
import { getMood } from "@/app/moods";
import MoodBoard from "../_components/MoodBoard";
import { CALM_ARTIFACTS } from "./artifacts";

export const metadata: Metadata = { title: "Calm mood board" };

export default function CalmMoodBoard() {
  return <MoodBoard mood={getMood("calm")} artifacts={CALM_ARTIFACTS} />;
}
```

- [ ] **Step 9: Run the Calm tests to make sure they pass**

Run: `rm -rf out && npx next build && node --test --test-name-pattern="Calm|hub|contrast" 'tests/*.test.mjs'`
(`npm test -- --test-name-pattern=…` does not work: Node ignores options that come after the file glob.)
Expected: every Calm board test passes, and the contrast and hub tests still pass. Then run `npm run lint`; expected: no output.

- [ ] **Step 10: Check Calm in the browser at 1440 px**

Start `python3 -m http.server 4173 --directory out` in the background if it isn't running. In Claude in Chrome, navigate to `http://localhost:4173/mood-boards/calm/`, resize the window to 1440 × 900, take a screenshot, then run this with `javascript_tool`:

```js
(async () => {
  const statuses = await Promise.all(
    [...document.images].map(async (image) => [image.getAttribute("src"), (await fetch(image.src)).status]),
  );
  return {
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    artifacts: document.querySelectorAll("[data-artifact]").length,
    broken: statuses.filter(([, status]) => status !== 200),
    clipped: [...document.querySelectorAll("[data-artifact]")].filter((tile) => tile.scrollWidth > tile.clientWidth + 1).length,
  };
})()
```

Expected: `{ overflow: 0, artifacts: 28, broken: [], clipped: 0 }`. Scroll through the whole board and look at every tile: the type renders in Nunito, the ✦ marks are readable, nothing is cut off.

- [ ] **Step 11: Check Calm at 390 px**

Chrome won't shrink a window to 390 px, so measure inside a 390 px iframe. Run with `javascript_tool`:

```js
(async () => {
  const frame = document.createElement("iframe");
  frame.src = location.href;
  frame.style.cssText = "position:fixed;top:0;left:0;width:390px;height:844px;border:0;z-index:9999;background:white";
  document.body.append(frame);
  await new Promise((resolve) => frame.addEventListener("load", resolve, { once: true }));
  const doc = frame.contentDocument;
  return {
    overflow: doc.documentElement.scrollWidth - doc.documentElement.clientWidth,
    clipped: [...doc.querySelectorAll("[data-artifact]")]
      .filter((tile) => tile.scrollWidth > tile.clientWidth + 1)
      .map((tile) => tile.querySelector("img")?.getAttribute("src") ?? tile.textContent.slice(0, 40)),
  };
})()
```

Expected: `{ overflow: 0, clipped: [] }`. Take a screenshot (the iframe covers the top left of the page) to confirm the two-column layout and the header. Reload the page to remove the iframe. If a tile is clipped, make its text smaller, re-run Steps 9–11, and only then continue.

- [ ] **Step 12: Document the photo script**

In `README.md`, add after `## Commands`:

````markdown
## Photos

Mood-board photos are free Unsplash photos saved into `public/mood-boards/<mood>/`. The script
refuses Unsplash+ photos and prints the entry for `app/mood-boards/<mood>/photos.ts`:

```bash
scripts/unsplash.sh search "treadmill window"
scripts/unsplash.sh get calm <photo-id> treadmill-window
```

Rewrite each printed `alt` by hand so it describes the photo plainly.
````

- [ ] **Step 13: Commit**

```bash
git add app/mood-boards scripts/unsplash.sh public/mood-boards/calm tests/boards.test.mjs README.md
git commit -F - <<'EOF'
Build the Calm mood board

Add the shared mood-board layout (masonry collage, ✦ marks, artifact
count and photo credits), a script that fetches free Unsplash photos,
and the Calm board: nine photos plus palette, type, texture and
interface pieces in Nunito and the dawn palette.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

- [ ] **Step 14: CHECKPOINT: Nikita reviews Calm**

Stop and tell Nikita the board is ready at `http://localhost:4173/mood-boards/calm/` (or `npm run dev`, then `http://localhost:3000/mood-boards/calm/`). Ask what to change, by naming UI elements and design principles. For each round of feedback:
1. Make the changes.
2. Re-run Step 9. If the layout changed, re-run Steps 10–11 too.
3. Commit with a subject naming what Nikita asked for, e.g. `Calm board: swap the gym photo for a warmer one`, ending with the `Co-Authored-By` trailer.

Do not start Task 4 until Nikita says Calm is done.

---

### Task 4: The Editorial board

**Files:**
- Create: `app/mood-boards/editorial/photos.ts`
- Create: `app/mood-boards/editorial/artifacts.tsx`
- Modify: `app/mood-boards/editorial/page.tsx` (replace the placeholder)
- Create: `public/mood-boards/editorial/*.jpg` (9 photos)
- Test: `tests/boards.test.mjs` (already written; the Editorial suite)

**Interfaces:**
- Consumes: `MoodBoard`, `Swatch`, `Specimen`, `Artifact`, `Photo` from `app/mood-boards/_components/`; `getMood`, `getSwatch` from `app/moods.ts`; `scripts/unsplash.sh`.
- Produces: `PHOTOS` (`app/mood-boards/editorial/photos.ts`), `EDITORIAL_ARTIFACTS: Artifact[]`.

- [ ] **Step 1: Confirm the Editorial tests fail**

Run: `rm -rf out && npx next build && node --test --test-name-pattern="Editorial" 'tests/*.test.mjs'`
Expected: the Editorial board suite FAILS with "has 25 to 30 artifacts: found 0".

- [ ] **Step 2: Pick and download the nine Editorial photos**

Editorial's photos are shown in black and white, so pick for composition, not color: strong lines, tight crops and motion, like a magazine spread. Mix portrait and landscape, with at least three portrait. Avoid logos or a close-up face as the main subject.

For each row, run `scripts/unsplash.sh search "<query>"`, choose one photo, run `scripts/unsplash.sh get editorial <id> <file-name>`, and view it with the Read tool.

| Key | File name | Query |
|---|---|---|
| `runner` | `runner` | `black and white runner` |
| `trackLanes` | `track-lanes` | `running track lanes` |
| `raceBib` | `race-bib` | `race bib` |
| `stopwatch` | `stopwatch` | `stopwatch` |
| `startingLine` | `starting-line` | `track starting line` |
| `shoes` | `shoes` | `running shoes close up` |
| `runnerLegs` | `runner-legs` | `runner legs` |
| `cyclist` | `cyclist` | `cyclist black and white` |
| `gym` | `gym` | `gym black and white` |

Create `app/mood-boards/editorial/photos.ts` with the nine printed lines in the table's order, with `alt` rewritten by hand (under 15 words):

```ts
import type { Photo } from "../_components/artifact";

// Printed by `scripts/unsplash.sh get editorial <id> <name>`; alt text rewritten by hand.
export const PHOTOS = {
  // the nine printed lines: runner, trackLanes, raceBib, stopwatch, startingLine, shoes, runnerLegs, cyclist, gym
} satisfies Record<string, Photo>;
```

- [ ] **Step 3: Write the Editorial artifacts**

Create `app/mood-boards/editorial/artifacts.tsx`:

```tsx
import { getMood, getSwatch } from "@/app/moods";
import type { Artifact, Photo } from "../_components/artifact";
import Specimen from "../_components/Specimen";
import Swatch from "../_components/Swatch";
import { PHOTOS } from "./photos";

const editorial = getMood("editorial");
const SPECIMEN = "border-t-4 border-ink";
const LABEL = "font-label text-[11px] font-bold uppercase tracking-[0.16em]";

// The Editorial board shows its photos in black and white.
const bw = (photo: Photo): Photo => ({ ...photo, className: "grayscale contrast-125" });

const DAY_2_STEPS = [
  ["Brisk walk", "5 min"],
  ["Easy run", "20 min"],
  ["Stretch", "5 min"],
];
const CONTENTS = [
  ["Mon", "Lower body"],
  ["Tue", "Easy run"],
  ["Wed", "Upper body"],
  ["Thu", "Stairs + incline walk"],
  ["Fri", "Full body"],
  ["Sat", "Bike ride"],
  ["Sun", "Rest"],
];

export const EDITORIAL_ARTIFACTS: Artifact[] = [
  bw(PHOTOS.runner),
  {
    kind: "interface",
    id: "ui-masthead",
    node: (
      <div className="p-5">
        <p className="font-display text-5xl font-bold tracking-tight">The Week</p>
        <div className={`mt-2 flex justify-between gap-2 border-t-4 border-ink pt-2 ${LABEL}`}>
          <span>No. 1 · Beginner</span>
          <span className="text-accent">Strength + cardio</span>
        </div>
      </div>
    ),
  },
  { kind: "color", id: "color-ink", node: <Swatch swatch={getSwatch(editorial, "ink")} textToken="paper" className="h-36" /> },
  bw(PHOTOS.trackLanes),
  {
    kind: "type",
    id: "type-headline",
    node: (
      <Specimen caption="Newsreader 600 · Display" className={SPECIMEN}>
        <p className="font-display text-6xl font-semibold leading-[0.95] tracking-tight">The easy run</p>
      </Specimen>
    ),
  },
  {
    kind: "texture",
    id: "texture-halftone",
    node: (
      <div
        role="img"
        aria-label="Halftone dots fading across the page"
        className="h-40"
        style={{
          backgroundImage: "radial-gradient(var(--swatch-ink) 32%, transparent 34%)",
          backgroundSize: "9px 9px",
          maskImage: "linear-gradient(90deg, black, transparent)",
        }}
      />
    ),
  },
  bw(PHOTOS.raceBib),
  {
    kind: "interface",
    id: "ui-steps",
    node: (
      <div className="p-5">
        <p className={LABEL}>Day 2 · Easy run</p>
        <ol className="mt-3 text-[15px]">
          {DAY_2_STEPS.map(([step, time], index) => (
            <li key={step} className="grid grid-cols-[2.25rem_1fr_auto] items-baseline border-t border-line py-2.5">
              <span className="font-numbers font-bold text-accent">{String(index + 1).padStart(2, "0")}</span>
              <span>{step}</span>
              <span className="font-label text-sm text-muted">{time}</span>
            </li>
          ))}
        </ol>
      </div>
    ),
  },
  { kind: "color", id: "color-red", node: <Swatch swatch={getSwatch(editorial, "red")} textToken="paper" className="h-44" /> },
  bw(PHOTOS.stopwatch),
  {
    kind: "type",
    id: "type-deck",
    node: (
      <Specimen caption="Newsreader italic · Deck" className={SPECIMEN}>
        <p className="font-display text-2xl italic leading-snug">Twenty minutes at a pace you could talk through.</p>
      </Specimen>
    ),
  },
  {
    kind: "texture",
    id: "texture-columns",
    node: (
      <div role="img" aria-label="Three columns of text between hairline rules" className="grid h-48 grid-cols-3 p-4">
        {[0, 1, 2].map((column) => (
          <div key={column} className={`space-y-1.5 px-2 ${column > 0 ? "border-l border-line" : ""}`}>
            {Array.from({ length: 11 }, (_, line) => (
              <div
                key={line}
                className="h-1.5 bg-(--swatch-rule)"
                style={{ width: `${70 + ((line * 7 + column * 13) % 30)}%` }}
              />
            ))}
          </div>
        ))}
      </div>
    ),
  },
  bw(PHOTOS.startingLine),
  {
    kind: "interface",
    id: "ui-buttons",
    node: (
      <div className="flex flex-wrap items-center gap-5 p-5">
        <span className="bg-accent px-5 py-3 font-label text-sm font-bold tracking-wide text-on-accent">Start workout →</span>
        <span className="font-label text-sm font-bold underline decoration-accent decoration-2 underline-offset-4">
          Read the notes
        </span>
      </div>
    ),
  },
  { kind: "color", id: "color-graphite", node: <Swatch swatch={getSwatch(editorial, "graphite")} textToken="paper" className="h-28" /> },
  bw(PHOTOS.shoes),
  {
    kind: "type",
    id: "type-body",
    node: (
      <Specimen caption="Newsreader 400 · Body" className={SPECIMEN}>
        <p className="text-[17px] leading-relaxed">
          <span className="float-left mr-2 font-display text-6xl font-semibold leading-[0.8] text-accent">G</span>
          o at a pace where you could still hold a conversation. Walking breaks are part of the plan, not a
          failure of it.
        </p>
      </Specimen>
    ),
  },
  {
    kind: "interface",
    id: "ui-contents",
    node: (
      <div className="bg-surface p-5">
        <p className={LABEL}>In this week</p>
        <ul className="mt-3 space-y-1.5 text-[15px]">
          {CONTENTS.map(([day, workout]) => (
            <li key={day} className="flex items-baseline gap-3">
              <span className="w-8 shrink-0 font-label text-xs font-bold uppercase text-accent">{day}</span>
              <span>{workout}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  bw(PHOTOS.runnerLegs),
  { kind: "color", id: "color-newsprint", node: <Swatch swatch={getSwatch(editorial, "newsprint")} textToken="ink" className="h-32" /> },
  {
    kind: "texture",
    id: "texture-newsprint",
    node: (
      <svg viewBox="0 0 200 160" role="img" aria-label="Newsprint grain" className="block h-auto w-full bg-surface">
        <filter id="editorial-grain">
          <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="200" height="160" filter="url(#editorial-grain)" opacity="0.3" />
      </svg>
    ),
  },
  {
    kind: "interface",
    id: "ui-pullquote",
    node: (
      <figure className="p-5">
        <p aria-hidden="true" className="font-display text-7xl leading-[0.6] text-accent">
          “
        </p>
        <blockquote className="font-display text-2xl italic leading-snug">Walking breaks are part of the plan.</blockquote>
        <figcaption className={`mt-3 text-muted ${LABEL}`}>Day 2 notes</figcaption>
      </figure>
    ),
  },
  bw(PHOTOS.cyclist),
  {
    kind: "type",
    id: "type-labels",
    node: (
      <Specimen caption="Libre Franklin 700 · Labels and numbers" className={SPECIMEN}>
        <p className="font-numbers text-5xl font-bold text-accent">01 02 03</p>
        <p className="mt-2 font-label text-sm font-bold uppercase tracking-[0.16em]">Rest 90 s</p>
      </Specimen>
    ),
  },
  { kind: "color", id: "color-rule", node: <Swatch swatch={getSwatch(editorial, "rule")} textToken="ink" className="h-24" /> },
  bw(PHOTOS.gym),
  {
    kind: "interface",
    id: "ui-tabs",
    node: (
      <div className="p-5">
        <div className="flex gap-5 border-b border-line font-label text-sm font-bold">
          <span className="-mb-px border-b-2 border-accent pb-2">Today</span>
          <span className="pb-2 text-muted">Week</span>
          <span className="pb-2 text-muted">Notes</span>
        </div>
        <p className="mt-3 text-[15px]">Tuesday · Easy run, 20 minutes</p>
        <span className={`mt-3 inline-block border border-ink px-2 py-0.5 ${LABEL}`}>Cardio</span>
      </div>
    ),
  },
  {
    kind: "texture",
    id: "texture-crop-marks",
    node: (
      <svg viewBox="0 0 160 120" role="img" aria-label="Printer's crop marks around a registration target" className="block h-auto w-full">
        <g fill="none" strokeWidth="1" className="stroke-ink">
          <path d="M24 4 V20 M4 24 H20 M136 4 V20 M156 24 H140 M24 116 V100 M4 96 H20 M136 116 V100 M156 96 H140" />
          <circle cx="80" cy="60" r="16" />
          <circle cx="80" cy="60" r="8" />
          <path d="M80 36 V84 M56 60 H104" />
        </g>
      </svg>
    ),
  },
];
```

- [ ] **Step 4: Replace the Editorial placeholder**

Replace `app/mood-boards/editorial/page.tsx` with:

```tsx
import type { Metadata } from "next";
import { getMood } from "@/app/moods";
import MoodBoard from "../_components/MoodBoard";
import { EDITORIAL_ARTIFACTS } from "./artifacts";

export const metadata: Metadata = { title: "Editorial mood board" };

export default function EditorialMoodBoard() {
  return <MoodBoard mood={getMood("editorial")} artifacts={EDITORIAL_ARTIFACTS} />;
}
```

- [ ] **Step 5: Run the Editorial tests to make sure they pass**

Run: `rm -rf out && npx next build && node --test --test-name-pattern="Calm|Editorial|hub|contrast" 'tests/*.test.mjs'`, then `npm run lint`.
Expected: Calm and Editorial board tests, contrast and hub all PASS; lint prints nothing.

- [ ] **Step 6: Check Editorial in the browser**

Navigate to `http://localhost:4173/mood-boards/editorial/` and repeat Task 3 Steps 10 and 11 (the same two `javascript_tool` scripts) at 1440 px and in the 390 px iframe.
Expected: `{ overflow: 0, artifacts: 28, broken: [], clipped: 0 }` and `{ overflow: 0, clipped: [] }`. In the screenshots, photos are black and white, red appears only on step numbers, the drop cap, the pull-quote mark and the main button, and headlines render in Newsreader.

- [ ] **Step 7: Commit**

```bash
git add app/mood-boards/editorial public/mood-boards/editorial
git commit -F - <<'EOF'
Build the Editorial mood board

Nine black-and-white running photos plus paper, ink and red pieces set
in Newsreader and Libre Franklin: a masthead, numbered steps, a pull
quote, halftone and newsprint textures.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

- [ ] **Step 8: CHECKPOINT: Nikita reviews Editorial**

Same loop as Task 3 Step 14, at `http://localhost:4173/mood-boards/editorial/`. Commit each round as `Editorial board: <what changed>`. Do not start Task 5 until Nikita says Editorial is done.

---

### Task 5: The Plate Room board

**Files:**
- Create: `app/mood-boards/plate-room/photos.ts`
- Create: `app/mood-boards/plate-room/artifacts.tsx`
- Modify: `app/mood-boards/plate-room/page.tsx` (replace the placeholder)
- Create: `public/mood-boards/plate-room/*.jpg` (9 photos)
- Test: `tests/boards.test.mjs` (already written; the Plate Room suite)

**Interfaces:**
- Consumes: `MoodBoard`, `Swatch`, `Specimen`, `Artifact` from `app/mood-boards/_components/`; `getMood`, `getSwatch` from `app/moods.ts`; `scripts/unsplash.sh`.
- Produces: `PHOTOS` (`app/mood-boards/plate-room/photos.ts`), `PLATE_ROOM_ARTIFACTS: Artifact[]`.

- [ ] **Step 1: Confirm the Plate Room tests fail**

Run: `rm -rf out && npx next build && node --test --test-name-pattern="Plate Room" 'tests/*.test.mjs'`
Expected: the Plate Room board suite FAILS with "has 25 to 30 artifacts: found 0".

- [ ] **Step 2: Pick and download the nine Plate Room photos**

Plate Room's photos are about equipment, in hard light. Prefer bumper-plate red, blue and green, and yellow and black, and avoid pastel or moody, dim gyms. Mix portrait and landscape, with at least three portrait. Avoid logos or a close-up face as the main subject.

For each row, run `scripts/unsplash.sh search "<query>"`, choose one photo, run `scripts/unsplash.sh get plate-room <id> <file-name>`, and view it with the Read tool.

| Key | File name | Query |
|---|---|---|
| `bumperPlates` | `bumper-plates` | `bumper plates` |
| `chalkHands` | `chalk-hands` | `chalk hands gym` |
| `stairClimber` | `stair-climber` | `stairmaster` |
| `barbellRack` | `barbell-rack` | `barbell rack` |
| `dumbbellRack` | `dumbbell-rack` | `dumbbell rack` |
| `gymSign` | `gym-sign` | `gym sign` |
| `plateStack` | `plate-stack` | `weight plates` |
| `rubberFloor` | `rubber-floor` | `gym floor` |
| `treadmills` | `treadmills` | `treadmills gym` |

Create `app/mood-boards/plate-room/photos.ts` with the nine printed lines in the table's order, with `alt` rewritten by hand (under 15 words):

```ts
import type { Photo } from "../_components/artifact";

// Printed by `scripts/unsplash.sh get plate-room <id> <name>`; alt text rewritten by hand.
export const PHOTOS = {
  // the nine printed lines: bumperPlates, chalkHands, stairClimber, barbellRack, dumbbellRack, gymSign, plateStack, rubberFloor, treadmills
} satisfies Record<string, Photo>;
```

- [ ] **Step 3: Write the Plate Room artifacts**

Create `app/mood-boards/plate-room/artifacts.tsx`:

```tsx
import { getMood, getSwatch } from "@/app/moods";
import type { Artifact } from "../_components/artifact";
import Specimen from "../_components/Specimen";
import Swatch from "../_components/Swatch";
import { PHOTOS } from "./photos";

const plateRoom = getMood("plate-room");
const SPECIMEN = "bg-surface";
const LABEL = "font-label text-xs font-bold uppercase tracking-[0.14em]";
const HAZARD = "repeating-linear-gradient(-45deg, var(--swatch-safety) 0 18px, var(--swatch-ink) 18px 36px)";

// Day type colors: red legs, blue upper body, green cardio.
const WEEK = [
  ["Mon", "Lower body", "var(--swatch-red)"],
  ["Tue", "Easy run", "var(--swatch-green)"],
  ["Wed", "Upper body", "var(--swatch-blue)"],
  ["Thu", "Stairs + incline", "var(--swatch-green)"],
  ["Fri", "Full body", "linear-gradient(var(--swatch-red) 50%, var(--swatch-blue) 50%)"],
  ["Sat", "Bike ride", "var(--swatch-green)"],
  ["Sun", "Rest", "transparent"],
];

export const PLATE_ROOM_ARTIFACTS: Artifact[] = [
  PHOTOS.bumperPlates,
  {
    kind: "type",
    id: "type-display",
    node: (
      <Specimen caption="Big Shoulders 900 · Display" className={SPECIMEN}>
        <p className="font-display text-6xl font-black uppercase leading-[0.85]">Leg day</p>
      </Specimen>
    ),
  },
  { kind: "color", id: "color-safety", node: <Swatch swatch={getSwatch(plateRoom, "safety")} textToken="ink" className="h-40" /> },
  PHOTOS.chalkHands,
  {
    kind: "interface",
    id: "ui-buttons",
    node: (
      <div className="flex flex-wrap gap-3 bg-surface p-5">
        <span className="border-2 border-ink bg-accent px-6 py-2 font-display text-2xl font-extrabold uppercase text-on-accent">
          Start
        </span>
        <span className="border-2 border-ink px-6 py-2 font-display text-2xl font-extrabold uppercase">Skip</span>
      </div>
    ),
  },
  {
    kind: "texture",
    id: "texture-hazard",
    node: <div role="img" aria-label="Yellow and black hazard stripes" className="h-28" style={{ backgroundImage: HAZARD }} />,
  },
  PHOTOS.stairClimber,
  { kind: "color", id: "color-red", node: <Swatch swatch={getSwatch(plateRoom, "red")} textToken="panel" className="h-32" /> },
  {
    kind: "interface",
    id: "ui-chips",
    node: (
      <div className={`flex flex-wrap gap-2 bg-surface p-5 ${LABEL}`}>
        <span className="bg-(--swatch-red) px-3 py-1.5 text-(--swatch-panel)">Legs</span>
        <span className="bg-(--swatch-blue) px-3 py-1.5 text-(--swatch-panel)">Upper</span>
        <span className="bg-(--swatch-green) px-3 py-1.5 text-(--swatch-panel)">Cardio</span>
        <span className="border-2 border-ink px-3 py-1">Rest</span>
      </div>
    ),
  },
  PHOTOS.barbellRack,
  {
    kind: "type",
    id: "type-numbers",
    node: (
      <Specimen caption="Big Shoulders Stencil 800 · Numbers" className={SPECIMEN}>
        <p className="font-numbers text-7xl font-extrabold leading-none">3 × 10</p>
      </Specimen>
    ),
  },
  {
    kind: "texture",
    id: "texture-rubber",
    node: (
      <svg viewBox="0 0 200 160" role="img" aria-label="Black rubber gym floor with light flecks" className="block h-auto w-full bg-ink">
        <filter id="plate-rubber">
          <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="4" />
          {/* RGB is the steel swatch; the alpha row keeps only the brightest specks. */}
          <feColorMatrix type="matrix" values="0 0 0 0 0.74  0 0 0 0 0.73  0 0 0 0 0.71  0 0 0 9 -5.6" />
        </filter>
        <rect width="200" height="160" filter="url(#plate-rubber)" />
      </svg>
    ),
  },
  PHOTOS.dumbbellRack,
  { kind: "color", id: "color-blue", node: <Swatch swatch={getSwatch(plateRoom, "blue")} textToken="panel" className="h-36" /> },
  {
    kind: "interface",
    id: "ui-timer",
    node: (
      <div className="bg-surface p-5">
        <p className={`${LABEL} text-muted`}>Rest</p>
        <p className="font-numbers text-7xl font-extrabold leading-none">1:30</p>
        <div className="mt-3 h-3 border-2 border-ink">
          <div className="h-full w-2/3 bg-accent" />
        </div>
      </div>
    ),
  },
  PHOTOS.gymSign,
  {
    kind: "type",
    id: "type-body",
    node: (
      <Specimen caption="Archivo 400 · Body" className={SPECIMEN}>
        <p className="text-base leading-relaxed">
          Hold the weight at your chest. Sit back and down until your thighs are level, then stand up tall.
        </p>
      </Specimen>
    ),
  },
  { kind: "color", id: "color-green", node: <Swatch swatch={getSwatch(plateRoom, "green")} textToken="panel" className="h-28" /> },
  PHOTOS.plateStack,
  {
    kind: "interface",
    id: "ui-barbell",
    node: (
      <div className="bg-surface p-5">
        <svg viewBox="0 0 240 80" role="img" aria-label="A barbell with one red plate on each side" className="block h-auto w-full">
          <rect x="4" y="36" width="232" height="8" className="fill-(--swatch-steel)" />
          <rect x="44" y="8" width="16" height="64" strokeWidth="2" className="fill-(--swatch-red) stroke-ink" />
          <rect x="180" y="8" width="16" height="64" strokeWidth="2" className="fill-(--swatch-red) stroke-ink" />
          <rect x="62" y="28" width="6" height="24" className="fill-ink" />
          <rect x="172" y="28" width="6" height="24" className="fill-ink" />
        </svg>
        <p className={`mt-2 ${LABEL}`}>Bar 45 lb + 10 lb a side</p>
      </div>
    ),
  },
  {
    kind: "texture",
    id: "texture-knurl",
    node: (
      <div
        role="img"
        aria-label="Knurled bar grip"
        className="h-24 bg-(--swatch-steel)"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, var(--swatch-muted) 0 1.5px, transparent 1.5px 7px), repeating-linear-gradient(-45deg, var(--swatch-muted) 0 1.5px, transparent 1.5px 7px)",
        }}
      />
    ),
  },
  PHOTOS.rubberFloor,
  { kind: "color", id: "color-ink", node: <Swatch swatch={getSwatch(plateRoom, "ink")} textToken="panel" className="h-32" /> },
  {
    kind: "interface",
    id: "ui-station",
    node: (
      <div className="bg-surface">
        <div className="h-3" style={{ backgroundImage: HAZARD }} />
        <div className="p-5">
          <p className={`${LABEL} text-muted`}>Station 3</p>
          <p className="mt-1 font-display text-3xl font-extrabold uppercase leading-none">Goblet squat</p>
          <p className="mt-3 font-numbers text-5xl font-extrabold leading-none">3 × 10</p>
          <p className="mt-1 text-sm">20 lb dumbbell · rest 90 s</p>
        </div>
      </div>
    ),
  },
  {
    kind: "type",
    id: "type-plates",
    node: (
      <Specimen caption="Stencil numerals · plate weights" className={SPECIMEN}>
        <p className="font-numbers text-5xl font-extrabold leading-tight">45 35 25 10 5</p>
        <p className={`mt-1 ${LABEL}`}>Pounds per plate</p>
      </Specimen>
    ),
  },
  PHOTOS.treadmills,
  {
    kind: "texture",
    id: "texture-floor-line",
    node: (
      <div role="img" aria-label="Painted concrete with a yellow floor line" className="relative h-40 bg-bg">
        <svg viewBox="0 0 200 160" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 h-full w-full">
          <filter id="plate-concrete">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="4" seed="9" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="200" height="160" filter="url(#plate-concrete)" opacity="0.2" />
        </svg>
        <div className="absolute inset-x-0 bottom-8 h-4 bg-accent" />
      </div>
    ),
  },
  {
    kind: "interface",
    id: "ui-week",
    node: (
      <div className="bg-surface p-5">
        <p className={LABEL}>This week</p>
        <ul className="mt-3 text-sm">
          {WEEK.map(([day, workout, color]) => (
            <li key={day} className="flex items-center gap-3 border-t border-line py-1.5">
              <span className="h-5 w-2.5 shrink-0 border border-ink" style={{ background: color }} />
              <span className="w-9 font-bold uppercase">{day}</span>
              <span>{workout}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
];
```

- [ ] **Step 4: Replace the Plate Room placeholder**

Replace `app/mood-boards/plate-room/page.tsx` with:

```tsx
import type { Metadata } from "next";
import { getMood } from "@/app/moods";
import MoodBoard from "../_components/MoodBoard";
import { PLATE_ROOM_ARTIFACTS } from "./artifacts";

export const metadata: Metadata = { title: "Plate Room mood board" };

export default function PlateRoomMoodBoard() {
  return <MoodBoard mood={getMood("plate-room")} artifacts={PLATE_ROOM_ARTIFACTS} />;
}
```

- [ ] **Step 5: Run the full suite to make sure everything passes**

Run: `npm test`, then `npm run lint`.
Expected: every test passes (contrast, hub, and all three board suites); lint prints nothing.

- [ ] **Step 6: Check Plate Room in the browser**

Navigate to `http://localhost:4173/mood-boards/plate-room/` and repeat Task 3 Steps 10 and 11 at 1440 px and in the 390 px iframe.
Expected: `{ overflow: 0, artifacts: 28, broken: [], clipped: 0 }` and `{ overflow: 0, clipped: [] }`. In the screenshots, every tile has a 2 px ink outline, yellow is only ever a fill (never text), the numbers are in the stencil cut, and the display type is Big Shoulders.

- [ ] **Step 7: Commit**

```bash
git add app/mood-boards/plate-room public/mood-boards/plate-room
git commit -F - <<'EOF'
Build the Plate Room mood board

Nine gym-equipment photos plus signage pieces in Big Shoulders and
Archivo: plate-colored day types, a stencil rest timer, a station
placard, hazard stripes, rubber flooring and a knurled grip.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

- [ ] **Step 8: CHECKPOINT: Nikita reviews Plate Room**

Same loop as Task 3 Step 14, at `http://localhost:4173/mood-boards/plate-room/`. Commit each round as `Plate Room board: <what changed>`.

---

### Task 6: Final pass across the hub and boards

**Files:**
- Modify: only what this pass finds broken.

**Interfaces:**
- Consumes: everything above.
- Produces: a clean `npm test` and lint, and screenshots of the hub and all three boards at both widths.

- [ ] **Step 1: Run every check**

Run: `npm test`, then `npm run lint`.
Expected: all tests pass; lint prints nothing.

- [ ] **Step 2: Check the hub at both widths and by keyboard**

Navigate to `http://localhost:4173/`. At 1440 × 900, take a screenshot. Press Tab repeatedly with the `computer` tool's `key` action and take a screenshot after the first, fourth and seventh press. Each focused card or button must show a visible outline. Run Task 3 Step 11's iframe script on the hub, which also returns `clipped: []` because the hub has no tiles. Expected: `overflow: 0`.

- [ ] **Step 3: Compare the three boards side by side**

Take one 1440 px screenshot of the top of each board. Check against spec §2.4 that the three read as clearly different in color, type and shape. If two look alike, raise it with Nikita rather than changing a board on your own.

- [ ] **Step 4: Stop the static server and commit any fixes**

Stop the `python3 -m http.server` background job. If Steps 1–3 changed any file, commit:

```bash
git add -A app tests README.md
git commit -F - <<'EOF'
Fix issues from the final mood-board pass

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

Then report to Nikita: the test output, the screenshots, and anything left for the design-system spec.
