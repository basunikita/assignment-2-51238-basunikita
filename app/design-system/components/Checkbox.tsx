"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import type { FrozenState } from "../recipe";
import { useRecipe } from "../RecipeContext";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  id: string;
  label: ReactNode;
  state?: FrozenState;
};

export default function Checkbox({ id, label, state, className = "", ...props }: CheckboxProps) {
  const recipe = useRecipe();
  return (
    <label htmlFor={id} className={`${recipe.choiceLabel} ${className}`}>
      {/* The native box and its tick share one grid cell, so the tick sits on the box. */}
      <span className="grid shrink-0 place-items-center">
        <input
          id={id}
          type="checkbox"
          data-state={state}
          className={`peer [grid-area:1/1] ${recipe.checkbox} ${recipe.focus}`}
          {...props}
        />
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className={`pointer-events-none [grid-area:1/1] size-3.5 opacity-0 peer-checked:opacity-100 ${recipe.checkmark}`}
        >
          <path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {label}
    </label>
  );
}
