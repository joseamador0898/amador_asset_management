import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { BellRing } from "lucide-react";
import { getCongress, getDarkPool, getInsiders, getLiveBoard, getMacro, getMarketTide, getOptionsPulse, getPredictions, getQuotes } from "@/lib/signals";
import { Panel } from "@/components/signals/Panel";
import { TickerTape } from "@/components/signals/TickerTape";
import { MacroGrid } from "@/components/signals/MacroGrid";
import { NetPremiumBars } from "@/components/signals/NetPremiumBars";
import { UnusualTable } from "@/components/signals/UnusualTable";
import { InsiderTable } from "@/components/signals/InsiderTable";
import { Predictions } from "@/components/signals/Predictions";
import { MarketTide } from "@/components/signals/MarketTide";
import { CongressTable, DarkPoolTable } from "@/components/signals/PartnerTables";
import { MorningNote } from "@/components/signals/MorningNote";
import { GsAlertsPanel, GsMacroPanel } from "@/components/signals/GsMacroPanel";
import { WorldMarketsLive } from "@/components/signals/WorldMarketsLive";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Signals: live market dashboard",
  description:
    "Amador Signals: Goldman Sachs macro indicators and forecasts, signal alerts, live world markets, unusual options activity, SEC insider filings and prediction-market odds in one terminal.",
  alternates: { canonical: "/signals" },
};

function Skeleton({ className = "h-64" }: { className?: string }) {
  return <div className={`term-panel animate-pulse ${className}`} aria-hidden />;
}

async function Tape() {
  return <TickerTape feed={await getQuotes()} />;
}

async function WorldPanel() {
  const board = await getLiveBoard();
  return (
    <Panel
      title="World markets"
      subtitle="Local index levels and US-listed country ETFs, refreshed every 15 seconds"
      source={{ provider: "Alpaca Markets (real-time IEX) and Yahoo Finance (index levels, delayed)", live: board.live, url: "https://alpaca.markets", asOf: board.asOf, note: "Set APCA_API_KEY_ID / APCA_API_SECRET_KEY for live prices." }}
      className="lg:col-span-3"
    >
      <WorldMarketsLive initial={board} />
    </Panel>
  );
}

async function MacroPanel() {
  const macro = await getMacro();
  return (
    <Panel title="Macro dashboard" subtitle="Rates, inflation, labor and financial conditions" source={macro.source} className="lg:col-span-3">
      <MacroGrid series={macro.data} />
    </Panel>
  );
}

async function PredictionsPanel() {
  const feed = await getPredictions();
  return (
    <Panel title="Prediction markets" subtitle="Crowd-implied odds on macro and market events" source={feed.source}>
      <Predictions markets={feed.data} limit={4} />
    </Panel>
  );
}

async function OptionsPanels() {
  const feed = await getOptionsPulse();
  return (
    <>
      <Panel title="Options pulse" subtitle="Est. call vs put premium traded today" source={feed.source}>
        <NetPremiumBars tickers={feed.data.tickers} />
      </Panel>
      <Panel title="Unusual options activity" subtitle="Contracts trading far above open interest" source={feed.source} className="lg:col-span-2">
        <UnusualTable contracts={feed.data.contracts} />
      </Panel>
    </>
  );
}

async function InsiderPanel() {
  const feed = await getInsiders();
  return (
    <Panel title="Insider filings" subtitle="Latest SEC Form 4 transactions, open-market buys first" source={feed.source} className="lg:col-span-2">
      <InsiderTable trades={feed.data} />
    </Panel>
  );
}

// Partner panels render only with a live licensed feed: blurred illustrative layouts read as placeholder content.
async function PartnerPanels() {
  const [congress, darkpool] = await Promise.all([getCongress(), getDarkPool()]);
  if (!congress.source.live && !darkpool.source.live) return null;
  return (
    <div className="flex flex-col gap-5">
      {congress.source.live && (
        <Panel title="Congressional trades" subtitle="Periodic transaction reports" source={congress.source}>
          <CongressTable trades={congress.data} />
        </Panel>
      )}
      {darkpool.source.live && (
        <Panel title="Dark pool prints" subtitle="Largest off-exchange blocks" source={darkpool.source}>
          <DarkPoolTable prints={darkpool.data} />
        </Panel>
      )}
    </div>
  );
}

