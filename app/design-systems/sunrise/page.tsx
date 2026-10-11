import type { Metadata } from "next";
import DesignSystemPage from "@/app/design-system/DesignSystemPage";
import { SUNRISE_RECIPE } from "@/app/design-system/recipes/sunrise";
import { SUNRISE_FONTS } from "@/app/fonts/sunrise";
import { getMood } from "@/app/moods";

export const metadata: Metadata = { title: "Sunrise design system" };

export default function SunriseDesignSystem() {
  return <DesignSystemPage mood={getMood("sunrise")} recipe={SUNRISE_RECIPE} fontClass={SUNRISE_FONTS} />;
}
