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
