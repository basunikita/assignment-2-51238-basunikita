import type { Metadata } from "next";
import DesignSystemPage from "@/app/design-system/DesignSystemPage";
import { PLATE_ROOM_RECIPE } from "@/app/design-system/recipes/plate-room";
import { PLATE_ROOM_FONTS } from "@/app/fonts/plate-room";
import { getMood } from "@/app/moods";

export const metadata: Metadata = { title: "Plate Room design system" };

export default function PlateRoomDesignSystem() {
  return <DesignSystemPage mood={getMood("plate-room")} recipe={PLATE_ROOM_RECIPE} fontClass={PLATE_ROOM_FONTS} />;
}
