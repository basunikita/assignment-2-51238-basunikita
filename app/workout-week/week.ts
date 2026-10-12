import type { WorkoutDay } from "../design-system/content";

type Option = { value: string; label: string };

function plural(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

// e.g. "3 strength days, 3 cardio, 1 rest · 3 × 10 every lift"
export function weekSummary(week: WorkoutDay[], sets: number, reps: number): string {
  const count = (kind: WorkoutDay["kind"]) => week.filter((day) => day.kind === kind).length;
  return `${plural(count("Strength"), "strength day")}, ${count("Cardio")} cardio, ${count("Rest")} rest · ${sets} × ${reps} every lift`;
}

// e.g. "7 exercises · 3 × 10"
export function daySummary(day: WorkoutDay, sets: number, reps: number): string {
  return `${plural(day.exercises.length, "exercise")} · ${sets} × ${reps}`;
}

export function restLabel(options: Option[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? value;
}
