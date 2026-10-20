import "server-only";
import { getJson, mapLimit } from "../http";
import type { OptionsContract, OptionsPulse, TickerFlow } from "../types";

/*
 * Options Pulse: an "unusual activity" screen computed from Cboe's public
 * delayed (about 15 minutes) option chains. No API key. Opt in with
 * SIGNALS_CBOE=on and confirm Cboe's terms allow your use before public launch.
 */

export const PULSE_TICKERS = ["NVDA", "TSLA", "AAPL", "AMZN", "META", "MSFT", "GOOGL", "AMD", "PLTR", "COIN", "AVGO", "NFLX"];

type CboeOption = {
  option: string;
  last_trade_price: number;
  volume: number;
  open_interest: number;
  iv: number;
  delta: number;
  bid: number;
  ask: number;
};
type CboeChain = {
  data: {
    symbol: string;
    current_price: number;
    price_change_percent: number;
    iv30?: number;
    options: CboeOption[];
  };
};

export function cboeEnabled() {
  return (process.env.SIGNALS_CBOE ?? "").toLowerCase() === "on";
}

/** OCC symbol: ROOT + YYMMDD + C/P + strike x 1000 (8 digits). */
function parseOcc(sym: string) {
  const m = sym.match(/^([A-Z.]+)(\d{2})(\d{2})(\d{2})([CP])(\d{8})$/);
  if (!m) return null;
  const [, root, yy, mm, dd, cp, strike] = m;
  return { root, expiry: `20${yy}-${mm}-${dd}`, type: cp as "C" | "P", strike: Number(strike) / 1000 };
}

export async function fetchOptionsPulse(): Promise<OptionsPulse | null> {
  if (!cboeEnabled()) return null;
  const chains = await mapLimit(PULSE_TICKERS, 4, (t) =>
    getJson<CboeChain>(`https://cdn.cboe.com/api/global/delayed_quotes/options/${t}.json`, { timeoutMs: 12000 }),
  );

  const tickers: TickerFlow[] = [];
  const contracts: OptionsContract[] = [];

  chains.forEach((chain, idx) => {
    const d = chain?.data;
    if (!d?.options?.length) return;
    const ticker = PULSE_TICKERS[idx];
    const spot = d.current_price;
    let callPremium = 0;
    let putPremium = 0;
    let callVol = 0;
    let putVol = 0;

    for (const o of d.options) {
      if (!o.volume) continue;
      const occ = parseOcc(o.option);
      if (!occ) continue;
      const mid = o.bid > 0 && o.ask > 0 ? (o.bid + o.ask) / 2 : 0;
      const px = o.last_trade_price || mid;
      const premium = o.volume * px * 100;
      if (occ.type === "C") {
        callPremium += premium;
        callVol += o.volume;
      } else {
        putPremium += premium;
        putVol += o.volume;
      }
      // "Unusual": heavy volume relative to existing open interest, with size.
      const volOi = o.open_interest > 0 ? o.volume / o.open_interest : o.volume;
      if (o.volume >= 1000 && volOi >= 2 && premium >= 500_000) {
        contracts.push({
          ticker,
          contract: o.option,
          type: occ.type,
          strike: occ.strike,
          expiry: occ.expiry,
          volume: o.volume,
          openInterest: o.open_interest,
          volOi,
          premium,
          last: px,
          iv: o.iv,
          delta: o.delta,
          underlying: spot,
          moneynessPct: ((occ.strike - spot) / spot) * 100,
        });
      }
    }

    tickers.push({
      ticker,
      price: spot,
      changePct: d.price_change_percent,
      callPremium,
      putPremium,
      net: callPremium - putPremium,
      putCallVolume: callVol ? putVol / callVol : 0,
      iv30: d.iv30,
    });
  });

  if (!tickers.length) return null;
  contracts.sort((a, b) => b.premium - a.premium);
  tickers.sort((a, b) => Math.abs(b.net) - Math.abs(a.net));
  return { tickers, contracts: contracts.slice(0, 30) };
}
