/**
 * Two languages, two URL trees: English at the root, Mexican Spanish under /es with Spanish paths.
 * This file holds what both trees share: the route map, the navigation and chrome strings, and the
 * helpers that build hreflang alternates. Page copy lives with each page; article translations live in
 * src/content/insights/es.
 */

import type { NavItem } from "@/lib/site";
import { fund, mainNav, utilityNav, footerNav, site } from "@/lib/site";

export type Lang = "en" | "es";
export const LANGS: Lang[] = ["en", "es"];
export const HTML_LANG: Record<Lang, string> = { en: "en", es: "es-MX" };
export const OG_LOCALE: Record<Lang, string> = { en: "en_US", es: "es_MX" };
/**
 * hreflang codes. Generic Spanish, not es-MX: with one Spanish version, a region-specific code would send Spanish readers
 * outside Mexico to the English pages. The html lang (es-MX) still names the variety.
 */
export const HREFLANG: Record<Lang, string> = { en: "en", es: "es" };

/** The organization description in each language (Open Graph, structured data). */
export const SITE_DESCRIPTION: Record<Lang, string> = {
  en: site.description,
  es: "Amador Asset Management es una firma de inversión independiente construida sobre investigación, disciplina de riesgo y transparencia: investigación de portafolios, señales de mercado en vivo, educación para inversionistas y el próximo Fondo Nautilus de Amador.",
};

/** The fund's name as each language's pages say it (the legal name stays fund.legalName). */
export const FUND_NAME: Record<Lang, string> = { en: fund.name, es: "Fondo Nautilus de Amador" };

/** Static routes, English path → Spanish path. Articles pair through their frontmatter (see lib/insights). */
export const ROUTES: Record<string, string> = {
  "/": "/es",
  "/firm": "/es/firma",
  "/approach": "/es/enfoque",
  "/insights": "/es/analisis",
  "/signals": "/es/senales",
  "/briefings": "/es/boletines",
  "/fund": "/es/fondo",
  "/book": "/es/reservar",
  "/contact": "/es/contacto",
  "/legal/disclosures": "/es/legal/divulgaciones",
  "/legal/privacy": "/es/legal/privacidad",
  "/legal/terms": "/es/legal/terminos",
};
const ROUTES_ES_TO_EN: Record<string, string> = Object.fromEntries(Object.entries(ROUTES).map(([en, es]) => [es, en]));

export const ARTICLES_PATH: Record<Lang, string> = { en: "/insights", es: "/es/analisis" };

export function langOf(pathname: string): Lang {
  return pathname === "/es" || pathname.startsWith("/es/") ? "es" : "en";
}

/** The same page in the other language, given the article slug pairs (English slug → Spanish slug and back). */
export function counterpart(pathname: string, lang: Lang, pairs: Record<string, string>): string {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (lang === "en") {
    if (ROUTES[path]) return ROUTES[path];
    const m = path.match(/^\/insights\/([^/]+)$/);
    if (m) return pairs[m[1]] ? `${ARTICLES_PATH.es}/${pairs[m[1]]}` : ARTICLES_PATH.es;
    return "/es";
  }
  if (ROUTES_ES_TO_EN[path]) return ROUTES_ES_TO_EN[path];
  const m = path.match(/^\/es\/analisis\/([^/]+)$/);
  if (m) return pairs[m[1]] ? `${ARTICLES_PATH.en}/${pairs[m[1]]}` : ARTICLES_PATH.en;
  return "/";
}

/** Metadata `alternates` for a page that exists in both languages: canonical plus hreflang links both ways. */
export function alternates(lang: Lang, enPath: string, esPath: string) {
  return {
    canonical: lang === "en" ? enPath : esPath,
    languages: { [HREFLANG.en]: enPath, [HREFLANG.es]: esPath, "x-default": enPath },
  };
}

/** `alternates` for a static route from the map. */
export function routeAlternates(lang: Lang, enPath: string) {
  return alternates(lang, enPath, ROUTES[enPath] ?? `/es${enPath}`);
}

// ------------------------------------------------------------ navigation and chrome

const mainNavEs: NavItem[] = [
  { label: "Firma", href: "/es/firma", description: "Quiénes somos y cómo pensamos" },
  { label: "Enfoque", href: "/es/enfoque", description: "Proceso, riesgo e investigación" },
  { label: "Análisis", href: "/es/analisis", description: "Marcos, investigación y memos" },
  { label: "Señales", href: "/es/senales", description: "Panel de mercados en vivo" },
  { label: "Fondo Nautilus", href: "/es/fondo", description: "Nuestro fondo insignia, próximamente" },
];

const utilityNavEs: NavItem[] = [
  { label: "Boletines y alertas", href: "/es/boletines" },
  { label: "Registrar interés", href: "/es/fondo#registro" },
  { label: "Contacto", href: "/es/contacto" },
];

