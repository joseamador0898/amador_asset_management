/**
 * Studio content. Add a video by filling `youtubeId` (or `url` for TikTok,
 * Instagram, X) and setting `status: "published"`. Entries without media
 * render as "Coming soon" cards.
 */

export type Platform = "YouTube" | "YouTube Shorts" | "TikTok" | "Instagram" | "X" | "Podcast";

export type Clip = {
  id: string;
  title: string;
  series: string;
  platform: Platform;
  duration: string;
  status: "published" | "coming-soon";
  youtubeId?: string;
  url?: string;
  language?: "EN" | "ES";
};

export const featuredVideo: Clip = {
  id: "deep-hrp-explained",
  title: "Deep HRP, explained: teaching hierarchical risk parity to learn",
  series: "Paper to Portfolio",
  platform: "YouTube",
  duration: "12 min",
  status: "coming-soon",
  youtubeId: "", // e.g. "dQw4w9WgXcQ"
};

export const series = [
  { name: "60-Second Frameworks", description: "One investing idea, one minute, no jargon.", format: "Vertical clips" },
  { name: "Flow Breakdown", description: "What the day's most unusual options trades do, and don't, tell you.", format: "Short video" },
  { name: "Paper to Portfolio", description: "Academic research translated into portfolio decisions, including our own.", format: "Long-form video" },
  { name: "Fund Diaries", description: "Building the Nautilus Fund in public: structure, risk, decisions and mistakes.", format: "Video series" },
  { name: "Mercados en Español", description: "Nuestros análisis y marcos de inversión, en español.", format: "Clips · ES" },
];

export const clips: Clip[] = [
  { id: "kelly-ceiling", title: "Why we never bet full Kelly", series: "60-Second Frameworks", platform: "YouTube Shorts", duration: "0:58", status: "coming-soon" },
  { id: "unusual-not-signal", title: "Unusual options activity is usually a hedge", series: "Flow Breakdown", platform: "TikTok", duration: "1:12", status: "coming-soon" },
  { id: "four-seasons", title: "The four seasons of the economy", series: "60-Second Frameworks", platform: "Instagram", duration: "0:54", status: "coming-soon" },
  { id: "insider-buys", title: "When insiders buy, should you care?", series: "Flow Breakdown", platform: "YouTube Shorts", duration: "1:05", status: "coming-soon" },
  { id: "mar-fuerte", title: "Firme en mar fuerte: cómo pensamos el riesgo", series: "Mercados en Español", platform: "TikTok", duration: "1:00", status: "coming-soon", language: "ES" },
  { id: "ten-seeds", title: "One lucky backtest is not evidence", series: "Paper to Portfolio", platform: "YouTube Shorts", duration: "0:59", status: "coming-soon" },
];

export const podcast = {
  name: "The Amador Memo",
  description: "Conversations with investors, researchers and builders on risk, markets and the craft of allocation.",
  episodes: [
    { n: 1, title: "Process over prediction", status: "coming-soon" as const },
    { n: 2, title: "What a learnable risk-parity model taught us", status: "coming-soon" as const },
    { n: 3, title: "Prediction markets and the price of macro", status: "coming-soon" as const },
  ],
};
