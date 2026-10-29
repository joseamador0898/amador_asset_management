import type { Lang } from "@/lib/i18n";
import { ALERT_COPY } from "./alerts-copy";
import type { GsMacro, MacroSeries, SignalAlert } from "./types";

/*
 * Rule-based alerts derived from the Goldman Sachs macro lens. Deterministic
 * thresholds on published GS series; no forecasts of our own and no advice.
 * The wording in each language lives in alerts-copy.ts.
 */

const LEVEL_RANK: Record<SignalAlert["level"], number> = { high: 0, medium: 1, info: 2 };

function tile(macro: GsMacro, id: string): MacroSeries | undefined {
  return macro.tiles.find((t) => t.id === id);
}

export function buildGsAlerts(macro: GsMacro, lang: Lang = "en"): SignalAlert[] {
  const t = ALERT_COPY[lang];
  const out: SignalAlert[] = [];

  const fci = tile(macro, "GS_FCI");
  if (fci) {
    const d = fci.change;
    const big = Math.abs(d) >= 0.25;
    out.push({
      id: "fci",
      level: Math.abs(d) >= 0.5 ? "high" : big ? "medium" : "info",
      direction: d > 0 ? "up" : d < 0 ? "down" : "neutral",
      title: big ? (d > 0 ? t.fciTighter : t.fciEasier) : t.fciFlat,
      detail: t.fciDetail(fci.value, d),
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
      title: big ? t.caiMoved(d > 0, cai.value) : t.caiSteady(cai.value),
      detail: t.caiDetail(d),
      source: "GS CAI",
      date: cai.date,
    });
  }

  const map = tile(macro, "GS_MAP");
  if (map) {
    const prev = map.value - map.change;
    const crossed = Math.sign(map.value) !== Math.sign(prev) && Math.abs(map.change) >= 0.3;
    let title = t.mapNeutral;
    let level: SignalAlert["level"] = "info";
    if (map.value <= -0.5) [title, level] = [t.mapDown, map.value <= -1 ? "high" : "medium"];
    else if (map.value >= 0.5) [title, level] = [t.mapUp, map.value >= 1 ? "high" : "medium"];
    else if (crossed) [title, level] = [t.mapTurned(map.value < 0), "medium"];
    out.push({
      id: "map",
      level,
      direction: map.change > 0 ? "up" : map.change < 0 ? "down" : "neutral",
      title,
      detail: t.mapDetail(map.value, map.change),
      source: "GS MAP",
      date: map.date,
    });
  }

  const rai = tile(macro, "GS_RAI");
  if (rai) {
    let title = t.raiNeutral;
    let level: SignalAlert["level"] = "info";
    if (rai.value <= -0.5) [title, level] = [t.raiOff, rai.value <= -1 ? "high" : "medium"];
    else if (rai.value >= 0.5) [title, level] = [t.raiOn, rai.value >= 1 ? "high" : "medium"];
    else if (Math.abs(rai.change) >= 0.75) [title, level] = [t.raiSharp(rai.change < 0), "medium"];
    out.push({
      id: "rai",
      level,
      direction: rai.change > 0 ? "up" : rai.change < 0 ? "down" : "neutral",
      title,
      detail: t.raiDetail(rai.value, rai.change),
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
      title: t.socialTitle(social.change > 0),
      detail: t.socialDetail(social.value, social.change),
      source: t.socialSource,
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
      title: t.commodityTitle(c.label, move > 0),
      detail: t.commodityDetail(c.twelveMonth, c.quarter, c.quarterLabel, move, c.unit),
      source: t.commoditySource,
      date: c.date,
    });
  }

  const mxn = macro.fx.find((f) => f.pair === "USD/MXN");
  if (mxn && mxn.threeMonth !== null && mxn.twelveMonth !== null) {
    out.push({
      id: "fx-mxn",
      level: "info",
      direction: mxn.twelveMonth > mxn.threeMonth ? "up" : mxn.twelveMonth < mxn.threeMonth ? "down" : "neutral",
      title: t.mxnTitle(mxn.twelveMonth),
      detail: t.mxnDetail(mxn.threeMonth, mxn.twelveMonth),
      source: t.mxnSource,
      date: mxn.date,
    });
  }

  return out.sort((a, b) => LEVEL_RANK[a.level] - LEVEL_RANK[b.level]);
}
