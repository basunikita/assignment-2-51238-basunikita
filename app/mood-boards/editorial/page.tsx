import type { Metadata } from "next";
import { EDITORIAL_FONTS } from "@/app/fonts/editorial";
import { getMood } from "@/app/moods";
import MoodBoard from "../_components/MoodBoard";
import { EDITORIAL_ARTIFACTS } from "./artifacts";

export const metadata: Metadata = { title: "Editorial mood board" };

export default function EditorialMoodBoard() {
  return <MoodBoard mood={getMood("editorial")} fontClass={EDITORIAL_FONTS} artifacts={EDITORIAL_ARTIFACTS} />;
}
