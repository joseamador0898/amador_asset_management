import "server-only";
import { getJson } from "../http";
import type { CongressTrade, DarkPoolPrint, TidePoint } from "../types";

/*
 * Unusual Whales API adapter (https://api.unusualwhales.com/docs).
 * Active only when UNUSUAL_WHALES_API_KEY holds a valid key; every call returns
 * null on any failure so panels fall back gracefully. Public display of UW data
 * requires a plan whose terms permit redistribution.
 */

const BASE = "https://api.unusualwhales.com";

function headers() {
  return { Authorization: `Bearer ${process.env.UNUSUAL_WHALES_API_KEY}` };
}

export function uwConfigured() {
  return Boolean(process.env.UNUSUAL_WHALES_API_KEY);
}

type Rows<T> = { data?: T[] };

export async function fetchUwMarketTide(): Promise<TidePoint[] | null> {
  if (!uwConfigured()) return null;
  const json = await getJson<Rows<{ timestamp: string; net_call_premium: string; net_put_premium: string }>>(
    `${BASE}/api/market/market-tide?interval_5m=true`,
    { headers: headers() },
  );
  const rows = json?.data ?? [];
  if (!rows.length) return null;
  return rows.map((r) => ({
    t: new Date(r.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/New_York" }),
    netCall: Number(r.net_call_premium) || 0,
    netPut: Number(r.net_put_premium) || 0,
  }));
}

export async function fetchUwCongress(): Promise<CongressTrade[] | null> {
  if (!uwConfigured()) return null;
  const json = await getJson<
    Rows<{ name?: string; reporter?: string; member_type?: string; ticker?: string; txn_type?: string; amounts?: string; transaction_date?: string; filed_at_date?: string }>
  >(`${BASE}/api/congress/recent-trades?limit=30`, { headers: headers() });
  const rows = json?.data ?? [];
  if (!rows.length) return null;
  return rows.map((r) => {
    const t = (r.txn_type ?? "").toLowerCase();
    return {
      member: r.name ?? r.reporter ?? "Member",
      chamber: r.member_type ?? "",
      ticker: (r.ticker ?? "").toUpperCase(),
      side: t.includes("buy") || t.includes("purchase") ? "buy" : t.includes("sell") || t.includes("sale") ? "sell" : "other",
      amount: r.amounts ?? "",
      tradedOn: r.transaction_date ?? "",
      filedOn: r.filed_at_date ?? "",
    };
  });
}

export async function fetchUwDarkPool(): Promise<DarkPoolPrint[] | null> {
  if (!uwConfigured()) return null;
  const json = await getJson<Rows<{ ticker: string; price: string; size: number; premium: string; executed_at: string }>>(
    `${BASE}/api/darkpool/recent?limit=40`,
    { headers: headers() },
  );
  const rows = json?.data ?? [];
  if (!rows.length) return null;
  return rows
    .map((r) => ({
      ticker: r.ticker,
      price: Number(r.price) || 0,
      size: Number(r.size) || 0,
      premium: Number(r.premium) || 0,
      executedAt: r.executed_at,
    }))
    .sort((a, b) => b.premium - a.premium);
}
