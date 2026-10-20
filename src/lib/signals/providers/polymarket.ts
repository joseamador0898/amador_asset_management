import "server-only";
import { getJson } from "../http";
import type { PredictionMarket } from "../types";

// Public Gamma API (no key). Macro first, then markets, at most one crypto event;
// whole-word matching so "Golden State" never counts as gold.
const GROUPS: Array<{ max: number; pattern: RegExp }> = [
  {
    max: 5,
    pattern:
      /\b(fed|fomc|rates?|interest rates?|inflation|cpi|pce|recession|gdp|unemployment|jobs report|payrolls?|tariffs?|treasury|yields?|powell|ecb|boj|bank of england|government shutdown|shutdown|debt ceiling|default)\b/i,
  },
  { max: 2, pattern: /\b(s&p|nasdaq|dow jones|stock market|stocks|earnings|ipo|oil|crude|gold|dollar)\b/i },
  { max: 1, pattern: /\b(bitcoin|btc|ethereum|ether)\b/i },
];

type GammaMarket = {
  id: string;
  question?: string;
  groupItemTitle?: string;
  outcomes?: string;
  outcomePrices?: string;
  active?: boolean;
  closed?: boolean;
  volume24hr?: number;
};
type GammaEvent = {
  id: string;
  slug: string;
  title: string;
  endDate?: string;
  volume24hr?: number;
  markets?: GammaMarket[];
};

function parseList(s?: string): string[] {
  if (!s) return [];
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}

function toPrediction(ev: GammaEvent): PredictionMarket | null {
  const markets = (ev.markets ?? []).filter((m) => m.active !== false && m.closed !== true);
  if (!markets.length) return null;

  let outcomes: PredictionMarket["outcomes"];
  if (markets.length === 1) {
    // Single binary market: show its outcomes directly.
    const labels = parseList(markets[0].outcomes);
    const prices = parseList(markets[0].outcomePrices).map(Number);
    outcomes = labels.map((label, i) => ({ label, probability: prices[i] ?? 0 }));
  } else {
    // Multi-outcome event: one "Yes" price per sub-market.
    outcomes = markets.map((m) => ({
      label: m.groupItemTitle || m.question || "Outcome",
      probability: Number(parseList(m.outcomePrices)[0] ?? 0),
    }));
  }
  outcomes = outcomes
    .filter((o) => Number.isFinite(o.probability))
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 4);
  if (!outcomes.length) return null;

  return {
    id: ev.id,
    title: ev.title,
    url: `https://polymarket.com/event/${ev.slug}`,
    volume24h: ev.volume24hr ?? 0,
    endDate: ev.endDate,
    outcomes,
  };
}

export async function fetchPolymarket(limit = 8): Promise<PredictionMarket[] | null> {
  const events = await getJson<GammaEvent[]>(
    "https://gamma-api.polymarket.com/events?closed=false&active=true&order=volume24hr&ascending=false&limit=120",
  );
  if (!events?.length) return null;
  const picked: PredictionMarket[][] = GROUPS.map(() => []);
  for (const ev of events) {
    const g = GROUPS.findIndex((grp) => grp.pattern.test(ev.title));
    if (g < 0 || picked[g].length >= GROUPS[g].max) continue;
    const p = toPrediction(ev);
    // Skip markets that are effectively decided (nothing between 3% and 97%).
    if (!p || !p.outcomes.some((o) => o.probability > 0.03 && o.probability < 0.97)) continue;
    picked[g].push(p);
  }
  const out = picked.flat().slice(0, limit);
  return out.length ? out : null;
}
