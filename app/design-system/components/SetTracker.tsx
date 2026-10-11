"use client";

import { useId, useState } from "react";
import { REPS } from "../content";
import { progressLabel, progressPercent } from "../progress";
import { useRecipe } from "../RecipeContext";
import Checkbox from "./Checkbox";

// Starts with all but the last set done, so the progress bar has something to show.
export default function SetTracker({ exercise, sets }: { exercise: string; sets: number }) {
  const recipe = useRecipe();
  const baseId = useId();
  const [done, setDone] = useState(() => Array.from({ length: sets }, (_, index) => index < sets - 1));
  const count = done.filter(Boolean).length;

  return (
    <div className={recipe.tracker.root}>
      <p className={recipe.tracker.title}>{exercise}</p>
      <ul className="grid gap-2">
        {done.map((isDone, index) => (
          <li key={index}>
            <Checkbox
              id={`${baseId}-set-${index + 1}`}
              label={`Set ${index + 1} · ${REPS} reps`}
              checked={isDone}
              onChange={() => setDone((current) => current.map((value, i) => (i === index ? !value : value)))}
            />
          </li>
        ))}
      </ul>
      <div
        role="progressbar"
        aria-label={`${exercise} sets done`}
        aria-valuemin={0}
        aria-valuemax={sets}
        aria-valuenow={count}
        aria-valuetext={progressLabel(count, sets)}
        className={recipe.progress.track}
      >
        <div className={recipe.progress.fill} style={{ width: `${progressPercent(count, sets)}%` }} />
      </div>
      <p className={recipe.tracker.count}>{progressLabel(count, sets)}</p>
    </div>
  );
}
