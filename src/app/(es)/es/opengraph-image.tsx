import { ImageResponse } from "next/og";
import { MARK_PATH } from "@/lib/brand";

// Tarjeta social de las páginas en español (los artículos tienen la suya).
export const alt = "Amador Asset Management: investigación, señales y el Fondo Nautilus de Amador";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImageEs() {
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
          padding: "72px 80px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg width="84" height="84" viewBox="0 0 64 64">
            <path d={MARK_PATH} fill="#f7f5f0" />
            <rect x="2" y="41" width="60" height="4" fill="#c9a96e" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 40, letterSpacing: 12 }}>AMADOR</span>
            <span style={{ fontSize: 16, letterSpacing: 8, color: "#9aa3b2", fontFamily: "sans-serif" }}>ASSET MANAGEMENT</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 72, lineHeight: 1.05, fontWeight: 300 }}>Construido para cada estación del mercado.</span>
          <span style={{ marginTop: 28, fontSize: 26, color: "#c9a96e", fontFamily: "sans-serif", letterSpacing: 2 }}>
            Investigación · Señales · Fondo Nautilus de Amador
          </span>
        </div>
      </div>
    ),
    size,
  );
}
