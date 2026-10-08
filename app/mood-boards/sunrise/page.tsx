import type { Metadata } from "next";
import { getMood } from "@/app/moods";
import MoodBoard from "../_components/MoodBoard";
import { SUNRISE_ARTIFACTS } from "./artifacts";

export const metadata: Metadata = { title: "Sunrise mood board" };

export default function SunriseMoodBoard() {
  return <MoodBoard mood={getMood("sunrise")} artifacts={SUNRISE_ARTIFACTS} />;
}
