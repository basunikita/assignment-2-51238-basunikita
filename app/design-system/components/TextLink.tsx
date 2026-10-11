"use client";

import type { AnchorHTMLAttributes } from "react";
import { useRecipe } from "../RecipeContext";

export default function TextLink({ className = "", ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const recipe = useRecipe();
  return <a className={`${recipe.link} ${recipe.focus} ${className}`} {...props} />;
}
