"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import Tabs from "@/app/design-system/components/Tabs";
import { REPS, SETS, WEEK, type WorkoutDay } from "@/app/design-system/content";
import { allDone, noSetsDone, toggleSet } from "@/app/design-system/progress";
import type { Recipe } from "@/app/design-system/recipe";
import { RecipeProvider } from "@/app/design-system/RecipeContext";
import { moodStyle, type Mood } from "@/app/moods";
import { weekSummary } from "../week";
import DayPanel from "./DayPanel";
import ExercisePanel from "./ExercisePanel";

const DEFAULT_REST = "90";

type OpenExercise = { day: number; exercise: string };

// The visible tab shows the number (and the label from lg); the sr-only text is its accessible name.
function DayTabLabel({ day, finished }: { day: WorkoutDay; finished: boolean }) {
  return (
    <>
      <span className="sr-only">{`Day ${day.day}: ${day.name}${finished ? ", finished" : ""}`}</span>
      <span aria-hidden="true" className="grid justify-items-center gap-1">
        <span className="font-numbers text-2xl leading-none">
          {day.day}
          {finished && " ✓"}
        </span>
        <span className="hidden font-label text-[11px] tracking-[0.1em] lg:block">{day.short}</span>
      </span>
    </>
  );
}

type WorkoutWeekProps = { mood: Mood; recipe: Recipe; fontClass: string };

export default function WorkoutWeek({ mood, recipe, fontClass }: WorkoutWeekProps) {
  const [sets, setSets] = useState<Record<string, boolean[]>>({});
  const [rest, setRest] = useState<Record<number, string>>({});
  const [finished, setFinished] = useState<number[]>([]);
  const [open, setOpen] = useState<OpenExercise | null>(null);

  const setsFor = (exercise: string) => sets[exercise] ?? noSetsDone(SETS);
  const restFor = (day: number) => rest[day] ?? DEFAULT_REST;

  const toggle = (exercise: string, index: number) =>
    setSets((current) => ({ ...current, [exercise]: toggleSet(current[exercise] ?? noSetsDone(SETS), index) }));

  return (
    <RecipeProvider recipe={recipe}>
      <div className={`${fontClass} flex-1 bg-bg font-body text-ink`} style={moodStyle(mood) as CSSProperties}>
        <main className="mx-auto max-w-[960px] px-4 py-8 sm:px-8 sm:py-12">
          <header>
            <Link href="/" className={`text-sm underline underline-offset-4 ${recipe.focus}`}>
              ← Hub
            </Link>
            <h1 className={`mt-4 ${recipe.pageTitle}`}>My week</h1>
            <p className={`mt-3 ${recipe.hint}`}>{weekSummary(WEEK, SETS, REPS)}</p>
          </header>
          <div className="mt-8">
            <Tabs
              label="Days of the week"
              listClassName="w-full"
              tabClassName="flex-1"
              tabs={WEEK.map((day) => ({
                id: `day-${day.day}`,
                label: <DayTabLabel day={day} finished={finished.includes(day.day)} />,
                content: (
                  <DayPanel
                    day={day}
                    rest={restFor(day.day)}
                    onRestChange={(value) => setRest((current) => ({ ...current, [day.day]: value }))}
                    isDone={(exercise) => allDone(setsFor(exercise))}
                    onOpen={(exercise) => setOpen({ day: day.day, exercise })}
                    finished={finished.includes(day.day)}
                    onFinish={() => setFinished((current) => (current.includes(day.day) ? current : [...current, day.day]))}
                  />
                ),
              }))}
            />
          </div>
          <ExercisePanel
            exercise={open?.exercise ?? null}
            restSeconds={open ? restFor(open.day) : DEFAULT_REST}
            done={open ? setsFor(open.exercise) : noSetsDone(SETS)}
            onToggle={(index) => {
              if (open) toggle(open.exercise, index);
            }}
            onClose={() => setOpen(null)}
          />
        </main>
      </div>
    </RecipeProvider>
  );
}
