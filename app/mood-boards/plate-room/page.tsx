import type { Metadata } from "next";
import { getMood } from "@/app/moods";
import MoodBoard from "../_components/MoodBoard";
import { PLATE_ROOM_ARTIFACTS } from "./artifacts";

export const metadata: Metadata = { title: "Plate Room mood board" };

export default function PlateRoomMoodBoard() {
  return <MoodBoard mood={getMood("plate-room")} artifacts={PLATE_ROOM_ARTIFACTS} />;
}
