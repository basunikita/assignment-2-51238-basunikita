import assert from "node:assert/strict";
import test from "node:test";
import { FORM_CUES, REPS, REST_OPTIONS, SETS, WEEK } from "../app/design-system/content.ts";
import { daySummary, restLabel, weekSummary } from "../app/workout-week/week.ts";

test("the week summary counts Nikita's days", () => {
  assert.equal(weekSummary(WEEK, SETS, REPS), "3 strength days, 3 cardio, 1 rest · 3 × 10 every lift");
});

test("the week summary says day, not days, for one strength day", () => {
  assert.equal(weekSummary([WEEK[0], WEEK[6]], SETS, REPS), "1 strength day, 0 cardio, 1 rest · 3 × 10 every lift");
});

test("a strength day's summary counts its exercises", () => {
  assert.equal(daySummary(WEEK[0], SETS, REPS), "7 exercises · 3 × 10");
  assert.equal(daySummary(WEEK[4], SETS, REPS), "5 exercises · 3 × 10");
});

test("rest labels come from the options", () => {
  assert.equal(restLabel(REST_OPTIONS, "120"), "2 min");
  assert.equal(restLabel(REST_OPTIONS, "60"), "60 s");
});

test("every day has Nikita's tab label", () => {
  assert.deepEqual(
    WEEK.map((day) => day.short),
    ["BACK/BIS", "CARDIO", "SHOULDERS/TRIS", "CARDIO", "LEGS", "CARDIO", "REST"],
  );
});

test("every exercise in the week has form cues", () => {
  for (const day of WEEK) {
    for (const exercise of day.exercises) assert.ok(FORM_CUES[exercise]?.length > 0, `${exercise} has no cues`);
  }
});
