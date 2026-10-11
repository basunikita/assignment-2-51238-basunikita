"use client";

import { REPS, SETS } from "../content";
import { useRecipe } from "../RecipeContext";

export default function ExerciseList({ exercises, onOpen }: { exercises: string[]; onOpen: (exercise: string) => void }) {
  const recipe = useRecipe();
  return (
    <ul className={recipe.rows.list}>
      {exercises.map((exercise) => (
        <li key={exercise} className={recipe.rows.item}>
          <button type="button" onClick={() => onOpen(exercise)} className={`${recipe.rows.row} ${recipe.focus}`}>
            <span className={recipe.rows.name}>{exercise}</span>
            <span className={recipe.rows.sets}>
              {SETS} × {REPS} <span aria-hidden="true">›</span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
