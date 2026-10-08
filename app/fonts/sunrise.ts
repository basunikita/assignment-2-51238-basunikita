import { Nunito } from "next/font/google";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });

export const SUNRISE_FONTS = nunito.variable;
