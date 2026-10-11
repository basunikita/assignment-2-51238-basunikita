import assert from "node:assert/strict";
import test from "node:test";
import { progressLabel, progressPercent } from "../app/design-system/progress.ts";
import { formatSeconds, newTimer, resetTimer, tick, toggleRunning } from "../app/design-system/timer.ts";

test("formats seconds as m:ss", () => {
  assert.equal(formatSeconds(90), "1:30");
  assert.equal(formatSeconds(120), "2:00");
  assert.equal(formatSeconds(65), "1:05");
  assert.equal(formatSeconds(0), "0:00");
});

test("a new timer is full and paused", () => {
  assert.deepEqual(newTimer(90), { total: 90, remaining: 90, running: false });
});

test("a paused timer doesn't tick", () => {
  assert.deepEqual(tick(newTimer(90)), newTimer(90));
});

test("a running timer counts down one second per tick", () => {
  const running = toggleRunning(newTimer(90));
  assert.deepEqual(tick(running), { total: 90, remaining: 89, running: true });
});

test("the timer stops at zero", () => {
  const last = { total: 90, remaining: 1, running: true };
  assert.deepEqual(tick(last), { total: 90, remaining: 0, running: false });
  assert.deepEqual(tick(tick(last)), { total: 90, remaining: 0, running: false });
});

test("toggling pauses and resumes without losing time", () => {
  const paused = toggleRunning({ total: 90, remaining: 42, running: true });
  assert.deepEqual(paused, { total: 90, remaining: 42, running: false });
  assert.deepEqual(toggleRunning(paused), { total: 90, remaining: 42, running: true });
});

test("starting a finished timer runs it again from the top", () => {
  assert.deepEqual(toggleRunning({ total: 90, remaining: 0, running: false }), { total: 90, remaining: 90, running: true });
});

test("reset returns to full and paused", () => {
  assert.deepEqual(resetTimer({ total: 60, remaining: 12, running: true }), newTimer(60));
});

test("progress reads as done of total", () => {
  assert.equal(progressLabel(2, 3), "2 of 3 done");
  assert.equal(progressLabel(0, 3), "0 of 3 done");
});

test("progress percent rounds and handles zero sets", () => {
  assert.equal(progressPercent(2, 3), 67);
  assert.equal(progressPercent(3, 3), 100);
  assert.equal(progressPercent(0, 0), 0);
});
