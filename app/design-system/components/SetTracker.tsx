"use client";

import { useId } from "react";
import { REPS } from "../content";
import { progressLabel, progressPercent } from "../progress";
import { useRecipe } from "../RecipeContext";
import Checkbox from "./Checkbox";

type SetTrackerProps = {
  exercise: string;
  done: boolean[];
  onToggle: (index: number) => void;
  // Shown above the sets; defaults to the exercise name.
  title?: string;
};

export default function SetTracker({ exercise, done, onToggle, title = exercise }: SetTrackerProps) {
  const recipe = useRecipe();
  const baseId = useId();
  const count = done.filter(Boolean).length;

  return (
    <div className={recipe.tracker.root}>
      <p className={recipe.tracker.title}>{title}</p>
      <ul className="grid gap-2">
        {done.map((isDone, index) => (
          <li key={index}>
            <Checkbox
              id={`${baseId}-set-${index + 1}`}
              label={`Set ${index + 1} · ${REPS} reps`}
              checked={isDone}
              onChange={() => onToggle(index)}
            />
          </li>
        ))}
      </ul>
      <div
        role="progressbar"
        aria-label={`${exercise} sets done`}
        aria-valuemin={0}
        aria-valuemax={done.length}
        aria-valuenow={count}
        aria-valuetext={progressLabel(count, done.length)}
        className={recipe.progress.track}
      >
        <div className={recipe.progress.fill} style={{ width: `${progressPercent(count, done.length)}%` }} />
      </div>
      <p className={recipe.tracker.count}>{progressLabel(count, done.length)}</p>
    </div>
  );
}
