"use client";

import { useEffect, useRef } from "react";
import Button from "@/app/design-system/components/Button";
import ExerciseList from "@/app/design-system/components/ExerciseList";
import RadioGroup from "@/app/design-system/components/RadioGroup";
import StatePanel from "@/app/design-system/components/StatePanel";
import { REPS, REST_OPTIONS, SETS, UI_STATE_COPY, type WorkoutDay } from "@/app/design-system/content";
import { useRecipe } from "@/app/design-system/RecipeContext";
import { daySummary } from "../week";
import CardioPicker from "./CardioPicker";

type DayPanelProps = {
  day: WorkoutDay;
  rest: string;
  onRestChange: (value: string) => void;
  isDone: (exercise: string) => boolean;
  onOpen: (exercise: string) => void;
  cardioPick: string | null;
  onCardioPick: (value: string | null) => void;
  finished: boolean;
  onFinish: () => void;
};

export default function DayPanel({
  day,
  rest,
  onRestChange,
  isDone,
  onOpen,
  cardioPick,
  onCardioPick,
  finished,
  onFinish,
}: DayPanelProps) {
  const recipe = useRecipe();
  const successRef = useRef<HTMLDivElement>(null);

  // Finish workout disappears when pressed, so keyboard focus moves to the message that replaces it.
  useEffect(() => {
    if (finished) successRef.current?.focus();
  }, [finished]);

  // The recipe's tab panel is bold; font-normal lets the day's own text set its weight.
  return (
    <div className="grid gap-6 font-normal">
      <div>
        <p className={recipe.label}>Day {day.day}</p>
        <h2 className={`mt-2 ${recipe.sectionTitle}`}>{day.name}</h2>
        {day.kind === "Strength" && <p className={`mt-2 ${recipe.card.meta}`}>{daySummary(day, SETS, REPS)}</p>}
        {day.kind === "Cardio" && !cardioPick && <p className={`mt-2 ${recipe.hint}`}>Pick one</p>}
      </div>
      {day.kind === "Strength" && (
        <>
          <RadioGroup
            name={`rest-day-${day.day}`}
            legend="Rest between sets"
            options={REST_OPTIONS}
            value={rest}
            onChange={onRestChange}
          />
          <ExerciseList exercises={day.exercises} onOpen={onOpen} isDone={isDone} />
        </>
      )}
      {day.kind === "Cardio" && <CardioPicker pick={cardioPick} onPick={onCardioPick} />}
      {day.kind === "Rest" && <StatePanel kind="empty">{UI_STATE_COPY.empty}</StatePanel>}
      {day.kind !== "Rest" &&
        (finished ? (
          <div ref={successRef} tabIndex={-1} className={recipe.focus}>
            <StatePanel kind="success">{UI_STATE_COPY.success}</StatePanel>
          </div>
        ) : (
          <div>
            <Button onClick={onFinish}>Finish workout</Button>
          </div>
        ))}
    </div>
  );
}
