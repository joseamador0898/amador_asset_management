import { ImageResponse } from "next/og";
import { MARK_PATH } from "@/lib/brand";
import { getAllArticles, getArticle } from "@/lib/insights";

// Per-article social card (also the Article image in the structured data).
export const alt = "Amador Asset Management insight";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  const slugs = getAllArticles().map((a) => ({ slug: a.slug }));
  return slugs.length ? slugs : [{ slug: "coming-soon" }];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getArticle(slug)?.meta;
  const title = meta?.title ?? "Insights";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0e16",
          color: "#f7f5f0",
          padding: "64px 80px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <svg width="60" height="60" viewBox="0 0 64 64">
              <path d={MARK_PATH} fill="#f7f5f0" />
              <rect x="2" y="41" width="60" height="4" fill="#c9a96e" />
            </svg>
            <span style={{ fontSize: 30, letterSpacing: 10 }}>AMADOR</span>
          </div>
          <span style={{ fontSize: 20, letterSpacing: 4, color: "#c9a96e", fontFamily: "sans-serif", textTransform: "uppercase" }}>
            {meta?.category ?? "Insights"}
          </span>
        </div>
        <span style={{ fontSize: title.length > 70 ? 54 : 64, lineHeight: 1.1, fontWeight: 300 }}>{title}</span>
        <span style={{ fontSize: 22, color: "#9aa3b2", fontFamily: "sans-serif" }}>
          {meta ? `${meta.author} · ${meta.readingMinutes} min read · amadoram.com` : "amadoram.com"}
        </span>
      </div>
    ),
    size,
  );
}
