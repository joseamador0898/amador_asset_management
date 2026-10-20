/*
 * Hero illustration: a correlation dendrogram of sixteen markets, the first
 * step of hierarchical risk parity. Illustrative structure, drawn bottom-up.
 */

type Leaf = string;
type Node = { h: number; l: Tree; r: Tree };
type Tree = Leaf | Node;

const n = (h: number, l: Tree, r: Tree): Node => ({ h, l, r });

const RISK: Tree = n(0.7, n(0.48, n(0.35, n(0.2, n(0.1, "SPX", "NDX"), "RTY"), n(0.22, "EAFE", "EM")), n(0.38, "HY", "REIT")), "BTC");
const DEFENSIVE: Tree = n(0.85, n(0.62, n(0.36, n(0.22, n(0.08, "UST10", "UST30"), "BUND"), n(0.28, "IG", "TIPS")), n(0.55, "GOLD", "JPY")), "USD");
const ROOT: Node = n(1, RISK, DEFENSIVE);

const W = 640;
const H = 380;
const BASE = H - 44;
const TOP = 26;
const PAD = 26;

function leaves(t: Tree): string[] {
  return typeof t === "string" ? [t] : [...leaves(t.l), ...leaves(t.r)];
}

const ORDER = leaves(ROOT);
const step = (W - PAD * 2) / (ORDER.length - 1);
const leafX = (name: string) => PAD + ORDER.indexOf(name) * step;
const yOf = (h: number) => BASE - h * (BASE - TOP);

type Seg = { d: string; h: number; root: boolean };

function layout(t: Tree, segs: Seg[]): { x: number; h: number } {
  if (typeof t === "string") return { x: leafX(t), h: 0 };
  const a = layout(t.l, segs);
  const b = layout(t.r, segs);
  const y = yOf(t.h);
  segs.push({
    d: `M${a.x.toFixed(1)} ${yOf(a.h).toFixed(1)} V${y.toFixed(1)} H${b.x.toFixed(1)} V${yOf(b.h).toFixed(1)}`,
    h: t.h,
    root: t === ROOT,
  });
  return { x: (a.x + b.x) / 2, h: t.h };
}

const SEGMENTS: Seg[] = [];
const rootPos = layout(ROOT, SEGMENTS);

export function Dendrogram({ className, animate = true }: { className?: string; animate?: boolean }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} role="img" aria-label="Illustrative correlation dendrogram of sixteen markets">
      {/* faint grid */}
      <g stroke="currentColor" strokeOpacity="0.07">
        {[0.25, 0.5, 0.75, 1].map((h) => (
          <line key={h} x1={PAD} x2={W - PAD} y1={yOf(h)} y2={yOf(h)} />
        ))}
      </g>
      <g fill="none" strokeLinecap="square">
        {SEGMENTS.map((s, i) => (
          <path
            key={i}
            d={s.d}
            pathLength={1}
            stroke={s.root ? "var(--color-brass-light)" : "currentColor"}
            strokeOpacity={s.root ? 1 : 0.55 + s.h * 0.4}
            strokeWidth={s.root ? 1.6 : 1.1}
            style={
              animate
                ? { strokeDasharray: 1, strokeDashoffset: 1, animation: `draw 1.6s var(--ease-out-expo) ${0.2 + s.h * 1.6}s forwards` }
                : undefined
            }
          />
        ))}
        <path
          d={`M${rootPos.x} ${yOf(1)} V${TOP - 14}`}
          stroke="var(--color-brass-light)"
          strokeWidth="1.6"
          pathLength={1}
          style={animate ? { strokeDasharray: 1, strokeDashoffset: 1, animation: "draw 1s var(--ease-out-expo) 2s forwards" } : undefined}
        />
      </g>
      {ORDER.map((name) => (
        <g key={name}>
          <circle cx={leafX(name)} cy={BASE} r="2.6" fill="var(--color-brass-light)" />
          <text
            x={leafX(name)}
            y={BASE + 22}
            textAnchor="middle"
            fontSize="9.5"
            letterSpacing="0.06em"
            fill="currentColor"
            fillOpacity="0.55"
            className="font-mono"
          >
            {name}
          </text>
        </g>
      ))}
    </svg>
  );
}
