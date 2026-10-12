"use client";

import { useRecipe } from "@/app/design-system/RecipeContext";

// A cardio option in the recipe's card style, without the card's decorative band.
export default function CardioCard({ label, detail }: { label: string; detail: string }) {
  const recipe = useRecipe();
  return (
    <article className={`h-full ${recipe.card.root}`}>
      <div className={recipe.card.body}>
        <h3 className={recipe.card.title}>{label}</h3>
        <p>{detail}</p>
      </div>
    </article>
  );
}
