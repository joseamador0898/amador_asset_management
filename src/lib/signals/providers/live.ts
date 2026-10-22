import "server-only";
import { getJson, mapLimit } from "../http";
import type { LiveBoard, LiveQuote, WorldMarket } from "../types";

/*
 * Live board: real-time prices from Alpaca's IEX feed (free plan; we keep the
 * list under ~50 symbols) plus local index levels from Yahoo Finance's chart
 * endpoint (the source the Python yfinance library uses; delayed). Read-only.
 */

type Country = Omit<WorldMarket, "indexLevel" | "indexChangePct" | "etfPrice" | "etfChangePct" | "etfTime"> & { yahoo: string };

export const COUNTRIES: Country[] = [
  { country: "United States", code: "US", region: "Americas", indexName: "S&P 500", yahoo: "^GSPC", etf: "SPY" },
  { country: "Mexico", code: "MX", region: "Americas", indexName: "S&P/BMV IPC", yahoo: "^MXX", etf: "EWW" },
  { country: "Canada", code: "CA", region: "Americas", indexName: "S&P/TSX", yahoo: "^GSPTSE", etf: "EWC" },
  { country: "Brazil", code: "BR", region: "Americas", indexName: "Ibovespa", yahoo: "^BVSP", etf: "EWZ" },
  { country: "Chile", code: "CL", region: "Americas", indexName: "MSCI IPSA", yahoo: "MXIPSAPC.SN", etf: "ECH" },
  { country: "Argentina", code: "AR", region: "Americas", indexName: "S&P Merval", yahoo: "^MERV", etf: "ARGT" },
  { country: "Peru", code: "PE", region: "Americas", indexName: "MSCI nuam Peru General", yahoo: "^763087-PEN-STRD", etf: "EPU" },
  { country: "United Kingdom", code: "GB", region: "Europe", indexName: "FTSE 100", yahoo: "^FTSE", etf: "EWU" },
  { country: "Germany", code: "DE", region: "Europe", indexName: "DAX", yahoo: "^GDAXI", etf: "EWG" },
  { country: "France", code: "FR", region: "Europe", indexName: "CAC 40", yahoo: "^FCHI", etf: "EWQ" },
  { country: "Spain", code: "ES", region: "Europe", indexName: "IBEX 35", yahoo: "^IBEX", etf: "EWP" },
  { country: "Italy", code: "IT", region: "Europe", indexName: "FTSE MIB", yahoo: "FTSEMIB.MI", etf: "EWI" },
  { country: "Japan", code: "JP", region: "Asia-Pacific", indexName: "Nikkei 225", yahoo: "^N225", etf: "EWJ" },
  { country: "China", code: "CN", region: "Asia-Pacific", indexName: "Shanghai Composite", yahoo: "000001.SS", etf: "MCHI" },
  { country: "Hong Kong", code: "HK", region: "Asia-Pacific", indexName: "Hang Seng", yahoo: "^HSI", etf: "EWH" },
  { country: "India", code: "IN", region: "Asia-Pacific", indexName: "Sensex", yahoo: "^BSESN", etf: "INDA" },
  { country: "South Korea", code: "KR", region: "Asia-Pacific", indexName: "KOSPI", yahoo: "^KS11", etf: "EWY" },
  { country: "Taiwan", code: "TW", region: "Asia-Pacific", indexName: "TAIEX", yahoo: "^TWII", etf: "EWT" },
  { country: "Australia", code: "AU", region: "Asia-Pacific", indexName: "S&P/ASX 200", yahoo: "^AXJO", etf: "EWA" },
  { country: "South Africa", code: "ZA", region: "Middle East & Africa", indexName: "JSE All Share", yahoo: "^J203.JO", etf: "EZA" },
  { country: "Saudi Arabia", code: "SA", region: "Middle East & Africa", indexName: "Tadawul (TASI)", yahoo: "^TASI.SR", etf: "KSA" },
];

// Other live tickers (US index, sector, rates and commodity ETFs). Kept so the
// total stays under ~50 real-time symbols.
export const LIVE_EXTRAS: Array<Omit<LiveQuote, "price" | "changePct" | "time">> = [
  { symbol: "QQQ", label: "Nasdaq 100", group: "US indices" },
  { symbol: "DIA", label: "Dow Jones", group: "US indices" },
  { symbol: "IWM", label: "Russell 2000", group: "US indices" },
  { symbol: "XLK", label: "Technology", group: "US sectors" },
  { symbol: "XLF", label: "Financials", group: "US sectors" },
  { symbol: "XLE", label: "Energy", group: "US sectors" },
  { symbol: "XLV", label: "Health care", group: "US sectors" },
  { symbol: "XLI", label: "Industrials", group: "US sectors" },
  { symbol: "XLY", label: "Cons. discretionary", group: "US sectors" },
  { symbol: "XLP", label: "Cons. staples", group: "US sectors" },
  { symbol: "XLU", label: "Utilities", group: "US sectors" },
  { symbol: "XLB", label: "Materials", group: "US sectors" },
  { symbol: "XLRE", label: "Real estate", group: "US sectors" },
  { symbol: "XLC", label: "Communication", group: "US sectors" },
  { symbol: "TLT", label: "20Y+ Treasuries", group: "Rates & commodities" },
  { symbol: "HYG", label: "High yield", group: "Rates & commodities" },
  { symbol: "GLD", label: "Gold", group: "Rates & commodities" },
  { symbol: "SLV", label: "Silver", group: "Rates & commodities" },
  { symbol: "USO", label: "WTI crude", group: "Rates & commodities" },
  { symbol: "UNG", label: "Natural gas", group: "Rates & commodities" },
  { symbol: "UUP", label: "US dollar", group: "Rates & commodities" },
];

