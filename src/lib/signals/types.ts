/** Where a panel's data came from. `live: false` means the sample dataset is shown. */
export type SourceInfo = {
  provider: string;
  live: boolean;
  url?: string;
  note?: string;
  asOf: string; // ISO timestamp of when the data was fetched or last updated
};

export type Feed<T> = { data: T; source: SourceInfo };

export type Quote = {
  symbol: string;
  label: string;
  price: number;
  changePct: number;
  group: "Equities" | "Rates & Credit" | "Commodities" | "Currencies" | "Crypto" | "Volatility";
};

export type MacroSeries = {
  id: string;
  label: string;
  unit: string;
  decimals: number;
  value: number;
  change: number;
  changeLabel: string; // what `change` is measured against, e.g. "1M" or "prior"
  date: string;
  points: number[];
  description: string;
};

export type PredictionOutcome = { label: string; probability: number };

export type PredictionMarket = {
  id: string;
  title: string;
  url: string;
  volume24h: number;
  endDate?: string;
  outcomes: PredictionOutcome[];
};

export type OptionsContract = {
  ticker: string;
  contract: string;
  type: "C" | "P";
  strike: number;
  expiry: string; // YYYY-MM-DD
  volume: number;
  openInterest: number;
  volOi: number;
  premium: number; // volume x last x 100
  last: number;
  iv: number;
  delta: number;
  underlying: number;
  moneynessPct: number; // strike vs. spot, %
};

export type TickerFlow = {
  ticker: string;
  price: number;
  changePct: number;
  callPremium: number;
  putPremium: number;
  net: number;
  putCallVolume: number;
  iv30?: number;
};

export type OptionsPulse = { contracts: OptionsContract[]; tickers: TickerFlow[] };

export type InsiderTrade = {
  accession: string;
  issuer: string;
  ticker: string;
  insider: string;
  role: string;
  code: string;
  label: string;
  side: "buy" | "sell" | "other";
  shares: number;
  price: number;
  value: number;
  date: string;
  filedAt: string;
  url: string;
};

export type CongressTrade = {
  member: string;
  chamber: string;
  ticker: string;
  side: "buy" | "sell" | "other";
  amount: string;
  tradedOn: string;
  filedOn: string;
};

export type DarkPoolPrint = {
  ticker: string;
  price: number;
  size: number;
  premium: number;
  executedAt: string;
};

export type TidePoint = { t: string; netCall: number; netPut: number };
