import type { GsMacro, MacroSeries, SignalAlert } from "./types";

/*
 * Rule-based alerts derived from the Goldman Sachs macro lens. Deterministic
 * thresholds on published GS series; no forecasts of our own and no advice.
 */

const LEVEL_RANK: Record<SignalAlert["level"], number> = { high: 0, medium: 1, info: 2 };
const signed = (v: number, d = 2) => `${v > 0 ? "+" : ""}${v.toFixed(d)}`;
const pct = (v: number) => `${v > 0 ? "+" : ""}${(v * 100).toFixed(0)}%`;

function tile(macro: GsMacro, id: string): MacroSeries | undefined {
  return macro.tiles.find((t) => t.id === id);
}

export function buildGsAlerts(macro: GsMacro): SignalAlert[] {
  const out: SignalAlert[] = [];

  const fci = tile(macro, "GS_FCI");
  if (fci) {
    const d = fci.change;
    const big = Math.abs(d) >= 0.25;
    out.push({
      id: "fci",
      level: Math.abs(d) >= 0.5 ? "high" : big ? "medium" : "info",
      direction: d > 0 ? "up" : d < 0 ? "down" : "neutral",
      title: big ? (d > 0 ? "US financial conditions tightened" : "US financial conditions eased") : "US financial conditions little changed",
      detail: `GS Financial Conditions Index at ${fci.value.toFixed(2)}, ${signed(d)} over the past month (higher = tighter).`,
      source: "GS FCI",
      date: fci.date,
    });
  }

  const cai = tile(macro, "GS_CAI");
  if (cai) {
    const d = cai.change;
    const big = Math.abs(d) >= 0.5;
    out.push({
      id: "cai",
      level: Math.abs(d) >= 1 ? "high" : big ? "medium" : "info",
      direction: d > 0 ? "up" : d < 0 ? "down" : "neutral",
      title: big ? `US growth nowcast ${d > 0 ? "accelerated" : "slowed"} to ${cai.value.toFixed(1)}%` : `US growth nowcast steady at ${cai.value.toFixed(1)}%`,
      detail: `GS Current Activity Indicator ${signed(d, 1)} pp versus the prior reading (annualized pace).`,
      source: "GS CAI",
      date: cai.date,
    });
  }

  const map = tile(macro, "GS_MAP");
  if (map) {
    const prev = map.value - map.change;
    const crossed = Math.sign(map.value) !== Math.sign(prev) && Math.abs(map.change) >= 0.3;
    let title = "US data surprises near neutral";
    let level: SignalAlert["level"] = "info";
    if (map.value <= -0.5) [title, level] = ["US data surprising to the downside", map.value <= -1 ? "high" : "medium"];
    else if (map.value >= 0.5) [title, level] = ["US data surprising to the upside", map.value >= 1 ? "high" : "medium"];
    else if (crossed) [title, level] = [`US data surprises turned ${map.value < 0 ? "negative" : "positive"}`, "medium"];
    out.push({
      id: "map",
      level,
      direction: map.change > 0 ? "up" : map.change < 0 ? "down" : "neutral",
      title,
      detail: `GS MAP surprise index (21-day average) at ${map.value.toFixed(2)}, ${signed(map.change)} over the month.`,
      source: "GS MAP",
      date: map.date,
    });
  }

  const rai = tile(macro, "GS_RAI");
  if (rai) {
    let title = "Global risk appetite neutral";
    let level: SignalAlert["level"] = "info";
    if (rai.value <= -0.5) [title, level] = ["Global risk appetite in risk-off territory", rai.value <= -1 ? "high" : "medium"];
    else if (rai.value >= 0.5) [title, level] = ["Global risk appetite in risk-on territory", rai.value >= 1 ? "high" : "medium"];
    else if (Math.abs(rai.change) >= 0.75) [title, level] = [`Global risk appetite ${rai.change < 0 ? "fell" : "rose"} sharply`, "medium"];
    out.push({
      id: "rai",
      level,
      direction: rai.change > 0 ? "up" : rai.change < 0 ? "down" : "neutral",
      title,
      detail: `GS Risk Appetite Indicator at ${rai.value.toFixed(2)}, ${signed(rai.change)} over the month.`,
      source: "GS RAI",
      date: rai.date,
    });
  }

  const social = tile(macro, "GS_SOCIAL");
  if (social && Math.abs(social.change) >= 0.3) {
    out.push({
      id: "social",
      level: "medium",
      direction: social.change > 0 ? "up" : "down",
      title: `Social-media economic sentiment ${social.change > 0 ? "improved" : "deteriorated"}`,
      detail: `GS US social-media sentiment index at ${social.value.toFixed(2)}, ${signed(social.change)} over the month.`,
      source: "GS Social Sentiment",
      date: social.date,
    });
  }

  for (const c of macro.commodities) {
    if (c.quarter === null || c.twelveMonth === null || c.quarter === 0) continue;
    const move = c.twelveMonth / c.quarter - 1;
    if (Math.abs(move) < 0.1) continue;
    out.push({
      id: `cmd-${c.label}`,
      level: Math.abs(move) >= 0.2 ? "medium" : "info",
      direction: move > 0 ? "up" : "down",
      title: `GS sees ${c.label} ${move > 0 ? "higher" : "lower"} in 12 months`,
      detail: `GIR forecast $${Math.round(c.twelveMonth).toLocaleString("en-US")} in 12 months vs $${Math.round(c.quarter).toLocaleString("en-US")} for ${c.quarterLabel} (${pct(move)}, ${c.unit}).`,
      source: "GIR commodity forecasts",
      date: c.date,
    });
  }

  const mxn = macro.fx.find((f) => f.pair === "USD/MXN");
  if (mxn && mxn.threeMonth !== null && mxn.twelveMonth !== null) {
    out.push({
      id: "fx-mxn",
      level: "info",
      direction: mxn.twelveMonth > mxn.threeMonth ? "up" : mxn.twelveMonth < mxn.threeMonth ? "down" : "neutral",
      title: `GS forecasts USD/MXN at ${mxn.twelveMonth.toFixed(2)} in 12 months`,
      detail: `GIR FX forecast: ${mxn.threeMonth.toFixed(2)} in 3 months, ${mxn.twelveMonth.toFixed(2)} in 12 months.`,
      source: "GIR FX forecasts",
      date: mxn.date,
    });
  }

  return out.sort((a, b) => LEVEL_RANK[a.level] - LEVEL_RANK[b.level]);
}
