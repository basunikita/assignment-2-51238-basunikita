"use client";

import type { ButtonHTMLAttributes } from "react";
import type { FrozenState } from "../recipe";
import { useRecipe } from "../RecipeContext";

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & { pressed: boolean; state?: FrozenState };

export function Chip({ pressed, state, className = "", ...props }: ChipProps) {
  const recipe = useRecipe();
  return (
    <button
      type="button"
      aria-pressed={pressed}
      data-state={state}
      className={`${recipe.chip} ${recipe.focus} ${className}`}
      {...props}
    />
  );
}

type FilterChipsProps = {
  label: string;
  options: readonly string[];
  selected: string;
  onSelect: (option: string) => void;
};

export default function FilterChips({ label, options, selected, onSelect }: FilterChipsProps) {
  const recipe = useRecipe();
  return (
    <div role="group" aria-label={label} className={recipe.chipGroup}>
      {options.map((option) => (
        <Chip key={option} pressed={option === selected} onClick={() => onSelect(option)}>
          {option}
        </Chip>
      ))}
    </div>
  );
}
