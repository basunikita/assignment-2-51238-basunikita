import type { Metadata } from "next";
import { PLATE_ROOM_RECIPE } from "@/app/design-system/recipes/plate-room";
import { PLATE_ROOM_FONTS } from "@/app/fonts/plate-room";
import { getMood } from "@/app/moods";
import WorkoutWeek from "./_components/WorkoutWeek";

export const metadata: Metadata = { title: "My week" };

export default function WorkoutWeekPage() {
  return <WorkoutWeek mood={getMood("plate-room")} recipe={PLATE_ROOM_RECIPE} fontClass={PLATE_ROOM_FONTS} />;
}
