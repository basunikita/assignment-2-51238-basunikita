# Design Systems Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Sunrise, Editorial and Plate Room design-system pages from one shared component library with a style recipe per mood, using Nikita's routine as content. Nikita reviews each system in the browser before the next one starts.

**Architecture:** `app/design-system/` holds the library:
- **components:** each written once, with its markup, keyboard behavior and ARIA built in
- **`content.ts`:** the routine and component copy
- **pure logic:** `timer.ts` and `progress.ts`
- **recipes:** one file per mood under `recipes/`, each a plain object of Tailwind class strings

A `RecipeProvider` hands the active recipe to every component. `DesignSystemPage` renders the brief's six sections under a mood's recipe, CSS variables and fonts. Three Tailwind custom variants (`hover-state`, `focus-state`, `pressed-state`) let one class string style both a real interaction and a frozen sample in the control-states grid.

**Tech Stack:** Next.js 16.3.8 (App Router, `output: "export"`), React 19 client components (prerendered), Tailwind CSS 4 (`@custom-variant`, `aria-*`, `group-*`, `peer-*`, `backdrop:`, `marker:` variants), native `<dialog>`, Node 24 `node:test`, Claude in Chrome for browser checks.

**Spec:** `docs/superpowers/specs/2026-10-07-design-systems-design.md`

## Global Constraints

- Static export only. No database, accounts, APIs or storage; nothing persists across reloads.
- No new npm packages.
- Run npm with `npm_config_registry=https://imc-npm-proxy.trading.imc.intra/repository/npm-proxy/` and `NODE_OPTIONS=--use-system-ca` set for that one command. Never write `~/.npmrc`. `package-lock.json` keeps `registry.npmjs.org` URLs.
- In the sandbox, `next build` needs the hosts `fonts.googleapis.com` and `fonts.gstatic.com`.
- Colors come only from each mood's palette:
  - Recipes reference role tokens (`bg-bg`, `text-ink`, `border-control`, …) or `--swatch-*` variables.
  - No hex, `rgb()`, `hsl()` or Tailwind default-palette classes in `app/design-system/recipes/`.
  - Hover and press may darken with `brightness-*`.
