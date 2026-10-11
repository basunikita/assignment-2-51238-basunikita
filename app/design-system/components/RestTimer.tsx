"use client";

import { useEffect, useState } from "react";
import { useRecipe } from "../RecipeContext";
import { formatSeconds, newTimer, resetTimer, tick, toggleRunning } from "../timer";
import Button from "./Button";

// Remount (change the key) to use a new length; nothing persists across reloads.
export default function RestTimer({ seconds }: { seconds: number }) {
  const recipe = useRecipe();
  const [timer, setTimer] = useState(() => newTimer(seconds));

  useEffect(() => {
    if (!timer.running) return;
    const interval = setInterval(() => setTimer((current) => tick(current)), 1000);
    return () => clearInterval(interval);
  }, [timer.running]);

  const finished = timer.remaining === 0;
  return (
    <div className={recipe.timer.root}>
      <p className={recipe.timer.label}>Rest</p>
      <p className={recipe.timer.digits}>{formatSeconds(timer.remaining)}</p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={() => setTimer(toggleRunning)}>{timer.running ? "Pause" : finished ? "Start again" : "Start"}</Button>
        <Button variant="secondary" onClick={() => setTimer(resetTimer)}>
          Reset
        </Button>
      </div>
      <p aria-live="polite" className="sr-only">
        {finished ? "Rest over" : ""}
      </p>
    </div>
  );
}
