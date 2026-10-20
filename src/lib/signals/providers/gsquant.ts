import "server-only";
import { USER_AGENT } from "../http";
import type { GsCommodityForecast, GsMacro, MacroSeries } from "../types";

/*
 * Goldman Sachs Marquee (the data platform behind gs_quant), via its REST API.
 * LICENSED DATA: Marquee content is licensed to the account holder and is
 * generally not for public redistribution. The panel is off unless
 * SIGNALS_GS=on and GS_CLIENT_ID / GS_CLIENT_SECRET are set; keep it off on any
 * public deployment until Goldman Sachs confirms the license permits display.
 */

const TOKEN_URL = "https://idfs.gs.com/as/token.oauth2";
const API = "https://api.marquee.gs.com/v1/data";

type Row = Record<string, string | number | null>;

export function gsEnabled() {
  return (process.env.SIGNALS_GS ?? "").toLowerCase() === "on" && Boolean(process.env.GS_CLIENT_ID && process.env.GS_CLIENT_SECRET);
}

async function token(): Promise<string | null> {
  try {
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": USER_AGENT },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.GS_CLIENT_ID!,
        client_secret: process.env.GS_CLIENT_SECRET!,
        scope: "read_product_data",
      }),
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });
    if (!res.ok) {
      console.warn(`[signals] marquee auth -> HTTP ${res.status}`);
      return null;
    }
    return ((await res.json()) as { access_token?: string }).access_token ?? null;
  } catch (err) {
    console.warn(`[signals] marquee auth -> ${(err as Error).name}`);
    return null;
  }
}

async function query(bearer: string, dataset: string, where: Record<string, string[]>, days: number): Promise<Row[]> {
  try {
    const res = await fetch(`${API}/${dataset}/query`, {
      method: "POST",
      headers: { Authorization: `Bearer ${bearer}`, "Content-Type": "application/json", "User-Agent": USER_AGENT },
      body: JSON.stringify({
        where,
        startDate: new Date(Date.now() - days * 864e5).toISOString().slice(0, 10),
        endDate: new Date().toISOString().slice(0, 10),
      }),
      signal: AbortSignal.timeout(12000),
      cache: "no-store",
    });
    if (!res.ok) {
      console.warn(`[signals] marquee ${dataset} -> HTTP ${res.status}`);
      return [];
    }
    return ((await res.json()) as { data?: Row[] }).data ?? [];
  } catch (err) {
    console.warn(`[signals] marquee ${dataset} -> ${(err as Error).name}`);
    return [];
  }
}

function downsample(points: number[], max = 80) {
  if (points.length <= max) return points;
  const step = (points.length - 1) / (max - 1);
  return Array.from({ length: max }, (_, i) => points[Math.round(i * step)]);
}

/** Builds a tile from dated rows; `lookback` = observations back for the change. */
function series(
  rows: Row[],
  field: string,
  meta: Omit<MacroSeries, "value" | "change" | "date" | "points" | "changeLabel">,
  lookback: number,
  changeLabel: string,
): MacroSeries | null {
  const obs = rows
    .filter((r) => typeof r[field] === "number" && r.date)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  if (obs.length < 2) return null;
  const values = obs.map((r) => Number(r[field]));
  const last = values[values.length - 1];
  const ref = values[Math.max(0, values.length - 1 - lookback)];
  return { ...meta, value: last, change: last - ref, changeLabel, date: String(obs[obs.length - 1].date), points: downsample(values) };
}

const COMMODITIES: Array<{ name: string; label: string; unit: string }> = [
  { name: "Brent", label: "Brent crude", unit: "$/bbl" },
  { name: "Wti", label: "WTI crude", unit: "$/bbl" },
  { name: "Gold", label: "Gold", unit: "$/oz" },
  { name: "Copper", label: "Copper", unit: "$/t" },
];

