import { Big_Shoulders, Newsreader, Nunito } from "next/font/google";
import type { MoodSlug } from "../moods";

// Only each mood's display face, for the hub's "Aa" samples. A mood's pages load its full set.
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const newsreader = Newsreader({ subsets: ["latin"], axes: ["opsz"], variable: "--font-newsreader" });
const bigShoulders = Big_Shoulders({ subsets: ["latin"], axes: ["opsz"], variable: "--font-big-shoulders" });

export const HUB_DISPLAY_FONTS: Record<MoodSlug, string> = {
  sunrise: nunito.variable,
  editorial: newsreader.variable,
  "plate-room": bigShoulders.variable,
};
