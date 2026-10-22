import type { MetadataRoute } from "next";
import { studioLive } from "@/content/studio";
import { getAllArticles } from "@/lib/insights";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/firm", "/approach", "/insights", ...(studioLive ? ["/studio"] : []), "/signals", "/briefings", "/fund", "/book", "/contact", "/legal/disclosures", "/legal/privacy", "/legal/terms"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: p === "/signals" ? ("hourly" as const) : ("weekly" as const), priority: p === "" ? 1 : 0.7 })),
    ...getAllArticles().map((a) => ({ url: `${site.url}/insights/${a.slug}`, lastModified: a.updated ?? a.date, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
