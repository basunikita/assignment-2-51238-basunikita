"use client";

import { REPS, SETS } from "../content";
import { useRecipe } from "../RecipeContext";
import Badge from "./Badge";

type ExerciseListProps = {
  exercises: string[];
  onOpen: (exercise: string) => void;
  isDone?: (exercise: string) => boolean;
};

export default function ExerciseList({ exercises, onOpen, isDone }: ExerciseListProps) {
  const recipe = useRecipe();
  return (
    <ul className={recipe.rows.list}>
      {exercises.map((exercise) => (
        <li key={exercise} className={recipe.rows.item}>
          <button type="button" onClick={() => onOpen(exercise)} className={`${recipe.rows.row} ${recipe.focus}`}>
            <span className={recipe.rows.name}>{exercise}</span>
            <span className="flex shrink-0 items-center gap-2">
              {isDone?.(exercise) && <Badge tone="done">Done</Badge>}
              <span className={recipe.rows.sets}>
                {SETS} × {REPS} <span aria-hidden="true">›</span>
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
