import {
  Archivo,
  Big_Shoulders,
  Big_Shoulders_Stencil,
  Libre_Franklin,
  Newsreader,
  Nunito,
} from "next/font/google";
import type { MoodSlug } from "./moods";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-newsreader",
});
const libreFranklin = Libre_Franklin({ subsets: ["latin"], variable: "--font-libre-franklin" });
const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-big-shoulders",
});
const bigShouldersStencil = Big_Shoulders_Stencil({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-big-shoulders-stencil",
});
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo" });

// Put a mood's classes on any element whose children use that mood's fonts.
export const MOOD_FONT_CLASSES: Record<MoodSlug, string> = {
  calm: nunito.variable,
  editorial: `${newsreader.variable} ${libreFranklin.variable}`,
  "plate-room": `${bigShoulders.variable} ${bigShouldersStencil.variable} ${archivo.variable}`,
};