const footerNavEs: { title: string; items: NavItem[] }[] = [
  {
    title: "Firma",
    items: [
      { label: "Acerca de", href: "/es/firma" },
      { label: "Enfoque", href: "/es/enfoque" },
      { label: "Agendar una consulta", href: "/es/reservar" },
      { label: "Contacto", href: "/es/contacto" },
    ],
  },
  {
    title: "Investigación",
    items: [
      { label: "Análisis", href: "/es/analisis" },
      { label: "Señales", href: "/es/senales" },
      { label: "Boletines y alertas", href: "/es/boletines" },
    ],
  },
  {
    title: "Fondo",
    items: [
      { label: "Fondo Nautilus", href: "/es/fondo" },
      { label: "Registrar interés", href: "/es/fondo#registro" },
      { label: "Divulgaciones importantes", href: "/es/legal/divulgaciones" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Divulgaciones", href: "/es/legal/divulgaciones" },
      { label: "Privacidad", href: "/es/legal/privacidad" },
      { label: "Términos de uso", href: "/es/legal/terminos" },
    ],
  },
];

export function navFor(lang: Lang) {
  return lang === "en" ? { main: mainNav, utility: utilityNav, footer: footerNav } : { main: mainNavEs, utility: utilityNavEs, footer: footerNavEs };
}

/** Strings used by the header, footer, 404 page and other shared chrome. */
export const chrome = {
  en: {
    skip: "Skip to content",
    cta: "Book a consultation",
    ctaHref: "/book",
    home: "/",
    homeLabel: `${site.name}, home`,
    menuOpen: "Open menu",
    menuClose: "Close menu",
    menuLabel: "Site menu",
    utilityLabel: "Utility",
    mainLabel: "Main",
    mobileLabel: "Mobile",
    status: `${fund.name} · ${fund.status}`,
    switchLabel: "Español",
    switchTitle: "Versión en español",
    bandEyebrow: "Briefings & Alerts",
    bandTitle: "Research, signals and fund updates, delivered when they matter.",
    bandCta: "Choose your briefings",
    bandHref: "/briefings",
    blurb: `Independent research, disciplined risk, and the forthcoming ${fund.name}. ${site.location}.`,
    disclaimer: [
      `${site.name} publishes research, data and educational content for informational purposes only. Nothing on this website is investment, legal or tax advice, or an offer to sell or a solicitation of an offer to buy any security, including interests in the ${fund.legalName}. Any such offer will be made only through definitive offering documents to eligible investors where permitted by law. Advisory services, where offered, are provided only after applicable registration requirements are met. Past performance, including hypothetical or backtested results, does not guarantee future results; all investing involves risk, including loss of principal. Market data may be delayed or sourced from third parties and is provided without warranty. See`,
      "Important Disclosures",
      "/legal/disclosures",
    ] as const,
    rights: "All rights reserved.",
    notFound: { eyebrow: "404", title: "Off the chart.", body: "The page you were looking for has moved or never existed. Even the best models miss sometimes.", home: "Back home", insights: "Read insights", insightsHref: "/insights", live: "Looking for live data? Try", signals: "Signals", signalsHref: "/signals" },
  },
  es: {
    skip: "Ir al contenido",
    cta: "Agendar una consulta",
    ctaHref: "/es/reservar",
    home: "/es",
    homeLabel: `${site.name}, inicio`,
    menuOpen: "Abrir menú",
    menuClose: "Cerrar menú",
    menuLabel: "Menú del sitio",
    utilityLabel: "Utilidades",
    mainLabel: "Principal",
    mobileLabel: "Móvil",
    status: `${FUND_NAME.es} · Prelanzamiento`,
    switchLabel: "English",
    switchTitle: "English version",
    bandEyebrow: "Boletines y alertas",
    bandTitle: "Investigación, señales y novedades del fondo, cuando importan.",
    bandCta: "Elija sus boletines",
    bandHref: "/es/boletines",
    blurb: `Investigación independiente, riesgo disciplinado y el próximo ${FUND_NAME.es}. ${site.location}.`,
    disclaimer: [
      `${site.name} publica investigación, datos y contenido educativo con fines exclusivamente informativos. Nada en este sitio es asesoría de inversión, legal o fiscal, ni una oferta de venta o una solicitud de oferta de compra de valor alguno, incluidas participaciones en ${fund.legalName}. Cualquier oferta se realizará únicamente mediante documentos de oferta definitivos a inversionistas elegibles, donde la ley lo permita. Los servicios de asesoría, cuando se ofrezcan, se prestarán solo una vez cumplidos los requisitos de registro aplicables. El rendimiento pasado, incluidos los resultados hipotéticos o de backtests, no garantiza resultados futuros; toda inversión implica riesgo, incluida la pérdida del capital. Los datos de mercado pueden tener retraso o provenir de terceros y se proporcionan sin garantía. Consulte las`,
      "Divulgaciones importantes",
      "/es/legal/divulgaciones",
    ] as const,
    rights: "Todos los derechos reservados.",
    notFound: { eyebrow: "404", title: "Fuera de la gráfica.", body: "La página que buscaba se movió o nunca existió. Hasta los mejores modelos fallan a veces.", home: "Volver al inicio", insights: "Leer análisis", insightsHref: "/es/analisis", live: "¿Busca datos en vivo? Pruebe", signals: "Señales", signalsHref: "/es/senales" },
  },
} as const;

/** Category labels shown in the Insights browser and article cards (the frontmatter keeps the English code). */
export const CATEGORY_LABELS: Record<Lang, Record<string, string>> = {
  en: { Research: "Research", Frameworks: "Frameworks", Risk: "Risk", Markets: "Markets", Signals: "Signals", Education: "Education" },
  es: { Research: "Investigación", Frameworks: "Marcos", Risk: "Riesgo", Markets: "Mercados", Signals: "Señales", Education: "Educación" },
};

/** Date in the language's own format (UTC, so server and visitor agree). */
export function formatDateFor(iso: string, lang: Lang, opts: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" }) {
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
  return d.toLocaleDateString(lang === "es" ? "es-MX" : "en-US", { timeZone: "UTC", ...opts });
}
