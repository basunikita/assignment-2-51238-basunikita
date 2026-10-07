# A Week of Workouts: Mood Boards: Design Spec

Date: 2026-10-07
Status: Draft, awaiting review.

## 1. Goal

Build the three mood boards for MPCS 51238 assignment 2, and turn the home page into the
hub the brief describes. The design systems and the final site come later, each with its
own spec. This spec covers only the mood boards and the hub that links to them.

**Who the site is for:** Nikita, a beginner, following a week of workouts. The week mixes
strength training at the gym with cardio. The cardio is running and biking outdoors, plus
the treadmill and StairMaster indoors. The site should feel encouraging and doable, never
intimidating, and work on a phone during a workout.

**Success criteria** (from the brief)
- Three mood boards that feel clearly different from each other.
- Each board has a name for the mood and 25 to 30 artifacts: photos, type, color, texture
  and interface pieces.
- The hub links to every board.
- Nikita directs each board: the agent proposes, Nikita reviews it in the browser and
  says what to change. The commit history shows those rounds.

**Constraints**
- Next.js and Tailwind, as a static export. No database, accounts, APIs or storage.
- No packages beyond the ones the scaffold installed.
- Text contrast meets WCAG AA (4.5:1 for body text) on every board.
- Each board works at 390 px and 1440 px wide, with no horizontal page scroll.

## 2. The three moods

Nikita chose each palette and type pairing from options shown side by side. Contrast
ratios below are WCAG ratios, computed from the hex values.

### 2.1 Calm

A quiet morning routine: matte, warm and slow. It uses the colors of a sunrise run.
Tagline: **Calm · Matte · Dawn**.

| Role | Name | Hex | Notes |
|---|---|---|---|
| Background | Warm white | `#FBF6F0` | |
| Warm tint | Peach | `#F6D3BF` | Large areas, surfaces. Ink on peach 10.1:1 |
| Warm accent | Apricot | `#EBA587` | Decoration only. Ink on apricot 6.9:1 |
| Cool tint | Sky | `#C4D8E8` | Decoration, quiet highlights. Ink on sky 9.7:1 |
| Action | Dusk | `#56718C` | Main action only. White on dusk 5.1:1 |
| Text | Ink | `#2E2933` | Ink on warm white 13.2:1 |
| Muted text | Muted | `#6E6470` | Muted on warm white 5.3:1 |

- **Type:** Nunito throughout. Display weight 800, headings 700, body 400, labels 700 in
  uppercase with wide letter-spacing.
- **Shape:** generous rounded corners and pill buttons. No shadows; thin warm lines
  instead.
- **Photos:** sunrise runs, a quiet gym in morning light, stretching, a treadmill by a
  window, a bike path at dawn.
- **Textures:** paper grain, a soft dawn gradient (peach to sky), a blurred horizon.

### 2.2 Editorial

A training plan in a running magazine: paper, ink, one red, big serif headlines,
numbered steps on a strict grid. Tagline: **Editorial · Ink · Grid**.

| Role | Name | Hex | Notes |
|---|---|---|---|
| Background | Paper | `#F7F4EE` | |
| Surface | Newsprint | `#EDE8DF` | Ink on newsprint 15.1:1 |
| Border | Rule | `#D9D3C7` | Hairlines between list rows |
| Muted text | Graphite | `#5C5A55` | Graphite on paper 6.3:1 |
| Text | Ink | `#141414` | Ink on paper 16.8:1. Also heavy rules under mastheads |
| Accent | Red | `#C8102E` | Step numbers and the main action. Red on paper 5.4:1; white on red 5.9:1 |

- **Type:** Newsreader for display, headings and body, using its optical sizes. Libre
  Franklin for labels, numbers and buttons.
- **Shape:** square corners, hairline rules, a heavy rule under each masthead. No
  shadows.
- **Photos:** black-and-white running photography, the track, race bibs, a stopwatch,
  close crops like a magazine spread.
- **Textures:** newsprint grain, halftone dots, column rules.

### 2.3 Plate Room

Gym signage and bumper plates on a painted concrete wall: heavy outlines, condensed type
and huge numbers. Tagline: **Plate Room · Steel · Signal**.

| Role | Name | Hex | Notes |
|---|---|---|---|
| Background | Concrete | `#E9E8E4` | |
| Surface | Panel | `#FFFFFF` | |
| Border | Steel | `#BDBBB4` | Light dividers. Heavy outlines use Ink |
| Text | Ink | `#121212` | Ink on concrete 15.3:1, on white 18.7:1 |
| Muted text | Muted | `#55534E` | Muted on white 7.7:1, on concrete 6.3:1 |
| Action | Safety | `#FFD400` | Main action only, as a fill with Ink text (13.1:1). Never text: yellow on white is 1.4:1 |
| Legs | Red | `#D7262D` | Day type. White on red 5.0:1 |
| Upper body | Blue | `#1F5FBF` | Day type. White on blue 6.1:1 |
| Cardio | Green | `#187A43` | Day type. White on green 5.4:1 |

- **Type:** Big Shoulders Display for display and headings, set in uppercase. Big
  Shoulders Stencil Display for big numbers, so they look stamped on a plate. Archivo for
  body and labels.
- **Shape:** square corners, 2 px Ink outlines, a yellow-and-black hazard stripe as an
  accent band.
