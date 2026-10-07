import type { Metadata } from "next";
import Placeholder from "../placeholder";

export const metadata: Metadata = { title: "My week" };

export default function WorkoutWeek() {
  return <Placeholder title="A Week of Workouts" />;
}
