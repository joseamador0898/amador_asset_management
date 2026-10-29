import type { MetadataRoute } from "next";
import { studioLive } from "@/content/studio";
import { ARTICLES_PATH, HREFLANG, ROUTES } from "@/lib/i18n";
import { getAllArticles } from "@/lib/insights";
import { site } from "@/lib/site";

type Entry = MetadataRoute.Sitemap[number];

const abs = (path: string) => `${site.url}${path === "/" ? "" : path}`;
// Both entries of a translated pair list both versions and the x-default: Google's sitemap form of hreflang.
const pair = (en: string, es: string) => ({ languages: { [HREFLANG.en]: abs(en), [HREFLANG.es]: abs(es), "x-default": abs(en) } });

export default function sitemap(): MetadataRoute.Sitemap {
  const out: Entry[] = [];
  for (const [en, es] of Object.entries(ROUTES)) {
    const changeFrequency = en === "/signals" ? "hourly" : "weekly";
    const alternates = pair(en, es);
    out.push({ url: abs(en), changeFrequency, priority: en === "/" ? 1 : 0.7, alternates });
    out.push({ url: abs(es), changeFrequency, priority: en === "/" ? 0.9 : 0.6, alternates });
  }
  if (studioLive) out.push({ url: abs("/studio"), changeFrequency: "weekly", priority: 0.7 });

  const spanish = getAllArticles("es");
  const translationOf = new Map(spanish.filter((a) => a.translationOf).map((a) => [a.translationOf as string, a.slug]));
  for (const a of getAllArticles("en")) {
    const en = `${ARTICLES_PATH.en}/${a.slug}`;
    const es = translationOf.get(a.slug);
    out.push({ url: abs(en), lastModified: a.updated ?? a.date, changeFrequency: "monthly", priority: 0.6, ...(es ? { alternates: pair(en, `${ARTICLES_PATH.es}/${es}`) } : {}) });
  }
  for (const a of spanish) {
    const es = `${ARTICLES_PATH.es}/${a.slug}`;
    const alternates = a.translationOf ? pair(`${ARTICLES_PATH.en}/${a.translationOf}`, es) : undefined;
    out.push({ url: abs(es), lastModified: a.updated ?? a.date, changeFrequency: "monthly", priority: 0.5, ...(alternates ? { alternates } : {}) });
  }
  return out;
}