async function commodityForecasts(bearer: string): Promise<GsCommodityForecast[]> {
  try {
    const res = await fetch(`${API}/COMMODITIESRESEARCHFORECASTS/coverage?limit=100`, {
      headers: { Authorization: `Bearer ${bearer}`, "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });
    if (!res.ok) return [];
    const coverage = ((await res.json()) as { results?: Array<{ assetId: string; name: string }> }).results ?? [];
    const out = await Promise.all(
      COMMODITIES.map(async (c) => {
        const asset = coverage.find((a) => a.name === c.name);
        if (!asset) return null;
        const rows = await query(bearer, "COMMODITIESRESEARCHFORECASTS", { assetId: [asset.assetId] }, 14);
        const lastDate = rows.map((r) => String(r.date)).sort().at(-1);
        if (!lastDate) return null;
        const latest = rows.filter((r) => String(r.date) === lastDate && r.forecastType === "spot");
        const d = new Date(`${lastDate}T12:00:00Z`);
        const quarter = `${d.getUTCFullYear()}Q${Math.floor(d.getUTCMonth() / 3) + 1}`;
        const pick = (period: string) => {
          const v = latest.find((r) => r.forecastPeriod === period)?.forecastValue;
          return typeof v === "number" ? v : null;
        };
        const q = pick(quarter);
        const y12 = pick("12m");
        if (q === null && y12 === null) return null;
        return { label: c.label, unit: c.unit, quarterLabel: quarter.replace("Q", " Q"), quarter: q, twelveMonth: y12, date: lastDate };
      }),
    );
    return out.filter((x): x is GsCommodityForecast => x !== null);
  } catch {
    return [];
  }
}

export async function fetchGsMacro(): Promise<GsMacro | null> {
  if (!gsEnabled()) return null;
  const bearer = await token();
  if (!bearer) return null;

  const [fci, cai, map, rai, social, commodities] = await Promise.all([
    query(bearer, "FCI", { geographyId: ["US"] }, 420),
    query(bearer, "CAI", { geographyId: ["US"], metricName: ["CAI_HEADLINE"] }, 900),
    query(bearer, "MAP", { geographyId: ["US"], metricName: ["map_21d_ma"] }, 420),
    query(bearer, "RAI", { geographyId: ["GLagg"], metricName: ["rai_headline"] }, 420),
    query(bearer, "GS_SOCIAL_MEDIA_ECONOMIC_SENTIMENT_INDEX_V1_STANDARD", { geographyId: ["US"], metricName: ["sentiment_index"] }, 420),
    commodityForecasts(bearer),
  ]);

  const tiles = [
    series(fci, "fci", { id: "GS_FCI", label: "GS Fin. Conditions", unit: "index", decimals: 2, description: "Goldman Sachs US Financial Conditions Index (higher = tighter)" }, 21, "1M"),
    series(cai, "metricValue", { id: "GS_CAI", label: "GS Activity Nowcast", unit: "%", decimals: 1, description: "Goldman Sachs US Current Activity Indicator, annualized growth pace" }, 1, "prior"),
    series(map, "metricValue", { id: "GS_MAP", label: "GS Data Surprises", unit: "index", decimals: 2, description: "Goldman Sachs MAP US macro-data surprise index, 21-day average" }, 21, "1M"),
    series(rai, "metricValue", { id: "GS_RAI", label: "GS Risk Appetite", unit: "index", decimals: 2, description: "Goldman Sachs global Risk Appetite Indicator" }, 21, "1M"),
    // Social sentiment is published for calendar days, so a month is ~30 observations.
    series(social, "metricValue", { id: "GS_SOCIAL", label: "GS Social Sentiment", unit: "index", decimals: 2, description: "Goldman Sachs US social-media economic sentiment index" }, 30, "1M"),
  ].filter((t): t is MacroSeries => t !== null);

  if (!tiles.length && !commodities.length) return null;
  return { tiles, commodities };
}
