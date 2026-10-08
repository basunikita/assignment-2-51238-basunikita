# A Week of Workouts: Design Systems: Design Spec

Date: 2026-10-07
Status: Approved (written spec reviewed 2026-10-07).

## 1. Goal

Build the three design systems for MPCS 51238 assignment 2: one page per mood (Sunrise,
Editorial, Plate Room), each built from its mood board. The brief describes each page as "a UI
library: the components a site could use, built in that style, in every state". The final site
is out of scope, but it will import this library and use one mood's recipe, so the components
must be real and reusable.

**Who it's for:** Nikita, a beginner, following the weekly routine in §2. The site will let
Nikita run a rest timer, check off sets, and open an exercise's details. The design systems
build those pieces ahead of time.

**Success criteria** (from the brief)
- Each page has six numbered sections, described in §4:
  1. color roles, with contrast ratios
  2. type roles, with sizes and weights, set in Nikita's own content
  3. spacing and shape
  4. components
  5. control states
  6. UI states
- Components: primary and secondary buttons, a link, a text input, a select, checkboxes and
  radios, a toggle, tabs, filter chips, a card with one of Nikita's items, list rows, a badge, a
  modal or detail panel, and the site's own pieces: a rest timer and a set tracker.
- Each control shows rest, hover, focus, pressed, selected and disabled, where they apply.
- UI states: empty, loading, error and success.
- Each system looks like its mood, not like a default component kit.
- Nikita reviews each system in the browser before the next one starts.

**Constraints**
- Next.js and Tailwind, as a static export. No database, accounts, APIs or storage. Interactions
  are faked in the browser, and nothing is saved.
- No new npm packages.
- Colors come from each mood's palette in `app/moods.ts`. Hover and press may darken a fill with
  a brightness filter. Text contrast is at least 4.5:1, and control boundaries and focus rings
  are at least 3:1 (WCAG 1.4.3 and 1.4.11).
- Each page works at 390 px and 1440 px with no horizontal scroll, and every control works by
  keyboard.
- A mood's fonts load only on its own pages (one `app/fonts/<mood>.ts` module per mood).

## 2. Content: Nikita's routine

All strength exercises are 3 sets of 10. Names are as Nikita wrote them.

| Day | Workout | Exercises |
|---|---|---|
| 1 | Back and biceps | Back: Lat pulldowns · Face pulls · Single-arm dumbbell rows · Lower back hyperextensions. Biceps: African bicep curls · Cable bicep curls · Barbell curls |
| 2 | Cardio | One of the cardio options |
| 3 | Shoulders and triceps | Shoulders: Cable lateral raise · Shoulder superset: O movements and serving platters · Archer pull · Front raise cable. Triceps: Overhead tricep extension cable · Tricep cross extension · Tricep press |
| 4 | Cardio | One of the cardio options |
| 5 | Legs | Hip thrusts · RDLs · Bulgarian split squats · Hip abduction / adduction · Glute hyperextensions |
| 6 | Cardio | One of the cardio options |
| 7 | Rest | |

Cardio options:
1. Walk 5 min, run 30 min, walk 5 min
2. Walk 5 min, (run 15 min, walk 1 min) × 3, walk 5 min
3. 30 min walking at level 12 incline, 3 mph
4. 25 min of stairs at intensity 7

This routine lives in one shared module, `app/design-system/content.ts`, which the final site
will reuse.

## 3. Architecture: one library, three recipes

Nikita chose approach 1:
- **One shared library.** Each component is written once in `app/design-system/`, with its
  markup, keyboard behavior, ARIA and state logic.
- **Recipes per mood.** Each mood supplies a recipe: the class strings for every part of every
  component, covering shape, border, weight, casing, and hover and press behavior.
- **The page.** Each design-system page renders the same components under its mood's recipe.
- **The site.** The final site imports the components and one recipe.

### 3.1 Recipes (approved in the visual comparison)

| | Sunrise | Editorial | Plate Room |
|---|---|---|---|
| Corners | Pills for buttons and chips; 18 px cards; 12 px fields | Square | Square |
| Lines | 1.5 px | 1 px ink hairlines; fields are a 1.5 px ink underline only | 2 px ink outlines |
| Shadow | None | None | 2 px × 2 px solid ink, on buttons and cards only |
| Casing and weight | Sentence case, bold | Labels and buttons: Libre Franklin uppercase, wide tracking | Buttons, tabs and headings: Big Shoulders uppercase |
| Primary button | Dusk fill, warm-white text | Red fill, paper text | Safety-yellow fill, ink text, ink outline |
| Secondary button | Dusk outline and text | Ink outline, ink text | White fill, ink outline |
| Secondary hover | **Sky fill with ink text** | Inverts to ink fill, paper text | Concrete fill |
| Primary hover | Slight darken (brightness filter) | Slight darken | Slight darken |
| Pressed | Shrinks to 97 % | Nudges down 1 px | Sinks 2 px into its shadow; shadow disappears |
| Chips | Pills; selected = dusk fill | Square, uppercase; selected = ink fill | Square, 2 px outline, uppercase; selected = ink fill |
| Tabs | Segmented: peach track, selected tab on warm white | Text tabs; selected = 2 px red underline | Joined blocks; selected = ink block, white text |
| Toggle (on) | Dusk pill track, round thumb | Square red track, ink border | Square yellow track, ink border and thumb |
| Fields, checkbox, radio | Muted outline (see §3.2), dusk when checked | Ink | Ink, 2 px; checked box is yellow with an ink tick |
| Focus ring | 2 px dusk, 2 px offset | 2 px ink, 2 px offset | 3 px ink, 2 px offset |

