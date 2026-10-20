import "server-only";
import { getJson } from "../http";
import type { Quote } from "../types";

// Read-only market data from Alpaca's free plan: 15-minute delayed SIP stock
// snapshots (IEX as fallback) and crypto snapshots. Never touches trading APIs.
const STOCKS: Array<Omit<Quote, "price" | "changePct">> = [
  { symbol: "SPY", label: "S&P 500", group: "Equities" },
  { symbol: "QQQ", label: "Nasdaq 100", group: "Equities" },
  { symbol: "IWM", label: "Russell 2000", group: "Equities" },
  { symbol: "EFA", label: "Developed ex-US", group: "Equities" },
  { symbol: "EEM", label: "Emerging Mkts", group: "Equities" },
  { symbol: "TLT", label: "20Y+ Treasuries", group: "Rates & Credit" },
  { symbol: "IEF", label: "7–10Y Treasuries", group: "Rates & Credit" },
  { symbol: "HYG", label: "High Yield", group: "Rates & Credit" },
  { symbol: "GLD", label: "Gold", group: "Commodities" },
  { symbol: "SLV", label: "Silver", group: "Commodities" },
  { symbol: "USO", label: "WTI Crude", group: "Commodities" },
  { symbol: "UUP", label: "US Dollar", group: "Currencies" },
];

const CRYPTO: Array<Omit<Quote, "price" | "changePct">> = [
  { symbol: "BTC/USD", label: "Bitcoin", group: "Crypto" },
  { symbol: "ETH/USD", label: "Ether", group: "Crypto" },
  { symbol: "SOL/USD", label: "Solana", group: "Crypto" },
];

type Bar = { c: number };
type Snapshot = { latestTrade?: { p: number }; dailyBar?: Bar; prevDailyBar?: Bar };

function toQuote(meta: Omit<Quote, "price" | "changePct">, snap: Snapshot | undefined): Quote | null {
  if (!snap) return null;
  const price = snap.latestTrade?.p ?? snap.dailyBar?.c;
  const prev = snap.prevDailyBar?.c;
  if (!price || !prev) return null;
  return { ...meta, price, changePct: ((price - prev) / prev) * 100 };
}

export function alpacaConfigured() {
  return Boolean(process.env.APCA_API_KEY_ID && process.env.APCA_API_SECRET_KEY);
}

export async function fetchAlpacaQuotes(): Promise<Quote[] | null> {
  if (!alpacaConfigured()) return null;
  const headers = {
    "APCA-API-KEY-ID": process.env.APCA_API_KEY_ID!,
    "APCA-API-SECRET-KEY": process.env.APCA_API_SECRET_KEY!,
  };
  const stockUrl = (feed: string) =>
    `https://data.alpaca.markets/v2/stocks/snapshots?symbols=${STOCKS.map((s) => s.symbol).join(",")}&feed=${feed}`;
  const [stocks, crypto] = await Promise.all([
    // 15-minute delayed consolidated (SIP) prices; fall back to the IEX feed.
    getJson<Record<string, Snapshot>>(stockUrl("delayed_sip"), { headers }).then((r) => r ?? getJson<Record<string, Snapshot>>(stockUrl("iex"), { headers })),
    getJson<{ snapshots: Record<string, Snapshot> }>(
      `https://data.alpaca.markets/v1beta3/crypto/us/snapshots?symbols=${encodeURIComponent(CRYPTO.map((s) => s.symbol).join(","))}`,
      { headers },
    ),
  ]);
  const quotes = [
    ...STOCKS.map((m) => toQuote(m, stocks?.[m.symbol])),
    ...CRYPTO.map((m) => toQuote(m, crypto?.snapshots?.[m.symbol])),
  ].filter((q): q is Quote => q !== null);
  return quotes.length >= 4 ? quotes : null;
}
