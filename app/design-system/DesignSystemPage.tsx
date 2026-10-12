"use client";

import Link from "next/link";
import { useState, type CSSProperties, type ReactNode } from "react";
import { contrast } from "@/app/contrast";
import { getSwatch, moodStyle, type Mood } from "@/app/moods";
import Badge from "./components/Badge";
import Button from "./components/Button";
import Checkbox from "./components/Checkbox";
import DetailPanel, { ExerciseFacts } from "./components/DetailPanel";
import ExerciseList from "./components/ExerciseList";
import FilterChips, { Chip } from "./components/FilterChips";
import RadioGroup from "./components/RadioGroup";
import RestTimer from "./components/RestTimer";
import Select from "./components/Select";
import SetTracker from "./components/SetTracker";
import StatePanel from "./components/StatePanel";
import Tabs, { TabSample } from "./components/Tabs";
import TextInput from "./components/TextInput";
import TextLink from "./components/TextLink";
import Toggle from "./components/Toggle";
import WorkoutCard from "./components/WorkoutCard";
import { CARDIO_OPTIONS, DAY_FILTERS, REST_OPTIONS, UI_STATE_COPY, WEEK, type DayFilter } from "./content";
import type { FrozenState, Recipe } from "./recipe";
import { RecipeProvider, useRecipe } from "./RecipeContext";

type RoleName = keyof Mood["roles"];

const COLOR_ROLES: { role: RoleName; name: string; use: string }[] = [
  { role: "bg", name: "Background", use: "The page" },
  { role: "surface", name: "Surface", use: "Cards, the timer, the tab track" },
  { role: "ink", name: "Text", use: "Body text and headings" },
  { role: "muted", name: "Muted text", use: "Labels and hints" },
  { role: "line", name: "Border", use: "Dividers and decorative lines" },
  { role: "control", name: "Control", use: "Field, checkbox, radio and toggle outlines" },
  { role: "accent", name: "Accent", use: "The primary action and on states" },
  { role: "focus", name: "Focus", use: "The keyboard focus ring" },
];

const SPACING = [4, 8, 12, 16, 24, 32];

const STATES = ["rest", "hover", "focus", "pressed", "selected", "disabled"] as const;
type StateName = (typeof STATES)[number];

const CONTROLS: { id: string; name: string; states: StateName[] }[] = [
  { id: "primary", name: "Primary button", states: ["rest", "hover", "focus", "pressed", "disabled"] },
  { id: "secondary", name: "Secondary button", states: ["rest", "hover", "focus", "pressed", "disabled"] },
  { id: "chip", name: "Filter chip", states: ["rest", "hover", "focus", "pressed", "selected", "disabled"] },
  { id: "checkbox", name: "Checkbox", states: ["rest", "hover", "focus", "selected", "disabled"] },
  { id: "toggle", name: "Toggle", states: ["rest", "hover", "focus", "selected", "disabled"] },
  { id: "tab", name: "Tab", states: ["rest", "hover", "focus", "selected"] },
];

function roleRatio(mood: Mood, role: RoleName): string {
  const hex = (name: RoleName) => getSwatch(mood, mood.roles[name]).hex;
  const ratio = (a: RoleName, b: RoleName) => `${contrast(hex(a), hex(b)).toFixed(1)}:1`;
  if (role === "bg") return `${ratio("ink", "bg")} with text`;
  if (role === "surface") return `${ratio("ink", "surface")} with text`;
  if (role === "accent") {
    const onBackground = contrast(hex("accent"), hex("bg"));
    const textUse = onBackground >= 4.5 ? "" : " (fills only, not text)";
    return `${ratio("on-accent", "accent")} with its text · ${onBackground.toFixed(1)}:1 on background${textUse}`;
  }
  if (role === "line") return `${ratio("line", "bg")} · decorative`;
  return `${ratio(role, "bg")} on background`;
}

