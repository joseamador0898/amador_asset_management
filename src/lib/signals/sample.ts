import type {
  CongressTrade,
  DarkPoolPrint,
  InsiderTrade,
  MacroSeries,
  OptionsPulse,
  PredictionMarket,
  Quote,
  TidePoint,
} from "./types";

/*
 * Illustrative sample data. Shown only when a live provider is not configured
 * or does not respond, and always labeled "Sample" in the UI.
 */

export const sampleQuotes: Quote[] = [
  { symbol: "SPY", label: "S&P 500", price: 766.6, changePct: 0.43, group: "Equities" },
  { symbol: "QQQ", label: "Nasdaq 100", price: 688.2, changePct: 0.61, group: "Equities" },
  { symbol: "IWM", label: "Russell 2000", price: 251.4, changePct: -0.22, group: "Equities" },
  { symbol: "EFA", label: "Developed ex-US", price: 98.7, changePct: 0.18, group: "Equities" },
  { symbol: "EEM", label: "Emerging Mkts", price: 54.9, changePct: 0.35, group: "Equities" },
  { symbol: "TLT", label: "20Y+ Treasuries", price: 79.46, changePct: -0.72, group: "Rates & Credit" },
  { symbol: "HYG", label: "High Yield", price: 80.3, changePct: -0.05, group: "Rates & Credit" },
  { symbol: "GLD", label: "Gold", price: 412.5, changePct: 0.84, group: "Commodities" },
  { symbol: "USO", label: "WTI Crude", price: 76.1, changePct: -1.12, group: "Commodities" },
  { symbol: "UUP", label: "US Dollar", price: 28.4, changePct: 0.09, group: "Currencies" },
  { symbol: "BTC/USD", label: "Bitcoin", price: 112450, changePct: 1.84, group: "Crypto" },
  { symbol: "ETH/USD", label: "Ether", price: 4120, changePct: 2.31, group: "Crypto" },
];

const wave = (n: number, base: number, amp: number, drift = 0) =>
  Array.from({ length: n }, (_, i) => +(base + drift * i + amp * Math.sin(i / 5) + (amp / 3) * Math.cos(i / 2.3)).toFixed(3));

export const sampleMacro: MacroSeries[] = [
  { id: "DGS10", label: "10Y Treasury", unit: "%", decimals: 2, value: 5.09, change: 0.04, changeLabel: "1M", date: "2026-10-16", points: wave(60, 4.6, 0.18, 0.008), description: "10-year Treasury constant-maturity yield" },
  { id: "DGS2", label: "2Y Treasury", unit: "%", decimals: 2, value: 4.71, change: -0.02, changeLabel: "1M", date: "2026-10-16", points: wave(60, 4.5, 0.15, 0.004), description: "2-year Treasury constant-maturity yield" },
  { id: "T10Y2Y", label: "10Yâ€“2Y Curve", unit: "pp", decimals: 2, value: 0.38, change: 0.06, changeLabel: "1M", date: "2026-10-16", points: wave(60, 0.05, 0.08, 0.005), description: "10-year minus 2-year Treasury spread" },
  { id: "DFF", label: "Fed Funds", unit: "%", decimals: 2, value: 4.33, change: 0, changeLabel: "1M", date: "2026-10-16", points: wave(60, 4.4, 0.02, -0.001), description: "Effective federal funds rate" },
  { id: "CPIAUCSL", label: "CPI Inflation", unit: "% y/y", decimals: 1, value: 3.1, change: 0.1, changeLabel: "prior", date: "2026-09-01", points: wave(24, 2.9, 0.2, 0.005), description: "Consumer prices, change from a year ago" },
  { id: "UNRATE", label: "Unemployment", unit: "%", decimals: 1, value: 4.4, change: 0.1, changeLabel: "prior", date: "2026-09-01", points: wave(24, 4.1, 0.1, 0.01), description: "Civilian unemployment rate" },
  { id: "T10YIE", label: "10Y Breakeven", unit: "%", decimals: 2, value: 2.41, change: 0.01, changeLabel: "1M", date: "2026-10-16", points: wave(60, 2.3, 0.06, 0.001), description: "Market-implied 10-year inflation expectation" },
  { id: "NFCI", label: "Financial Conditions", unit: "index", decimals: 2, value: -0.48, change: 0.01, changeLabel: "1M", date: "2026-10-10", points: wave(60, -0.5, 0.04), description: "Chicago Fed NFCI (negative = looser than average)" },
];

export const samplePredictions: PredictionMarket[] = [
  {
    id: "sample-fed",
    title: "Fed decision at the next FOMC meeting?",
    url: "https://polymarket.com",
    volume24h: 2_740_000,
    outcomes: [
      { label: "No change", probability: 0.71 },
      { label: "25 bps cut", probability: 0.27 },
      { label: "25+ bps hike", probability: 0.02 },
    ],
  },
  {
    id: "sample-recession",
    title: "US recession declared in 2026?",
    url: "https://polymarket.com",
    volume24h: 480_000,
    outcomes: [
      { label: "Yes", probability: 0.14 },
      { label: "No", probability: 0.86 },
    ],
  },
  {
    id: "sample-cpi",
    title: "September CPI above 3.0% y/y?",
    url: "https://polymarket.com",
    volume24h: 210_000,
    outcomes: [
      { label: "Yes", probability: 0.58 },
      { label: "No", probability: 0.42 },
    ],
  },
];

