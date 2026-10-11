"use client";

import { REPS, SETS, type WorkoutDay } from "../content";
import { useRecipe } from "../RecipeContext";
import Badge from "./Badge";

export default function WorkoutCard({ day, today = false }: { day: WorkoutDay; today?: boolean }) {
  const recipe = useRecipe();
  return (
    <article className={recipe.card.root}>
      <div aria-hidden="true" className={recipe.card.band} />
      <div className={recipe.card.body}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className={recipe.card.eyebrow}>Day {day.day}</p>
          {today && <Badge tone="today">Today</Badge>}
        </div>
        <h3 className={recipe.card.title}>{day.name}</h3>
        <p className={recipe.card.meta}>
          {day.exercises.length} exercises · {SETS} × {REPS}
        </p>
      </div>
    </article>
  );
}