- Text reaches 4.5:1. Control outlines (`control` role) and focus rings reach 3:1 against the page background.
- Accent marks the one primary action in view and "on" indicators only: the toggle's on state, Editorial's selected-tab underline, and progress fill.
- Each page works at 390 px and 1440 px with no horizontal page scroll. Every control works by keyboard.
- A mood's fonts load only on its own pages, through `app/fonts/<mood>.ts`.
- Frozen state samples are `inert`: not focusable, not operable, hidden from assistive tech.
- Commits are authored `Nikita Basu <nbasu@uchicago.edu>` (already the repo's local config) and end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Never push.
- Nikita reviews each design system in the browser and approves it before the next one starts.

### Where this plan differs from the spec

- **List rows show Day 5 · Legs, not Day 1.** The rows open the detail panel, and the panel needs form cues. Nikita's Day 1 includes "African bicep curls", which isn't a standard exercise name, so this plan can't write cues for it. Day 5 contains the spec's Bulgarian split squats. The card still shows Day 1.
- **Cues for Day 5's other four exercises** (hip thrusts, RDLs, hip abduction / adduction, glute hyperextensions) are added in `content.ts`, so every row opens a complete panel. Nikita reviews them at the Sunrise checkpoint.
- **Sunrise's secondary button has a warm-white fill.** Its dusk text would otherwise sit on peach inside the timer card at 3.6:1. Hover still turns it Sky.
- **Hover never overrides a selected chip or tab.** Hover styles use `not-aria-pressed` and `not-aria-selected`, so a selected item keeps its color under the pointer.
- **Contrast lives in one place.** The contrast function moves to `app/contrast.ts`, so the page's ratios and the tests use the same code. `tests/helpers.mjs` re-exports it.
- **One recipe file per mood.** Recipes are `app/design-system/recipes/<mood>.ts`, each exporting one `Recipe`, instead of a single `RECIPES` record in `recipes.ts`. This lets Sunrise build and pass its tests before the other two recipes exist, and a page imports only its own recipe.

## Review Focus

1. **Accent text on a surface.** Dusk on peach is 3.6:1. A Sunrise secondary button, link or chip with `text-accent` inside a `bg-surface` element (the timer, a card or the tab track) would fail AA. `tests/design-systems.test.mjs` fails on `text-accent` inside `bg-surface` whenever that pair is under 4.5:1 (Task 3).
2. **Frozen samples are inert.** A keyboard user must never land on a frozen sample in the control-states grid. The test checks the grid container is `inert` (Task 3); the Task 3 browser check tabs past it.
3. **Dialog focus.** The detail panel must take focus when it opens, close on Esc and on its close button, and return focus to the row that opened it. Covered by the Task 3 browser check: open, Esc, then check the active element.
4. **Changing the rest length while the timer runs.** The timer must restart at the new length, not keep a stale interval or speed up. The `RestTimer` is keyed by its length so it remounts; the Task 3 browser check changes the radio while it runs.
5. **The control-states grid at 390 px.** Six states per control must fit a phone. Rows use 3 columns below `sm` and 6 from `sm`; the Task 3 390 px check lists clipped cells and must return none.

---

### Task 1: Foundations: control role, state variants, content and logic

**Files:**
- Modify: `app/moods.ts` (add the `control` color role)
- Modify: `app/globals.css` (the custom variants and `--color-control`)
- Create: `app/contrast.ts`
- Modify: `tests/helpers.mjs` (re-export `contrast` from `app/contrast.ts`)
- Create: `app/design-system/content.ts`
- Create: `app/design-system/timer.ts`
- Create: `app/design-system/progress.ts`
- Modify: `tests/contrast.test.mjs`
- Test: `tests/logic.test.mjs`

**Interfaces:**
- Consumes: `MOODS`, `getSwatch`, `Mood` from `app/moods.ts`.
- Produces:
  - `Mood["roles"].control`: a swatch token per mood (Sunrise `muted`, Editorial `ink`, Plate Room `ink`), with Tailwind token `control` (`border-control`, `bg-control`)
  - variants `hover-state:`, `focus-state:` and `pressed-state:`, which match the real pseudo-class or `[data-state~="hover" | "focus" | "pressed"]`
  - `contrast(a: string, b: string): number` from `app/contrast.ts`
  - from `content.ts`: `SETS`, `REPS`, `type DayKind`, `type DayTone`, `type WorkoutDay`, `WEEK`, `DAY_FILTERS`, `type DayFilter`, `CARDIO_OPTIONS`, `REST_OPTIONS`, `FORM_CUES`, `UI_STATE_COPY`
  - from `timer.ts`: `type TimerState`, `newTimer`, `tick`, `toggleRunning`, `resetTimer`, `formatSeconds`
  - from `progress.ts`: `progressLabel`, `progressPercent`

- [ ] **Step 1: Write the failing control-role test**

In `tests/contrast.test.mjs`, insert before the `every declared text pair reaches 4.5:1` test inside the `for (const mood of MOODS)` loop:

```js
  test(`${mood.name}: control outlines reach 3:1 against the page`, () => {
    const ratio = contrast(getSwatch(mood, mood.roles.control).hex, getSwatch(mood, mood.roles.bg).hex);
    assert.ok(ratio >= 3, `control ${mood.roles.control} on ${mood.roles.bg} is ${ratio.toFixed(2)}:1`);
  });
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `node --test tests/contrast.test.mjs`
Expected: three FAILs, one per mood ("Sunrise has no swatch "undefined"" and so on), because `roles.control` doesn't exist yet.

- [ ] **Step 3: Add the control role**

In `app/moods.ts`, change the `ColorRole` type to:

```ts
type ColorRole = "bg" | "surface" | "ink" | "muted" | "line" | "accent" | "on-accent" | "focus" | "control";
```

Add a `control` entry after `focus` in each mood's `roles`:
- Sunrise: `control: "muted",`
- Editorial: `control: "ink",`
- Plate Room: `control: "ink",`

- [ ] **Step 4: Run it to make sure it passes**

Run: `node --test tests/contrast.test.mjs`
Expected: PASS, 17 tests (Sunrise muted 5.3:1, Editorial ink 16.8:1, Plate Room ink 15.3:1).

- [ ] **Step 5: Add the variants and the control token**

In `app/globals.css`, insert directly after `@import "tailwindcss";`:

```css

/* One class string styles the real state and a frozen sample (data-state) in the design systems. */
@custom-variant hover-state (&:hover, &[data-state~="hover"]);
@custom-variant focus-state (&:focus-visible, &[data-state~="focus"]);
@custom-variant pressed-state (&:active, &[data-state~="pressed"]);
```

In the mood-token `@theme inline` block, add after `--color-focus: var(--mood-focus);`:

```css
  --color-control: var(--mood-control);
```

- [ ] **Step 6: Move contrast into the app**

Create `app/contrast.ts`:

```ts
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((start) => {
    const channel = parseInt(hex.slice(start, start + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// WCAG 2 contrast ratio between two #RRGGBB colors.
export function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}
```

In `tests/helpers.mjs`, delete the `luminance` function and the `contrast` function (with its comment), and add after the imports:

```js
export { contrast } from "../app/contrast.ts";
```

Run: `node --test tests/contrast.test.mjs tests/helpers.test.mjs`
Expected: PASS (17 + 6 tests). The known-value test still passes, which proves the moved function behaves the same.

- [ ] **Step 7: Write the failing logic tests**

Create `tests/logic.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";
import { progressLabel, progressPercent } from "../app/design-system/progress.ts";
import { formatSeconds, newTimer, resetTimer, tick, toggleRunning } from "../app/design-system/timer.ts";

test("formats seconds as m:ss", () => {
  assert.equal(formatSeconds(90), "1:30");
  assert.equal(formatSeconds(120), "2:00");
  assert.equal(formatSeconds(65), "1:05");
  assert.equal(formatSeconds(0), "0:00");
});

test("a new timer is full and paused", () => {
  assert.deepEqual(newTimer(90), { total: 90, remaining: 90, running: false });
});

test("a paused timer doesn't tick", () => {
  assert.deepEqual(tick(newTimer(90)), newTimer(90));
});

test("a running timer counts down one second per tick", () => {
  const running = toggleRunning(newTimer(90));
  assert.deepEqual(tick(running), { total: 90, remaining: 89, running: true });
});

test("the timer stops at zero", () => {
  const last = { total: 90, remaining: 1, running: true };
  assert.deepEqual(tick(last), { total: 90, remaining: 0, running: false });
  assert.deepEqual(tick(tick(last)), { total: 90, remaining: 0, running: false });
});

test("toggling pauses and resumes without losing time", () => {
  const paused = toggleRunning({ total: 90, remaining: 42, running: true });
  assert.deepEqual(paused, { total: 90, remaining: 42, running: false });
  assert.deepEqual(toggleRunning(paused), { total: 90, remaining: 42, running: true });
});

test("starting a finished timer runs it again from the top", () => {
  assert.deepEqual(toggleRunning({ total: 90, remaining: 0, running: false }), { total: 90, remaining: 90, running: true });
});

test("reset returns to full and paused", () => {
  assert.deepEqual(resetTimer({ total: 60, remaining: 12, running: true }), newTimer(60));
});

test("progress reads as done of total", () => {
  assert.equal(progressLabel(2, 3), "2 of 3 done");
  assert.equal(progressLabel(0, 3), "0 of 3 done");
});

test("progress percent rounds and handles zero sets", () => {
  assert.equal(progressPercent(2, 3), 67);
  assert.equal(progressPercent(3, 3), 100);
  assert.equal(progressPercent(0, 0), 0);
});
```

- [ ] **Step 8: Run it to make sure it fails**

Run: `node --test tests/logic.test.mjs`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `app/design-system/progress.ts`.

- [ ] **Step 9: Write the logic modules**

Create `app/design-system/timer.ts`:

```ts
export type TimerState = { total: number; remaining: number; running: boolean };

export function newTimer(total: number): TimerState {
  return { total, remaining: total, running: false };
}

// One second passes. A running timer stops itself when it reaches zero.
export function tick(state: TimerState): TimerState {
  if (!state.running) return state;
  const remaining = Math.max(0, state.remaining - 1);
  return { ...state, remaining, running: remaining > 0 };
}

// Start or pause. Starting a finished timer runs it again from the top.
export function toggleRunning(state: TimerState): TimerState {
  if (state.remaining === 0) return { ...state, remaining: state.total, running: true };
  return { ...state, running: !state.running };
}

export function resetTimer(state: TimerState): TimerState {
  return newTimer(state.total);
}

export function formatSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}
```

Create `app/design-system/progress.ts`:

```ts
export function progressLabel(done: number, total: number): string {
  return `${done} of ${total} done`;
}

export function progressPercent(done: number, total: number): number {
  return total === 0 ? 0 : Math.round((done / total) * 100);
}
```

- [ ] **Step 10: Run it to make sure it passes**

Run: `node --test tests/logic.test.mjs`
Expected: PASS, 10 tests.

- [ ] **Step 11: Write the content module**

Create `app/design-system/content.ts`:

```ts
// Nikita's routine (spec §2). Names are as Nikita wrote them.
export const SETS = 3;
export const REPS = 10;

export type DayKind = "Strength" | "Cardio" | "Rest";
export type DayTone = "upper" | "legs" | "cardio" | "rest";

export type WorkoutDay = {
  day: number;
  name: string;
  kind: DayKind;
  tone: DayTone;
  exercises: string[];
};

export const WEEK: WorkoutDay[] = [
  {
    day: 1,
    name: "Back and biceps",
    kind: "Strength",
    tone: "upper",
    exercises: [
      "Lat pulldowns",
      "Face pulls",
      "Single-arm dumbbell rows",
      "Lower back hyperextensions",
      "African bicep curls",
      "Cable bicep curls",
      "Barbell curls",
    ],
  },
  { day: 2, name: "Cardio", kind: "Cardio", tone: "cardio", exercises: [] },
  {
    day: 3,
    name: "Shoulders and triceps",
    kind: "Strength",
    tone: "upper",
    exercises: [
      "Cable lateral raise",
      "Shoulder superset: O movements and serving platters",
      "Archer pull",
      "Front raise cable",
      "Overhead tricep extension cable",
      "Tricep cross extension",
      "Tricep press",
    ],
  },
  { day: 4, name: "Cardio", kind: "Cardio", tone: "cardio", exercises: [] },
  {
    day: 5,
    name: "Legs",
    kind: "Strength",
    tone: "legs",
    exercises: ["Hip thrusts", "RDLs", "Bulgarian split squats", "Hip abduction / adduction", "Glute hyperextensions"],
  },
  { day: 6, name: "Cardio", kind: "Cardio", tone: "cardio", exercises: [] },
  { day: 7, name: "Rest", kind: "Rest", tone: "rest", exercises: [] },
];

export const DAY_FILTERS = ["All", "Strength", "Cardio", "Rest"] as const;
export type DayFilter = (typeof DAY_FILTERS)[number];

export const CARDIO_OPTIONS = [
  { value: "run", label: "Run 30 min", detail: "Walk 5 min, run 30 min, walk 5 min" },
  { value: "intervals", label: "Run–walk intervals", detail: "Walk 5 min, (run 15 min, walk 1 min) × 3, walk 5 min" },
  { value: "incline", label: "Incline walk", detail: "30 min walking at level 12 incline, 3 mph" },
  { value: "stairs", label: "Stairs", detail: "25 min of stairs at intensity 7" },
];

export const REST_OPTIONS = [
  { value: "60", label: "60 s" },
  { value: "90", label: "90 s" },
  { value: "120", label: "2 min" },
];

// Form cues for the Day 5 rows; Bulgarian split squats' cues come from the spec.
export const FORM_CUES: Record<string, string[]> = {
  "Hip thrusts": [
    "Upper back on the bench, bar across your hips.",
    "Drive through your heels until your hips are level with your knees.",
    "Pause and squeeze at the top, then lower slowly.",
  ],
  RDLs: [
    "Soft knees, weight in your heels.",
    "Push your hips back and lower the weight along your legs with a flat back.",
    "Stand by driving your hips forward.",
  ],
  "Bulgarian split squats": [
    "Rear foot on the bench behind you.",
    "Lower straight down until your front thigh is about level.",
    "Drive through your front heel to stand.",
  ],
  "Hip abduction / adduction": [
    "Sit tall with your back against the pad.",
    "Press the pads out (abduction) or in (adduction) in a slow, even arc.",
    "Return slowly; don't let the weights slam.",
  ],
  "Glute hyperextensions": [
    "Pad just below your hips, feet anchored.",
    "Lower with a flat back.",
    "Rise by squeezing your glutes until your body is straight; don't arch past it.",
  ],
};

export const UI_STATE_COPY = {
  empty: "Rest day: no workout today",
  loading: "Loading your week…",
  error: "Couldn't load this workout",
  success: "Workout logged. Nice work.",
};
```

- [ ] **Step 12: Run every check**

Run: `npm test` (sandbox: allow `fonts.googleapis.com`, `fonts.gstatic.com`), then `npm run lint`.
Expected: all tests pass (60 existing + 3 control + 10 logic = 73); lint prints nothing.

- [ ] **Step 13: Commit**

```bash
git add app/moods.ts app/globals.css app/contrast.ts app/design-system tests/helpers.mjs tests/contrast.test.mjs tests/logic.test.mjs
git commit -F - <<'EOF'
Add design-system foundations: control role, state variants, logic

A control color role gives field, checkbox and toggle outlines 3:1
against the page (Sunrise uses Muted, since its apricot outline was
1.9:1). Three Tailwind variants let one class string style a real
hover/focus/press and a frozen sample. The routine, timer and progress
logic live in app/design-system/, with tests for the logic.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 2: The component library and the Sunrise recipe

**Files:**
- Create: `app/design-system/recipe.ts`
- Create: `app/design-system/RecipeContext.tsx`
- Create: `app/design-system/components/Button.tsx`, `TextLink.tsx`, `TextInput.tsx`, `Select.tsx`, `RadioGroup.tsx`, `Checkbox.tsx`, `Toggle.tsx`, `Tabs.tsx`, `FilterChips.tsx`, `Badge.tsx`, `WorkoutCard.tsx`, `ExerciseList.tsx`, `DetailPanel.tsx`, `RestTimer.tsx`, `SetTracker.tsx`, `StatePanel.tsx`
- Create: `app/design-system/recipes/sunrise.ts`

**Interfaces:**
- Consumes: Task 1's `content.ts`, `timer.ts`, `progress.ts`; the role tokens and variants.
- Produces (Tasks 3–5 use these):
  - `type FrozenState = "hover" | "focus" | "pressed"`, `type BadgeTone = "today" | "done" | "upper" | "legs" | "cardio" | "rest"`, `type Recipe` (fields below)
  - `RecipeProvider({ recipe, children })` and `useRecipe(): Recipe`
  - Default-exported components, with props:
    - `Button({ variant?, state?, ...button })`
    - `TextLink(anchor props)`
    - `TextInput({ id, label, state?, ...input })`
    - `Select({ id, label, options, hint?, ...select })`
    - `RadioGroup({ name, legend, options, value, onChange })`
    - `Checkbox({ id, label, state?, ...input })`
    - `Toggle({ label, checked, onChange, state?, disabled? })`
    - `Tabs({ label, tabs })`
    - `FilterChips({ label, options, selected, onSelect })`
    - `Badge({ tone, children })`
    - `WorkoutCard({ day, today? })`
    - `ExerciseList({ exercises, onOpen })`
    - `DetailPanel({ exercise, restLabel, onClose })`
    - `RestTimer({ seconds })`
    - `SetTracker({ exercise, sets })`
    - `StatePanel({ kind, children, action? })`
  - Named exports: `TabSample` (Tabs.tsx), `Chip` (FilterChips.tsx), `ExerciseFacts` (DetailPanel.tsx), `type UiState` (StatePanel.tsx)
  - `SUNRISE_RECIPE: Recipe`

- [ ] **Step 1: Write the recipe type and provider**

Create `app/design-system/recipe.ts`:

```ts
export type FrozenState = "hover" | "focus" | "pressed";
export type BadgeTone = "today" | "done" | "upper" | "legs" | "cardio" | "rest";

// A mood's styling for every part of every component, as Tailwind class strings.
export type Recipe = {
  focus: string;
  label: string;
  hint: string;
  pageTitle: string;
  sectionTitle: string;
  sectionNumber: string;
  panel: string;
  swatch: string;
  button: { base: string; primary: string; secondary: string };
  link: string;
  field: string;
  fieldLabel: string;
  checkbox: string;
  checkmark: string;
  radio: string;
  choiceLabel: string;
  toggle: { track: string; thumb: string };
  tabs: { list: string; tab: string; panel: string };
  chipGroup: string;
  chip: string;
  card: { root: string; band: string; body: string; eyebrow: string; title: string; meta: string };
  rows: { list: string; item: string; row: string; name: string; sets: string };
  badge: { base: string; tones: Record<BadgeTone, string> };
  dialog: { root: string; preview: string; title: string; close: string; facts: string; cues: string };
  timer: { root: string; label: string; digits: string };
  progress: { track: string; fill: string };
  tracker: { root: string; title: string; count: string };
  uiState: { root: string; icon: string; text: string };
  typeRoles: { role: string; sample: string; className: string; spec: string }[];
  shape: {
    corners: { label: string; className: string }[];
    border: string;
    borderLabel: string;
    shadow: string;
    shadowLabel: string;
  };
  // [text token, background token] pairs this recipe sets text in; each must reach 4.5:1.
  textPairs: [string, string][];
};
```

Create `app/design-system/RecipeContext.tsx`:

```tsx
"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Recipe } from "./recipe";

const RecipeContext = createContext<Recipe | null>(null);

export function RecipeProvider({ recipe, children }: { recipe: Recipe; children: ReactNode }) {
  return <RecipeContext value={recipe}>{children}</RecipeContext>;
}

export function useRecipe(): Recipe {
  const recipe = useContext(RecipeContext);
  if (!recipe) throw new Error("useRecipe must be used inside a RecipeProvider");
  return recipe;
}
```

- [ ] **Step 2: Write the controls**

Create `app/design-system/components/Button.tsx`:

```tsx
"use client";

import type { ButtonHTMLAttributes } from "react";
import type { FrozenState } from "../recipe";
import { useRecipe } from "../RecipeContext";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  // A frozen hover, focus or press for the control-states grid.
  state?: FrozenState;
};

export default function Button({ variant = "primary", state, className = "", type = "button", ...props }: ButtonProps) {
  const recipe = useRecipe();
  return (
    <button
      type={type}
      data-state={state}
      className={`${recipe.button.base} ${recipe.button[variant]} ${recipe.focus} ${className}`}
      {...props}
    />
  );
}
```

Create `app/design-system/components/TextLink.tsx`:

```tsx
"use client";

import type { AnchorHTMLAttributes } from "react";
import { useRecipe } from "../RecipeContext";

export default function TextLink({ className = "", ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const recipe = useRecipe();
  return <a className={`${recipe.link} ${recipe.focus} ${className}`} {...props} />;
}
```

Create `app/design-system/components/TextInput.tsx`:

```tsx
"use client";

import type { InputHTMLAttributes } from "react";
import type { FrozenState } from "../recipe";
import { useRecipe } from "../RecipeContext";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & { id: string; label: string; state?: FrozenState };

export default function TextInput({ id, label, state, className = "", ...props }: TextInputProps) {
  const recipe = useRecipe();
  return (
    <div className={`grid gap-1.5 ${className}`}>
      <label htmlFor={id} className={recipe.fieldLabel}>
        {label}
      </label>
      <input id={id} data-state={state} className={`${recipe.field} ${recipe.focus}`} {...props} />
    </div>
  );
}
```

Create `app/design-system/components/Select.tsx`:

```tsx
"use client";

import type { SelectHTMLAttributes } from "react";
import { useRecipe } from "../RecipeContext";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  hint?: string;
};

export default function Select({ id, label, options, hint, className = "", ...props }: SelectProps) {
  const recipe = useRecipe();
  const hintId = `${id}-hint`;
  return (
    <div className={`grid gap-1.5 ${className}`}>
      <label htmlFor={id} className={recipe.fieldLabel}>
        {label}
      </label>
      <select id={id} aria-describedby={hint ? hintId : undefined} className={`${recipe.field} ${recipe.focus}`} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint && (
        <p id={hintId} className={recipe.hint}>
          {hint}
        </p>
      )}
    </div>
  );
}
```

Create `app/design-system/components/RadioGroup.tsx`:

```tsx
"use client";

import { useRecipe } from "../RecipeContext";

type RadioGroupProps = {
  name: string;
  legend: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
};

export default function RadioGroup({ name, legend, options, value, onChange }: RadioGroupProps) {
  const recipe = useRecipe();
  return (
    <fieldset>
      <legend className={recipe.fieldLabel}>{legend}</legend>
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
        {options.map((option) => {
          const id = `${name}-${option.value}`;
          return (
            <label key={option.value} htmlFor={id} className={recipe.choiceLabel}>
              <input
                id={id}
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                className={`${recipe.radio} ${recipe.focus}`}
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
```

Create `app/design-system/components/Checkbox.tsx`:

```tsx
"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import type { FrozenState } from "../recipe";
import { useRecipe } from "../RecipeContext";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  id: string;
  label: ReactNode;
  state?: FrozenState;
};

export default function Checkbox({ id, label, state, ...props }: CheckboxProps) {
  const recipe = useRecipe();
  return (
    <label htmlFor={id} className={recipe.choiceLabel}>
      {/* The native box and its tick share one grid cell, so the tick sits on the box. */}
      <span className="grid shrink-0 place-items-center">
        <input
          id={id}
          type="checkbox"
          data-state={state}
          className={`peer [grid-area:1/1] ${recipe.checkbox} ${recipe.focus}`}
          {...props}
        />
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className={`pointer-events-none [grid-area:1/1] size-3.5 opacity-0 peer-checked:opacity-100 ${recipe.checkmark}`}
        >
          <path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {label}
    </label>
  );
}
```

Create `app/design-system/components/Toggle.tsx`:

```tsx
"use client";

import { useId } from "react";
import type { FrozenState } from "../recipe";
import { useRecipe } from "../RecipeContext";

type ToggleProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  state?: FrozenState;
  disabled?: boolean;
};

export default function Toggle({ label, checked, onChange, state, disabled = false }: ToggleProps) {
  const recipe = useRecipe();
  const labelId = useId();
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        disabled={disabled}
        data-state={state}
        onClick={() => onChange(!checked)}
        className={`${recipe.toggle.track} ${recipe.focus}`}
      >
        <span aria-hidden="true" className={recipe.toggle.thumb} />
      </button>
      <span id={labelId} className={recipe.choiceLabel}>
        {label}
      </span>
    </div>
  );
}
```

Create `app/design-system/components/Tabs.tsx`:

```tsx
"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import type { FrozenState } from "../recipe";
import { useRecipe } from "../RecipeContext";

type Tab = { id: string; label: string; content: ReactNode };

export default function Tabs({ label, tabs }: { label: string; tabs: Tab[] }) {
  const recipe = useRecipe();
  const baseId = useId();
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const moveTo = (index: number) => {
    const next = (index + tabs.length) % tabs.length;
    setSelected(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const moves: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: tabs.length - 1 };
    if (event.key in moves) {
      event.preventDefault();
      moveTo(moves[event.key]);
    }
  };

  return (
    <div>
      <div role="tablist" aria-label={label} className={recipe.tabs.list}>
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${tab.id}`}
            aria-controls={`${baseId}-panel-${tab.id}`}
            aria-selected={index === selected}
            tabIndex={index === selected ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={`${recipe.tabs.tab} ${recipe.focus}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={index !== selected}
          className={recipe.tabs.panel}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}

// One frozen tab for the control-states grid.
export function TabSample({ label, selected, state }: { label: string; selected: boolean; state?: FrozenState }) {
  const recipe = useRecipe();
  return (
    <div role="tablist" aria-label={`${label} tab sample`} className={recipe.tabs.list}>
      <button
        type="button"
        role="tab"
        aria-selected={selected}
        tabIndex={-1}
        data-state={state}
        className={`${recipe.tabs.tab} ${recipe.focus}`}
      >
        {label}
      </button>
    </div>
  );
}
```

Create `app/design-system/components/FilterChips.tsx`:

```tsx
"use client";

import type { ButtonHTMLAttributes } from "react";
import type { FrozenState } from "../recipe";
import { useRecipe } from "../RecipeContext";

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & { pressed: boolean; state?: FrozenState };

export function Chip({ pressed, state, className = "", ...props }: ChipProps) {
  const recipe = useRecipe();
  return (
    <button
      type="button"
      aria-pressed={pressed}
      data-state={state}
      className={`${recipe.chip} ${recipe.focus} ${className}`}
      {...props}
    />
  );
}

type FilterChipsProps = {
  label: string;
  options: readonly string[];
  selected: string;
  onSelect: (option: string) => void;
};

export default function FilterChips({ label, options, selected, onSelect }: FilterChipsProps) {
  const recipe = useRecipe();
  return (
    <div role="group" aria-label={label} className={recipe.chipGroup}>
      {options.map((option) => (
        <Chip key={option} pressed={option === selected} onClick={() => onSelect(option)}>
          {option}
        </Chip>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Write the content components**

Create `app/design-system/components/Badge.tsx`:

```tsx
"use client";

import type { ReactNode } from "react";
import type { BadgeTone } from "../recipe";
import { useRecipe } from "../RecipeContext";

export default function Badge({ tone, children }: { tone: BadgeTone; children: ReactNode }) {
  const recipe = useRecipe();
  return <span className={`${recipe.badge.base} ${recipe.badge.tones[tone]}`}>{children}</span>;
}
```

Create `app/design-system/components/WorkoutCard.tsx`:

```tsx
"use client";

import { REPS, SETS, type WorkoutDay } from "../content";
import { useRecipe } from "../RecipeContext";
import Badge from "./Badge";

export default function WorkoutCard({ day, today = false }: { day: WorkoutDay; today?: boolean }) {
  const recipe = useRecipe();
  return (
    <article className={recipe.card.root}>
      <div aria-hidden="true" className={recipe.card.band} />
      <div className={recipe.card.body}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className={recipe.card.eyebrow}>Day {day.day}</p>
          {today && <Badge tone="today">Today</Badge>}
        </div>
        <h3 className={recipe.card.title}>{day.name}</h3>
        <p className={recipe.card.meta}>
          {day.exercises.length} exercises · {SETS} × {REPS}
        </p>
      </div>
    </article>
  );
}
```

Create `app/design-system/components/ExerciseList.tsx`:

```tsx
"use client";

import { REPS, SETS } from "../content";
import { useRecipe } from "../RecipeContext";

export default function ExerciseList({ exercises, onOpen }: { exercises: string[]; onOpen: (exercise: string) => void }) {
  const recipe = useRecipe();
  return (
    <ul className={recipe.rows.list}>
      {exercises.map((exercise) => (
        <li key={exercise} className={recipe.rows.item}>
          <button type="button" onClick={() => onOpen(exercise)} className={`${recipe.rows.row} ${recipe.focus}`}>
            <span className={recipe.rows.name}>{exercise}</span>
            <span className={recipe.rows.sets}>
              {SETS} × {REPS} <span aria-hidden="true">›</span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
```

Create `app/design-system/components/DetailPanel.tsx`:

```tsx
"use client";

import { useEffect, useId, useRef } from "react";
import { FORM_CUES, REPS, SETS } from "../content";
import { useRecipe } from "../RecipeContext";

export function ExerciseFacts({ exercise, restLabel }: { exercise: string; restLabel: string }) {
  const recipe = useRecipe();
  const cues = FORM_CUES[exercise] ?? [];
  return (
    <div className="mt-3 grid gap-3">
      <p className={recipe.dialog.facts}>
        {SETS} × {REPS} · Rest {restLabel}
      </p>
      {cues.length > 0 && (
        <ol className={recipe.dialog.cues}>
          {cues.map((cue) => (
            <li key={cue}>{cue}</li>
          ))}
        </ol>
      )}
    </div>
  );
}

type DetailPanelProps = { exercise: string | null; restLabel: string; onClose: () => void };

// A native modal dialog: it traps focus, closes on Esc and returns focus to the opener.
export default function DetailPanel({ exercise, restLabel, onClose }: DetailPanelProps) {
  const recipe = useRecipe();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (exercise && !dialog.open) dialog.showModal();
    if (!exercise && dialog.open) dialog.close();
  }, [exercise]);

  return (
    <dialog ref={dialogRef} aria-labelledby={titleId} onClose={onClose} className={recipe.dialog.root}>
      {exercise && (
        <>
          <div className="flex items-start justify-between gap-4">
            <h3 id={titleId} className={recipe.dialog.title}>
              {exercise}
            </h3>
            <button type="button" aria-label="Close" onClick={onClose} className={`${recipe.dialog.close} ${recipe.focus}`}>
              ×
            </button>
          </div>
          <ExerciseFacts exercise={exercise} restLabel={restLabel} />
        </>
      )}
    </dialog>
  );
}
```

Create `app/design-system/components/RestTimer.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useRecipe } from "../RecipeContext";
import { formatSeconds, newTimer, resetTimer, tick, toggleRunning } from "../timer";
import Button from "./Button";

// Remount (change the key) to use a new length; nothing persists across reloads.
export default function RestTimer({ seconds }: { seconds: number }) {
  const recipe = useRecipe();
  const [timer, setTimer] = useState(() => newTimer(seconds));

  useEffect(() => {
    if (!timer.running) return;
    const interval = setInterval(() => setTimer((current) => tick(current)), 1000);
    return () => clearInterval(interval);
  }, [timer.running]);

  const finished = timer.remaining === 0;
  return (
    <div className={recipe.timer.root}>
      <p className={recipe.timer.label}>Rest</p>
      <p className={recipe.timer.digits}>{formatSeconds(timer.remaining)}</p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={() => setTimer(toggleRunning)}>{timer.running ? "Pause" : finished ? "Start again" : "Start"}</Button>
        <Button variant="secondary" onClick={() => setTimer(resetTimer)}>
          Reset
        </Button>
      </div>
      <p aria-live="polite" className="sr-only">
        {finished ? "Rest over" : ""}
      </p>
    </div>
  );
}
```

Create `app/design-system/components/SetTracker.tsx`:

```tsx
"use client";

import { useId, useState } from "react";
import { REPS } from "../content";
import { progressLabel, progressPercent } from "../progress";
import { useRecipe } from "../RecipeContext";
import Checkbox from "./Checkbox";

// Starts with all but the last set done, so the progress bar has something to show.
export default function SetTracker({ exercise, sets }: { exercise: string; sets: number }) {
  const recipe = useRecipe();
  const baseId = useId();
  const [done, setDone] = useState(() => Array.from({ length: sets }, (_, index) => index < sets - 1));
  const count = done.filter(Boolean).length;

  return (
    <div className={recipe.tracker.root}>
      <p className={recipe.tracker.title}>{exercise}</p>
      <ul className="grid gap-2">
        {done.map((isDone, index) => (
          <li key={index}>
            <Checkbox
              id={`${baseId}-set-${index + 1}`}
              label={`Set ${index + 1} · ${REPS} reps`}
              checked={isDone}
              onChange={() => setDone((current) => current.map((value, i) => (i === index ? !value : value)))}
            />
          </li>
        ))}
      </ul>
      <div
        role="progressbar"
        aria-label={`${exercise} sets done`}
        aria-valuemin={0}
        aria-valuemax={sets}
        aria-valuenow={count}
        aria-valuetext={progressLabel(count, sets)}
        className={recipe.progress.track}
      >
        <div className={recipe.progress.fill} style={{ width: `${progressPercent(count, sets)}%` }} />
      </div>
      <p className={recipe.tracker.count}>{progressLabel(count, sets)}</p>
    </div>
  );
}
```

Create `app/design-system/components/StatePanel.tsx`:

```tsx
"use client";

import type { ReactNode } from "react";
import { useRecipe } from "../RecipeContext";

export type UiState = "empty" | "loading" | "error" | "success";

function StateIcon({ kind, className }: { kind: UiState; className: string }) {
  if (kind === "empty") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
        <circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
      </svg>
    );
  }
  if (kind === "loading") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" className={`${className} motion-safe:animate-spin`}>
        <path d="M16 4a12 12 0 1 1-12 12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "error") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
        <circle cx="16" cy="16" r="13" fill="currentColor" />
        <path d="M16 9v9" strokeWidth="3" strokeLinecap="round" className="stroke-bg" />
        <circle cx="16" cy="23" r="1.8" className="fill-bg" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <circle cx="16" cy="16" r="13" fill="currentColor" />
      <path d="M10 16.5 14 20.5 22 11.5" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="stroke-bg" />
    </svg>
  );
}

type StatePanelProps = { kind: UiState; children: ReactNode; action?: ReactNode };

export default function StatePanel({ kind, children, action }: StatePanelProps) {
  const recipe = useRecipe();
  return (
    <div role={kind === "error" ? "alert" : "status"} data-ui-state={kind} className={recipe.uiState.root}>
      <StateIcon kind={kind} className={recipe.uiState.icon} />
      <p className={recipe.uiState.text}>{children}</p>
      {action}
    </div>
  );
}
```

- [ ] **Step 4: Write the Sunrise recipe**

Create `app/design-system/recipes/sunrise.ts`:

```ts
import type { Recipe } from "../recipe";

const LABEL = "text-xs font-bold uppercase tracking-[0.14em]";

// Pills and soft corners, thin warm lines, no shadows; Skip hovers Sky with ink text.
export const SUNRISE_RECIPE: Recipe = {
  focus: "focus-state:outline-2 focus-state:outline-offset-2 focus-state:outline-focus",
  label: `${LABEL} text-muted`,
  hint: "text-sm text-muted",
  pageTitle: "font-display text-5xl font-extrabold leading-none sm:text-6xl",
  sectionTitle: "font-display text-2xl font-extrabold",
  sectionNumber: "grid size-8 shrink-0 place-items-center rounded-full bg-accent text-sm text-on-accent",
  panel: "rounded-tile border border-line p-5",
  swatch: "h-20 rounded-tile border border-line",
  button: {
    base: "inline-flex items-center justify-center gap-2 rounded-full border-[1.5px] px-5 py-2.5 font-bold transition pressed-state:scale-[0.97] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
    primary: "border-accent bg-accent text-on-accent hover-state:brightness-95",
    secondary: "border-accent bg-bg text-accent hover-state:bg-(--swatch-sky) hover-state:text-ink",
  },
  link: "rounded-sm font-bold text-accent underline decoration-2 underline-offset-4 hover-state:decoration-[3px]",
  field:
    "w-full rounded-xl border-[1.5px] border-control bg-bg px-3 py-2.5 text-ink placeholder:text-muted hover-state:border-accent disabled:cursor-not-allowed disabled:opacity-40",
  fieldLabel: "text-sm font-bold",
  checkbox:
    "size-5 appearance-none rounded-md border-[1.5px] border-control bg-bg checked:border-accent checked:bg-accent hover-state:border-accent disabled:cursor-not-allowed disabled:opacity-40",
  checkmark: "text-on-accent",
  radio:
    "size-5 shrink-0 appearance-none rounded-full border-[1.5px] border-control bg-bg checked:border-[6px] checked:border-accent hover-state:border-accent disabled:opacity-40",
  choiceLabel: "flex items-center gap-2.5 text-ink",
  toggle: {
    track:
      "group inline-flex h-6 w-11 shrink-0 items-center rounded-full border-[1.5px] border-control bg-bg transition aria-checked:border-accent aria-checked:bg-accent hover-state:brightness-95 disabled:cursor-not-allowed disabled:opacity-40",
    thumb: "ml-0.5 size-4 rounded-full bg-control transition group-aria-checked:translate-x-5 group-aria-checked:bg-bg",
  },
  tabs: {
    list: "inline-flex gap-1 rounded-full bg-surface p-1",
    tab: "rounded-full px-4 py-1.5 font-bold text-ink hover-state:not-aria-selected:bg-bg/60 aria-selected:bg-bg",
    panel: "pt-4",
  },
  chipGroup: "flex flex-wrap gap-2",
  chip: "rounded-full border-[1.5px] border-line bg-bg px-3.5 py-1.5 text-sm font-semibold text-ink transition hover-state:not-aria-pressed:bg-surface pressed-state:scale-[0.97] aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-on-accent disabled:cursor-not-allowed disabled:opacity-40",
  card: {
    root: "overflow-hidden rounded-tile bg-surface",
    band: "hidden",
    body: "grid gap-1 p-5",
    eyebrow: LABEL,
    title: "font-display text-2xl font-extrabold",
    meta: "text-sm",
  },
  rows: {
    list: "divide-y divide-line",
    item: "",
    row: "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left hover-state:bg-surface",
    name: "font-semibold",
    sets: "whitespace-nowrap text-sm font-bold",
  },
  badge: {
    base: "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold",
    tones: {
      today: "bg-accent text-on-accent",
      done: "border-[1.5px] border-control text-ink",
      upper: "bg-surface text-ink",
      legs: "bg-(--swatch-apricot) text-ink",
      cardio: "bg-(--swatch-sky) text-ink",
      rest: "border-[1.5px] border-line text-muted",
    },
  },
  dialog: {
    root: "m-auto w-[min(28rem,calc(100vw-2rem))] rounded-tile bg-bg p-6 text-ink backdrop:bg-ink/40",
    preview: "rounded-tile bg-surface p-5",
    title: "font-display text-2xl font-extrabold",
    close: "grid size-9 shrink-0 place-items-center rounded-full text-2xl leading-none hover-state:bg-surface",
    facts: "font-bold",
    cues: "list-decimal space-y-2 pl-5",
  },
  timer: {
    root: "grid justify-items-center gap-3 rounded-tile bg-surface p-6",
    label: LABEL,
    digits: "font-display text-6xl font-extrabold tabular-nums",
  },
  progress: {
    track: "h-2.5 overflow-hidden rounded-full bg-surface",
    fill: "h-full rounded-full bg-accent transition-[width]",
  },
  tracker: { root: "grid gap-3", title: "text-lg font-extrabold", count: `${LABEL} text-muted` },
  uiState: {
    root: "grid justify-items-center gap-2 rounded-tile border border-line p-5 text-center",
    icon: "size-8 text-accent",
    text: "text-sm font-semibold",
  },
  typeRoles: [
    { role: "Display", sample: "Day 1", className: "font-display text-5xl font-extrabold leading-none", spec: "Nunito 800 · 48 px" },
    { role: "Heading", sample: "Back and biceps", className: "text-2xl font-bold", spec: "Nunito 700 · 24 px" },
    {
      role: "Body",
      sample: "Three sets of ten for every exercise. Rest 90 seconds between sets.",
      className: "max-w-prose text-base leading-relaxed",
      spec: "Nunito 400 · 16 px / 1.6",
    },
    { role: "Label", sample: "Rest between sets", className: LABEL, spec: "Nunito 700 · 12 px, uppercase" },
  ],
  shape: {
    corners: [
      { label: "Pill · buttons and chips", className: "rounded-full" },
      { label: "18 px · cards", className: "rounded-tile" },
      { label: "12 px · fields", className: "rounded-xl" },
    ],
    border: "rounded-xl border-[1.5px] border-control",
    borderLabel: "1.5 px outlines",
    shadow: "rounded-tile",
    shadowLabel: "No shadows",
  },
  textPairs: [
    ["warm-white", "dusk"],
    ["dusk", "warm-white"],
    ["ink", "sky"],
    ["ink", "peach"],
    ["ink", "apricot"],
    ["ink", "warm-white"],
    ["muted", "warm-white"],
  ],
};
```

- [ ] **Step 5: Typecheck and lint the library**

Run: `npx tsc --noEmit`, then `npm run lint`.
Expected: no output from either. The library isn't rendered anywhere yet; Task 3's tests exercise it.

- [ ] **Step 6: Commit**

```bash
git add app/design-system
git commit -F - <<'EOF'
Add the design-system component library and Sunrise recipe

Sixteen components written once with their markup, keyboard behavior
and ARIA: buttons, link, input, select, radios, checkbox, switch,
tabs, filter chips, card, list rows, badges, a native-dialog detail
panel, the rest timer, the set tracker and UI-state panels. Each mood
styles them through a recipe of class strings; this adds Sunrise's.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 3: The design-system page and the Sunrise system

**Files:**
- Create: `app/design-system/DesignSystemPage.tsx`
- Modify: `app/design-systems/sunrise/page.tsx` (replace the placeholder)
- Modify: `tests/fonts.test.mjs` (design-system font expectations)
- Modify: `tests/contrast.test.mjs` (recipe text pairs)
- Test: `tests/design-systems.test.mjs`

**Interfaces:**
- Consumes: everything from Tasks 1 and 2; `getMood`, `getSwatch`, `moodStyle` from `app/moods.ts`; `SUNRISE_FONTS` from `app/fonts/sunrise.ts`; `findNested`, `contrast`, `readPage`, `ROOT` from `tests/helpers.mjs`.
- Produces:
  - `DesignSystemPage({ mood, recipe, fontClass })` (default export)
  - Page HTML markers: `data-section="color|type|spacing|components|control-states|ui-states"`, `data-component="<id>"`, `data-cell="<control>-<state>"` (with `data-na` when n/a), `data-ui-state="<kind>"`, `data-role="<role>"`

- [ ] **Step 1: Write the failing design-system tests**

Create `tests/design-systems.test.mjs`:

```js
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
```

In `tests/contrast.test.mjs`, add `import { existsSync } from "node:fs";` after the `node:assert/strict` import, and insert inside the `for (const mood of MOODS)` loop, after the `control outlines` test:

```js
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
```

In `tests/fonts.test.mjs`, replace the `"/design-systems/sunrise/": [],` line in `FONTS_BY_PAGE` with:

```js
  "/design-systems/sunrise/": ["Nunito"],
  "/design-systems/editorial/": ["Libre Franklin", "Newsreader"],
  "/design-systems/plate-room/": ["Archivo", "Big Shoulders", "Big Shoulders Stencil"],
```

- [ ] **Step 2: Run them to make sure Sunrise fails**

Run: `rm -rf out && npx next build && node --test --test-name-pattern="Sunrise|recipes|/design-systems/sunrise/" 'tests/*.test.mjs'`
Expected: the Sunrise design-system suite FAILS starting with "has the six sections in order" (the placeholder has none). The Sunrise recipe-pairs test PASSES (the recipe exists from Task 2). `/design-systems/sunrise/ preloads only the fonts it uses` FAILS (it preloads none yet). The palette test PASSES.

- [ ] **Step 3: Write the page component**

Create `app/design-system/DesignSystemPage.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useState, type CSSProperties, type ReactNode } from "react";
import { contrast } from "@/app/contrast";
import { getSwatch, moodStyle, type Mood } from "@/app/moods";
import Badge from "./components/Badge";
import Button from "./components/Button";
import Checkbox from "./components/Checkbox";
import DetailPanel, { ExerciseFacts } from "./components/DetailPanel";
import ExerciseList from "./components/ExerciseList";
import FilterChips, { Chip } from "./components/FilterChips";
import RadioGroup from "./components/RadioGroup";
import RestTimer from "./components/RestTimer";
import Select from "./components/Select";
import SetTracker from "./components/SetTracker";
import StatePanel from "./components/StatePanel";
import Tabs, { TabSample } from "./components/Tabs";
import TextInput from "./components/TextInput";
import TextLink from "./components/TextLink";
import Toggle from "./components/Toggle";
import WorkoutCard from "./components/WorkoutCard";
import { CARDIO_OPTIONS, DAY_FILTERS, REST_OPTIONS, UI_STATE_COPY, WEEK, type DayFilter } from "./content";
import type { FrozenState, Recipe } from "./recipe";
import { RecipeProvider, useRecipe } from "./RecipeContext";

type RoleName = keyof Mood["roles"];

const COLOR_ROLES: { role: RoleName; name: string; use: string }[] = [
  { role: "bg", name: "Background", use: "The page" },
  { role: "surface", name: "Surface", use: "Cards, the timer, the tab track" },
  { role: "ink", name: "Text", use: "Body text and headings" },
  { role: "muted", name: "Muted text", use: "Labels and hints" },
  { role: "line", name: "Border", use: "Dividers and decorative lines" },
  { role: "control", name: "Control", use: "Field, checkbox, radio and toggle outlines" },
  { role: "accent", name: "Accent", use: "The primary action and on states" },
  { role: "focus", name: "Focus", use: "The keyboard focus ring" },
];

const SPACING = [4, 8, 12, 16, 24, 32];

const STATES = ["rest", "hover", "focus", "pressed", "selected", "disabled"] as const;
type StateName = (typeof STATES)[number];

const CONTROLS: { id: string; name: string; states: StateName[] }[] = [
  { id: "primary", name: "Primary button", states: ["rest", "hover", "focus", "pressed", "disabled"] },
  { id: "secondary", name: "Secondary button", states: ["rest", "hover", "focus", "pressed", "disabled"] },
  { id: "chip", name: "Filter chip", states: ["rest", "hover", "focus", "pressed", "selected", "disabled"] },
  { id: "checkbox", name: "Checkbox", states: ["rest", "hover", "focus", "selected", "disabled"] },
  { id: "toggle", name: "Toggle", states: ["rest", "hover", "focus", "selected", "disabled"] },
  { id: "tab", name: "Tab", states: ["rest", "hover", "focus", "selected"] },
];

function roleRatio(mood: Mood, role: RoleName): string {
  const hex = (name: RoleName) => getSwatch(mood, mood.roles[name]).hex;
  const ratio = (a: RoleName, b: RoleName) => `${contrast(hex(a), hex(b)).toFixed(1)}:1`;
  if (role === "bg") return `${ratio("ink", "bg")} with text`;
  if (role === "surface") return `${ratio("ink", "surface")} with text`;
  if (role === "accent") return `${ratio("on-accent", "accent")} with its text`;
  if (role === "line") return `${ratio("line", "bg")} · decorative`;
  return `${ratio(role, "bg")} on background`;
}

function Section({ number, id, title, children }: { number: number; id: string; title: string; children: ReactNode }) {
  const recipe = useRecipe();
  return (
    <section data-section={id} aria-labelledby={`${id}-title`} className="mt-14">
      <h2 id={`${id}-title`} className={`flex items-center gap-3 ${recipe.sectionTitle}`}>
        <span className={recipe.sectionNumber}>{number}</span>
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Header({ mood }: { mood: Mood }) {
  const recipe = useRecipe();
  return (
    <header>
      <Link href="/" className={`text-sm underline underline-offset-4 ${recipe.focus}`}>
        ← Hub
      </Link>
      <h1 className={`mt-4 ${recipe.pageTitle}`}>{mood.name} · Design System</h1>
      <p className={`mt-3 max-w-prose ${recipe.hint}`}>
        Every component the workout site can use, in the {mood.name} style. The components in section 4 are live; section 5
        freezes each state side by side.
      </p>
    </header>
  );
}

function ColorRoles({ mood }: { mood: Mood }) {
  const recipe = useRecipe();
  return (
    <Section number={1} id="color" title="Color roles">
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {COLOR_ROLES.map(({ role, name, use }) => {
          const swatch = getSwatch(mood, mood.roles[role]);
          return (
            <li key={role} data-role={role} className="grid content-start gap-0.5">
              <div className={recipe.swatch} style={{ background: swatch.hex }} />
              <p className="mt-2 font-bold">{name}</p>
              <p className={recipe.hint}>
                {swatch.name} · {swatch.hex}
              </p>
              <p className={recipe.hint}>{use}</p>
              <p className="text-sm font-bold">{roleRatio(mood, role)}</p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

function TypeRoles() {
  const recipe = useRecipe();
  return (
    <Section number={2} id="type" title="Type roles">
      <dl className="grid gap-6">
        {recipe.typeRoles.map((typeRole) => (
          <div key={typeRole.role} className="grid gap-2 border-b border-line pb-4 sm:grid-cols-[11rem_1fr] sm:items-baseline">
            <dt className={recipe.label}>
              {typeRole.role}
              <span className="block normal-case tracking-normal">{typeRole.spec}</span>
            </dt>
            <dd className={typeRole.className}>{typeRole.sample}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

function SpacingAndShape() {
  const recipe = useRecipe();
  return (
    <Section number={3} id="spacing" title="Spacing and shape">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <p className={recipe.label}>Spacing scale</p>
          <ul className="mt-3 flex items-end gap-3">
            {SPACING.map((size) => (
              <li key={size} className="grid justify-items-center gap-1">
                <span className="block w-6 bg-accent" style={{ height: size * 2 }} />
                <span className="text-xs tabular-nums">{size}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className={recipe.label}>Corners, border and shadow</p>
          <ul className="mt-3 flex flex-wrap gap-4">
            {recipe.shape.corners.map((corner) => (
              <li key={corner.label} className="grid max-w-24 justify-items-center gap-1 text-center">
                <span className={`block size-16 border-2 border-ink bg-surface ${corner.className}`} />
                <span className="text-xs">{corner.label}</span>
              </li>
            ))}
            <li className="grid max-w-24 justify-items-center gap-1 text-center">
              <span className={`block size-16 bg-bg ${recipe.shape.border}`} />
              <span className="text-xs">{recipe.shape.borderLabel}</span>
            </li>
            <li className="grid max-w-24 justify-items-center gap-1 text-center">
              <span className={`block size-16 border border-line bg-surface ${recipe.shape.shadow}`} />
              <span className="text-xs">{recipe.shape.shadowLabel}</span>
            </li>
          </ul>
        </div>
      </div>
    </Section>
  );
}

function ComponentPanel({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  const recipe = useRecipe();
  return (
    <div id={`component-${id}`} data-component={id} className={recipe.panel}>
      <h3 className={recipe.label}>{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Components() {
  const recipe = useRecipe();
  const [soundOn, setSoundOn] = useState(true);
  const [filter, setFilter] = useState<DayFilter>("All");
  const [restSeconds, setRestSeconds] = useState("90");
  const [cardio, setCardio] = useState(CARDIO_OPTIONS[2].value);
  const [openExercise, setOpenExercise] = useState<string | null>(null);

  const legDay = WEEK[4];
  const restLabel = REST_OPTIONS.find((option) => option.value === restSeconds)?.label ?? "90 s";
  const days = WEEK.filter((day) => filter === "All" || day.kind === filter);
  const cardioDetail = CARDIO_OPTIONS.find((option) => option.value === cardio)?.detail;

  return (
    <Section number={4} id="components" title="Components">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <ComponentPanel id="button" title="Buttons">
          <div className="flex flex-wrap gap-3">
            <Button>Start workout</Button>
            <Button variant="secondary">Skip</Button>
          </div>
        </ComponentPanel>
        <ComponentPanel id="link" title="Link">
          <TextLink href="#component-list-rows">See all exercises →</TextLink>
        </ComponentPanel>
        <ComponentPanel id="text-input" title="Text input">
          <TextInput id="weight-used" label="Weight used (lb)" inputMode="decimal" placeholder="e.g. 25" />
        </ComponentPanel>
        <ComponentPanel id="select" title="Select">
          <Select
            id="cardio-option"
            label="Cardio option"
            options={CARDIO_OPTIONS}
            value={cardio}
            onChange={(event) => setCardio(event.target.value)}
            hint={cardioDetail}
          />
        </ComponentPanel>
        <ComponentPanel id="radio" title="Radios">
          <RadioGroup name="rest" legend="Rest between sets" options={REST_OPTIONS} value={restSeconds} onChange={setRestSeconds} />
        </ComponentPanel>
        <ComponentPanel id="checkbox" title="Checkbox">
          <Checkbox id="set-one-done" label="Set 1 · 10 reps" defaultChecked />
        </ComponentPanel>
        <ComponentPanel id="toggle" title="Toggle">
          <Toggle label="Sound when rest ends" checked={soundOn} onChange={setSoundOn} />
        </ComponentPanel>
        <ComponentPanel id="tabs" title="Tabs">
          <Tabs
            label="Workout views"
            tabs={[
              { id: "today", label: "Today", content: <p>Day 1 · Back and biceps</p> },
              { id: "week", label: "Week", content: <p>Three strength days, three cardio days and a rest day.</p> },
              { id: "notes", label: "Notes", content: <p>Every strength exercise is 3 sets of 10.</p> },
            ]}
          />
        </ComponentPanel>
        <ComponentPanel id="chips" title="Filter chips">
          <FilterChips label="Filter the week" options={DAY_FILTERS} selected={filter} onSelect={(option) => setFilter(option as DayFilter)} />
          <ul className="mt-4 grid gap-2">
            {days.map((day) => (
              <li key={day.day} className="flex items-center justify-between gap-2">
                <span>
                  Day {day.day} · {day.name}
                </span>
                <Badge tone={day.tone}>{day.kind}</Badge>
              </li>
            ))}
          </ul>
        </ComponentPanel>
        <ComponentPanel id="card" title="Card">
          <WorkoutCard day={WEEK[0]} today />
        </ComponentPanel>
        <ComponentPanel id="badge" title="Badges">
          <div className="flex flex-wrap gap-2">
            <Badge tone="today">Today</Badge>
            <Badge tone="done">Done</Badge>
            <Badge tone="upper">Upper body</Badge>
            <Badge tone="legs">Legs</Badge>
            <Badge tone="cardio">Cardio</Badge>
            <Badge tone="rest">Rest</Badge>
          </div>
        </ComponentPanel>
        <ComponentPanel id="list-rows" title={`List rows · Day ${legDay.day} · ${legDay.name}`}>
          <ExerciseList exercises={legDay.exercises} onOpen={setOpenExercise} />
        </ComponentPanel>
        <ComponentPanel id="detail-panel" title="Detail panel">
          <div className={recipe.dialog.preview}>
            <p className={recipe.dialog.title}>Bulgarian split squats</p>
            <ExerciseFacts exercise="Bulgarian split squats" restLabel={restLabel} />
          </div>
          <Button variant="secondary" className="mt-4" onClick={() => setOpenExercise("Bulgarian split squats")}>
            Open as a panel
          </Button>
        </ComponentPanel>
        <ComponentPanel id="rest-timer" title="Rest timer">
          <RestTimer key={restSeconds} seconds={Number(restSeconds)} />
        </ComponentPanel>
        <ComponentPanel id="set-tracker" title="Set tracker">
          <SetTracker exercise="Face pulls" sets={3} />
        </ComponentPanel>
      </div>
      <DetailPanel exercise={openExercise} restLabel={restLabel} onClose={() => setOpenExercise(null)} />
    </Section>
  );
}

function frozen(state: StateName): FrozenState | undefined {
  return state === "hover" || state === "focus" || state === "pressed" ? state : undefined;
}

function Sample({ control, state }: { control: string; state: StateName }) {
  const frozenState = frozen(state);
  const disabled = state === "disabled";
  const selected = state === "selected";
  if (control === "primary") return <Button state={frozenState} disabled={disabled}>Start</Button>;
  if (control === "secondary") return <Button variant="secondary" state={frozenState} disabled={disabled}>Skip</Button>;
  if (control === "chip") return <Chip pressed={selected} state={frozenState} disabled={disabled}>Cardio</Chip>;
  if (control === "checkbox") {
    return <Checkbox id={`state-checkbox-${state}`} label="Set 1" checked={selected} readOnly state={frozenState} disabled={disabled} />;
  }
  if (control === "toggle") {
    return <Toggle label="Sound" checked={selected} onChange={() => undefined} state={frozenState} disabled={disabled} />;
  }
  return <TabSample label="Today" selected={selected} state={frozenState} />;
}

function ControlStates() {
  const recipe = useRecipe();
  return (
    <Section number={5} id="control-states" title="Control states">
      <p className={recipe.hint}>
        Frozen copies of each control, styled by the same classes as the live components, so hover, focus and press look
        exactly like this.
      </p>
      <div inert className="mt-6 grid gap-6">
        {CONTROLS.map((control) => (
          <div key={control.id} className="grid gap-3 lg:grid-cols-[9rem_1fr] lg:items-center">
            <p className="font-bold">{control.name}</p>
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {STATES.map((state) => {
                const applies = control.states.includes(state);
                return (
                  <li
                    key={state}
                    data-cell={`${control.id}-${state}`}
                    data-na={applies ? undefined : ""}
                    className="grid min-h-20 content-start justify-items-start gap-2"
                  >
                    <span className={recipe.label}>{state}</span>
                    {applies ? <Sample control={control.id} state={state} /> : <span className={recipe.hint}>n/a</span>}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

function UiStates() {
  return (
    <Section number={6} id="ui-states" title="UI states">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatePanel kind="empty">{UI_STATE_COPY.empty}</StatePanel>
        <StatePanel kind="loading">{UI_STATE_COPY.loading}</StatePanel>
        <StatePanel kind="error" action={<Button variant="secondary">Try again</Button>}>
          {UI_STATE_COPY.error}
        </StatePanel>
        <StatePanel kind="success">{UI_STATE_COPY.success}</StatePanel>
      </div>
    </Section>
  );
}

type DesignSystemPageProps = { mood: Mood; recipe: Recipe; fontClass: string };

export default function DesignSystemPage({ mood, recipe, fontClass }: DesignSystemPageProps) {
  return (
    <RecipeProvider recipe={recipe}>
      <div className={`${fontClass} flex-1 bg-bg font-body text-ink`} style={moodStyle(mood) as CSSProperties}>
        <main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-8 sm:py-12">
          <Header mood={mood} />
          <ColorRoles mood={mood} />
          <TypeRoles />
          <SpacingAndShape />
          <Components />
          <ControlStates />
          <UiStates />
        </main>
      </div>
    </RecipeProvider>
  );
}
```

- [ ] **Step 4: Replace the Sunrise placeholder**

Replace `app/design-systems/sunrise/page.tsx` with:

```tsx
import type { Metadata } from "next";
import DesignSystemPage from "@/app/design-system/DesignSystemPage";
import { SUNRISE_RECIPE } from "@/app/design-system/recipes/sunrise";
import { SUNRISE_FONTS } from "@/app/fonts/sunrise";
import { getMood } from "@/app/moods";

export const metadata: Metadata = { title: "Sunrise design system" };

export default function SunriseDesignSystem() {
  return <DesignSystemPage mood={getMood("sunrise")} recipe={SUNRISE_RECIPE} fontClass={SUNRISE_FONTS} />;
}
```

- [ ] **Step 5: Run the Sunrise tests to make sure they pass**

Run: `rm -rf out && npx next build && node --test --test-skip-pattern="Editorial design system|Plate Room design system|Editorial: every text pair its recipe|Plate Room: every text pair its recipe|/design-systems/editorial/|/design-systems/plate-room/" 'tests/*.test.mjs'`, then `npm run lint`.
Expected: every test that runs PASSES. The skip pattern leaves out only Editorial's and Plate Room's design-system suites, recipe-pairs tests and two font tests; those stay red until Tasks 4 and 5. Lint prints nothing.

- [ ] **Step 6: Check Sunrise in the browser at 1440 px and 390 px**

Start `python3 -m http.server 4173 --directory out` in the background if it isn't running. In Claude in Chrome, open a tab at `http://localhost:4173/design-systems/sunrise/` and run with `javascript_tool`:

```js
const check = async (width) => {
  const frame = document.createElement("iframe");
  frame.src = location.href;
  frame.style.cssText = `position:fixed;top:0;left:0;width:${width}px;height:800px;border:0;z-index:9999`;
  document.body.append(frame);
  await new Promise((resolve) => frame.addEventListener("load", resolve, { once: true }));
  await new Promise((resolve) => setTimeout(resolve, 400));
  const doc = frame.contentDocument;
  const result = {
    width,
    overflow: doc.documentElement.scrollWidth - doc.documentElement.clientWidth,
    clipped: [...doc.querySelectorAll("[data-component], [data-cell]")]
      .filter((element) => element.scrollWidth > element.clientWidth + 1)
      .map((element) => element.dataset.component ?? element.dataset.cell),
  };
  frame.remove();
  return result;
};
[await check(1440), await check(390)]
```

Expected: `[{ width: 1440, overflow: 0, clipped: [] }, { width: 390, overflow: 0, clipped: [] }]`. Take screenshots at both widths (scroll through the page) and check that it reads as Sunrise: pills, peach surfaces, Nunito, dusk only on primary and on states.

- [ ] **Step 7: Check Sunrise by keyboard and interaction**

In the same tab:
1. Click the page background, then press Tab repeatedly. Every live control in section 4 gets a visible dusk focus ring. Focus never lands in section 5.
2. Focus the toggle and press Space: `aria-checked` flips.
3. Focus the "Today" tab and press ArrowRight: "Week" is selected and focused.
4. Focus the "Bulgarian split squats" row and press Enter. The dialog opens with focus inside it. Press Esc: it closes, and `document.activeElement.textContent` contains "Bulgarian split squats".
5. Click Start on the timer, wait 3 s, then click the "60 s" radio. The timer shows 1:00, paused.
6. Hover the live Skip button: it turns Sky with ink text, matching section 5's hover cell.

Expected: all six behave as described. Fix anything that doesn't, re-run Steps 5–7, then continue.

- [ ] **Step 8: Commit**

```bash
git add app/design-system/DesignSystemPage.tsx app/design-systems/sunrise/page.tsx tests/design-systems.test.mjs tests/contrast.test.mjs tests/fonts.test.mjs
git commit -F - <<'EOF'
Build the Sunrise design system

The shared design-system page renders the brief's six sections under a
mood's recipe: color roles with computed contrast, type roles, spacing
and shape, every component live, a frozen grid of control states and
the four UI states, all in Nikita's routine. Sunrise is the first.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

- [ ] **Step 9: CHECKPOINT: Nikita reviews Sunrise**

Stop and tell Nikita the page is ready at `http://localhost:4173/design-systems/sunrise/`. Point out the Day 5 form cues in the detail panel, which Nikita hasn't seen yet. For each round of feedback:
1. Make the changes.
2. Re-run Step 5. If the layout or interaction changed, re-run Steps 6–7.
3. Commit with a subject naming what Nikita asked for, e.g. `Sunrise design system: <change>`, ending with the `Co-Authored-By` trailer.

Do not start Task 4 until Nikita says Sunrise is done.

---

### Task 4: The Editorial design system

**Files:**
- Create: `app/design-system/recipes/editorial.ts`
- Modify: `app/design-systems/editorial/page.tsx` (replace the placeholder)

**Interfaces:**
- Consumes: `Recipe` from `app/design-system/recipe.ts`; `DesignSystemPage`; `EDITORIAL_FONTS` from `app/fonts/editorial.ts`.
- Produces: `EDITORIAL_RECIPE: Recipe`.

- [ ] **Step 1: Confirm the Editorial tests fail**

Run: `rm -rf out && npx next build && node --test --test-name-pattern="Editorial|/design-systems/editorial/" 'tests/*.test.mjs'`
Expected: the Editorial design-system suite FAILS ("has the six sections in order"). The Editorial recipe-pairs test FAILS ("no recipe for Editorial yet"). The `/design-systems/editorial/` font test FAILS.

- [ ] **Step 2: Write the Editorial recipe**

Create `app/design-system/recipes/editorial.ts`:

```ts
import type { Recipe } from "../recipe";

const LABEL = "font-label text-[11px] font-bold uppercase tracking-[0.16em]";

// Square corners, ink hairlines, form fields as underlines; red only for the primary action and on states.
export const EDITORIAL_RECIPE: Recipe = {
  focus: "focus-state:outline-2 focus-state:outline-offset-2 focus-state:outline-focus",
  label: `${LABEL} text-muted`,
  hint: "italic text-muted",
  pageTitle: "font-display text-5xl font-semibold leading-none tracking-tight sm:text-6xl",
  sectionTitle: "font-display text-3xl font-semibold tracking-tight",
  sectionNumber: "font-numbers text-base font-bold text-accent",
  panel: "border-t-4 border-ink pt-4",
  swatch: "h-20 border border-ink",
  button: {
    base: "inline-flex items-center justify-center gap-2 border px-5 py-3 font-label text-xs font-bold uppercase tracking-[0.12em] transition pressed-state:translate-y-px disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
    primary: "border-accent bg-accent text-on-accent hover-state:brightness-90",
    secondary: "border-ink bg-bg text-ink hover-state:bg-ink hover-state:text-bg",
  },
  link: "font-label font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4 hover-state:decoration-[3px]",
  field:
    "w-full border-0 border-b-[1.5px] border-control bg-transparent px-0.5 py-2 text-lg text-ink placeholder:text-muted hover-state:border-accent disabled:cursor-not-allowed disabled:opacity-40",
  fieldLabel: LABEL,
  checkbox:
    "size-[18px] appearance-none border-[1.5px] border-control bg-bg hover-state:border-accent disabled:cursor-not-allowed disabled:opacity-40",
  checkmark: "text-ink",
  radio:
    "size-[18px] shrink-0 appearance-none rounded-full border-[1.5px] border-control bg-bg checked:border-[5px] hover-state:border-accent disabled:opacity-40",
  choiceLabel: "flex items-center gap-2.5 text-lg text-ink",
  toggle: {
    track:
      "group inline-flex h-[22px] w-11 shrink-0 items-center border-[1.5px] border-control bg-bg transition aria-checked:bg-accent hover-state:brightness-95 disabled:cursor-not-allowed disabled:opacity-40",
    thumb: "ml-[3px] size-3.5 bg-control transition group-aria-checked:translate-x-[22px] group-aria-checked:bg-bg",
  },
  tabs: {
    list: "flex gap-5 border-b border-line",
    tab: "-mb-px border-b-2 border-transparent pb-2 font-label text-sm font-bold text-muted hover-state:text-ink aria-selected:border-accent aria-selected:text-ink",
    panel: "pt-4 text-lg",
  },
  chipGroup: "flex flex-wrap gap-2",
  chip: "border border-ink bg-bg px-2.5 py-1 font-label text-[11px] font-bold uppercase tracking-[0.12em] text-ink hover-state:not-aria-pressed:bg-surface pressed-state:translate-y-px aria-pressed:bg-ink aria-pressed:text-bg disabled:cursor-not-allowed disabled:opacity-40",
  card: {
    root: "border-y border-ink",
    band: "hidden",
    body: "grid gap-1 py-4",
    eyebrow: `${LABEL} text-accent`,
    title: "font-display text-3xl font-semibold",
    meta: "italic text-muted",
  },
  rows: {
    list: "border-t border-ink",
    item: "border-b border-line",
    row: "flex w-full items-baseline justify-between gap-3 py-3 text-left text-lg hover-state:bg-surface",
    name: "",
    sets: "whitespace-nowrap font-label text-sm font-bold",
  },
  badge: {
    base: "inline-flex items-center border px-2 py-0.5 font-label text-[10px] font-bold uppercase tracking-[0.14em]",
    tones: {
      today: "border-accent text-accent",
      done: "border-ink bg-ink text-bg",
      upper: "border-ink text-ink",
      legs: "border-ink text-ink",
      cardio: "border-ink text-ink",
      rest: "border-line text-muted",
    },
  },
  dialog: {
    root: "m-auto w-[min(30rem,calc(100vw-2rem))] border-t-4 border-ink bg-bg p-6 text-ink backdrop:bg-ink/50",
    preview: "border-y border-ink py-4",
    title: "font-display text-3xl font-semibold",
    close: "grid size-9 shrink-0 place-items-center font-label text-2xl leading-none hover-state:bg-surface",
    facts: LABEL,
    cues: "list-decimal space-y-2 pl-5 text-lg marker:font-label marker:font-bold marker:text-accent",
  },
  timer: {
    root: "grid justify-items-center gap-3 border-y-4 border-ink py-6",
    label: `${LABEL} text-muted`,
    digits: "font-numbers text-6xl font-bold tabular-nums",
  },
  progress: { track: "h-1.5 bg-line", fill: "h-full bg-accent transition-[width]" },
  tracker: { root: "grid gap-3", title: "font-display text-2xl font-semibold", count: `${LABEL} text-muted` },
  uiState: {
    root: "grid justify-items-center gap-2 border-t border-ink pt-4 text-center",
    icon: "size-7 text-ink",
    text: "font-display text-lg italic",
  },
  typeRoles: [
    {
      role: "Display",
      sample: "Back and biceps",
      className: "font-display text-5xl font-semibold leading-[0.95] tracking-tight",
      spec: "Newsreader 600 · 48 px",
    },
    { role: "Heading", sample: "Day 3: Shoulders and triceps", className: "font-display text-2xl italic", spec: "Newsreader italic · 24 px" },
    {
      role: "Body",
      sample: "Three sets of ten for every exercise, with ninety seconds of rest between sets.",
      className: "max-w-prose text-lg leading-relaxed",
      spec: "Newsreader 400 · 18 px / 1.6",
    },
    { role: "Label", sample: "Rest between sets", className: LABEL, spec: "Libre Franklin 700 · 11 px, uppercase" },
    { role: "Numbers", sample: "3 × 10", className: "font-numbers text-4xl font-bold text-accent", spec: "Libre Franklin 700 · 36 px" },
  ],
  shape: {
    corners: [{ label: "Square · everything", className: "rounded-none" }],
    border: "border-b-[1.5px] border-ink",
    borderLabel: "1 px hairlines; fields are a 1.5 px underline",
    shadow: "",
    shadowLabel: "No shadows",
  },
  textPairs: [
    ["paper", "red"],
    ["ink", "paper"],
    ["paper", "ink"],
    ["ink", "newsprint"],
    ["graphite", "paper"],
    ["red", "paper"],
  ],
};
```

- [ ] **Step 3: Replace the Editorial placeholder**

Replace `app/design-systems/editorial/page.tsx` with:

```tsx
import type { Metadata } from "next";
import DesignSystemPage from "@/app/design-system/DesignSystemPage";
import { EDITORIAL_RECIPE } from "@/app/design-system/recipes/editorial";
import { EDITORIAL_FONTS } from "@/app/fonts/editorial";
import { getMood } from "@/app/moods";

export const metadata: Metadata = { title: "Editorial design system" };

export default function EditorialDesignSystem() {
  return <DesignSystemPage mood={getMood("editorial")} recipe={EDITORIAL_RECIPE} fontClass={EDITORIAL_FONTS} />;
}
```

- [ ] **Step 4: Run the tests to make sure Editorial passes**

Run: `rm -rf out && npx next build && node --test --test-skip-pattern="Plate Room design system|Plate Room: every text pair its recipe|/design-systems/plate-room/" 'tests/*.test.mjs'`, then `npm run lint`.
Expected: every test that runs PASSES; lint prints nothing.

- [ ] **Step 5: Check Editorial in the browser**

Open `http://localhost:4173/design-systems/editorial/` and run the Task 3 Step 6 script (the two-width `check`).
Expected: `[{ width: 1440, overflow: 0, clipped: [] }, { width: 390, overflow: 0, clipped: [] }]`.

Then repeat the six keyboard and interaction checks from Task 3 Step 7. Here the focus ring is ink, and hovering Skip inverts it to ink with paper text. Take screenshots at both widths. The page should read as Editorial: square, hairline rules, underlined fields, Newsreader, and red only on the primary action, the selected tab and progress.

- [ ] **Step 6: Commit**

```bash
git add app/design-system/recipes/editorial.ts app/design-systems/editorial/page.tsx
git commit -F - <<'EOF'
Build the Editorial design system

Editorial's recipe on the shared library: square corners, ink
hairlines, fields drawn as underlines, uppercase Libre Franklin labels,
and red kept for the primary action, the selected tab and progress.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

- [ ] **Step 7: CHECKPOINT: Nikita reviews Editorial**

Same loop as Task 3 Step 9, at `http://localhost:4173/design-systems/editorial/`. Commit each round as `Editorial design system: <change>`. Do not start Task 5 until Nikita says Editorial is done.

---

### Task 5: The Plate Room design system

**Files:**
- Create: `app/design-system/recipes/plate-room.ts`
- Modify: `app/design-systems/plate-room/page.tsx` (replace the placeholder)

**Interfaces:**
- Consumes: `Recipe`; `DesignSystemPage`; `PLATE_ROOM_FONTS` from `app/fonts/plate-room.ts`.
- Produces: `PLATE_ROOM_RECIPE: Recipe`.

- [ ] **Step 1: Confirm the Plate Room tests fail**

Run: `rm -rf out && npx next build && node --test --test-name-pattern="Plate Room|/design-systems/plate-room/" 'tests/*.test.mjs'`
Expected: the Plate Room design-system suite FAILS. The recipe-pairs test FAILS ("no recipe for Plate Room yet"). The font test FAILS.

- [ ] **Step 2: Write the Plate Room recipe**

Create `app/design-system/recipes/plate-room.ts`:

```ts
import type { Recipe } from "../recipe";

const LABEL = "font-label text-xs font-bold uppercase tracking-[0.14em]";
const SHADOW = "shadow-[2px_2px_0_var(--color-ink)]";

// Square, 2 px ink outlines, a thin 2 px shadow on buttons and cards; yellow only for the primary action and on states.
export const PLATE_ROOM_RECIPE: Recipe = {
  focus: "focus-state:outline-3 focus-state:outline-offset-2 focus-state:outline-focus",
  label: `${LABEL} text-muted`,
  hint: "text-sm text-muted",
  pageTitle: "font-display text-6xl font-black uppercase leading-none sm:text-7xl",
  sectionTitle: "font-display text-4xl font-black uppercase leading-none",
  sectionNumber: "grid size-9 shrink-0 place-items-center border-2 border-ink bg-accent font-numbers text-xl text-on-accent",
  panel: "border-2 border-ink bg-surface p-5",
  swatch: "h-20 border-2 border-ink",
  button: {
    base: `inline-flex items-center justify-center gap-2 border-2 border-ink px-5 py-2 font-display text-xl font-extrabold uppercase ${SHADOW} transition pressed-state:translate-x-0.5 pressed-state:translate-y-0.5 pressed-state:shadow-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40`,
    primary: "bg-accent text-on-accent hover-state:brightness-95",
    secondary: "bg-(--swatch-panel) text-ink hover-state:bg-bg",
  },
  link: "font-label text-sm font-bold uppercase tracking-[0.06em] text-ink underline decoration-2 underline-offset-4 hover-state:decoration-[3px]",
  field:
    "w-full border-2 border-control bg-(--swatch-panel) px-3 py-2 text-ink placeholder:text-muted hover-state:bg-bg disabled:cursor-not-allowed disabled:opacity-40",
  fieldLabel: LABEL,
  checkbox:
    "size-[22px] appearance-none border-2 border-control bg-(--swatch-panel) checked:bg-accent hover-state:not-checked:bg-bg disabled:cursor-not-allowed disabled:opacity-40",
  checkmark: "text-ink",
  radio:
    "size-[22px] shrink-0 appearance-none rounded-full border-2 border-control bg-(--swatch-panel) checked:border-[7px] hover-state:not-checked:bg-bg disabled:opacity-40",
  choiceLabel: "flex items-center gap-2.5 font-bold text-ink",
  toggle: {
    track:
      "group inline-flex h-[26px] w-12 shrink-0 items-center border-2 border-control bg-(--swatch-panel) transition aria-checked:bg-accent hover-state:brightness-95 disabled:cursor-not-allowed disabled:opacity-40",
    thumb: "ml-[3px] size-4 bg-ink transition group-aria-checked:translate-x-[22px]",
  },
  tabs: {
    list: "inline-flex border-2 border-ink",
    tab: "border-l-2 border-ink bg-(--swatch-panel) px-4 py-1.5 font-display text-lg font-extrabold uppercase text-ink first:border-l-0 hover-state:not-aria-selected:bg-bg aria-selected:bg-ink aria-selected:text-(--swatch-panel)",
    panel: "pt-4 font-bold",
  },
  chipGroup: "flex flex-wrap gap-2",
  chip: "border-2 border-ink bg-(--swatch-panel) px-2.5 py-1 font-label text-xs font-bold uppercase tracking-[0.1em] text-ink hover-state:not-aria-pressed:bg-bg pressed-state:translate-y-0.5 aria-pressed:bg-ink aria-pressed:text-(--swatch-panel) disabled:cursor-not-allowed disabled:opacity-40",
  card: {
    root: `border-2 border-ink bg-surface ${SHADOW}`,
    band: "h-2 bg-[repeating-linear-gradient(-45deg,var(--swatch-safety)_0_8px,var(--swatch-ink)_8px_16px)]",
    body: "grid gap-1 p-4",
    eyebrow: `${LABEL} text-muted`,
    title: "font-display text-3xl font-black uppercase leading-none",
    meta: "font-numbers text-2xl font-extrabold",
  },
  rows: {
    list: "border-2 border-ink bg-surface",
    item: "border-b-2 border-ink last:border-b-0",
    row: "flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left font-bold hover-state:bg-bg",
    name: "",
    sets: "whitespace-nowrap font-numbers text-xl font-extrabold",
  },
  badge: {
    base: "inline-flex items-center border-2 border-ink px-2 py-0.5 font-label text-[11px] font-bold uppercase tracking-[0.1em]",
    tones: {
      today: "bg-accent text-on-accent",
      done: "bg-ink text-(--swatch-panel)",
      upper: "bg-(--swatch-blue) text-(--swatch-panel)",
      legs: "bg-(--swatch-red) text-(--swatch-panel)",
      cardio: "bg-(--swatch-green) text-(--swatch-panel)",
      rest: "bg-(--swatch-panel) text-ink",
    },
  },
  dialog: {
    root: `m-auto w-[min(30rem,calc(100vw-2rem))] border-2 border-ink bg-surface p-6 text-ink ${SHADOW} backdrop:bg-ink/50`,
    preview: "border-2 border-ink bg-bg p-4",
    title: "font-display text-3xl font-black uppercase leading-none",
    close: "grid size-9 shrink-0 place-items-center border-2 border-ink font-display text-2xl leading-none hover-state:bg-bg",
    facts: "font-numbers text-2xl font-extrabold",
    cues: "list-decimal space-y-2 pl-5 font-bold",
  },
  timer: {
    root: "grid justify-items-center gap-3 border-2 border-ink bg-surface p-6",
    label: `${LABEL} text-muted`,
    digits: "font-numbers text-7xl font-extrabold",
  },
  progress: { track: "h-3 border-2 border-ink bg-(--swatch-panel)", fill: "h-full bg-accent transition-[width]" },
  tracker: { root: "grid gap-3", title: "font-display text-2xl font-extrabold uppercase", count: `${LABEL} text-muted` },
  uiState: {
    root: "grid justify-items-center gap-2 border-2 border-ink bg-surface p-5 text-center",
    icon: "size-8 text-ink",
    text: "font-bold",
  },
  typeRoles: [
    { role: "Display", sample: "Leg day", className: "font-display text-6xl font-black uppercase leading-none", spec: "Big Shoulders 900 · 60 px, uppercase" },
    { role: "Heading", sample: "Shoulders + triceps", className: "font-display text-3xl font-extrabold uppercase", spec: "Big Shoulders 800 · 30 px, uppercase" },
    {
      role: "Body",
      sample: "Three sets of ten. Rest 90 seconds between sets.",
      className: "max-w-prose text-base leading-relaxed",
      spec: "Archivo 400 · 16 px / 1.6",
    },
    { role: "Label", sample: "Rest between sets", className: LABEL, spec: "Archivo 700 · 12 px, uppercase" },
    { role: "Numbers", sample: "3 × 10", className: "font-numbers text-6xl font-extrabold", spec: "Big Shoulders Stencil 800 · 60 px" },
  ],
  shape: {
    corners: [{ label: "Square · everything", className: "rounded-none" }],
    border: "border-2 border-ink",
    borderLabel: "2 px ink outlines",
    shadow: SHADOW,
    shadowLabel: "2 px offset shadow · buttons and cards",
  },
  textPairs: [
    ["ink", "safety"],
    ["ink", "panel"],
    ["panel", "ink"],
    ["ink", "concrete"],
    ["muted", "panel"],
    ["muted", "concrete"],
    ["panel", "blue"],
    ["panel", "red"],
    ["panel", "green"],
  ],
};
```

- [ ] **Step 3: Replace the Plate Room placeholder**

Replace `app/design-systems/plate-room/page.tsx` with:

```tsx
import type { Metadata } from "next";
import DesignSystemPage from "@/app/design-system/DesignSystemPage";
import { PLATE_ROOM_RECIPE } from "@/app/design-system/recipes/plate-room";
import { PLATE_ROOM_FONTS } from "@/app/fonts/plate-room";
import { getMood } from "@/app/moods";

export const metadata: Metadata = { title: "Plate Room design system" };

export default function PlateRoomDesignSystem() {
  return <DesignSystemPage mood={getMood("plate-room")} recipe={PLATE_ROOM_RECIPE} fontClass={PLATE_ROOM_FONTS} />;
}
```

- [ ] **Step 4: Run the full suite to make sure everything passes**

Run: `npm test`, then `npm run lint`.
Expected: every test passes, including all three design-system suites; lint prints nothing.

- [ ] **Step 5: Check Plate Room in the browser**

Open `http://localhost:4173/design-systems/plate-room/` and run the Task 3 Step 6 script.
Expected: `[{ width: 1440, overflow: 0, clipped: [] }, { width: 390, overflow: 0, clipped: [] }]`.

Then repeat the six checks from Task 3 Step 7. Here the focus ring is a 3 px ink outline, hovering Skip turns it concrete, and pressing a button sinks it into its shadow. Take screenshots at both widths. The page should read as Plate Room: 2 px outlines, the thin shadow, uppercase Big Shoulders, the stencil timer, and yellow only on primary and on states.

- [ ] **Step 6: Commit**

```bash
git add app/design-system/recipes/plate-room.ts app/design-systems/plate-room/page.tsx
git commit -F - <<'EOF'
Build the Plate Room design system

Plate Room's recipe on the shared library: square 2 px ink outlines,
the thin 2 px shadow Nikita picked, uppercase Big Shoulders, a stencil
rest timer, plate-colored day badges, and safety yellow kept for the
primary action and on states.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

- [ ] **Step 7: CHECKPOINT: Nikita reviews Plate Room**

Same loop as Task 3 Step 9, at `http://localhost:4173/design-systems/plate-room/`. Commit each round as `Plate Room design system: <change>`.

---

### Task 6: Final pass across the design systems

**Files:**
- Modify: only what this pass finds broken; `README.md` (layout table).

**Interfaces:**
- Consumes: everything above.
- Produces: a clean `npm test` and lint, and screenshots of all three systems at both widths.

- [ ] **Step 1: Update the README**

In `README.md`'s layout table, replace the `/design-systems/<mood>/` row with:

```markdown
| `/design-systems/<mood>/` | `app/design-systems/<mood>/page.tsx` | Design system *mood*: the shared library in `app/design-system/` styled by `app/design-system/recipes/<mood>.ts` |
```

- [ ] **Step 2: Run every check**

Run: `npm test`, then `npm run lint`.
Expected: all tests pass; lint prints nothing.

- [ ] **Step 3: Compare the three systems side by side**

Take a 1440 px screenshot of section 4 (components) on each page. Check against spec §3.1 that the three read as clearly different: pills and peach, print hairlines and underlines, outlines and a thin shadow. If two look alike, raise it with Nikita rather than changing a recipe on your own.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -F - <<'EOF'
Document the design-system library in the README

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

Then report to Nikita: the test output, the screenshots, and anything left for the final-site spec.
