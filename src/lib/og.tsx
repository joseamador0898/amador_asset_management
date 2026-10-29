import { ImageResponse } from "next/og";
import { MARK_PATH } from "@/lib/brand";
import { CATEGORY_LABELS, type Lang } from "@/lib/i18n";
import type { ArticleMeta } from "@/lib/insights";

/*
 * Social cards (Open Graph and the Article image in the structured data), served by route handlers at fixed addresses:
 * /og/<lang> for the site and /og/<lang>/<slug> for articles. File-based opengraph-image routes inside route groups get
 * a hashed path, which the structured data cannot name.
 */
export const OG_SIZE = { width: 1200, height: 630 };

const COPY = {
  en: { headline: "Built for every season of the market.", line: "Research · Signals · The Amador Nautilus Fund", read: "min read", insights: "Insights" },
  es: { headline: "Construido para cada estación del mercado.", line: "Investigación · Señales · Fondo Nautilus de Amador", read: "min de lectura", insights: "Análisis" },
};


function Mark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <path d={MARK_PATH} fill="#f7f5f0" />
      <rect x="2" y="41" width="60" height="4" fill="#c9a96e" />
    </svg>
  );
}

const frame = { width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0a0e16", color: "#f7f5f0", fontFamily: "Georgia, serif" } as const;

export function siteCard(lang: Lang) {
  const t = COPY[lang];
  return new ImageResponse(
    (
      <div style={{ ...frame, padding: "72px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Mark size={84} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 40, letterSpacing: 12 }}>AMADOR</span>
            <span style={{ fontSize: 16, letterSpacing: 8, color: "#9aa3b2", fontFamily: "sans-serif" }}>ASSET MANAGEMENT</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: lang === "es" ? 72 : 76, lineHeight: 1.05, fontWeight: 300 }}>{t.headline}</span>
          <span style={{ marginTop: 28, fontSize: 26, color: "#c9a96e", fontFamily: "sans-serif", letterSpacing: 2 }}>{t.line}</span>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}

export function articleCard(meta: ArticleMeta) {
  const t = COPY[meta.lang];
  const category = CATEGORY_LABELS[meta.lang][meta.category] ?? meta.category;
  return new ImageResponse(
    (
      <div style={{ ...frame, padding: "64px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Mark size={60} />
            <span style={{ fontSize: 30, letterSpacing: 10 }}>AMADOR</span>
          </div>
          <span style={{ fontSize: 20, letterSpacing: 4, color: "#c9a96e", fontFamily: "sans-serif", textTransform: "uppercase" }}>{category}</span>
        </div>
        <span style={{ fontSize: meta.title.length > 70 ? 54 : 64, lineHeight: 1.1, fontWeight: 300 }}>{meta.title}</span>
        <span style={{ fontSize: 22, color: "#9aa3b2", fontFamily: "sans-serif" }}>
          {`${meta.author} · ${meta.readingMinutes} ${t.read} · amadoram.com`}
        </span>
      </div>
    ),
    OG_SIZE,
  );
}
