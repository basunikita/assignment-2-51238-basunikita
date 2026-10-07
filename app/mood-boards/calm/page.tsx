import type { Metadata } from "next";
import { getMood } from "@/app/moods";
import MoodBoard from "../_components/MoodBoard";
import { CALM_ARTIFACTS } from "./artifacts";

export const metadata: Metadata = { title: "Calm mood board" };

export default function CalmMoodBoard() {
  return <MoodBoard mood={getMood("calm")} artifacts={CALM_ARTIFACTS} />;
}
