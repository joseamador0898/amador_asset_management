import type { ArticleMeta } from "@/lib/insights";
import { ARTICLES_PATH, SITE_DESCRIPTION, type Lang } from "@/lib/i18n";
import { site } from "@/lib/site";

/*
 * schema.org JSON-LD for search engines and AI assistants. The organization, website and founder are declared once per
 * page (root layouts) with stable @ids; pages reference them instead of repeating them. Everything here matches visible
 * text in the page's language. A translated article names its original (translationOfWork), and the original names its
 * translation (workTranslation).
 */

const ORG_ID = `${site.url}/#organization`;
const SITE_ID = `${site.url}/#website`;
const FOUNDER_ID = `${site.url}/#founder`;

const IN_LANGUAGE: Record<Lang, string> = { en: "en-US", es: "es-MX" };
const HOME: Record<Lang, { name: string; path: string }> = { en: { name: "Home", path: "/" }, es: { name: "Inicio", path: "/es" } };
const INSIGHTS: Record<Lang, string> = { en: "Insights", es: "Análisis" };
const FIRM_PATH: Record<Lang, string> = { en: "/firm", es: "/es/firma" };
const ROLE: Record<Lang, string> = { en: site.founder.role, es: "Fundador y director de inversiones" };
const KNOWS_ABOUT: Record<Lang, string[]> = {
  en: ["Portfolio construction", "Risk parity", "Hierarchical risk parity", "Risk management", "Macroeconomics", "Options markets"],
  es: ["Construcción de portafolios", "Paridad de riesgo", "Paridad de riesgo jerárquica", "Gestión de riesgos", "Macroeconomía", "Mercados de opciones"],
};

type Thing = Record<string, unknown>;

export function siteGraph(lang: Lang = "en"): Thing {
  const sameAs = site.socials.map((s) => s.href).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: site.name,
        alternateName: site.shortName,
        url: site.url,
        logo: { "@type": "ImageObject", url: `${site.url}/brand/png/icon-512.png`, width: 512, height: 512 },
        description: SITE_DESCRIPTION[lang],
        email: site.email,
        founder: { "@id": FOUNDER_ID },
        address: { "@type": "PostalAddress", addressLocality: "Chicago", addressRegion: "IL", addressCountry: "US" },
        knowsAbout: KNOWS_ABOUT[lang],
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": SITE_ID,
        url: site.url,
        name: site.name,
        description: SITE_DESCRIPTION[lang],
        publisher: { "@id": ORG_ID },
        inLanguage: [IN_LANGUAGE.en, IN_LANGUAGE.es],
      },
      {
        "@type": "Person",
        "@id": FOUNDER_ID,
        name: site.founder.name,
        jobTitle: ROLE[lang],
        url: `${site.url}${FIRM_PATH[lang]}`,
        worksFor: { "@id": ORG_ID },
      },
    ],
  };
}

export function breadcrumbs(items: Array<{ name: string; path: string }>): Thing {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: `${site.url}${item.path}` })),
  };
}

/** An article in its own language; `twinSlug` is the slug of the same article in the other language, when there is one. */
export function articleGraph(meta: ArticleMeta, wordCount: number, twinSlug?: string): Thing {
  const lang = meta.lang;
  const other: Lang = lang === "en" ? "es" : "en";
  const path = `${ARTICLES_PATH[lang]}/${meta.slug}`;
  const url = `${site.url}${path}`;
  const twin = twinSlug ? { "@id": `${site.url}${ARTICLES_PATH[other]}/${twinSlug}#article` } : null;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: meta.title,
        description: meta.dek,
        url,
        mainEntityOfPage: url,
        image: [`${site.url}/og/${lang}/${meta.slug}`],
        datePublished: meta.date,
        dateModified: meta.updated ?? meta.date,
        author:
          meta.author === site.founder.name
            ? { "@id": FOUNDER_ID, "@type": "Person", name: meta.author, url: `${site.url}${FIRM_PATH[lang]}` }
            : { "@type": "Person", name: meta.author },
        publisher: { "@id": ORG_ID },
        isPartOf: { "@id": SITE_ID },
        articleSection: meta.category,
        keywords: meta.tags.join(", "),
        wordCount,
        inLanguage: IN_LANGUAGE[lang],
        isAccessibleForFree: true,
        ...(twin ? (lang === "es" ? { translationOfWork: twin } : { workTranslation: twin }) : {}),
      },
      breadcrumbs([HOME[lang], { name: INSIGHTS[lang], path: ARTICLES_PATH[lang] }, { name: meta.title, path }]),
    ],
  };
}

export function pageGraph(type: "AboutPage" | "ContactPage" | "CollectionPage" | "WebPage", name: string, path: string, lang: Lang = "en"): Thing {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": type,
        "@id": `${site.url}${path}#page`,
        url: `${site.url}${path}`,
        name,
        inLanguage: IN_LANGUAGE[lang],
        isPartOf: { "@id": SITE_ID },
        about: { "@id": ORG_ID },
      },
      breadcrumbs([HOME[lang], { name, path }]),
    ],
  };
}

/** Inline JSON-LD; "<" is escaped so the content can never close the script tag. */
export function JsonLd({ data }: { data: Thing }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }} />;
}
