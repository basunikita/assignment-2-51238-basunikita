import assert from "node:assert/strict";
import test from "node:test";
import { CARDIO_OPTIONS, REPS, SETS, UI_STATE_COPY, WEEK } from "../app/design-system/content.ts";
import { daySummary, weekSummary } from "../app/workout-week/week.ts";
import { readPage } from "./helpers.mjs";

// The page without the RSC payload, which repeats every string, or React's <!-- --> text separators.
function markup() {
  return readPage("/workout-week/")
    .replace(/<script\b[\s\S]*?<\/script>/g, "")
    .replace(/<!-- -->/g, "");
}

function text(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

// Each day's tabpanel, in order: the markup from one role="tabpanel" to the next.
function panels() {
  return markup().split('role="tabpanel"').slice(1);
}

test("has the page heading, the week summary and a link back to the hub", () => {
  const html = markup();
  assert.match(html, /<h1[^>]*>My week<\/h1>/);
  assert.ok(text(html).includes(weekSummary(WEEK, SETS, REPS)));
  assert.match(html, /<a[^>]*href="\/"[^>]*>← Hub<\/a>/);
});

test("has one tab per day, named for its day, with Day 1 selected", () => {
  const html = markup();
  assert.equal((html.match(/role="tablist"/g) ?? []).length, 1);
  const tabs = [...html.matchAll(/<button([^>]*role="tab"[^>]*)>([\s\S]*?)<\/button>/g)];
  assert.equal(tabs.length, 7);
  tabs.forEach(([, attributes, inner], index) => {
    const day = WEEK[index];
    assert.ok(text(inner).includes(`Day ${day.day}: ${day.name}`), `tab ${index + 1}: ${text(inner)}`);
    assert.ok(text(inner).includes(day.short), `tab ${index + 1} has no ${day.short}`);
    assert.match(attributes, new RegExp(`aria-selected="${index === 0}"`));
  });
});

test("each strength day lists its exercises in order, with a rest picker on 90 s", () => {
  const all = panels();
  assert.equal(all.length, 7);
  for (const day of WEEK.filter((each) => each.kind === "Strength")) {
    const panel = all[day.day - 1];
    const panelText = text(panel);
    assert.ok(panelText.includes(daySummary(day, SETS, REPS)), `Day ${day.day} summary`);
    const positions = day.exercises.map((exercise) => panelText.indexOf(exercise));
    assert.ok(positions.every((position) => position !== -1), `Day ${day.day} is missing an exercise`);
    assert.deepEqual([...positions].sort((a, b) => a - b), positions, `Day ${day.day} exercises out of order`);
    assert.match(panel, /<legend[^>]*>Rest between sets<\/legend>/);
    assert.match(panel, new RegExp(`<input[^>]*id="rest-day-${day.day}-90"[^>]*checked=""`));
  }
});

test("each cardio day shows the four options with their steps", () => {
  const all = panels();
  for (const day of WEEK.filter((each) => each.kind === "Cardio")) {
    const panelText = text(all[day.day - 1]);
    assert.ok(panelText.includes("Pick one"), `Day ${day.day}`);
    for (const option of CARDIO_OPTIONS) {
      assert.ok(panelText.includes(option.label), `Day ${day.day}: ${option.label}`);
      assert.ok(panelText.includes(option.detail), `Day ${day.day}: ${option.detail}`);
    }
  }
});

test("each cardio option is a button you can pick", () => {
  const all = panels();
  for (const day of WEEK.filter((each) => each.kind === "Cardio")) {
    const buttons = [...all[day.day - 1].matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/g)].map(([, inner]) => text(inner));
    for (const option of CARDIO_OPTIONS) {
      assert.ok(
        buttons.some((label) => label.includes(option.label) && label.includes(option.detail)),
        `Day ${day.day}: ${option.label} isn't a button`,
      );
    }
  }
});

test("the rest day shows the empty state and no Finish workout", () => {
  const panel = panels()[6];
  assert.match(panel, /data-ui-state="empty"/);
  assert.ok(text(panel).includes(UI_STATE_COPY.empty));
  assert.ok(!panel.includes("Finish workout"));
});

test("Days 1 to 6 each end with one Finish workout button", () => {
  const all = panels();
  assert.equal(all.length, 7);
  all
    .slice(0, 6)
    .forEach((panel, index) => {
      assert.equal((panel.match(/>Finish workout<\/button>/g) ?? []).length, 1, `Day ${index + 1}`);
    });
});

test("keeps the accent fill for Finish workout, with no hazard band", () => {
  const html = markup();
  const filled = [...html.matchAll(/<(\w+)\b[^>]*\bclass="([^"]*)"[^>]*>([^<]*)/g)].filter(([, , classes]) =>
    classes.split(/\s+/).includes("bg-accent"),
  );
  assert.equal(filled.length, 6);
  for (const [, tag, , inner] of filled) assert.deepEqual([tag, inner], ["button", "Finish workout"]);
  assert.ok(!html.includes("repeating-linear-gradient"), "hazard band on the page");
});

test("labels every input and names every button", () => {
  const html = markup();
  assert.ok(html.includes("<input"), "no inputs");
  assert.ok(html.includes("<button"), "no buttons");
  for (const field of html.match(/<input\b[^>]*>/g) ?? []) {
    const id = field.match(/\bid="([^"]+)"/)?.[1];
    assert.ok(id && html.includes(`for="${id}"`), `unlabelled field: ${field}`);
  }
  for (const [, attributes, inner] of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)) {
    assert.ok(text(inner) || /aria-label(?:ledby)?="/.test(attributes), `unnamed button: ${attributes}`);
  }
});

test("has the dialog for the exercise panel", () => {
  assert.match(markup(), /<dialog\b/);
});
