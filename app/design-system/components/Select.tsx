"use client";

import type { SelectHTMLAttributes } from "react";
import { useRecipe } from "../RecipeContext";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  hint?: string;
};

export default function Select({ id, label, options, hint, className = "", ...props }: SelectProps) {
  const recipe = useRecipe();
  const hintId = `${id}-hint`;
  return (
    <div className={`grid gap-1.5 ${className}`}>
      <label htmlFor={id} className={recipe.fieldLabel}>
        {label}
      </label>
      <select id={id} aria-describedby={hint ? hintId : undefined} className={`${recipe.field} ${recipe.focus}`} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint && (
        <p id={hintId} className={recipe.hint}>
          {hint}
        </p>
      )}
    </div>
  );
}