- **Photos:** bumper plates, chalk, barbells, rubber flooring, the StairMaster, gym
  signage.
- **Textures:** rubber flooring, hazard stripes, painted concrete, a knurled bar grip.

### 2.4 How the three differ

All three have light backgrounds, so they differ in other ways:

| | Calm | Editorial | Plate Room |
|---|---|---|---|
| Color | Warm pastels, one muted blue | Black and white, one red | Gray and black, primary plate colors, yellow |
| Type | One rounded sans | Serif-led | Condensed, stencil numbers |
| Shape | Soft, rounded, pills | Square, hairline rules | Square, heavy outlines |
| Feeling | Reassuring | Authoritative | Loud and functional |

## 3. The mood board page

All three boards share one layout. Each board renders it in its own mood.

- **Styled in its mood.** The page background, title type and colors come from that
  mood's palette and fonts, so the page itself is part of the board.
- **Header.** The mood's name, its three-word tagline, and a "← Hub" link.
- **Collage.** 25 to 30 artifacts in a masonry layout with mixed sizes. It uses CSS
  columns: 2 at 390 px, 4 to 5 at 1440 px.
- **Artifact mix per board** (about 28 in total):

  | Kind | Count | Source | Examples |
  |---|---|---|---|
  | Photos | ~9 | Unsplash | See each mood's photo subjects in §2 |
  | Color swatches | ~5 | Generated | The palette, with names and hex codes |
  | Type specimens | ~4 | Generated | The mood's fonts set in workout content: "3 × 10 Goblet squat", "Rest 90 s", "Day 3" |
  | Textures | ~4 | Generated (CSS/SVG) | See each mood's textures in §2 |
  | Interface pieces | ~6 | Generated | Rep counter, rest timer, "Start workout" button, day chips, streak badge, a workout card |

- **Marks.** Every generated artifact carries a small ✦ in a corner, as in the brief's
  example. A key under the header explains it: "✦ generated by my agent".
- **Footer.** A count line ("28 artifacts: photos, type, color, texture and interface
  pieces") and photo credits that name each Unsplash photographer.
- **Content.** All text in artifacts comes from the workout week (exercises, sets, reps,
  times, days), never lorem ipsum.
- **Accessibility.** Photos have alt text. Swatches state their hex codes in text. The
  hub link has a visible focus style.

## 4. The hub and routes

### 4.1 Routes

| Route | What |
|---|---|
| `/` | Hub |
| `/mood-boards/calm/`, `/mood-boards/editorial/`, `/mood-boards/plate-room/` | Mood boards (this spec) |
| `/design-systems/calm/`, `/design-systems/editorial/`, `/design-systems/plate-room/` | Placeholders until the design-system spec |
| `/workout-week/` | Placeholder for the final site |

The scaffold's `/moods/1–3`, `/systems/1–3` and `/site` routes are removed.

### 4.2 Hub layout

This follows the brief's hub example.
- A title and a one-line description of the project.
- **1 Mood boards:** three cards. Each shows three or four of that mood's swatches and
  its name with an arrow.
- **2 Design systems:** three cards. Each shows "Aa" in that mood's display font, a few
  color dots, and the name.
- **3 Your site:** one dark button, "Open A Week of Workouts →".
- The hub itself stays neutral, so it doesn't compete with the moods. It uses system
  type and grays.

## 5. Code structure

```
app/
  page.tsx                      hub
  sections.ts                   hub data: moods (slug, name, swatches, font sample)
  mood-boards/
    _components/MoodBoard.tsx   shared layout: header, masonry, ✦ marks, footer
    calm/page.tsx               board page: fonts, CSS variables, artifact list
    editorial/page.tsx
    plate-room/page.tsx
  design-systems/<mood>/page.tsx  placeholders
  workout-week/page.tsx           placeholder
public/
  mood-boards/<mood>/*.jpg      photos, resized to at most 1200 px wide
```

- **Fonts.** Each board page loads its own fonts with `next/font/google`, so a mood's
  fonts load only on its own pages.
- **Palette.** Each board sets its palette as CSS custom properties (`--bg`, `--ink`,
  `--muted`, `--accent`, and so on) on its root element. Tailwind classes read them
  through arbitrary values, e.g. `bg-[var(--bg)]`. The design systems will reuse these
  values.
- **Artifact list.** Each board defines its artifacts as data: a photo (`src`, `alt`,
  photographer, Unsplash URL) or a generated piece (a small React component). The shared
  layout renders the list in order.
- **Photos.** Photos are downloaded from Unsplash, resized with macOS `sips`, and
  committed. The site never loads images from Unsplash at runtime.

## 6. Process

1. Change the routes and the hub (§4), with all three boards as placeholders. Commit.
2. Build **Calm**: pick photos, generate artifacts, then Nikita reviews it in the browser.
   Make Nikita's changes, one commit per round of feedback.
3. Build **Editorial** the same way.
4. Build **Plate Room** the same way.

Before each review, the agent checks the board in a real browser at 390 px and 1440 px,
using Claude in Chrome. It looks for horizontal scroll, broken images and the artifact
count, and runs `npm run lint` and `npm run build`.

## 7. Out of scope

- The design systems' content: color roles, type roles, components and states. This gets
  its own spec.
- The final site's content and interactions.
- Deploying to Vercel and creating the GitHub repo. These happen when Nikita asks.
