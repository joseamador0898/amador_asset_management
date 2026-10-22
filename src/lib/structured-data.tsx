import type { ArticleMeta } from "@/lib/insights";
import { site } from "@/lib/site";

/*
 * schema.org JSON-LD for search engines and AI assistants. The organization, website and founder are declared once
 * (root layout) with stable @ids; pages reference them instead of repeating them. Everything here matches visible text.
 */

const ORG_ID = `${site.url}/#organization`;
const SITE_ID = `${site.url}/#website`;
const FOUNDER_ID = `${site.url}/#founder`;

type Thing = Record<string, unknown>;

export function siteGraph(): Thing {
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
        description: site.description,
        email: site.email,
        founder: { "@id": FOUNDER_ID },
        address: { "@type": "PostalAddress", addressLocality: "Chicago", addressRegion: "IL", addressCountry: "US" },
        knowsAbout: ["Portfolio construction", "Risk parity", "Hierarchical risk parity", "Risk management", "Macroeconomics", "Options markets"],
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": SITE_ID,
        url: site.url,
        name: site.name,
        description: site.description,
        publisher: { "@id": ORG_ID },
        inLanguage: "en-US",
      },
      {
        "@type": "Person",
        "@id": FOUNDER_ID,
        name: site.founder.name,
        jobTitle: site.founder.role,
        url: `${site.url}/firm`,
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

export function articleGraph(meta: ArticleMeta, wordCount: number): Thing {
  const url = `${site.url}/insights/${meta.slug}`;
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
        image: [`${url}/opengraph-image`],
        datePublished: meta.date,
        dateModified: meta.updated ?? meta.date,
        author: meta.author === site.founder.name ? { "@id": FOUNDER_ID, "@type": "Person", name: meta.author, url: `${site.url}/firm` } : { "@type": "Person", name: meta.author },
        publisher: { "@id": ORG_ID },
        isPartOf: { "@id": SITE_ID },
        articleSection: meta.category,
        keywords: meta.tags.join(", "),
        wordCount,
        inLanguage: "en-US",
        isAccessibleForFree: true,
      },
      breadcrumbs([
        { name: "Home", path: "/" },
        { name: "Insights", path: "/insights" },
        { name: meta.title, path: `/insights/${meta.slug}` },
      ]),
    ],
  };
}

export function pageGraph(type: "AboutPage" | "ContactPage" | "CollectionPage" | "WebPage", name: string, path: string): Thing {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": type, "@id": `${site.url}${path}#page`, url: `${site.url}${path}`, name, isPartOf: { "@id": SITE_ID }, about: { "@id": ORG_ID } },
      breadcrumbs([
        { name: "Home", path: "/" },
        { name, path },
      ]),
    ],
  };
}

/** Inline JSON-LD; "<" is escaped so the content can never close the script tag. */
export function JsonLd({ data }: { data: Thing }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
