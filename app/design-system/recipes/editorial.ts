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
    base: "inline-flex items-center justify-center gap-2 border px-5 py-3 font-label text-xs font-bold uppercase tracking-[0.12em] transition-[color,background-color,border-color,box-shadow,translate,scale,filter] pressed-state:translate-y-px disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
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
      "group inline-flex h-[22px] w-11 shrink-0 items-center border-[1.5px] border-control bg-bg transition-[color,background-color,border-color,box-shadow,translate,scale,filter] aria-checked:bg-accent hover-state:brightness-95 disabled:cursor-not-allowed disabled:opacity-40",
    thumb: "ml-[3px] size-3.5 bg-control transition-[color,background-color,border-color,box-shadow,translate,scale,filter] group-aria-checked:translate-x-[22px] group-aria-checked:bg-bg",
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
