import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Newsreader } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from "@/components/analytics/Analytics";
import { site } from "@/lib/site";
import { JsonLd, siteGraph } from "@/lib/structured-data";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

// Body and mono fonts use "optional": on a slow first visit the metrics-matched fallback simply stays, instead of
// swapping in a second later and reflowing the page (Inter's fallback wraps the hero text one line longer, which
// was the whole of the home page's layout shift). On normal connections and every later visit the real font shows.
// Newsreader keeps "swap": its fallback matches closely and the display face is the brand.
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

// Google AdSense (optional): set NEXT_PUBLIC_ADSENSE_CLIENT="ca-pub-…" to add the
// site-verification meta tag, the AdSense script and /ads.txt.
const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  ...(adsenseClient ? { other: { "google-adsense-account": adsenseClient } } : {}),
  // Google shows about 60 characters of a title and 155 of a description: a short brand suffix keeps page titles
  // whole in search results, and the home description is a trimmed version of the longer site.description.
  title: {
    default: `${site.name} | Research, Signals & Nautilus Fund`,
    template: `%s | ${site.shortName}`,
  },
  description: "Independent investment research, the Amador Signals market dashboard, investor education and the forthcoming Amador Nautilus Fund, from Chicago.",
  applicationName: site.name,
  authors: [{ name: site.founder.name }],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.name,
    description: site.description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: site.name, description: site.description },
  // Search Console and Bing Webmaster Tools ownership tags, when set.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0e16",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${newsreader.variable} ${inter.variable} ${jetbrains.variable} antialiased`}>
      <head>
        {adsenseClient && (
          // AdSense's own snippet, in <head> as Google asks: its site check reads the server HTML.
          <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`} crossOrigin="anonymous" />
        )}
      </head>
      <body className="flex min-h-screen flex-col">
        <JsonLd data={siteGraph()} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