### 3.2 Color rules

- **Accent** marks the one primary action in view, and "on" indicators: the toggle's on state,
  Editorial's selected-tab underline, and progress fill. It is not decoration.
- **Control outlines get their own role.** A new color role, `control`, colors the outline of
  fields, checkboxes, radios and the toggle's off state. It must reach 3:1 against the page:
  - Sunrise uses Muted (5.3:1). The comparison screen showed apricot field outlines, but those
    are only 1.9:1.
  - Editorial and Plate Room use Ink (16.8:1 and 15.3:1).
  - Peach (Sunrise) and Rule (Editorial) stay for decorative lines and unselected chips, which
    their text labels already identify.
- **Text pairs used in the recipes,** all at least 4.5:1:
  - Sunrise: ink on sky (9.7:1), for the Skip hover.
  - Editorial: paper on ink (16.8:1), for the secondary hover.
  - Plate Room: white on ink (18.7:1), for selected chips and tabs.
  - Dusk on sky is 3.5:1, so Sunrise's Skip text switches to ink on hover.
- **Disabled** controls show at 40 % opacity with a not-allowed cursor and no hover change.
  WCAG exempts disabled controls from contrast rules.

## 4. The design-system page

Each page lives at `/design-systems/<mood>/`, styled in its mood like its mood board, with a
"← Hub" link and the title "<Mood> · Design System". It has six numbered sections, each with a
`data-section` attribute.

1. **Color roles** (`color`): a swatch for each role:
   - background, surface, text, muted text, border, control, accent and focus
   - each with its name, hex value and use
   - contrast ratios computed from `app/moods.ts` at build time: text and muted on background,
     on-accent on accent, accent on background, control and focus against background
2. **Type roles** (`type`): display, heading, body and label (Editorial and Plate Room also show
   numbers). Each is set in routine content, e.g. "Day 1 · Back and biceps" or "3 × 10", with
   its size, weight and line height.
3. **Spacing and shape** (`spacing`): the scale 4 / 8 / 12 / 16 / 24 / 32 shown as bars, plus
   corner, border and shadow samples.
4. **Components** (`components`): every component live, so it can be hovered, clicked, tabbed
   to and used. Each has a `data-component` attribute. See §5.
5. **Control states** (`control-states`): a grid with one row per control (primary button,
   secondary button, chip, checkbox, toggle, tab) and one column per state.
   - States: rest, hover, focus, pressed, selected and disabled. Cells that don't apply, such as
     a pressed checkbox or a selected primary button, are left blank and labeled "n/a".
   - Frozen hover, focus and pressed states use the same classes as the live ones (§6).
   - Selected and disabled cells really are selected or disabled.
6. **UI states** (`ui-states`): four panels in routine content:
   - empty: "Rest day: no workout today"
   - loading: "Loading your week…", with a spinner that respects reduced motion
   - error: "Couldn't load this workout", with a Try again button
   - success: "Workout logged. Nice work."

## 5. Components and their content

| Component | Content | Behavior and accessibility |
|---|---|---|
| Button: primary and secondary | "Start workout", "Skip" | `<button>` |
| Link | "See all exercises →" | `<a>`; underline in the mood's style |
| Text input | "Weight used (lb)" | `<label>` + `<input inputmode="decimal">` |
| Select | Cardio option: the four options from §2 | `<label>` + native `<select>` |
| Radios | Rest between sets: 60 s · 90 s · 2 min | `<fieldset>` + `<legend>`; sets the rest timer's length |
| Checkbox | "Set 1 · 10 reps" | `<label>` + native checkbox |
| Toggle | "Sound when rest ends" | `<button role="switch" aria-checked>`; Space and Enter toggle it |
| Tabs | Today · Week · Notes | `role="tablist"`, `tab` and `tabpanel`; arrow keys move between tabs |
| Filter chips | All · Strength · Cardio · Rest | `<button aria-pressed>` in a labeled group; filters a sample week list |
| Card | Day 1 · Back and biceps · 7 exercises · 3 × 10 · a "Today" badge | `<article>` |
| List rows | Day 1's seven exercises, each 3 × 10 | Each row is a button that opens the detail panel |
| Badge | Today · Done · Strength · Cardio · Rest | `<span>`; color comes from the mood |
| Detail panel | Bulgarian split squats: 3 × 10, rest 90 s, and three form cues | Native `<dialog>` opened with `showModal()`. Focus moves into it; Esc and the close button close it; focus returns to the row |
| Rest timer | 1:30 countdown with Start / Pause / Reset | Ticks once a second. Time shown as m:ss. Announces "Rest over" in an `aria-live="polite"` region at zero |
| Set tracker | Face pulls: Set 1–3 checkboxes, "2 of 3 done", and a progress bar | Checkboxes plus a `role="progressbar"` with `aria-valuenow` and `aria-valuemax` |
| UI state panels | §4, item 6 | `role="status"`; the error panel uses `role="alert"` |

