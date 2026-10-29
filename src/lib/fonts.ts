import { Inter, JetBrains_Mono, Newsreader } from "next/font/google";

/*
 * Fonts for both root layouts (English and Spanish; the latin subsets cover Spanish accents and punctuation).
 * Body and mono fonts use "optional": on a slow first visit the metrics-matched fallback simply stays, instead of
 * swapping in a second later and reflowing the page (Inter's fallback wraps the hero text one line longer, which was the
 * whole of the home page's layout shift). On normal connections and every later visit the real font shows.
 * Newsreader keeps "swap": its fallback matches closely and the display face is the brand.
 */
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "optional",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "optional",
});

export const fontClassName = `${newsreader.variable} ${inter.variable} ${jetbrains.variable} antialiased`;
