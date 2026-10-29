import type { Lang } from "@/lib/i18n";
import "server-only";
import { cacheLife } from "next/cache";
import type {
  CongressTrade,
  DarkPoolPrint,
  Feed,
  GsMacro,
  InsiderTrade,
  LiveBoard,
  MacroSeries,
  OptionsPulse,
  PredictionMarket,
  Quote,
  TidePoint,
} from "./types";
import { sampleCongress, sampleDarkPool, sampleInsiders, sampleMacro, sampleOptions, samplePredictions, sampleQuotes, sampleTide } from "./sample";
import { fetchAlpacaQuotes } from "./providers/alpaca";
import { fetchFredMacro } from "./providers/fred";
import { fetchPolymarket } from "./providers/polymarket";
import { fetchOptionsPulse } from "./providers/cboe";
import { fetchSecInsiders } from "./providers/sec";
import { fetchUwCongress, fetchUwDarkPool, fetchUwMarketTide } from "./providers/unusualwhales";
import { generateBrief } from "./providers/gemini";
import { fetchGsMacro } from "./providers/gsquant";
import { fetchLiveBoard } from "./providers/live";
import { buildGsAlerts } from "./alerts";
import { fmt } from "@/lib/utils";

const now = () => new Date().toISOString();

export async function getQuotes(): Promise<Feed<Quote[]>> {
  "use cache";
  cacheLife("signals");
  const live = await fetchAlpacaQuotes();
  return live
    ? { data: live, source: { provider: "Alpaca Markets (real-time IEX)", live: true, url: "https://alpaca.markets", asOf: now() } }
    : { data: sampleQuotes, source: { provider: "Sample data", live: false, note: "Set APCA_API_KEY_ID / APCA_API_SECRET_KEY for live quotes.", asOf: now() } };
}

export async function getMacro(): Promise<Feed<MacroSeries[]>> {
  "use cache";
  cacheLife("filings");
  const live = await fetchFredMacro();
  return live
    ? { data: live, source: { provider: "FRED®, Federal Reserve Bank of St. Louis", live: true, url: "https://fred.stlouisfed.org", asOf: now() } }
    : { data: sampleMacro, source: { provider: "Sample data", live: false, note: "Set FRED_API_KEY for live macro series.", asOf: now() } };
}

export async function getPredictions(): Promise<Feed<PredictionMarket[]>> {
  "use cache";
  cacheLife("signals");
  const live = await fetchPolymarket();
  return live
    ? { data: live, source: { provider: "Polymarket", live: true, url: "https://polymarket.com", asOf: now() } }
    : { data: samplePredictions, source: { provider: "Sample data", live: false, note: "Polymarket did not respond.", asOf: now() } };
}

export async function getOptionsPulse(): Promise<Feed<OptionsPulse>> {
  "use cache";
  cacheLife("signals");
  const live = await fetchOptionsPulse();
  return live
    ? { data: live, source: { provider: "Cboe delayed quotes (~15 min)", live: true, url: "https://www.cboe.com/delayed_quotes/", asOf: now() } }
    : { data: sampleOptions, source: { provider: "Sample data", live: false, note: "Set SIGNALS_CBOE=on (or add a licensed options feed).", asOf: now() } };
}

export async function getInsiders(): Promise<Feed<InsiderTrade[]>> {
  "use cache";
  cacheLife("filings");
  const live = await fetchSecInsiders();
  return live
    ? { data: live, source: { provider: "SEC EDGAR Form 4", live: true, url: "https://www.sec.gov/edgar/search/", asOf: now() } }
    : { data: sampleInsiders, source: { provider: "Sample data", live: false, note: "SEC EDGAR did not respond.", asOf: now() } };
}

export async function getCongress(): Promise<Feed<CongressTrade[]>> {
  "use cache";
  cacheLife("filings");
  const live = await fetchUwCongress();
  return live
    ? { data: live, source: { provider: "Unusual Whales", live: true, url: "https://unusualwhales.com", asOf: now() } }
    : { data: sampleCongress, source: { provider: "Data partner required", live: false, note: "Add a valid UNUSUAL_WHALES_API_KEY.", asOf: now() } };
}