async function TidePanel() {
  const tide = await getMarketTide();
  if (!tide.source.live) return null;
  return (
    <Panel title="Market tide" subtitle="Net call vs net put premium across all listed options, intraday" source={tide.source} className="lg:col-span-2">
      <MarketTide points={tide.data} />
    </Panel>
  );
}

export default function SignalsPage() {
  return (
    <div className="bg-term text-paper">
      <section className="grain border-b border-line-dark bg-ink">
        <div className="container-x flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between md:py-16">
          <div className="max-w-2xl">
            <p className="eyebrow text-brass-light">Amador Signals</p>
            <h1 className="display mt-5 text-5xl md:text-6xl">The market, on one screen.</h1>
            <p className="mt-5 text-base leading-relaxed text-paper/65">
              Goldman Sachs macro indicators and forecasts, rule-based alerts, live world markets, unusual options activity,
              insider filings and prediction-market odds. Built for context, not for calls: every panel shows its source and its
              delay.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/briefings#alerts" variant="brass">
              Get alerts
            </ButtonLink>
            <ButtonLink href="/insights/reading-options-flow" variant="outline-light">
              How to read flow
            </ButtonLink>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="h-10 border-y border-term-line bg-term" aria-hidden />}>
        <Tape />
      </Suspense>

      <div className="container-x space-y-5 py-8">
        {/* Goldman Sachs first: alerts, macro lens, then the analyst commentary built on them. */}
        <div className="grid gap-5 lg:grid-cols-3">
          <Suspense fallback={null}>
            <GsAlertsPanel />
          </Suspense>
          <Suspense fallback={null}>
            <GsMacroPanel />
          </Suspense>
        </div>

        <Suspense fallback={null}>
          <MorningNote />
        </Suspense>

        <div className="grid gap-5 lg:grid-cols-3">
          <Suspense fallback={<Skeleton className="h-96 lg:col-span-3" />}>
            <WorldPanel />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-80 lg:col-span-3" />}>
            <MacroPanel />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-96 lg:col-span-3" />}>
            <OptionsPanels />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-96 lg:col-span-2" />}>
            <InsiderPanel />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-96" />}>
            <PredictionsPanel />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-72 lg:col-span-2" />}>
            <TidePanel />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-96" />}>
            <PartnerPanels />
          </Suspense>
        </div>

        <section className="term-panel flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex gap-4">
            <BellRing className="mt-1 h-6 w-6 shrink-0 text-brass-light" aria-hidden />
            <div>
              <h2 className="font-serif text-2xl font-light">Don&apos;t watch the screen. Get the alert.</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-paper/60">
                Choose daily briefs, insider-buying alerts, unusual-activity digests and macro event odds. Delivered by
                email; unsubscribe anytime.
              </p>
            </div>
          </div>
          <ButtonLink href="/briefings#alerts" variant="light">
            Set up alerts
          </ButtonLink>
        </section>

        <section className="grid gap-6 border-t border-term-line pt-8 text-xs leading-relaxed text-paper/60 md:grid-cols-3">
          <p>
            <span className="font-semibold text-paper/70">Sources.</span> Quotes: Alpaca Markets (IEX). Macro: FRED®, Federal
            Reserve Bank of St. Louis. Options: Cboe delayed quotes (~15 min). Insider filings: SEC EDGAR. Prediction markets:
            Polymarket. Goldman Sachs Marquee data appears only where licensed. Partner panels activate with a licensed
            provider.
          </p>
          <p>
            <span className="font-semibold text-paper/70">Delays.</span> Panels refresh on a cache of one to thirty minutes.
            Quotes may be delayed and may not reflect consolidated prices. Options premium is estimated from volume and last
            price.
          </p>
          <p>
            <span className="font-semibold text-paper/70">Not advice.</span> Signals are information, not recommendations.
            Unusual activity is often hedging. See{" "}
            <Link href="/legal/disclosures" className="underline underline-offset-2 hover:text-paper">
              disclosures
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
