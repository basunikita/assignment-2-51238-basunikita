import { getMood, getSwatch } from "@/app/moods";
import type { Artifact } from "../_components/artifact";
import Specimen from "../_components/Specimen";
import Swatch from "../_components/Swatch";
import { PHOTOS } from "./photos";

const calm = getMood("calm");
const SPECIMEN = "rounded-tile border border-line";
const CARD = "rounded-tile border border-line p-4";
const PRIMARY = "inline-block whitespace-nowrap rounded-full bg-accent px-4 py-2.5 text-sm font-bold text-on-accent sm:px-5 sm:text-base";
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
        <p className="text-4xl font-extrabold leading-none whitespace-nowrap sm:text-6xl">Day 2</p>
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
      <div className={`${CARD} text-center`}>
        <p className={`text-muted ${LABEL}`}>Set 2 of 3</p>
        <div className="mt-2 flex items-center justify-center gap-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-accent text-xl font-bold text-accent">
            −
          </span>
          <p className="w-14 text-4xl font-extrabold leading-none">10</p>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-xl font-bold text-on-accent">
            +
          </span>
        </div>
        <p className={`mt-2 text-muted ${LABEL}`}>Reps</p>
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
              <span className="whitespace-nowrap font-bold">{sets}</span>
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
        <p className="text-4xl font-extrabold leading-none whitespace-nowrap sm:text-5xl">3 × 10</p>
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
      <div className={`${CARD} flex items-center gap-3 pr-8`}>
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
