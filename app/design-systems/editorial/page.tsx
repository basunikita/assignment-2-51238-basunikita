import type { Metadata } from "next";
import DesignSystemPage from "@/app/design-system/DesignSystemPage";
import { EDITORIAL_RECIPE } from "@/app/design-system/recipes/editorial";
import { EDITORIAL_FONTS } from "@/app/fonts/editorial";
import { getMood } from "@/app/moods";

export const metadata: Metadata = { title: "Editorial design system" };

export default function EditorialDesignSystem() {
  return <DesignSystemPage mood={getMood("editorial")} recipe={EDITORIAL_RECIPE} fontClass={EDITORIAL_FONTS} />;
}
