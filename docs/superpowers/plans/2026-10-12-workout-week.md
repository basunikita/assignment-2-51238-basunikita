# Workout Week Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Nikita's week of workouts at `/workout-week/` in the Plate Room style. It shows one day at a time with a seven-day strip, exercise panels with form cues, set check-off and a rest timer, cardio option cards, and Finish workout as the one primary action.

**Architecture:** The page reuses the design-system library in `app/design-system/` under `PLATE_ROOM_RECIPE`, the same way `DesignSystemPage` does.
- **Library extensions:** a few small props on Tabs, ExerciseList, DetailPanel, SetTracker and RestTimer. The design-system pages render as before.
- **Site components:** `app/workout-week/_components/`. A client component, `WorkoutWeek`, holds the page state: ticked sets per exercise, the rest choice per day, finished days and the open panel. Nothing is saved.
- **Pure helpers:** in `app/design-system/progress.ts` (set ticking) and `app/workout-week/week.ts` (summary lines), with node tests.

**Tech Stack:** Next.js 16.3.8 (App Router, `output: "export"`), React 19 client components (prerendered), Tailwind CSS 4.3, native `<dialog>`, Node 24 `node:test`, Claude in Chrome for browser checks.

**Spec:** `docs/superpowers/specs/2026-10-12-workout-week-design.md`

## Global Constraints