function Section({ number, id, title, children }: { number: number; id: string; title: string; children: ReactNode }) {
  const recipe = useRecipe();
  return (
    <section data-section={id} aria-labelledby={`${id}-title`} className="mt-14">
      <h2 id={`${id}-title`} className={`flex items-center gap-3 ${recipe.sectionTitle}`}>
        <span className={recipe.sectionNumber}>{number}</span>
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Header({ mood }: { mood: Mood }) {
  const recipe = useRecipe();
  return (
    <header>
      <Link href="/" className={`text-sm underline underline-offset-4 ${recipe.focus}`}>
        ← Hub
      </Link>
      <h1 className={`mt-4 ${recipe.pageTitle}`}>{mood.name} · Design System</h1>
      <p className={`mt-3 max-w-prose ${recipe.hint}`}>
        Every component the workout site can use, in the {mood.name} style. The components in section 4 are live; section 5
        freezes each state side by side.
      </p>
    </header>
  );
}

function ColorRoles({ mood }: { mood: Mood }) {
  const recipe = useRecipe();
  return (
    <Section number={1} id="color" title="Color roles">
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {COLOR_ROLES.map(({ role, name, use }) => {
          const swatch = getSwatch(mood, mood.roles[role]);
          return (
            <li key={role} data-role={role} className="grid content-start gap-0.5">
              <div className={recipe.swatch} style={{ background: swatch.hex }} />
              <p className="mt-2 font-bold">{name}</p>
              <p className={recipe.hint}>
                {swatch.name} · {swatch.hex}
              </p>
              <p className={recipe.hint}>{use}</p>
              <p className="text-sm font-bold">{roleRatio(mood, role)}</p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

function TypeRoles() {
  const recipe = useRecipe();
  return (
    <Section number={2} id="type" title="Type roles">
      <dl className="grid gap-6">
        {recipe.typeRoles.map((typeRole) => (
          <div key={typeRole.role} className="grid gap-2 border-b border-line pb-4 sm:grid-cols-[11rem_1fr] sm:items-baseline">
            <dt className={recipe.label}>
              {typeRole.role}
              <span className="block normal-case tracking-normal">{typeRole.spec}</span>
            </dt>
            <dd className={typeRole.className}>{typeRole.sample}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

function SpacingAndShape() {
  const recipe = useRecipe();
  return (
    <Section number={3} id="spacing" title="Spacing and shape">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <p className={recipe.label}>Spacing scale</p>
          <ul className="mt-3 flex items-end gap-3">
            {SPACING.map((size) => (
              <li key={size} className="grid justify-items-center gap-1">
                <span className="block w-6 bg-accent" style={{ height: size * 2 }} />
                <span className="text-xs tabular-nums">{size}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className={recipe.label}>Corners, border and shadow</p>
          <ul className="mt-3 flex flex-wrap gap-4">
            {recipe.shape.corners.map((corner) => (
              <li key={corner.label} className="grid max-w-24 justify-items-center gap-1 text-center">
                <span className={`block size-16 border-2 border-ink bg-surface ${corner.className}`} />
                <span className="text-xs">{corner.label}</span>
              </li>
            ))}
            <li className="grid max-w-24 justify-items-center gap-1 text-center">
              <span className={`block size-16 bg-bg ${recipe.shape.border}`} />
              <span className="text-xs">{recipe.shape.borderLabel}</span>
            </li>
            <li className="grid max-w-24 justify-items-center gap-1 text-center">
              <span className={`block size-16 border border-line bg-surface ${recipe.shape.shadow}`} />
              <span className="text-xs">{recipe.shape.shadowLabel}</span>
            </li>
          </ul>
        </div>
      </div>
    </Section>
  );
}

function ComponentPanel({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  const recipe = useRecipe();
  return (
    <div id={`component-${id}`} data-component={id} className={recipe.panel}>
      <h3 className={recipe.label}>{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Components() {
  const recipe = useRecipe();
  const [soundOn, setSoundOn] = useState(true);
  const [filter, setFilter] = useState<DayFilter>("All");
  const [restSeconds, setRestSeconds] = useState("90");
  const [cardio, setCardio] = useState(CARDIO_OPTIONS[2].value);
  const [openExercise, setOpenExercise] = useState<string | null>(null);

  const legDay = WEEK[4];
  const restLabel = REST_OPTIONS.find((option) => option.value === restSeconds)?.label ?? "90 s";
  const days = WEEK.filter((day) => filter === "All" || day.kind === filter);
  const cardioDetail = CARDIO_OPTIONS.find((option) => option.value === cardio)?.detail;

  return (
    <Section number={4} id="components" title="Components">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <ComponentPanel id="button" title="Buttons">
          <div className="flex flex-wrap gap-3">
            <Button>Start workout</Button>
            <Button variant="secondary">Skip</Button>
          </div>
        </ComponentPanel>
        <ComponentPanel id="link" title="Link">
          <TextLink href="#component-list-rows">See all exercises →</TextLink>
        </ComponentPanel>
        <ComponentPanel id="text-input" title="Text input">
          <TextInput id="weight-used" label="Weight used (lb)" inputMode="decimal" placeholder="e.g. 25" />
        </ComponentPanel>
        <ComponentPanel id="select" title="Select">
          <Select
            id="cardio-option"
            label="Cardio option"
            options={CARDIO_OPTIONS}
            value={cardio}
            onChange={(event) => setCardio(event.target.value)}
            hint={cardioDetail}
          />
        </ComponentPanel>
        <ComponentPanel id="radio" title="Radios">
          <RadioGroup name="rest" legend="Rest between sets" options={REST_OPTIONS} value={restSeconds} onChange={setRestSeconds} />
        </ComponentPanel>
        <ComponentPanel id="checkbox" title="Checkbox">
          <Checkbox id="set-one-done" label="Set 1 · 10 reps" defaultChecked />
        </ComponentPanel>
        <ComponentPanel id="toggle" title="Toggle">
          <Toggle label="Sound when rest ends" checked={soundOn} onChange={setSoundOn} />
        </ComponentPanel>
        <ComponentPanel id="tabs" title="Tabs">
          <Tabs
            label="Workout views"
            tabs={[
              { id: "today", label: "Today", content: <p>Day 1 · Back and biceps</p> },
              { id: "week", label: "Week", content: <p>Three strength days, three cardio days and a rest day.</p> },
              { id: "notes", label: "Notes", content: <p>Every strength exercise is 3 sets of 10.</p> },
            ]}
          />
        </ComponentPanel>
        <ComponentPanel id="chips" title="Filter chips">
          <FilterChips label="Filter the week" options={DAY_FILTERS} selected={filter} onSelect={(option) => setFilter(option as DayFilter)} />
          <ul className="mt-4 grid gap-2">
            {days.map((day) => (
              <li key={day.day} className="flex items-center justify-between gap-2">
                <span>
                  Day {day.day} · {day.name}
                </span>
                <Badge tone={day.tone}>{day.kind}</Badge>
              </li>
            ))}
          </ul>
        </ComponentPanel>
        <ComponentPanel id="card" title="Card">
          <WorkoutCard day={WEEK[0]} today />
        </ComponentPanel>
        <ComponentPanel id="badge" title="Badges">
          <div className="flex flex-wrap gap-2">
            <Badge tone="today">Today</Badge>
            <Badge tone="done">Done</Badge>
            <Badge tone="upper">Upper body</Badge>
            <Badge tone="legs">Legs</Badge>
            <Badge tone="cardio">Cardio</Badge>
            <Badge tone="rest">Rest</Badge>
          </div>
        </ComponentPanel>
        <ComponentPanel id="list-rows" title={`List rows · Day ${legDay.day} · ${legDay.name}`}>
          <ExerciseList exercises={legDay.exercises} onOpen={setOpenExercise} />
        </ComponentPanel>
        <ComponentPanel id="detail-panel" title="Detail panel">
          <div className={recipe.dialog.preview}>
            <p className={recipe.dialog.title}>Bulgarian split squats</p>
            <ExerciseFacts exercise="Bulgarian split squats" restLabel={restLabel} />
          </div>
          <Button variant="secondary" className="mt-4" onClick={() => setOpenExercise("Bulgarian split squats")}>
            Open as a panel
          </Button>
        </ComponentPanel>
        <ComponentPanel id="rest-timer" title="Rest timer">
          <RestTimer key={restSeconds} seconds={Number(restSeconds)} />
        </ComponentPanel>
        <ComponentPanel id="set-tracker" title="Set tracker">
          <SetTracker exercise="Face pulls" sets={3} />
        </ComponentPanel>
      </div>
      <DetailPanel exercise={openExercise} restLabel={restLabel} onClose={() => setOpenExercise(null)} />
    </Section>
  );
}

function frozen(state: StateName): FrozenState | undefined {
  return state === "hover" || state === "focus" || state === "pressed" ? state : undefined;
}

function Sample({ control, state }: { control: string; state: StateName }) {
  const frozenState = frozen(state);
  const disabled = state === "disabled";
  const selected = state === "selected";
  if (control === "primary") return <Button state={frozenState} disabled={disabled}>Start</Button>;
  if (control === "secondary") return <Button variant="secondary" state={frozenState} disabled={disabled}>Skip</Button>;
  if (control === "chip") return <Chip pressed={selected} state={frozenState} disabled={disabled}>Cardio</Chip>;
  if (control === "checkbox") {
    return <Checkbox id={`state-checkbox-${state}`} label="Set 1" checked={selected} readOnly state={frozenState} disabled={disabled} />;
  }
  if (control === "toggle") {
    return <Toggle label="Sound" checked={selected} onChange={() => undefined} state={frozenState} disabled={disabled} />;
  }
  // Roving tabindex only focuses the selected tab, so the focus sample is selected too.
  return <TabSample label="Today" selected={selected || state === "focus"} state={frozenState} />;
}

function ControlStates() {
  const recipe = useRecipe();
  return (
    <Section number={5} id="control-states" title="Control states">
      <p className={recipe.hint}>
        Frozen copies of each control, styled by the same classes as the live components, so hover, focus and press look
        exactly like this.
      </p>
      <div inert className="mt-6 grid gap-6">
        {CONTROLS.map((control) => (
          <div key={control.id} className="grid gap-3 lg:grid-cols-[9rem_1fr] lg:items-center">
            <p className="font-bold">{control.name}</p>
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {STATES.map((state) => {
                const applies = control.states.includes(state);
                return (
                  <li
                    key={state}
                    data-cell={`${control.id}-${state}`}
                    data-na={applies ? undefined : ""}
                    className="grid min-h-20 content-start justify-items-start gap-2"
                  >
                    <span className={recipe.label}>{state}</span>
                    {applies ? <Sample control={control.id} state={state} /> : <span className={recipe.hint}>n/a</span>}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

function UiStates() {
  return (
    <Section number={6} id="ui-states" title="UI states">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatePanel kind="empty">{UI_STATE_COPY.empty}</StatePanel>
        <StatePanel kind="loading">{UI_STATE_COPY.loading}</StatePanel>
        <StatePanel kind="error" action={<Button variant="secondary">Try again</Button>}>
          {UI_STATE_COPY.error}
        </StatePanel>
        <StatePanel kind="success">{UI_STATE_COPY.success}</StatePanel>
      </div>
    </Section>
  );
}

type DesignSystemPageProps = { mood: Mood; recipe: Recipe; fontClass: string };

export default function DesignSystemPage({ mood, recipe, fontClass }: DesignSystemPageProps) {
  return (
    <RecipeProvider recipe={recipe}>
      <div className={`${fontClass} flex-1 bg-bg font-body text-ink`} style={moodStyle(mood) as CSSProperties}>
        <main className="mx-auto max-w-[1200px] px-4 py-8 sm:px-8 sm:py-12">
          <Header mood={mood} />
          <ColorRoles mood={mood} />
          <TypeRoles />
          <SpacingAndShape />
          <Components />
          <ControlStates />
          <UiStates />
        </main>
      </div>
    </RecipeProvider>
  );
}
