"use client";

import { useEffect, useId, useRef } from "react";
import { FORM_CUES, REPS, SETS } from "../content";
import { useRecipe } from "../RecipeContext";

export function ExerciseFacts({ exercise, restLabel }: { exercise: string; restLabel: string }) {
  const recipe = useRecipe();
  const cues = FORM_CUES[exercise] ?? [];
  return (
    <div className="mt-3 grid gap-3">
      <p className={recipe.dialog.facts}>
        {SETS} × {REPS} · Rest {restLabel}
      </p>
      {cues.length > 0 && (
        <ol className={recipe.dialog.cues}>
          {cues.map((cue) => (
            <li key={cue}>{cue}</li>
          ))}
        </ol>
      )}
    </div>
  );
}

type DetailPanelProps = { exercise: string | null; restLabel: string; onClose: () => void };

// A native modal dialog: it traps focus, closes on Esc and returns focus to the opener.
export default function DetailPanel({ exercise, restLabel, onClose }: DetailPanelProps) {
  const recipe = useRecipe();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (exercise && !dialog.open) dialog.showModal();
    if (!exercise && dialog.open) dialog.close();
  }, [exercise]);

  return (
    <dialog ref={dialogRef} aria-labelledby={titleId} onClose={onClose} className={recipe.dialog.root}>
      {exercise && (
        <>
          <div className="flex items-start justify-between gap-4">
            <h3 id={titleId} className={recipe.dialog.title}>
              {exercise}
            </h3>
            <button type="button" aria-label="Close" onClick={onClose} className={`${recipe.dialog.close} ${recipe.focus}`}>
              ×
            </button>
          </div>
          <ExerciseFacts exercise={exercise} restLabel={restLabel} />
        </>
      )}
    </dialog>
  );
}
