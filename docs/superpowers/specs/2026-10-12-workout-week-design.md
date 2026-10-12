# A Week of Workouts: The Site: Design Spec

Date: 2026-10-12
Status: Draft, for Nikita's review.

## 1. Goal

Build "Your Site" for MPCS 51238 assignment 2: Nikita's real week of workouts at
`/workout-week/`, in the **Plate Room** style Nikita picked, built from the design-system library
already on `main`.

**Who it's for:** Nikita, a beginner, at the gym or about to go. The page answers "what do I do
today?" first, then helps with each exercise: how to do it, which sets are done, and how long to
rest.

**Success criteria** (from the brief, page 4 and "Design Requirements")
- Thoughtful visual hierarchy: it's clear what to look at first.
- At least two interactions, faked in the browser. This site has four: switching days, opening
  an exercise's panel, checking off sets, and running the rest timer, plus Finish workout.
- Every control in its states (hover, focus, pressed, selected, disabled where it applies).
- The accent kept for the primary action.
- Responsive: works at 390 px and 1440 px, with no horizontal page scroll.
- Simplicity: nothing extra.
- It looks like Plate Room, not a default kit.
- No database, accounts, APIs or storage. Nothing is saved; a reload resets the page.
- Due Tuesday 2026-10-13 at 5:30 PM, with the GitHub repo and Vercel deploy still to do, so the
  scope stays small.

## 2. Decisions Nikita made

| Question | Decision |
|---|---|
| Style | Plate Room |
| First view | One day at a time, with a 7-day strip to switch days |
| Opening day | Always Day 1 (no weekday mapping, no "Today" marker) |
| Cardio days | All four options as cards, steps visible, nothing to tap |
| Form cues | Claude drafts cues for the standard Day 1 and Day 3 exercises; Nikita fixes them at review |
| Primary action | Finish workout, on strength and cardio days |
| Rest length | A picker per day (60 s / 90 s / 2 min), default 90 s |
| Row progress | Rows show only DONE once all three sets are ticked |
| Day labels | BACK/BIS · CARDIO · SHOULDERS/TRIS · CARDIO · LEGS · CARDIO · REST |

## 3. Page layout

Top to bottom, in one centered column (max width about 960 px):

1. **Header**
   - A small "← Hub" link.
   - "MY WEEK" as the display heading (Big Shoulders, uppercase).
   - One line under it: "3 strength days, 3 cardio, 1 rest · 3 × 10 every lift".
2. **Day strip:** the library's Tabs, one tab per day.
   - Each tab shows the day number in Big Shoulders Stencil. From `sm` (640 px) up, the day's
     label shows under the number (BACK/BIS, CARDIO, …). Below `sm` only the numbers show, since
     "SHOULDERS/TRIS" can't fit a phone-width tab; the day heading below names the day.
   - The tabs share the strip's width evenly: seven columns that fill the column.
   - The selected day is the solid ink tab, as in the Plate Room design system. Arrow keys,
     Home and End move between days (the library's roving tabindex).
   - A finished day's tab shows a small ✓ after its number, with "finished" in its accessible
     name.
   - It opens on Day 1.
3. **The day's panel** (the selected tab's tabpanel):
   - **Strength days (1, 3, 5):**
     - Eyebrow "DAY 1", then the day's name as the heading ("BACK AND BICEPS"), then "7 exercises
       · 3 × 10".
     - The rest picker: the library's RadioGroup, legend "Rest between sets", options 60 s /
       90 s / 2 min, default 90 s. Each day keeps its own choice.
     - The exercise list: the library's ExerciseList (outlined box, one row per exercise, "3 × 10
       ›"). A row shows a black DONE badge once all three of its sets are ticked.
     - Finish workout (item 4 below).
   - **Cardio days (2, 4, 6):**
     - Eyebrow "DAY 2", heading "CARDIO", and the line "Pick one".
     - Four outlined cards in a 2 × 2 grid (one column below `sm`): the option's label as the
       card title and its steps as the text, e.g. "RUN 30 MIN / Walk 5 min, run 30 min, walk
       5 min". The cards use Plate Room's card style without the yellow hazard band. Nothing on
       them is interactive.
     - Finish workout (item 4 below).
   - **Rest day (7):** eyebrow "DAY 7", heading "REST", and the library's empty StatePanel:
     "Rest day: no workout today". No Finish workout.
