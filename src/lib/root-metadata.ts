import type { Metadata, Viewport } from "next";
import { OG_LOCALE, SITE_DESCRIPTION, type Lang } from "@/lib/i18n";
import { site } from "@/lib/site";

// Google AdSense (optional): NEXT_PUBLIC_ADSENSE_CLIENT adds the site-verification meta tag here, the AdSense script
// (components/layout/SiteChrome) and /ads.txt.
const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

const OG_ALT: Record<Lang, string> = {
  en: "Amador Asset Management: research, signals and the Amador Nautilus Fund",
  es: "Amador Asset Management: investigación, señales y el Fondo Nautilus de Amador",
};

// Google shows about 60 characters of a title and 155 of a description: a short brand suffix keeps page titles whole in
// search results, and the default descriptions are trimmed versions of the organization description.
const DEFAULTS: Record<Lang, { title: string; description: string }> = {
  en: {
    title: `${site.name} | Research, Signals & Nautilus Fund`,
    description: "Independent investment research, the Amador Signals market dashboard, investor education and the forthcoming Amador Nautilus Fund, from Chicago.",
  },
  es: {
    title: `${site.name} | Investigación y Fondo Nautilus`,
    description: "Investigación de inversiones independiente, el panel Amador Señales, educación para inversionistas y el próximo Fondo Nautilus de Amador, desde Chicago.",
  },
};

/** Metadata defaults of each language's root layout; every page sets its own title, description and hreflang alternates. */
export function rootMetadata(lang: Lang): Metadata {
  const other: Lang = lang === "en" ? "es" : "en";
  return {
    metadataBase: new URL(site.url),
    ...(adsenseClient ? { other: { "google-adsense-account": adsenseClient } } : {}),
    title: { default: DEFAULTS[lang].title, template: `%s | ${site.shortName}` },
    description: DEFAULTS[lang].description,
    applicationName: site.name,
    authors: [{ name: site.founder.name }],
    openGraph: {
      type: "website",
      siteName: site.name,
      title: site.name,
      description: SITE_DESCRIPTION[lang],
      locale: OG_LOCALE[lang],
      alternateLocale: OG_LOCALE[other],
      // Fixed addresses (app/og): file-based images inside route groups get hashed paths.
      images: [{ url: `/og/${lang}`, width: 1200, height: 630, alt: OG_ALT[lang] }],
    },
    twitter: { card: "summary_large_image", title: site.name, description: SITE_DESCRIPTION[lang], images: [`/og/${lang}`] },
    // Search Console and Bing Webmaster Tools ownership tags, when set.
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
      other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } : undefined,
    },
  };
}

export const rootViewport: Viewport = { themeColor: "#0a0e16" };
