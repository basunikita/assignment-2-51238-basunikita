import { Libre_Franklin, Newsreader } from "next/font/google";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-newsreader",
});
const libreFranklin = Libre_Franklin({ subsets: ["latin"], variable: "--font-libre-franklin" });

export const EDITORIAL_FONTS = `${newsreader.variable} ${libreFranklin.variable}`;