export const sampleOptions: OptionsPulse = {
  tickers: [
    { ticker: "NVDA", price: 214.3, changePct: 1.9, callPremium: 412_000_000, putPremium: 198_000_000, net: 214_000_000, putCallVolume: 0.48 },
    { ticker: "TSLA", price: 431.0, changePct: -2.4, callPremium: 365_000_000, putPremium: 341_000_000, net: 24_000_000, putCallVolume: 0.83 },
    { ticker: "AAPL", price: 262.8, changePct: 0.3, callPremium: 141_000_000, putPremium: 96_000_000, net: 45_000_000, putCallVolume: 0.61 },
    { ticker: "AMZN", price: 241.2, changePct: 0.8, callPremium: 118_000_000, putPremium: 60_000_000, net: 58_000_000, putCallVolume: 0.52 },
    { ticker: "META", price: 788.4, changePct: -0.6, callPremium: 133_000_000, putPremium: 151_000_000, net: -18_000_000, putCallVolume: 0.91 },
    { ticker: "MSFT", price: 542.6, changePct: 0.2, callPremium: 88_000_000, putPremium: 71_000_000, net: 17_000_000, putCallVolume: 0.74 },
    { ticker: "AMD", price: 233.9, changePct: 3.1, callPremium: 152_000_000, putPremium: 49_000_000, net: 103_000_000, putCallVolume: 0.39 },
    { ticker: "PLTR", price: 182.5, changePct: -1.4, callPremium: 74_000_000, putPremium: 81_000_000, net: -7_000_000, putCallVolume: 1.02 },
  ],
  contracts: [
    { ticker: "NVDA", contract: "NVDA261120C00230000", type: "C", strike: 230, expiry: "2026-11-20", volume: 48_210, openInterest: 9_870, volOi: 4.88, premium: 26_997_600, last: 5.6, iv: 0.47, delta: 0.34, underlying: 214.3, moneynessPct: 7.3 },
    { ticker: "AMD", contract: "AMD261030C00250000", type: "C", strike: 250, expiry: "2026-10-30", volume: 31_480, openInterest: 4_102, volOi: 7.67, premium: 9_758_800, last: 3.1, iv: 0.58, delta: 0.29, underlying: 233.9, moneynessPct: 6.9 },
    { ticker: "TSLA", contract: "TSLA261023P00400000", type: "P", strike: 400, expiry: "2026-10-23", volume: 22_950, openInterest: 6_310, volOi: 3.64, premium: 8_032_500, last: 3.5, iv: 0.66, delta: -0.21, underlying: 431.0, moneynessPct: -7.2 },
    { ticker: "META", contract: "META261120P00740000", type: "P", strike: 740, expiry: "2026-11-20", volume: 6_820, openInterest: 1_175, volOi: 5.8, premium: 10_502_800, last: 15.4, iv: 0.39, delta: -0.27, underlying: 788.4, moneynessPct: -6.1 },
    { ticker: "AMZN", contract: "AMZN261218C00260000", type: "C", strike: 260, expiry: "2026-12-18", volume: 12_400, openInterest: 3_050, volOi: 4.07, premium: 7_068_000, last: 5.7, iv: 0.33, delta: 0.31, underlying: 241.2, moneynessPct: 7.8 },
  ],
};

export const sampleInsiders: InsiderTrade[] = [
  { accession: "sample-1", issuer: "Sample Industrials Inc.", ticker: "SMPL", insider: "Doe Jane", role: "Director", code: "P", label: "Open-market buy", side: "buy", shares: 25_000, price: 41.2, value: 1_030_000, date: "2026-10-15", filedAt: "2026-10-17T16:05:00-04:00", url: "https://www.sec.gov/edgar/search/" },
  { accession: "sample-2", issuer: "Example Biotech Corp.", ticker: "EXBT", insider: "Roe Richard", role: "CEO", code: "P", label: "Open-market buy", side: "buy", shares: 100_000, price: 8.75, value: 875_000, date: "2026-10-14", filedAt: "2026-10-16T17:31:00-04:00", url: "https://www.sec.gov/edgar/search/" },
  { accession: "sample-3", issuer: "Placeholder Software", ticker: "PHSW", insider: "Smith Alex", role: "CFO", code: "S", label: "Open-market sale", side: "sell", shares: 12_000, price: 132.4, value: 1_588_800, date: "2026-10-14", filedAt: "2026-10-16T18:12:00-04:00", url: "https://www.sec.gov/edgar/search/" },
];

export const sampleCongress: CongressTrade[] = [
  { member: "Sample Representative", chamber: "House", ticker: "NVDA", side: "buy", amount: "$15,001 â€“ $50,000", tradedOn: "2026-09-29", filedOn: "2026-10-14" },
  { member: "Sample Senator", chamber: "Senate", ticker: "MSFT", side: "sell", amount: "$50,001 â€“ $100,000", tradedOn: "2026-09-22", filedOn: "2026-10-10" },
];

export const sampleDarkPool: DarkPoolPrint[] = [
  { ticker: "SPY", price: 766.1, size: 410_000, premium: 314_101_000, executedAt: "2026-10-19T15:42:00-04:00" },
  { ticker: "NVDA", price: 213.9, size: 900_000, premium: 192_510_000, executedAt: "2026-10-19T14:10:00-04:00" },
];

export const sampleTide: TidePoint[] = Array.from({ length: 78 }, (_, i) => ({
  t: `${String(9 + Math.floor((30 + i * 5) / 60)).padStart(2, "0")}:${String((30 + i * 5) % 60).padStart(2, "0")}`,
  netCall: Math.round(40e6 * Math.sin(i / 11) + i * 1.6e6),
  netPut: Math.round(-25e6 * Math.cos(i / 9) - i * 0.9e6),
}));
