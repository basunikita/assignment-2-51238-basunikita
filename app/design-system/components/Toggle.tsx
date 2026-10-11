"use client";

import { useId } from "react";
import type { FrozenState } from "../recipe";
import { useRecipe } from "../RecipeContext";

type ToggleProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  state?: FrozenState;
  disabled?: boolean;
};

export default function Toggle({ label, checked, onChange, state, disabled = false }: ToggleProps) {
  const recipe = useRecipe();
  const labelId = useId();
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        disabled={disabled}
        data-state={state}
        onClick={() => onChange(!checked)}
        className={`${recipe.toggle.track} ${recipe.focus}`}
      >
        <span aria-hidden="true" className={recipe.toggle.thumb} />
      </button>
      <span id={labelId} className={recipe.choiceLabel}>
        {label}
      </span>
    </div>
  );
}
