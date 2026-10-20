/*
 * Chambered nautilus in cross-section, generated from a logarithmic spiral
 * r = a·e^(bθ) whose radius triples each turn. Septa (chamber walls) join each
 * outer whorl to the whorl inside it; the last third of a turn is left open as
 * the living chamber.
 */

const SIZE = 520;
const C = SIZE / 2;
const TURNS = 3.2;
const B = Math.log(3) / (2 * Math.PI);
const THETA_MAX = TURNS * 2 * Math.PI;
const R_MAX = SIZE * 0.47;
const A = R_MAX / Math.exp(B * THETA_MAX);
const ROT = -0.35; // rotate so the aperture opens toward the lower right

function pt(theta: number, r = A * Math.exp(B * theta)) {
  const t = theta + ROT;
  return [C + r * Math.cos(t), C + r * Math.sin(t)] as const;
}

function spiralPath(from: number, to: number, steps = 900) {
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const th = from + ((to - from) * i) / steps;
    const [x, y] = pt(th);
    d += `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

const OUTER = spiralPath(0.6, THETA_MAX);
const APERTURE = (() => {
  const [x1, y1] = pt(THETA_MAX);
  const [x2, y2] = pt(THETA_MAX - 2 * Math.PI);
  return `M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`;
})();

const SEPTA = (() => {
  const out: string[] = [];
  const last = THETA_MAX - (2 * Math.PI) / 3; // living chamber stays open
  for (let th = last; th > 2 * Math.PI + 0.3; th -= 0.36) {
    const [x1, y1] = pt(th);
    const [x2, y2] = pt(th - 2 * Math.PI);
    // Curve each wall back toward the shell's center, like real septa.
    const r = A * Math.exp(B * (th - 0.22)) * 0.72;
    const [cx, cy] = pt(th - 0.22, r);
    out.push(`M${x1.toFixed(1)} ${y1.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`);
  }
  return out;
})();

export function Nautilus({ className, animate = true }: { className?: string; animate?: boolean }) {
  const draw = (delay: number, dur = 2.4) =>
    animate ? { strokeDasharray: 1, strokeDashoffset: 1, animation: `draw ${dur}s var(--ease-out-expo) ${delay}s forwards` } : undefined;
  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className={className} role="img" aria-label="Chambered nautilus drawn as a logarithmic spiral">
      <g fill="none" strokeLinecap="round">
        <path d={OUTER} stroke="currentColor" strokeWidth="1.4" pathLength={1} style={draw(0.1, 3.2)} />
        <path d={APERTURE} stroke="currentColor" strokeWidth="1.4" pathLength={1} style={draw(2.6, 0.8)} />
        {SEPTA.map((d, i) => (
          <path key={i} d={d} stroke="var(--color-brass-light)" strokeOpacity="0.85" strokeWidth="1" pathLength={1} style={draw(0.6 + i * 0.07, 1.2)} />
        ))}
      </g>
    </svg>
  );
}