4. **Finish workout:** the page's one primary (yellow) button, at the end of each strength and
   cardio day.
   - Works whether or not every set is ticked.
   - Pressing it replaces the button with the library's success StatePanel, "Workout logged.
     Nice work.", and marks that day's tab with ✓. It stays finished until a reload.

### 3.1 The exercise panel

Opens when a strength-day row is pressed. It is the library's DetailPanel, a native modal
dialog: focus moves into it, Esc or the × button closes it, and focus returns to the row.

Inside, top to bottom:
1. The exercise name as its title.
2. "3 × 10 · Rest 90 s" (the day's chosen rest).
3. The form cues as a numbered list, when the exercise has them (see §4).
4. The set tracker: three checkboxes "Set 1 · 10 reps" to "Set 3 · 10 reps", a progress bar and
   "N of 3 done". All three start unticked.
5. The rest timer at the day's rest length. Start/Pause and Reset are **secondary** (outlined)
   buttons here, so Finish workout stays the only yellow button.

### 3.2 What the page remembers while it's open

- Ticked sets, per exercise. Closing the panel or switching days keeps them.
- The rest choice, per day.
- Which days are finished.
- Which panel is open.

A reload clears all of it. Nothing goes to storage.

### 3.3 Color

- Yellow (accent) appears only on Finish workout, a checked checkbox's fill, and the progress
  fill. No yellow section numbers, hazard bands or spacing bars on this page: the brief keeps the
  accent for the primary action. (Nikita kept decorative accent on the design-system pages; this
  rule is for the site only.)
- Everything else is ink, concrete, panel white and muted, as in the Plate Room recipe. The
  plate-colored badges aren't used here.

## 4. Content

The routine is the one in `app/design-system/content.ts` (spec 2026-10-07 §2), plus:

- **Tab labels,** a new `short` field on each day: BACK/BIS, CARDIO, SHOULDERS/TRIS, CARDIO,
  LEGS, CARDIO, REST.
- **Form cues for Days 1 and 3,** drafted for Nikita to correct. Day 5's cues are unchanged.

| Exercise | Cues |
|---|---|
| Lat pulldowns | Grip the bar a little wider than your shoulders, thighs under the pad. · Pull the bar to your upper chest, leading with your elbows. · Let it rise slowly until your arms are straight. |
| Face pulls | Set the rope at face height and step back until your arms are straight. · Pull the rope toward your face, hands ending beside your ears. · Squeeze your shoulder blades, then return slowly. |
| Single-arm dumbbell rows | One hand and knee on the bench, back flat. · Pull the dumbbell toward your hip, elbow close to your side. · Lower it until your arm is straight, without twisting. |
| Lower back hyperextensions | Pad just below your hips, feet anchored. · Lower with a flat back. · Rise until your body is straight; don't arch past it. |
| Cable bicep curls | Stand tall, elbows at your sides. · Curl the handle up without moving your elbows. · Lower slowly until your arms are straight. |
| Barbell curls | Hands shoulder-width apart, elbows at your sides. · Curl the bar to your shoulders without swinging. · Lower it slowly all the way down. |
| Cable lateral raise | Stand side-on to a low cable, handle in your far hand. · Raise your arm out to the side to shoulder height, elbow soft. · Lower slowly, without shrugging. |
| Front raise cable | Stand facing away from a low cable, handle in front of your thighs. · Raise your straight arm in front of you to shoulder height. · Lower slowly, keeping your body still. |
| Overhead tricep extension cable | Face away from the cable, rope behind your head, elbows by your ears. · Straighten your arms overhead without moving your elbows. · Bend back slowly until you feel the stretch. |

No cues (their panels show sets, reps, rest, the set tracker and the timer only), unless Nikita
supplies them: African bicep curls · Shoulder superset: O movements and serving platters · Archer
pull · Tricep cross extension · Tricep press.

## 5. Architecture

The page reuses the library the design systems built, under `PLATE_ROOM_RECIPE` and
`PLATE_ROOM_FONTS`, with Plate Room's `moodStyle` variables on its root, the same way
`DesignSystemPage` does. Site-only pieces live next to the page.

### 5.1 Library changes

Each keeps the design-system pages looking and behaving as they do now.

- **Tabs:** a tab's `label` accepts a ReactNode (number, label and ✓), and Tabs accepts an
  optional class for its list so the strip can fill the width as seven even columns.
- **ExerciseList:** an optional `isDone(exercise)` that shows a DONE badge (tone `done`) in the
  row.
- **DetailPanel:** an optional `children`, rendered under the facts (the set tracker and the
  timer).
- **SetTracker:** becomes controlled: `done: boolean[]` and `onToggle(index)`. The design-system
  page holds its sample state (first two sets ticked), so it looks the same.
- **RestTimer:** an optional button variant, so the site's Start/Pause and Reset are secondary.
- **Review fixes the site touches:**
  - Checkbox destructures `className` before spreading props, so a passed class can't drop the
    recipe or `peer`.
  - Controls transition only the properties that animate (colors, transform, shadow), not
    `outline-color`, so the focus ring doesn't flash the text color.
  - `app/globals.css` adds `@source not "../docs";` so Tailwind stops shipping classes from the
    specs and plans.

### 5.2 Site files

```
app/workout-week/
  page.tsx                server component: metadata, renders <WorkoutWeek />
  _components/
    WorkoutWeek.tsx       client: recipe, fonts, moodStyle, page state, header, day strip
    DayPanel.tsx          one day's content: strength, cardio or rest
    CardioCard.tsx        one cardio option card
    ExercisePanel.tsx     the DetailPanel with the set tracker and the rest timer
  week.ts                 pure helpers: day summary line, per-day defaults, done checks
```

`content.ts` gains the `short` labels and the new cues.

### 5.3 Pure logic (`week.ts`)

- `isExerciseDone(done: boolean[]): boolean`: true when every set is ticked.
- `daySummary(day: WorkoutDay): string`: "7 exercises · 3 × 10" for strength days.
- `weekSummary(week: WorkoutDay[]): string`: "3 strength days, 3 cardio, 1 rest · 3 × 10 every
  lift", counted from `WEEK`, not hardcoded.
- `restLabel(seconds: string): string`: the REST_OPTIONS label for a value.

## 6. Testing

`npm test` keeps running a clean build and then `node:test` over `tests/*.test.mjs`.

- **`tests/week.test.mjs`:** the pure helpers in §5.3.
- **`tests/workout-week.test.mjs`,** on the exported `/workout-week/` HTML:
  - one tablist with seven tabs; each tab's text contains its number and `short` label; Day 1 is
    selected and the others are not
  - seven tabpanels; each strength day's panel lists its exercises in order and has a "Rest
    between sets" radio group with 90 s checked
  - each cardio day's panel has the four options' labels and steps
  - Day 7's panel has the rest-day empty state and no Finish workout
  - Days 1–6 each have exactly one Finish workout button, and Finish workout is the only button
    on the page with the accent fill
  - no yellow decoration: no hazard band, and the only other accent fills are a checked
    checkbox (`checked:bg-accent`) and the progress fill
  - every input is labeled; every button has a name
  - the page has a dialog for the exercise panel
- **`tests/fonts.test.mjs`:** `/workout-week/` preloads Archivo, Big Shoulders and Big Shoulders
  Stencil.
- **`tests/design-systems.test.mjs`** still passes unchanged after the library changes.
- **Browser checks** (Claude in Chrome) at 390 px and 1440 px: no horizontal overflow, no clipped
  tabs or rows; then by keyboard: arrow through the days, open a panel and close it with Esc and
  ×, tick three sets until DONE shows on the row, run the timer at each rest length, press Finish
  workout and see the success message and the ✓.

## 7. Process

1. Nikita approves this spec.
2. A build plan, then execution on a `workout-week` branch.
3. Nikita reviews the page in the browser, round by round. Each round is its own commit.
4. A final review of the branch, then merge.
5. Then, only when Nikita asks: the GitHub repo and the Vercel deploy.

## 8. Out of scope

- Remembering anything across reloads.
- Mapping days to weekdays, or a "Today" marker.
- A guided step-by-step session or a "Next exercise" button.
- Sound when the rest ends.
- The deferred review items the site doesn't touch: disabled controls' hover and cursor, the
  toggle's label click, and the tests' known blind spots.
