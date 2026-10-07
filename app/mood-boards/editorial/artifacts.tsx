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
  bw(PHOTOS.kettlebells),
  {
    kind: "interface",
    id: "ui-masthead",
    node: (
      <div className="p-5">
        <p className="font-display text-5xl font-bold tracking-tight">The Week</p>
        <div className={`mt-2 flex flex-wrap justify-between gap-x-3 gap-y-1 border-t-4 border-ink pt-2 ${LABEL}`}>
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
          Go at a pace where you could still hold a conversation. Walking breaks are part of the plan, not a
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
        <div className="flex gap-3 border-b border-line font-label text-[13px] font-bold sm:gap-5 sm:text-sm">
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