Form cues for the Bulgarian split squat panel:
1. Rear foot on the bench behind you.
2. Lower straight down until your front thigh is about level.
3. Drive through your front heel to stand.

Nothing persists: reloading the page resets the timer, the checkboxes and the toggle.

## 6. States without duplicated styles

Three Tailwind custom variants in `app/globals.css` let one class string cover both the real
state and a frozen sample:

```css
@custom-variant hover-state (&:hover, &[data-state~="hover"]);
@custom-variant focus-state (&:focus-visible, &[data-state~="focus"]);
@custom-variant pressed-state (&:active, &[data-state~="pressed"]);
```

Recipes write `hover-state:…`, `focus-state:…` and `pressed-state:…` rather than `hover:…`. In
the control-states grid, a sample gets `data-state="hover"`, and the same component is styled
exactly as a real hover would style it. Selected uses `aria-pressed`, `aria-checked` or
`aria-selected` (Tailwind's `aria-*` variants), and disabled uses the `disabled` attribute, so
those samples are real.

## 7. Code structure

```
app/
  moods.ts                        + "control" color role per mood
  globals.css                     + the three custom variants; --color-control token
  design-system/
    content.ts                    the routine (§2) and the component copy (§5)
    recipes.ts                    RECIPES: Record<MoodSlug, Recipe>, class strings only
    RecipeContext.tsx             "use client"; provides the mood's recipe to components
    timer.ts                      pure: formatSeconds, nextTick; tested directly
    progress.ts                   pure: progressLabel(done, total); tested directly
    components/                   Button, TextLink, TextInput, Select, RadioGroup, Checkbox,
                                  Toggle, Tabs, FilterChips, WorkoutCard, ExerciseRow, Badge,
                                  DetailPanel, RestTimer, SetTracker, StatePanel
    DesignSystemPage.tsx          the six sections, shared by all three pages
  design-systems/<mood>/page.tsx  font module + DesignSystemPage for that mood
```

- Interactive components are client components. They still prerender to static HTML, so each
  page works without JavaScript for reading. Interaction needs JavaScript.
- Recipe class strings are written out in full so Tailwind can find them. No class names are
  built at runtime.

## 8. Testing

- **`tests/design-systems.test.mjs`** reads each exported page and checks:
  - the six sections, every `data-component`, the full state grid (which cells are "n/a" is
    fixed in the test), and the four UI states
  - `role="switch"` with `aria-checked`, the tablist, the dialog, a label for every input and
    select, and text in every button
  - no `text-muted` inside `bg-surface` where that pair is under 4.5:1, using `findNested`
  - no raw color literals in `recipes.ts`
- **`tests/contrast.test.mjs`** gains checks that each mood's `control` color reaches 3:1
  against the background, and that every text pair a recipe uses is declared and reaches 4.5:1.
- **`tests/logic.test.mjs`** covers the timer and progress functions: m:ss formatting, counting
  down, stopping at zero, pause and resume, and "2 of 3 done".
- **`tests/fonts.test.mjs`** checks that each design-system page preloads only its mood's fonts.
- **Browser checks** (Claude in Chrome) for each page:
  - 390 px and 1440 px: no overflow and no clipped controls
  - keyboard: tab through every control, toggle with Space, move between tabs with the arrow
    keys, open the detail panel with Enter, close it with Esc and confirm focus returns
  - start and pause the timer
  - check the frozen-state cells against the live hover and press

## 9. Process

1. Work on a `design-systems` branch.
2. Build the shared library, the `control` role, the variants and the **Sunrise** page.
   Nikita reviews it in the browser; each round of feedback is its own commit.
3. Build **Editorial** the same way, then **Plate Room**.
4. A final pass and a fresh whole-branch review, then merge into `main` when Nikita says so.

## 10. Out of scope

- The final site at `/workout-week/`. It will get its own spec, reusing this library and one
  mood's recipe.
- Changing the mood boards. They keep the sample week Nikita already approved.
- Deploying to Vercel and creating the GitHub repo. These happen when Nikita asks.