- Work on a `workout-week` branch cut from `main`.
- Static export only. No database, accounts, APIs or storage; nothing persists across reloads.
- No new npm packages.
- Run npm with `npm_config_registry=https://imc-npm-proxy.trading.imc.intra/repository/npm-proxy/` and `NODE_OPTIONS=--use-system-ca` set for that one command, if npm needs the network at all. Never write `~/.npmrc`.
- In the sandbox, `next build` needs the hosts `fonts.googleapis.com` and `fonts.gstatic.com`.
- The site uses the Plate Room recipe, fonts and palette only. Colors come from role tokens or `--swatch-*` variables, never hex or Tailwind default palette classes.
- Yellow (accent) appears only on Finish workout, a checked checkbox's fill, and the progress fill. No yellow section numbers, hazard bands or spacing bars on this page.
- Text reaches 4.5:1; control outlines and focus rings reach 3:1.
- The page works at 390 px and 1440 px with no horizontal page scroll. Every control works by keyboard.
- `/workout-week/` loads only Plate Room's fonts.
- The design-system pages keep looking and behaving as they do now; `tests/design-systems.test.mjs` keeps passing.
- Node's tests import `.ts` files directly, without a bundler: a module they load may import other modules only with `import type`.
- Commits are authored `Nikita Basu <nbasu@uchicago.edu>` (the repo's local config) and end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Never push.
- Nikita reviews the page in the browser and approves it before the final review.

### Where this plan differs from the spec

- **Tab labels show from `lg` (1024 px), not `sm`.**
  - "SHOULDERS/TRIS" needs about 110 px with the tab's padding.
  - A seventh of the strip is about 82 px at 640 px and 100 px at 768 px. At 1024 px it's about 128 px.
  - Below `lg`, the strip shows only the numbers.
- **The set-ticking helpers live in the library.**
  - `isExerciseDone` becomes `allDone` in `app/design-system/progress.ts`, alongside `noSetsDone` and `toggleSet`.
  - The reason: the design-system page's set-tracker sample also needs `toggleSet`, and the library mustn't import from the site.
  - `week.ts` takes sets, reps and options as parameters, because Node's tests can't follow value imports between `.ts` files.
- **SetTracker gets an optional `title`,** so the panel shows "Sets" instead of repeating the exercise name.
- **Tabs gets `tabClassName` as well as `listClassName`,** so each tab can take `flex-1`.
- **Finish workout's success message takes keyboard focus.** The spec is silent on this. The button disappears when pressed, and without this a keyboard user's focus would fall back to the top of the page.
- **The Checkbox `className` fix has no automated test.**
  - Nothing in the site or the design systems passes a `className` to Checkbox.
  - The test setup can't render components: there's no DOM renderer, and adding one would mean a new package.
  - The typecheck covers the signature.

## Review Focus

1. **Finish workout's focus.** Pressing Finish workout by keyboard removes the focused button. Focus must move to the "Workout logged" message, not jump to the top of the page. The Task 3 browser check presses it with Enter and reads `document.activeElement`.
2. **Ticks survive.** Ticked sets must survive closing the panel and switching days. The Task 3 browser check:
   1. Tick two sets, then press Esc.
   2. Switch to Day 3 and back.
   3. Reopen the panel. It must show "2 of 3 done".
3. **Rest choice per day.**
   - Choosing 2 min on Day 3 sets Day 3's panel facts to "Rest 2 min" and its timer to 2:00.
   - Day 1 stays at 90 s.
   - The Task 3 browser check covers this.
4. **The day strip at 390, 640, 768, 1024 and 1440 px.** The seven tabs fit with no clipping and no page overflow, and labels appear from 1024 px. The Task 3 width script measures every day at those five widths.
5. **A long exercise name on a phone.** "Shoulder superset: O movements and serving platters" must wrap without pushing its DONE badge or "3 × 10" out of the row. The Task 3 browser check ticks its three sets at 390 px and measures the row.

---

### Task 1: Set-ticking helpers and the review fixes the site needs

**Files:**
- Modify: `app/design-system/progress.ts`
- Modify: `app/design-system/recipes/sunrise.ts`, `editorial.ts`, `plate-room.ts` (transitions)
- Modify: `app/globals.css` (`@source not`)
- Modify: `app/design-system/components/Checkbox.tsx` (`className`)
- Test: `tests/logic.test.mjs`, `tests/design-systems.test.mjs`

**Interfaces:**
- Consumes: nothing new.
- Produces:
  - from `progress.ts`: `noSetsDone(sets: number): boolean[]`, `toggleSet(done: boolean[], index: number): boolean[]`, `allDone(done: boolean[]): boolean`
  - `Checkbox` passes its `className` to its label wrapper

- [ ] **Step 1: Write the failing helper tests**

In `tests/logic.test.mjs`, change the progress import to:

```js
import { allDone, noSetsDone, progressLabel, progressPercent, toggleSet } from "../app/design-system/progress.ts";
```

and add at the end of the file:

```js
test("no sets are done at the start", () => {
  assert.deepEqual(noSetsDone(3), [false, false, false]);
});

test("toggling a set flips only that set", () => {
  assert.deepEqual(toggleSet([true, false, false], 1), [true, true, false]);
  assert.deepEqual(toggleSet([true, true, false], 0), [false, true, false]);
});

test("an exercise is done only when every set is", () => {
  assert.equal(allDone([true, true, true]), true);
  assert.equal(allDone([true, true, false]), false);
  assert.equal(allDone([]), false);
});
```

- [ ] **Step 2: Run them to make sure they fail**

Run: `node --test tests/logic.test.mjs`
Expected: FAIL with `SyntaxError: The requested module '../app/design-system/progress.ts' does not provide an export named 'allDone'`.

- [ ] **Step 3: Write the helpers**

Append to `app/design-system/progress.ts`:

```ts
export function noSetsDone(sets: number): boolean[] {
  return Array.from({ length: sets }, () => false);
}

export function toggleSet(done: boolean[], index: number): boolean[] {
  return done.map((isDone, i) => (i === index ? !isDone : isDone));
}

export function allDone(done: boolean[]): boolean {
  return done.length > 0 && done.every(Boolean);
}
```

- [ ] **Step 4: Run them to make sure they pass**

Run: `node --test tests/logic.test.mjs`
Expected: PASS, 15 tests.

- [ ] **Step 5: Write the failing transition and docs-scan tests**

In `tests/design-systems.test.mjs`, add this function after the `UI_STATES` constant:

```js
function compiledCss() {
  const dir = `${OUT}/_next/static/chunks`;
  return readdirSync(dir)
    .filter((file) => file.endsWith(".css"))
    .map((file) => readFileSync(`${dir}/${file}`, "utf8"))
    .join("\n");
}
```

In the `hover styles apply only on devices that can hover` test, replace its first six lines (from `const dir =` through `.join("\n");`) with:

```js
  const css = compiledCss();
```

Add these two tests before `test("recipes use only palette colors"`:

```js
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
```

- [ ] **Step 6: Run them to make sure they fail**

If `out/` doesn't exist, run `npx next build` first. Then run:

`node --test --test-name-pattern="bare transition|only appear in docs|devices that can hover" tests/design-systems.test.mjs`

Expected:
- `recipes never use the bare transition utility` FAILS on the first recipe file it reads (`editorial.ts`).
- `the CSS doesn't ship classes that only appear in docs/` FAILS: the docs-only class is in the CSS.
- `hover styles apply only on devices that can hover` still PASSES after the refactor.

- [ ] **Step 7: Narrow the transitions and stop scanning docs**

Run:

```bash
sed -i '' -E 's/(["` ])transition([ "`])/\1transition-[color,background-color,border-color,box-shadow,translate,scale,filter]\2/g' app/design-system/recipes/sunrise.ts app/design-system/recipes/editorial.ts app/design-system/recipes/plate-room.ts
grep -o 'transition-\[color,background-color,border-color,box-shadow,translate,scale,filter\]' app/design-system/recipes/*.ts | sort | uniq -c
```

Expected: `4` for `sunrise.ts`, `3` for `editorial.ts` and `3` for `plate-room.ts`:
- Sunrise: button base, toggle track, toggle thumb, chip.
- Editorial and Plate Room: button base, toggle track, toggle thumb.

In `app/globals.css`, insert after `@import "tailwindcss";`:

```css
@source not "../docs";
```

- [ ] **Step 8: Fix Checkbox's className**

In `app/design-system/components/Checkbox.tsx`, change the function signature and the label line:

```tsx
export default function Checkbox({ id, label, state, className = "", ...props }: CheckboxProps) {
```

```tsx
    <label htmlFor={id} className={`${recipe.choiceLabel} ${className}`}>
```

- [ ] **Step 9: Run every check**

Run: `npm test` (sandbox: allow `fonts.googleapis.com`, `fonts.gstatic.com`), then `npm run lint`, then:

```bash
grep -o 'transition-property:color,background-color,border-color,box-shadow,translate,scale,filter' out/_next/static/chunks/*.css | head -1
```

Expected:
- All tests pass, including the two new ones.
- Lint prints nothing.
- The grep prints one match: the arbitrary transition compiled.

- [ ] **Step 10: Commit**

```bash
git add app/design-system/progress.ts app/design-system/recipes app/globals.css app/design-system/components/Checkbox.tsx tests/logic.test.mjs tests/design-systems.test.mjs
git commit -F - <<'EOF'
Add set-ticking helpers and fix three review findings

noSetsDone, toggleSet and allDone let a page hold ticked sets outside
the set tracker. Recipes now transition only the properties that
animate, so focus rings no longer fade in from the text color;
Tailwind stops scanning docs/, so classes quoted in specs don't ship;
and Checkbox keeps its recipe classes when given a className.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 2: Day labels, form cues and the summary helpers

**Files:**
- Modify: `app/design-system/content.ts`
- Create: `app/workout-week/week.ts`
- Test: `tests/week.test.mjs`

**Interfaces:**
- Consumes: `WorkoutDay`, `WEEK`, `SETS`, `REPS`, `REST_OPTIONS`, `FORM_CUES` from `content.ts`.
- Produces:
  - `WorkoutDay.short: string`
  - `FORM_CUES` entries for every exercise in `WEEK`
  - from `week.ts`: `weekSummary(week: WorkoutDay[], sets: number, reps: number): string`, `daySummary(day: WorkoutDay, sets: number, reps: number): string`, `restLabel(options: { value: string; label: string }[], value: string): string`

- [ ] **Step 1: Write the failing tests**

Create `tests/week.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";
import { FORM_CUES, REPS, REST_OPTIONS, SETS, WEEK } from "../app/design-system/content.ts";
import { daySummary, restLabel, weekSummary } from "../app/workout-week/week.ts";

test("the week summary counts Nikita's days", () => {
  assert.equal(weekSummary(WEEK, SETS, REPS), "3 strength days, 3 cardio, 1 rest · 3 × 10 every lift");
});

test("the week summary says day, not days, for one strength day", () => {
  assert.equal(weekSummary([WEEK[0], WEEK[6]], SETS, REPS), "1 strength day, 0 cardio, 1 rest · 3 × 10 every lift");
});

test("a strength day's summary counts its exercises", () => {
  assert.equal(daySummary(WEEK[0], SETS, REPS), "7 exercises · 3 × 10");
  assert.equal(daySummary(WEEK[4], SETS, REPS), "5 exercises · 3 × 10");
});

test("rest labels come from the options", () => {
  assert.equal(restLabel(REST_OPTIONS, "120"), "2 min");
  assert.equal(restLabel(REST_OPTIONS, "60"), "60 s");
});

test("every day has Nikita's tab label", () => {
  assert.deepEqual(
    WEEK.map((day) => day.short),
    ["BACK/BIS", "CARDIO", "SHOULDERS/TRIS", "CARDIO", "LEGS", "CARDIO", "REST"],
  );
});

test("every exercise in the week has form cues", () => {
  for (const day of WEEK) {
    for (const exercise of day.exercises) assert.ok(FORM_CUES[exercise]?.length > 0, `${exercise} has no cues`);
  }
});
```

- [ ] **Step 2: Run them to make sure they fail**

Run: `node --test tests/week.test.mjs`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `app/workout-week/week.ts`.

- [ ] **Step 3: Write the helpers**

Create `app/workout-week/week.ts`:

```ts
import type { WorkoutDay } from "../design-system/content";

type Option = { value: string; label: string };

function plural(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

// e.g. "3 strength days, 3 cardio, 1 rest · 3 × 10 every lift"
export function weekSummary(week: WorkoutDay[], sets: number, reps: number): string {
  const count = (kind: WorkoutDay["kind"]) => week.filter((day) => day.kind === kind).length;
  return `${plural(count("Strength"), "strength day")}, ${count("Cardio")} cardio, ${count("Rest")} rest · ${sets} × ${reps} every lift`;
}

// e.g. "7 exercises · 3 × 10"
export function daySummary(day: WorkoutDay, sets: number, reps: number): string {
  return `${plural(day.exercises.length, "exercise")} · ${sets} × ${reps}`;
}

export function restLabel(options: Option[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? value;
}
```

- [ ] **Step 4: Run them to see which still fail**

Run: `node --test tests/week.test.mjs`
Expected:
- The four summary and label tests PASS.
- `every day has Nikita's tab label` FAILS (`short` is undefined).
- `every exercise in the week has form cues` FAILS ("Lat pulldowns has no cues").

- [ ] **Step 5: Add the labels and the cues**

In `app/design-system/content.ts`, add the field to `WorkoutDay`, after `name: string;`:

```ts
  // The day strip's label.
  short: string;
```

Add a `short` after each day's `name` in `WEEK`:

| Day | `short` |
|---|---|
| 1 | `"BACK/BIS"` |
| 2 | `"CARDIO"` |
| 3 | `"SHOULDERS/TRIS"` |
| 4 | `"CARDIO"` |
| 5 | `"LEGS"` |
| 6 | `"CARDIO"` |
| 7 | `"REST"` |

For example: `{ day: 2, name: "Cardio", short: "CARDIO", kind: "Cardio", tone: "cardio", exercises: [] },`.

Replace the comment above `FORM_CUES` and the opening of the object with the following. Keep the five existing Day 5 entries, from `"Hip thrusts"` to `"Glute hyperextensions"`, after these new ones:

```ts
// Form cues for every strength exercise. Nikita wrote them for African bicep curls, the shoulder
// superset, archer pull, tricep cross extension and tricep press; Bulgarian split squats' come
// from the design-system spec.
export const FORM_CUES: Record<string, string[]> = {
  "Lat pulldowns": [
    "Grip the bar a little wider than your shoulders, thighs under the pad.",
    "Pull the bar to your upper chest, leading with your elbows.",
    "Let it rise slowly until your arms are straight.",
  ],
  "Face pulls": [
    "Set the rope at face height and step back until your arms are straight.",
    "Pull the rope toward your face, hands ending beside your ears.",
    "Squeeze your shoulder blades, then return slowly.",
  ],
  "Single-arm dumbbell rows": [
    "One hand and knee on the bench, back flat.",
    "Pull the dumbbell toward your hip, elbow close to your side.",
    "Lower it until your arm is straight, without twisting.",
  ],
  "Lower back hyperextensions": [
    "Pad just below your hips, feet anchored.",
    "Lower with a flat back.",
    "Rise until your body is straight; don't arch past it.",
  ],
  "African bicep curls": [
    "Curl the weight up with a standard underhand grip, palms up.",
    "As you lower it, rotate your wrists into a neutral hammer grip, palms in.",
    "Or alternate hammer and standard curl paths, to work both the bicep and the forearm.",
  ],
  "Cable bicep curls": [
    "Stand tall, elbows at your sides.",
    "Curl the handle up without moving your elbows.",
    "Lower slowly until your arms are straight.",
  ],
  "Barbell curls": [
    "Hands shoulder-width apart, elbows at your sides.",
    "Curl the bar to your shoulders without swinging.",
    "Lower it slowly all the way down.",
  ],
  "Cable lateral raise": [
    "Stand side-on to a low cable, handle in your far hand.",
    "Raise your arm out to the side to shoulder height, elbow soft.",
    "Lower slowly, without shrugging.",
  ],
  "Shoulder superset: O movements and serving platters": [
    "O movements: arms straight, move your hands from your thighs up above your head.",
    "Serving platters: arms straight in front of you, bring them back in toward your chest, then extend them straight out to your sides.",
  ],
  "Archer pull": [
    "Set the cable at shoulder height.",
    "Pull the attachment back like drawing a bow and arrow.",
    "Repeat on the other side.",
  ],
  "Front raise cable": [
    "Stand facing away from a low cable, handle in front of your thighs.",
    "Raise your straight arm in front of you to shoulder height.",
    "Lower slowly, keeping your body still.",
  ],
  "Overhead tricep extension cable": [
    "Face away from the cable, rope behind your head, elbows by your ears.",
    "Straighten your arms overhead without moving your elbows.",
    "Bend back slowly until you feel the stretch.",
  ],
  "Tricep cross extension": [
    "Set the cable at shoulder height.",
    "Pull the attachment diagonally across your body.",
    "Focus on your triceps as you pull.",
  ],
  "Tricep press": ["Use the tricep press machine."],
```

- [ ] **Step 6: Run them to make sure they pass, then typecheck**

Run: `node --test tests/week.test.mjs`, then `npx tsc --noEmit`.
Expected: PASS, 6 tests; tsc prints nothing.

- [ ] **Step 7: Commit**

```bash
git add app/design-system/content.ts app/workout-week/week.ts tests/week.test.mjs
git commit -F - <<'EOF'
Add day labels, every exercise's form cues and the week summaries

Nikita's tab labels (BACK/BIS, SHOULDERS/TRIS, …) and cues for every
Day 1 and Day 3 exercise: Nikita's own for the five less common ones,
drafts for the rest. week.ts builds the page's summary lines from the
routine rather than hardcoding them.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

---

### Task 3: The workout-week page

**Files:**
- Modify: `app/design-system/components/Tabs.tsx`, `ExerciseList.tsx`, `DetailPanel.tsx`, `SetTracker.tsx`, `RestTimer.tsx`
- Modify: `app/design-system/DesignSystemPage.tsx` (the set tracker sample's state)
- Modify: `app/workout-week/page.tsx` (replace the placeholder)
- Create: `app/workout-week/_components/WorkoutWeek.tsx`, `DayPanel.tsx`, `CardioCard.tsx`, `ExercisePanel.tsx`
- Modify: `tests/fonts.test.mjs`, `tests/design-systems.test.mjs`
- Test: `tests/workout-week.test.mjs`

**Interfaces:**
- Consumes:
  - from Task 1: `noSetsDone`, `toggleSet`, `allDone`
  - from Task 2: `weekSummary`, `daySummary`, `restLabel`, `WorkoutDay.short`, `FORM_CUES`
  - `PLATE_ROOM_RECIPE`, `PLATE_ROOM_FONTS`, `getMood`, `moodStyle`
- Produces:
  - `Tabs({ label, tabs, listClassName?, tabClassName? })`, where a tab's `label` is a `ReactNode`
  - `ExerciseList({ exercises, onOpen, isDone? })`
  - `DetailPanel({ exercise, restLabel, onClose, children? })`
  - `SetTracker({ exercise, done, onToggle, title? })`
  - `RestTimer({ seconds, buttonVariant? })`
  - the page at `/workout-week/`

- [ ] **Step 1: Write the failing page tests**

Create `tests/workout-week.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";
import { CARDIO_OPTIONS, REPS, SETS, UI_STATE_COPY, WEEK } from "../app/design-system/content.ts";
import { daySummary, weekSummary } from "../app/workout-week/week.ts";
import { readPage } from "./helpers.mjs";

// The page without the RSC payload, which repeats every string, or React's <!-- --> text separators.
function markup() {
  return readPage("/workout-week/")
    .replace(/<script\b[\s\S]*?<\/script>/g, "")
    .replace(/<!-- -->/g, "");
}

function text(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

// Each day's tabpanel, in order: the markup from one role="tabpanel" to the next.
function panels() {
  return markup().split('role="tabpanel"').slice(1);
}

test("has the page heading, the week summary and a link back to the hub", () => {
  const html = markup();
  assert.match(html, /<h1[^>]*>My week<\/h1>/);
  assert.ok(text(html).includes(weekSummary(WEEK, SETS, REPS)));
  assert.match(html, /<a[^>]*href="\/"[^>]*>← Hub<\/a>/);
});

test("has one tab per day, named for its day, with Day 1 selected", () => {
  const html = markup();
  assert.equal((html.match(/role="tablist"/g) ?? []).length, 1);
  const tabs = [...html.matchAll(/<button([^>]*role="tab"[^>]*)>([\s\S]*?)<\/button>/g)];
  assert.equal(tabs.length, 7);
  tabs.forEach(([, attributes, inner], index) => {
    const day = WEEK[index];
    assert.ok(text(inner).includes(`Day ${day.day}: ${day.name}`), `tab ${index + 1}: ${text(inner)}`);
    assert.ok(text(inner).includes(day.short), `tab ${index + 1} has no ${day.short}`);
    assert.match(attributes, new RegExp(`aria-selected="${index === 0}"`));
  });
});

test("each strength day lists its exercises in order, with a rest picker on 90 s", () => {
  const all = panels();
  assert.equal(all.length, 7);
  for (const day of WEEK.filter((each) => each.kind === "Strength")) {
    const panel = all[day.day - 1];
    const panelText = text(panel);
    assert.ok(panelText.includes(daySummary(day, SETS, REPS)), `Day ${day.day} summary`);
    const positions = day.exercises.map((exercise) => panelText.indexOf(exercise));
    assert.ok(positions.every((position) => position !== -1), `Day ${day.day} is missing an exercise`);
    assert.deepEqual([...positions].sort((a, b) => a - b), positions, `Day ${day.day} exercises out of order`);
    assert.match(panel, /<legend[^>]*>Rest between sets<\/legend>/);
    assert.match(panel, new RegExp(`<input[^>]*id="rest-day-${day.day}-90"[^>]*checked=""`));
  }
});

test("each cardio day shows the four options with their steps", () => {
  const all = panels();
  for (const day of WEEK.filter((each) => each.kind === "Cardio")) {
    const panelText = text(all[day.day - 1]);
    assert.ok(panelText.includes("Pick one"), `Day ${day.day}`);
    for (const option of CARDIO_OPTIONS) {
      assert.ok(panelText.includes(option.label), `Day ${day.day}: ${option.label}`);
      assert.ok(panelText.includes(option.detail), `Day ${day.day}: ${option.detail}`);
    }
  }
});

test("the rest day shows the empty state and no Finish workout", () => {
  const panel = panels()[6];
  assert.match(panel, /data-ui-state="empty"/);
  assert.ok(text(panel).includes(UI_STATE_COPY.empty));
  assert.ok(!panel.includes("Finish workout"));
});

test("Days 1 to 6 each end with one Finish workout button", () => {
  panels()
    .slice(0, 6)
    .forEach((panel, index) => {
      assert.equal((panel.match(/>Finish workout<\/button>/g) ?? []).length, 1, `Day ${index + 1}`);
    });
});

test("keeps the accent fill for Finish workout, with no hazard band", () => {
  const html = markup();
  const filled = [...html.matchAll(/<(\w+)\b[^>]*\bclass="([^"]*)"[^>]*>([^<]*)/g)].filter(([, , classes]) =>
    classes.split(/\s+/).includes("bg-accent"),
  );
  assert.equal(filled.length, 6);
  for (const [, tag, , inner] of filled) assert.deepEqual([tag, inner], ["button", "Finish workout"]);
  assert.ok(!html.includes("repeating-linear-gradient"), "hazard band on the page");
});

test("labels every input and names every button", () => {
  const html = markup();
  for (const field of html.match(/<input\b[^>]*>/g) ?? []) {
    const id = field.match(/\bid="([^"]+)"/)?.[1];
    assert.ok(id && html.includes(`for="${id}"`), `unlabelled field: ${field}`);
  }
  for (const [, attributes, inner] of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)) {
    assert.ok(text(inner) || /aria-label(?:ledby)?="/.test(attributes), `unnamed button: ${attributes}`);
  }
});

test("has the dialog for the exercise panel", () => {
  assert.match(markup(), /<dialog\b/);
});
```

In `tests/fonts.test.mjs`, replace `"/workout-week/": [],` with:

```js
  "/workout-week/": ["Archivo", "Big Shoulders", "Big Shoulders Stencil"],
```

In `tests/design-systems.test.mjs`, add inside the per-mood `describe`, after `shows the four UI states`. It guards the set tracker refactor and passes before and after:

```js
    test("starts the set tracker sample with two of three sets done", () => {
      assert.match(page(), /role="progressbar"[^>]*aria-valuenow="2"/);
    });
```

- [ ] **Step 2: Run them to make sure the page tests fail**

Run: `rm -rf out && npx next build && node --test tests/workout-week.test.mjs; node --test --test-name-pattern="/workout-week/|two of three" 'tests/*.test.mjs'`

Expected:
- Every `tests/workout-week.test.mjs` test FAILS: the placeholder has no tabs.
- The `/workout-week/` font test FAILS: it preloads none.
- `starts the set tracker sample with two of three sets done` PASSES for all three moods.

- [ ] **Step 3: Extend the library components**

Replace `app/design-system/components/Tabs.tsx`'s `Tab` type and `Tabs` signature, and add the two classes:

```tsx
type Tab = { id: string; label: ReactNode; content: ReactNode };

type TabsProps = {
  label: string;
  tabs: Tab[];
  // Added to the recipe's list and tab classes, e.g. to stretch the tabs across a strip.
  listClassName?: string;
  tabClassName?: string;
};

export default function Tabs({ label, tabs, listClassName = "", tabClassName = "" }: TabsProps) {
```

In the same file:
- Change the list's `className={recipe.tabs.list}` to `className={`${recipe.tabs.list} ${listClassName}`}`.
- Change the tab button's `className={`${recipe.tabs.tab} ${recipe.focus}`}` (inside `Tabs`, not `TabSample`) to `className={`${recipe.tabs.tab} ${tabClassName} ${recipe.focus}`}`.

Replace `app/design-system/components/ExerciseList.tsx` with:

```tsx
"use client";

import { REPS, SETS } from "../content";
import { useRecipe } from "../RecipeContext";
import Badge from "./Badge";

type ExerciseListProps = {
  exercises: string[];
  onOpen: (exercise: string) => void;
  isDone?: (exercise: string) => boolean;
};

export default function ExerciseList({ exercises, onOpen, isDone }: ExerciseListProps) {
  const recipe = useRecipe();
  return (
    <ul className={recipe.rows.list}>
      {exercises.map((exercise) => (
        <li key={exercise} className={recipe.rows.item}>
          <button type="button" onClick={() => onOpen(exercise)} className={`${recipe.rows.row} ${recipe.focus}`}>
            <span className={recipe.rows.name}>{exercise}</span>
            <span className="flex shrink-0 items-center gap-2">
              {isDone?.(exercise) && <Badge tone="done">Done</Badge>}
              <span className={recipe.rows.sets}>
                {SETS} × {REPS} <span aria-hidden="true">›</span>
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
```

In `app/design-system/components/DetailPanel.tsx`:
- Change the React import to `import { useEffect, useId, useRef, type ReactNode } from "react";`.
- Change the props type to `type DetailPanelProps = { exercise: string | null; restLabel: string; onClose: () => void; children?: ReactNode };`.
- Change the signature to `export default function DetailPanel({ exercise, restLabel, onClose, children }: DetailPanelProps) {`.
- Add `{children}` on the line after `<ExerciseFacts exercise={exercise} restLabel={restLabel} />`.

Replace `app/design-system/components/SetTracker.tsx` with:

```tsx
"use client";

import { useId } from "react";
import { REPS } from "../content";
import { progressLabel, progressPercent } from "../progress";
import { useRecipe } from "../RecipeContext";
import Checkbox from "./Checkbox";

type SetTrackerProps = {
  exercise: string;
  done: boolean[];
  onToggle: (index: number) => void;
  // Shown above the sets; defaults to the exercise name.
  title?: string;
};

export default function SetTracker({ exercise, done, onToggle, title = exercise }: SetTrackerProps) {
  const recipe = useRecipe();
  const baseId = useId();
  const count = done.filter(Boolean).length;

  return (
    <div className={recipe.tracker.root}>
      <p className={recipe.tracker.title}>{title}</p>
      <ul className="grid gap-2">
        {done.map((isDone, index) => (
          <li key={index}>
            <Checkbox
              id={`${baseId}-set-${index + 1}`}
              label={`Set ${index + 1} · ${REPS} reps`}
              checked={isDone}
              onChange={() => onToggle(index)}
            />
          </li>
        ))}
      </ul>
      <div
        role="progressbar"
        aria-label={`${exercise} sets done`}
        aria-valuemin={0}
        aria-valuemax={done.length}
        aria-valuenow={count}
        aria-valuetext={progressLabel(count, done.length)}
        className={recipe.progress.track}
      >
        <div className={recipe.progress.fill} style={{ width: `${progressPercent(count, done.length)}%` }} />
      </div>
      <p className={recipe.tracker.count}>{progressLabel(count, done.length)}</p>
    </div>
  );
}
```

In `app/design-system/components/RestTimer.tsx`, replace the two lines starting `// Remount (change the key)` and `export default function RestTimer` with:

```tsx
type RestTimerProps = {
  seconds: number;
  // The site keeps its one primary button for Finish workout, so its timer uses secondary.
  buttonVariant?: "primary" | "secondary";
};

// Remount (change the key) to use a new length; nothing persists across reloads.
export default function RestTimer({ seconds, buttonVariant = "primary" }: RestTimerProps) {
```

Then change `<Button onClick={startOrPause}>` to `<Button variant={buttonVariant} onClick={startOrPause}>`.

In `app/design-system/DesignSystemPage.tsx`:
- Add `import { toggleSet } from "./progress";` after the `./content` import.
- In `Components()`, add after `const [openExercise, …] = useState…;`:

```tsx
  // The sample starts with all but the last set done, so the progress bar has something to show.
  const [faceSets, setFaceSets] = useState([true, true, false]);
```

- Replace `<SetTracker exercise="Face pulls" sets={3} />` with:

```tsx
          <SetTracker exercise="Face pulls" done={faceSets} onToggle={(index) => setFaceSets((current) => toggleSet(current, index))} />
```

- [ ] **Step 4: Write the site components**

Create `app/workout-week/_components/CardioCard.tsx`:

```tsx
"use client";

import { useRecipe } from "@/app/design-system/RecipeContext";

// A cardio option in the recipe's card style, without the card's decorative band.
export default function CardioCard({ label, detail }: { label: string; detail: string }) {
  const recipe = useRecipe();
  return (
    <article className={`h-full ${recipe.card.root}`}>
      <div className={recipe.card.body}>
        <h3 className={recipe.card.title}>{label}</h3>
        <p>{detail}</p>
      </div>
    </article>
  );
}
```

Create `app/workout-week/_components/ExercisePanel.tsx`:

```tsx
"use client";

import DetailPanel from "@/app/design-system/components/DetailPanel";
import RestTimer from "@/app/design-system/components/RestTimer";
import SetTracker from "@/app/design-system/components/SetTracker";
import { REST_OPTIONS } from "@/app/design-system/content";
import { restLabel } from "../week";

type ExercisePanelProps = {
  exercise: string | null;
  restSeconds: string;
  done: boolean[];
  onToggle: (index: number) => void;
  onClose: () => void;
};

export default function ExercisePanel({ exercise, restSeconds, done, onToggle, onClose }: ExercisePanelProps) {
  return (
    <DetailPanel exercise={exercise} restLabel={restLabel(REST_OPTIONS, restSeconds)} onClose={onClose}>
      {exercise && (
        <div className="mt-6 grid gap-6">
          <SetTracker exercise={exercise} title="Sets" done={done} onToggle={onToggle} />
          <RestTimer key={`${exercise}-${restSeconds}`} seconds={Number(restSeconds)} buttonVariant="secondary" />
        </div>
      )}
    </DetailPanel>
  );
}
```

Create `app/workout-week/_components/DayPanel.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import Button from "@/app/design-system/components/Button";
import ExerciseList from "@/app/design-system/components/ExerciseList";
import RadioGroup from "@/app/design-system/components/RadioGroup";
import StatePanel from "@/app/design-system/components/StatePanel";
import { CARDIO_OPTIONS, REPS, REST_OPTIONS, SETS, UI_STATE_COPY, type WorkoutDay } from "@/app/design-system/content";
import { useRecipe } from "@/app/design-system/RecipeContext";
import { daySummary } from "../week";
import CardioCard from "./CardioCard";

type DayPanelProps = {
  day: WorkoutDay;
  rest: string;
  onRestChange: (value: string) => void;
  isDone: (exercise: string) => boolean;
  onOpen: (exercise: string) => void;
  finished: boolean;
  onFinish: () => void;
};

export default function DayPanel({ day, rest, onRestChange, isDone, onOpen, finished, onFinish }: DayPanelProps) {
  const recipe = useRecipe();
  const successRef = useRef<HTMLDivElement>(null);

  // Finish workout disappears when pressed, so keyboard focus moves to the message that replaces it.
  useEffect(() => {
    if (finished) successRef.current?.focus();
  }, [finished]);

  // The recipe's tab panel is bold; font-normal lets the day's own text set its weight.
  return (
    <div className="grid gap-6 font-normal">
      <div>
        <p className={recipe.label}>Day {day.day}</p>
        <h2 className={`mt-2 ${recipe.sectionTitle}`}>{day.name}</h2>
        {day.kind === "Strength" && <p className={`mt-2 ${recipe.card.meta}`}>{daySummary(day, SETS, REPS)}</p>}
        {day.kind === "Cardio" && <p className={`mt-2 ${recipe.hint}`}>Pick one</p>}
      </div>
      {day.kind === "Strength" && (
        <>
          <RadioGroup
            name={`rest-day-${day.day}`}
            legend="Rest between sets"
            options={REST_OPTIONS}
            value={rest}
            onChange={onRestChange}
          />
          <ExerciseList exercises={day.exercises} onOpen={onOpen} isDone={isDone} />
        </>
      )}
      {day.kind === "Cardio" && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {CARDIO_OPTIONS.map((option) => (
            <li key={option.value}>
              <CardioCard label={option.label} detail={option.detail} />
            </li>
          ))}
        </ul>
      )}
      {day.kind === "Rest" && <StatePanel kind="empty">{UI_STATE_COPY.empty}</StatePanel>}
      {day.kind !== "Rest" &&
        (finished ? (
          <div ref={successRef} tabIndex={-1} className={recipe.focus}>
            <StatePanel kind="success">{UI_STATE_COPY.success}</StatePanel>
          </div>
        ) : (
          <div>
            <Button onClick={onFinish}>Finish workout</Button>
          </div>
        ))}
    </div>
  );
}
```

Create `app/workout-week/_components/WorkoutWeek.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import Tabs from "@/app/design-system/components/Tabs";
import { REPS, SETS, WEEK, type WorkoutDay } from "@/app/design-system/content";
import { allDone, noSetsDone, toggleSet } from "@/app/design-system/progress";
import type { Recipe } from "@/app/design-system/recipe";
import { RecipeProvider } from "@/app/design-system/RecipeContext";
import { moodStyle, type Mood } from "@/app/moods";
import { weekSummary } from "../week";
import DayPanel from "./DayPanel";
import ExercisePanel from "./ExercisePanel";

const DEFAULT_REST = "90";

type OpenExercise = { day: number; exercise: string };

// The visible tab shows the number (and the label from lg); the sr-only text is its accessible name.
function DayTabLabel({ day, finished }: { day: WorkoutDay; finished: boolean }) {
  return (
    <>
      <span className="sr-only">{`Day ${day.day}: ${day.name}${finished ? ", finished" : ""}`}</span>
      <span aria-hidden="true" className="grid justify-items-center gap-1">
        <span className="font-numbers text-2xl leading-none">
          {day.day}
          {finished && " ✓"}
        </span>
        <span className="hidden font-label text-[11px] tracking-[0.1em] lg:block">{day.short}</span>
      </span>
    </>
  );
}

type WorkoutWeekProps = { mood: Mood; recipe: Recipe; fontClass: string };

export default function WorkoutWeek({ mood, recipe, fontClass }: WorkoutWeekProps) {
  const [sets, setSets] = useState<Record<string, boolean[]>>({});
  const [rest, setRest] = useState<Record<number, string>>({});
  const [finished, setFinished] = useState<number[]>([]);
  const [open, setOpen] = useState<OpenExercise | null>(null);

  const setsFor = (exercise: string) => sets[exercise] ?? noSetsDone(SETS);
  const restFor = (day: number) => rest[day] ?? DEFAULT_REST;

  const toggle = (exercise: string, index: number) =>
    setSets((current) => ({ ...current, [exercise]: toggleSet(current[exercise] ?? noSetsDone(SETS), index) }));

  return (
    <RecipeProvider recipe={recipe}>
      <div className={`${fontClass} flex-1 bg-bg font-body text-ink`} style={moodStyle(mood) as CSSProperties}>
        <main className="mx-auto max-w-[960px] px-4 py-8 sm:px-8 sm:py-12">
          <header>
            <Link href="/" className={`text-sm underline underline-offset-4 ${recipe.focus}`}>
              ← Hub
            </Link>
            <h1 className={`mt-4 ${recipe.pageTitle}`}>My week</h1>
            <p className={`mt-3 ${recipe.hint}`}>{weekSummary(WEEK, SETS, REPS)}</p>
          </header>
          <div className="mt-8">
            <Tabs
              label="Days of the week"
              listClassName="w-full"
              tabClassName="flex-1"
              tabs={WEEK.map((day) => ({
                id: `day-${day.day}`,
                label: <DayTabLabel day={day} finished={finished.includes(day.day)} />,
                content: (
                  <DayPanel
                    day={day}
                    rest={restFor(day.day)}
                    onRestChange={(value) => setRest((current) => ({ ...current, [day.day]: value }))}
                    isDone={(exercise) => allDone(setsFor(exercise))}
                    onOpen={(exercise) => setOpen({ day: day.day, exercise })}
                    finished={finished.includes(day.day)}
                    onFinish={() => setFinished((current) => (current.includes(day.day) ? current : [...current, day.day]))}
                  />
                ),
              }))}
            />
          </div>
          <ExercisePanel
            exercise={open?.exercise ?? null}
            restSeconds={open ? restFor(open.day) : DEFAULT_REST}
            done={open ? setsFor(open.exercise) : noSetsDone(SETS)}
            onToggle={(index) => {
              if (open) toggle(open.exercise, index);
            }}
            onClose={() => setOpen(null)}
          />
        </main>
      </div>
    </RecipeProvider>
  );
}
```

Replace `app/workout-week/page.tsx` with:

```tsx
import type { Metadata } from "next";
import { PLATE_ROOM_RECIPE } from "@/app/design-system/recipes/plate-room";
import { PLATE_ROOM_FONTS } from "@/app/fonts/plate-room";
import { getMood } from "@/app/moods";
import WorkoutWeek from "./_components/WorkoutWeek";

export const metadata: Metadata = { title: "My week" };

export default function WorkoutWeekPage() {
  return <WorkoutWeek mood={getMood("plate-room")} recipe={PLATE_ROOM_RECIPE} fontClass={PLATE_ROOM_FONTS} />;
}
```

The old page was the last user of `app/placeholder.tsx`, so delete it: `git rm app/placeholder.tsx`.

- [ ] **Step 5: Run every check**

Run: `npm test` (sandbox: allow `fonts.googleapis.com`, `fonts.gstatic.com`), then `npm run lint`.
Expected:
- Every test passes: the new page suite, the `/workout-week/` font test, the set-tracker guard, and the unchanged design-system suites.
- Lint prints nothing.

- [ ] **Step 6: Check the page in the browser at five widths**

Start `python3 -m http.server 4173 --directory out` in the background if it isn't running. In Claude in Chrome, open a new tab at `http://localhost:4173/workout-week/` and run this with `javascript_tool`. It clicks through all seven days inside each frame.

```js
const check = async (width) => {
  const frame = document.createElement("iframe");
  frame.src = location.href;
  frame.style.cssText = `position:fixed;top:0;left:0;width:${width}px;height:800px;border:0;z-index:9999`;
  document.body.append(frame);
  await new Promise((resolve) => frame.addEventListener("load", resolve, { once: true }));
  await new Promise((resolve) => setTimeout(resolve, 400));
  const doc = frame.contentDocument;
  const result = { width, overflow: [], clipped: [], labelsShown: false };
  for (const tab of doc.querySelectorAll('[role="tab"]')) {
    tab.click();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const overflow = doc.documentElement.scrollWidth - doc.documentElement.clientWidth;
    if (overflow > 0) result.overflow.push(`${tab.textContent.slice(0, 12)}: ${overflow}`);
    result.clipped.push(
      ...[...doc.querySelectorAll('[role="tab"], [role="tabpanel"]:not([hidden]) button, [role="tabpanel"]:not([hidden]) article')]
        .filter((element) => element.scrollWidth > element.clientWidth + 1)
        .map((element) => element.textContent.trim().slice(0, 30)),
    );
  }
  result.labelsShown = getComputedStyle(doc.querySelector('[role="tab"] [aria-hidden] span:last-child')).display !== "none";
  frame.remove();
  return result;
};
const results = [];
for (const width of [390, 640, 768, 1024, 1440]) results.push(await check(width));
JSON.stringify(results)
```

Expected:
- Every width returns `overflow: []` and `clipped: []`.
- `labelsShown` is `false` at 390, 640 and 768, and `true` at 1024 and 1440.

Then take screenshots at 1440 px and, through a 390 px iframe, at phone width, of Day 1, Day 2 and Day 7. Check that it reads as Plate Room:
- outlined boxes, the thin shadow, uppercase Big Shoulders, stencil numbers
- yellow only on Finish workout

- [ ] **Step 7: Check the page by keyboard and interaction**

In the same tab:
1. **Days.** Click the page background, then Tab to the day strip. ArrowRight moves to Day 2, which is selected and focused. End moves to Day 7; Home returns to Day 1. Every focused control shows a visible ring; on the selected tab it's the inset white ring.
2. **Panel.**
   1. Tab to "Lat pulldowns" and press Enter. The dialog opens with focus inside, titled "Lat pulldowns", reading "3 × 10 · Rest 90 s" and showing three cues.
   2. Press Esc. It closes and `document.activeElement` is the Lat pulldowns row.
3. **Ticks survive.**
   1. Open Lat pulldowns, tick Set 1 and Set 2, and press Esc.
   2. Switch to Day 3, then back to Day 1, and reopen Lat pulldowns.
   3. It shows "2 of 3 done" with Sets 1–2 ticked.
   4. Tick Set 3 and close: the Lat pulldowns row shows DONE.
4. **Rest per day.**
   1. On Day 3, choose "2 min", open "Cable lateral raise", and check it reads "Rest 2 min" with the timer on 2:00.
   2. Close it, go to Day 1, and open Lat pulldowns: it reads "Rest 90 s" with the timer on 1:30.
   3. Start the timer, wait 3 s, and check it shows 1:27 or 1:28.
5. **Long name.**
   1. Through a 390 px iframe, open "Shoulder superset: O movements and serving platters" on Day 3 and tick its three sets.
   2. Its row wraps the name and keeps DONE and "3 × 10" inside the row: the row's `scrollWidth` is at most its `clientWidth + 1`.
6. **Finish.**
   1. On Day 2, Tab to Finish workout and press Enter.
   2. "Workout logged. Nice work." replaces the button, and `document.activeElement` is the element wrapping it.
   3. The Day 2 tab shows ✓, and its accessible name ends ", finished".
7. **Hover.** Hover a list row (it turns concrete) and Finish workout (it darkens slightly).

Expected: all seven behave as described. Fix anything that doesn't, re-run Steps 5–7, then continue.

- [ ] **Step 8: Commit**

```bash
git add app/design-system/components app/design-system/DesignSystemPage.tsx app/workout-week tests/workout-week.test.mjs tests/fonts.test.mjs tests/design-systems.test.mjs
git commit -F - <<'EOF'
Build the workout-week site in the Plate Room style

One day at a time: a seven-day strip, each strength day's exercises
with a rest picker, cardio days' four options as cards, and the rest
day's empty state. An exercise opens a panel with its form cues, set
check-off and a rest timer; ticks, rest choices and finished days are
kept while the page is open. Finish workout is the one yellow button.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

- [ ] **Step 9: CHECKPOINT: Nikita reviews the page**

Stop and tell Nikita the page is ready at `http://localhost:4173/workout-week/`. Point out the drafted form cues on Days 1 and 3, which Nikita hasn't seen in the panel yet. For each round of feedback:
1. Make the changes.
2. Re-run Step 5. If the layout or interaction changed, re-run Steps 6–7.
3. Commit with a subject naming what Nikita asked for, e.g. `Workout week: <change>`, ending with the `Co-Authored-By` trailer.

Do not start Task 4 until Nikita says the page is done.

---

### Task 4: README and the final pass

**Files:**
- Modify: `README.md` (layout table)

**Interfaces:**
- Consumes: everything above.
- Produces: a clean `npm test` and lint.

- [ ] **Step 1: Update the README**

In `README.md`'s layout table, replace the `/workout-week/` row with:

```markdown
| `/workout-week/` | `app/workout-week/page.tsx` | The final site: Nikita's week in the Plate Room style, built from the shared library in `app/design-system/` |
```

- [ ] **Step 2: Run every check**

Run: `npm test`, then `npm run lint`.
Expected: all tests pass; lint prints nothing.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -F - <<'EOF'
Document the workout-week site in the README

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
```

Then report to Nikita: the test output, and that the GitHub repo and the Vercel deploy are the remaining steps, to be done when Nikita asks.
