"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import type { FrozenState } from "../recipe";
import { useRecipe } from "../RecipeContext";

// className is added to that one tab, e.g. to give a selected tab its own fill.
type Tab = { id: string; label: ReactNode; content: ReactNode; className?: string };

type TabsProps = {
  label: string;
  tabs: Tab[];
  // Added to the recipe's list and tab classes, e.g. to stretch the tabs across a strip.
  listClassName?: string;
  tabClassName?: string;
};

export default function Tabs({ label, tabs, listClassName = "", tabClassName = "" }: TabsProps) {
  const recipe = useRecipe();
  const baseId = useId();
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const moveTo = (index: number) => {
    const next = (index + tabs.length) % tabs.length;
    setSelected(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const moves: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: tabs.length - 1 };
    if (event.key in moves) {
      event.preventDefault();
      moveTo(moves[event.key]);
    }
  };

  return (
    <div>
      <div role="tablist" aria-label={label} className={`${recipe.tabs.list} ${listClassName}`}>
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${tab.id}`}
            aria-controls={`${baseId}-panel-${tab.id}`}
            aria-selected={index === selected}
            tabIndex={index === selected ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={`${recipe.tabs.tab} ${tabClassName} ${tab.className ?? ""} ${recipe.focus}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={index !== selected}
          className={recipe.tabs.panel}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}

// One frozen tab for the control-states grid.
export function TabSample({ label, selected, state }: { label: string; selected: boolean; state?: FrozenState }) {
  const recipe = useRecipe();
  return (
    <div role="tablist" aria-label={`${label} tab sample`} className={recipe.tabs.list}>
      <button
        type="button"
        role="tab"
        aria-selected={selected}
        tabIndex={-1}
        data-state={state}
        className={`${recipe.tabs.tab} ${recipe.focus}`}
      >
        {label}
      </button>
    </div>
  );
}
