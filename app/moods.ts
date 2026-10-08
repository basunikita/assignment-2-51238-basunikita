export type MoodSlug = "sunrise" | "editorial" | "plate-room";

export type Swatch = {
  token: string;
  name: string;
  hex: string;
  role: string;
};

type ColorRole = "bg" | "surface" | "ink" | "muted" | "line" | "accent" | "on-accent" | "focus";
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
    slug: "sunrise",
    name: "Sunrise",
    tagline: "Sunrise · Matte · Calm",
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
      focus: "dusk",
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
      focus: "ink",
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
      focus: "ink",
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