export async function getDarkPool(): Promise<Feed<DarkPoolPrint[]>> {
  "use cache";
  cacheLife("signals");
  const live = await fetchUwDarkPool();
  return live
    ? { data: live, source: { provider: "Unusual Whales", live: true, url: "https://unusualwhales.com", asOf: now() } }
    : { data: sampleDarkPool, source: { provider: "Data partner required", live: false, note: "Add a valid UNUSUAL_WHALES_API_KEY.", asOf: now() } };
}

export async function getMarketTide(): Promise<Feed<TidePoint[]>> {
  "use cache";
  cacheLife("signals");
  const live = await fetchUwMarketTide();
  return live
    ? { data: live, source: { provider: "Unusual Whales", live: true, url: "https://unusualwhales.com", asOf: now() } }
    : { data: sampleTide, source: { provider: "Data partner required", live: false, note: "Add a valid UNUSUAL_WHALES_API_KEY.", asOf: now() } };
}

/**
 * Goldman Sachs Marquee macro lens (licensed data). Returns null unless
 * SIGNALS_GS=on with credentials, so public deployments omit the panel.
 */
export async function getGsMacro(): Promise<Feed<GsMacro> | null> {
  "use cache";
  cacheLife("filings");
  const live = await fetchGsMacro();
  return live
    ? { data: live, source: { provider: "Goldman Sachs Global Investment Research, via Marquee", live: true, url: "https://marquee.gs.com", asOf: now() } }
    : null;
}

/** Live board for first paint; the client then polls /api/markets/live. */
export async function getLiveBoard(): Promise<LiveBoard> {
  "use cache";
  cacheLife("signals");
  return fetchLiveBoard();
}

/**
 * Analyst commentary: a Gemini-written summary led by Goldman Sachs indicators
 * and GIR forecasts (when enabled), then markets, macro and prediction markets.
 * Refreshed hourly.
 */
export async function getBrief(lang: Lang = "en"): Promise<{ text: string; asOf: string; model: string; gs: boolean } | null> {
  "use cache";
  cacheLife("hours");
  const [gs, quotes, macro, predictions] = await Promise.all([fetchGsMacro(), fetchAlpacaQuotes(), fetchFredMacro(), fetchPolymarket(5)]);
  if (!gs && !quotes && !macro && !predictions) return null;
  const lines: string[] = [];
  if (gs) {
    lines.push(
      "Goldman Sachs indicators (lead with these): " +
        gs.tiles.map((t) => `${t.label} ${t.value.toFixed(t.decimals)}${t.unit === "%" ? "%" : ""} (${t.change >= 0 ? "+" : ""}${t.change.toFixed(t.decimals)} vs ${t.changeLabel})`).join("; "),
    );
    if (gs.commodities.length)
      lines.push(
        "Goldman Sachs GIR commodity forecasts: " +
          gs.commodities.map((c) => `${c.label} ${c.quarterLabel} $${c.quarter ?? "n/a"}, 12-month $${c.twelveMonth ?? "n/a"} (${c.unit})`).join("; "),
      );
    if (gs.fx.length)
      lines.push("Goldman Sachs GIR FX forecasts: " + gs.fx.map((f) => `${f.pair} 3-month ${f.threeMonth ?? "n/a"}, 12-month ${f.twelveMonth ?? "n/a"}`).join("; "));
    const alerts = buildGsAlerts(gs).filter((a) => a.level !== "info");
    if (alerts.length) lines.push("Alerts triggered: " + alerts.map((a) => a.title).join("; "));
  }
  if (quotes) lines.push("Markets (daily % change): " + quotes.map((q) => `${q.label} ${fmt.pct(q.changePct)}`).join("; "));
  if (macro)
    lines.push(
      "Macro (latest, change vs " + "reference): " +
        macro.map((m) => `${m.label} ${m.value.toFixed(m.decimals)}${m.unit === "index" ? "" : m.unit} (${m.change >= 0 ? "+" : ""}${m.change.toFixed(m.decimals)} vs ${m.changeLabel})`).join("; "),
    );
  if (predictions)
    lines.push(
      "Prediction markets: " +
        predictions.map((p) => `${p.title}: ${p.outcomes.slice(0, 2).map((o) => `${o.label} ${(o.probability * 100).toFixed(0)}%`).join(", ")}`).join(" | "),
    );
  const text = await generateBrief(lines.join("\n"), lang);
  return text ? { text, asOf: now(), model: process.env.GEMINI_MODEL || "gemini-2.5-flash", gs: Boolean(gs) } : null;
}
