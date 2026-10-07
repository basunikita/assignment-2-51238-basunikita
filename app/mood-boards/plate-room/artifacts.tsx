import { getMood, getSwatch } from "@/app/moods";
import type { Artifact } from "../_components/artifact";
import Specimen from "../_components/Specimen";
import Swatch from "../_components/Swatch";
import { PHOTOS } from "./photos";

const plateRoom = getMood("plate-room");
const SPECIMEN = "bg-surface";
const LABEL = "font-label text-xs font-bold uppercase tracking-[0.14em]";
const HAZARD = "repeating-linear-gradient(-45deg, var(--swatch-safety) 0 18px, var(--swatch-ink) 18px 36px)";

// Day type colors: red legs, blue upper body, green cardio.
const WEEK = [
  ["Mon", "Lower body", "var(--swatch-red)"],
  ["Tue", "Easy run", "var(--swatch-green)"],
  ["Wed", "Upper body", "var(--swatch-blue)"],
  ["Thu", "Stairs + incline", "var(--swatch-green)"],
  ["Fri", "Full body", "linear-gradient(var(--swatch-red) 50%, var(--swatch-blue) 50%)"],
  ["Sat", "Bike ride", "var(--swatch-green)"],
  ["Sun", "Rest", "transparent"],
];

export const PLATE_ROOM_ARTIFACTS: Artifact[] = [
  PHOTOS.bumperPlates,
  {
    kind: "type",
    id: "type-display",
    node: (
      <Specimen caption="Big Shoulders 900 · Display" className={SPECIMEN}>
        <p className="font-display text-6xl font-black uppercase leading-[0.85]">Leg day</p>
      </Specimen>
    ),
  },
  { kind: "color", id: "color-safety", node: <Swatch swatch={getSwatch(plateRoom, "safety")} textToken="ink" className="h-40" /> },
  PHOTOS.barbellFloor,
  {
    kind: "interface",
    id: "ui-buttons",
    node: (
      <div className="flex flex-wrap gap-3 bg-surface p-5">
        <span className="border-2 border-ink bg-accent px-6 py-2 font-display text-2xl font-extrabold uppercase text-on-accent">
          Start
        </span>
        <span className="border-2 border-ink px-6 py-2 font-display text-2xl font-extrabold uppercase">Skip</span>
      </div>
    ),
  },
  {
    kind: "texture",
    id: "texture-hazard",
    node: <div role="img" aria-label="Yellow and black hazard stripes" className="h-28" style={{ backgroundImage: HAZARD }} />,
  },
  PHOTOS.cableMachine,
  { kind: "color", id: "color-red", node: <Swatch swatch={getSwatch(plateRoom, "red")} textToken="panel" className="h-32" /> },
  {
    kind: "interface",
    id: "ui-chips",
    node: (
      <div className={`flex flex-wrap gap-2 bg-surface p-5 ${LABEL}`}>
        <span className="bg-(--swatch-red) px-3 py-1.5 text-(--swatch-panel)">Legs</span>
        <span className="bg-(--swatch-blue) px-3 py-1.5 text-(--swatch-panel)">Upper</span>
        <span className="bg-(--swatch-green) px-3 py-1.5 text-(--swatch-panel)">Cardio</span>
        <span className="border-2 border-ink px-3 py-1">Rest</span>
      </div>
    ),
  },
  PHOTOS.barbellRack,
  {
    kind: "type",
    id: "type-numbers",
    node: (
      <Specimen caption="Big Shoulders Stencil 800 · Numbers" className={SPECIMEN}>
        <p className="font-numbers text-5xl font-extrabold leading-none whitespace-nowrap sm:text-7xl">3 × 10</p>
      </Specimen>
    ),
  },
  {
    kind: "texture",
    id: "texture-rubber",
    node: (
      <svg viewBox="0 0 200 160" role="img" aria-label="Black rubber gym floor with light flecks" className="block h-auto w-full bg-ink">
        <filter id="plate-rubber">
          <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="4" />
          {/* RGB is the steel swatch; the alpha row keeps only the brightest specks. */}
          <feColorMatrix type="matrix" values="0 0 0 0 0.74  0 0 0 0 0.73  0 0 0 0 0.71  0 0 0 9 -5.6" />
        </filter>
        <rect width="200" height="160" filter="url(#plate-rubber)" />
      </svg>
    ),
  },
  PHOTOS.dumbbellRack,
  { kind: "color", id: "color-blue", node: <Swatch swatch={getSwatch(plateRoom, "blue")} textToken="panel" className="h-36" /> },
  {
    kind: "interface",
    id: "ui-timer",
    node: (
      <div className="bg-surface p-5">
        <p className={`${LABEL} text-muted`}>Rest</p>
        <p className="font-numbers text-7xl font-extrabold leading-none">1:30</p>
        <div className="mt-3 h-3 border-2 border-ink">
          <div className="h-full w-2/3 bg-accent" />
        </div>
      </div>
    ),
  },
  PHOTOS.gymSign,
  {
    kind: "type",
    id: "type-body",
    node: (
      <Specimen caption="Archivo 400 · Body" className={SPECIMEN}>
        <p className="text-base leading-relaxed">
          Hold the weight at your chest. Sit back and down until your thighs are level, then stand up tall.
        </p>
      </Specimen>
    ),
  },
  { kind: "color", id: "color-green", node: <Swatch swatch={getSwatch(plateRoom, "green")} textToken="panel" className="h-28" /> },
  PHOTOS.plate45,
  {
    kind: "interface",
    id: "ui-barbell",
    node: (
      <div className="bg-surface p-5">
        <svg viewBox="0 0 240 80" role="img" aria-label="A barbell with one red plate on each side" className="block h-auto w-full">
          <rect x="4" y="36" width="232" height="8" className="fill-(--swatch-steel)" />
          <rect x="44" y="8" width="16" height="64" strokeWidth="2" className="fill-(--swatch-red) stroke-ink" />
          <rect x="180" y="8" width="16" height="64" strokeWidth="2" className="fill-(--swatch-red) stroke-ink" />
          <rect x="62" y="28" width="6" height="24" className="fill-ink" />
          <rect x="172" y="28" width="6" height="24" className="fill-ink" />
        </svg>
        <p className={`mt-2 ${LABEL}`}>Bar 45 lb + 10 lb a side</p>
      </div>
    ),
  },
  {
    kind: "texture",
    id: "texture-knurl",
    node: (
      <div
        role="img"
        aria-label="Knurled bar grip"
        className="h-24 bg-(--swatch-steel)"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, var(--swatch-muted) 0 1.5px, transparent 1.5px 7px), repeating-linear-gradient(-45deg, var(--swatch-muted) 0 1.5px, transparent 1.5px 7px)",
        }}
      />
    ),
  },
  PHOTOS.rubberFloor,
  { kind: "color", id: "color-ink", node: <Swatch swatch={getSwatch(plateRoom, "ink")} textToken="panel" className="h-32" /> },
  {
    kind: "interface",
    id: "ui-station",
    node: (
      <div className="bg-surface">
        <div className="h-3" style={{ backgroundImage: HAZARD }} />
        <div className="p-5">
          <p className={`${LABEL} text-muted`}>Station 3</p>
          <p className="mt-1 font-display text-3xl font-extrabold uppercase leading-none">Goblet squat</p>
          <p className="mt-3 font-numbers text-4xl font-extrabold leading-none whitespace-nowrap sm:text-5xl">3 × 10</p>
          <p className="mt-1 text-sm">20 lb dumbbell · rest 90 s</p>
        </div>
      </div>
    ),
  },
  {
    kind: "type",
    id: "type-plates",
    node: (
      <Specimen caption="Stencil numerals · plate weights" className={SPECIMEN}>
        <p className="grid grid-cols-2 gap-x-4 font-numbers text-5xl font-extrabold leading-tight"><span>45</span><span>25</span><span>10</span><span>5</span></p>
        <p className={`mt-1 ${LABEL}`}>Pounds per plate</p>
      </Specimen>
    ),
  },
  {
    kind: "texture",
    id: "texture-floor-line",
    node: (
      <div role="img" aria-label="Painted concrete with a yellow floor line" className="relative h-40 bg-bg">
        <svg viewBox="0 0 200 160" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 h-full w-full">
          <filter id="plate-concrete">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="4" seed="9" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="200" height="160" filter="url(#plate-concrete)" opacity="0.2" />
        </svg>
        <div className="absolute inset-x-0 bottom-8 h-4 bg-accent" />
      </div>
    ),
  },
  {
    kind: "interface",
    id: "ui-week",
    node: (
      <div className="bg-surface p-5">
        <p className={LABEL}>This week</p>
        <ul className="mt-3 text-sm">
          {WEEK.map(([day, workout, color]) => (
            <li key={day} className="flex items-center gap-3 border-t border-line py-1.5">
              <span className="h-5 w-2.5 shrink-0 border border-ink" style={{ background: color }} />
              <span className="w-9 font-bold uppercase">{day}</span>
              <span>{workout}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
];
