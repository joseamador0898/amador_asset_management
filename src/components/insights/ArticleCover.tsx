import type { CoverTheme } from "@/lib/insights";
import { Dendrogram } from "@/components/art/Dendrogram";
import { Nautilus } from "@/components/art/Nautilus";
import { cn } from "@/lib/utils";

/** Generated cover art for articles: brass line drawings on ink. */
export function ArticleCover({ theme, className }: { theme: CoverTheme; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden bg-ink text-paper/80", className)} aria-hidden>
      {theme === "dendrogram" && <Dendrogram animate={false} className="absolute inset-x-[6%] bottom-[4%] w-[88%]" />}
      {theme === "nautilus" && <Nautilus animate={false} className="absolute -right-[12%] top-1/2 w-[78%] -translate-y-1/2 text-paper/70" />}
      {theme === "waves" && <Waves />}
      {theme === "bars" && <Bars />}
      {theme === "rings" && <Rings />}
      {theme === "grid" && <Grid />}
    </div>
  );
}

function Waves() {
  const lines = Array.from({ length: 14 }, (_, i) => {
    const y0 = 40 + i * 22;
    let d = `M0 ${y0}`;
    for (let x = 0; x <= 800; x += 20) {
      const y = y0 + Math.sin(x / 70 + i * 0.6) * (10 + i * 1.6) + Math.cos(x / 31 + i) * 3;
      d += ` L${x} ${y.toFixed(1)}`;
    }
    return d;
  });
  return (
    <svg viewBox="0 0 800 380" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      {lines.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={i === 7 ? "var(--color-brass-light)" : "currentColor"} strokeOpacity={i === 7 ? 1 : 0.18 + i * 0.03} strokeWidth="1.1" />
      ))}
    </svg>
  );
}

function Bars() {
  const heights = [0.32, 0.46, 0.41, 0.58, 0.52, 0.69, 0.63, 0.78, 0.72, 0.86, 0.8, 0.94];
  return (
    <svg viewBox="0 0 800 380" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      {heights.map((h, i) => (
        <rect key={i} x={70 + i * 56} y={340 - h * 280} width="30" height={h * 280} fill="none" stroke={i === heights.length - 1 ? "var(--color-brass-light)" : "currentColor"} strokeOpacity={i === heights.length - 1 ? 1 : 0.4} />
      ))}
      <line x1="40" x2="760" y1="340" y2="340" stroke="currentColor" strokeOpacity="0.4" />
    </svg>
  );
}

function Rings() {
  return (
    <svg viewBox="0 0 800 380" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      {Array.from({ length: 12 }, (_, i) => (
        <circle key={i} cx="560" cy="190" r={20 + i * 26} fill="none" stroke={i === 5 ? "var(--color-brass-light)" : "currentColor"} strokeOpacity={i === 5 ? 1 : 0.25} />
      ))}
      <line x1="0" x2="800" y1="190" y2="190" stroke="currentColor" strokeOpacity="0.2" />
    </svg>
  );
}

function Grid() {
  const pts = Array.from({ length: 60 }, (_, i) => {
    const x = 60 + (i % 12) * 60;
    const y = 50 + Math.floor(i / 12) * 66;
    const r = 2 + ((i * 37) % 7);
    return { x, y, r, hot: (i * 13) % 11 === 0 };
  });
  return (
    <svg viewBox="0 0 800 380" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.hot ? "var(--color-brass-light)" : "currentColor"} fillOpacity={p.hot ? 1 : 0.28} />
      ))}
    </svg>
  );
}
