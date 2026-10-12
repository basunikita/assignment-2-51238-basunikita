"use client";

import { useEffect, useRef } from "react";
import Button from "@/app/design-system/components/Button";
import { CARDIO_OPTIONS } from "@/app/design-system/content";
import { useRecipe } from "@/app/design-system/RecipeContext";
import CardioCard from "./CardioCard";

type CardioPickerProps = { pick: string | null; onPick: (value: string | null) => void };

// Pressing an option hides the other three; Pick another brings them back.
export default function CardioPicker({ pick, onPick }: CardioPickerProps) {
  const recipe = useRecipe();
  const rootRef = useRef<HTMLDivElement>(null);
  const previousPick = useRef<string | null>(null);
  const chosen = CARDIO_OPTIONS.find((option) => option.value === pick);

  // The pressed control disappears either way, so focus moves to what replaces it.
  useEffect(() => {
    const root = rootRef.current;
    if (pick) root?.querySelector<HTMLButtonElement>("[data-change]")?.focus();
    else if (previousPick.current) root?.querySelector<HTMLButtonElement>(`[data-option="${previousPick.current}"]`)?.focus();
    previousPick.current = pick;
  }, [pick]);

  return (
    <div ref={rootRef}>
      {chosen ? (
        <div className="grid justify-items-start gap-4">
          <div className="w-full">
            <CardioCard label={chosen.label} detail={chosen.detail} />
          </div>
          <Button variant="secondary" data-change onClick={() => onPick(null)}>
            Pick another
          </Button>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {CARDIO_OPTIONS.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                data-option={option.value}
                onClick={() => onPick(option.value)}
                className={`h-full w-full text-left ${recipe.card.root} transition-[background-color,box-shadow,translate] hover-state:bg-bg pressed-state:translate-x-0.5 pressed-state:translate-y-0.5 pressed-state:shadow-none ${recipe.focus}`}
              >
                <span className={recipe.card.body}>
                  <span className={`block ${recipe.card.title}`}>{option.label}</span>
                  <span className="block">{option.detail}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