type Bar = { c: number };
type Snapshot = { latestTrade?: { p: number; t?: string }; dailyBar?: Bar; prevDailyBar?: Bar };

async function alpacaSnapshots(symbols: string[]): Promise<Record<string, Snapshot> | null> {
  const id = process.env.APCA_API_KEY_ID;
  const secret = process.env.APCA_API_SECRET_KEY;
  if (!id || !secret) return null;
  // IEX = real-time on Alpaca's free plan.
  return getJson<Record<string, Snapshot>>(
    `https://data.alpaca.markets/v2/stocks/snapshots?symbols=${encodeURIComponent(symbols.join(","))}&feed=iex`,
    { headers: { "APCA-API-KEY-ID": id, "APCA-API-SECRET-KEY": secret }, timeoutMs: 8000 },
  );
}

function fromSnap(s: Snapshot | undefined) {
  const price = s?.latestTrade?.p ?? s?.dailyBar?.c;
  const prev = s?.prevDailyBar?.c;
  if (!price || !prev) return null;
  return { price, changePct: ((price - prev) / prev) * 100, time: s?.latestTrade?.t ?? null };
}

type YahooChart = {
  chart?: { result?: Array<{ meta?: { regularMarketPrice?: number; chartPreviousClose?: number; regularMarketTime?: number } }> };
};

async function yahooLevel(symbol: string) {
  // range=1d so chartPreviousClose is the prior session's close (with 5d it is the close before the window).
  const json = await getJson<YahooChart>(
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1d&interval=1d`,
    { timeoutMs: 6000 },
  );
  const meta = json?.chart?.result?.[0]?.meta;
  const level = meta?.regularMarketPrice;
  const prev = meta?.chartPreviousClose;
  if (!level || !prev) return null;
  // Some feeds stop updating; past a long weekend, show the ETF alone instead.
  if (!meta.regularMarketTime || Date.now() - meta.regularMarketTime * 1000 > 4 * 864e5) return null;
  return { level, changePct: ((level - prev) / prev) * 100 };
}

const SYMBOLS = [...COUNTRIES.map((c) => c.etf), ...LIVE_EXTRAS.map((q) => q.symbol)];

// Short in-memory caches so frequent polling never hammers either provider.
// They hold the pending promise, so concurrent requests share one fetch.
let snapCache: { at: number; data: Promise<Record<string, Snapshot> | null> } | null = null;
let indexCache: { at: number; data: Promise<Array<{ level: number; changePct: number } | null>> } | null = null;

export async function fetchLiveBoard(): Promise<LiveBoard> {
  const now = Date.now();
  if (!snapCache || now - snapCache.at > 10_000) snapCache = { at: now, data: alpacaSnapshots(SYMBOLS) };
  if (!indexCache || now - indexCache.at > 60_000) indexCache = { at: now, data: mapLimit(COUNTRIES, 6, (c) => yahooLevel(c.yahoo)) };
  const asOf = snapCache.at;
  const [snapData, levels] = await Promise.all([snapCache.data, indexCache.data]);
  const snaps = snapData ?? {};
  const world: WorldMarket[] = COUNTRIES.map((c, i) => {
    const etf = fromSnap(snaps[c.etf]);
    const idx = levels[i];
    return {
      country: c.country,
      code: c.code,
      region: c.region,
      indexName: c.indexName,
      etf: c.etf,
      indexLevel: idx?.level ?? null,
      indexChangePct: idx?.changePct ?? null,
      etfPrice: etf?.price ?? null,
      etfChangePct: etf?.changePct ?? null,
      etfTime: etf?.time ?? null,
    };
  });
  const quotes: LiveQuote[] = LIVE_EXTRAS.map((q) => {
    const s = fromSnap(snaps[q.symbol]);
    return s ? { ...q, ...s } : null;
  }).filter((q): q is LiveQuote => q !== null);
  const live = world.some((w) => w.etfPrice !== null || w.indexLevel !== null);
  return { world, quotes, asOf: new Date(asOf).toISOString(), live };
}
