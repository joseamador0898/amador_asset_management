import type { Metadata } from "next";
import { Suspense } from "react";
import { BellRing, CalendarClock, FileText, LineChart, Newspaper, Scale, Waves } from "lucide-react";
import { CircleArrowLink } from "@/components/ui/Button";
import { PageHero, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { SubscribeForm } from "@/components/forms/SubscribeForm";
import { AlertList } from "@/components/signals/AlertList";
import { MorningNote } from "@/components/signals/MorningNote";
import { getGsMacro } from "@/lib/signals";
import { buildGsAlerts } from "@/lib/signals/alerts";
import { fund } from "@/lib/site";

export const metadata: Metadata = {
  title: "Briefings & Alerts",
  description:
    "Daily briefs, weekly memos, unusual-options and insider-buying alerts, macro and prediction-market odds, and Nautilus Fund updates, delivered by email.",
  alternates: { canonical: "/briefings" },
};

const PRODUCTS = [
  { icon: Newspaper, name: "Daily Brief", cadence: "Weekdays · 7:30 a.m. CT", body: "What moved overnight across equities, rates, commodities, FX and crypto, the calendar for the day, and one chart that matters." },
  { icon: FileText, name: "Weekly Memo", cadence: "Sundays", body: "One framework or research idea, explained properly, the long-form thinking behind how we build portfolios." },
  { icon: Waves, name: "Unusual Options Activity", cadence: "Daily digest after the close", body: "The largest contracts trading far above open interest, with context: hedge, spread or directional?" },
  { icon: BellRing, name: "Insider Buying", cadence: "As filed · daily digest", body: "Open-market purchases from SEC Form 4 filings, cluster buys flagged, sales and routine grants filtered out." },
  { icon: Scale, name: "Macro & Prediction Markets", cadence: "When triggered · around FOMC, CPI and jobs", body: "Alerts on Goldman Sachs financial conditions, growth nowcast and data surprises, plus what prediction markets imply around each major release." },
  { icon: LineChart, name: "Research Papers", cadence: "When published", body: "New Amador research, like our Deep HRP work, with a plain-language summary and the full paper." },
  { icon: CalendarClock, name: `${fund.shortName} Updates`, cadence: "Milestones only", body: "Launch timeline, investor events and offering availability, for eligible investors who opt in." },
];

/** Live alerts from the Goldman Sachs feed, with the AI commentary built on them. Hidden when the feed is off. */
async function LatestAlerts() {
  const gs = await getGsMacro();
  if (!gs) return null;
  const alerts = buildGsAlerts(gs.data);
  if (!alerts.length) return null;
  return (
    <section className="border-b border-line">
      <div className="container-x grid gap-12 py-20 md:py-24 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow text-brass">Latest alerts</p>
          <h2 className="display mt-5 text-4xl md:text-5xl">What the alerts are flagging now.</h2>
          <p className="mt-5 leading-relaxed text-muted">
            Rule-based alerts on Goldman Sachs macro indicators and GIR forecasts, refreshed through the day and ranked by
            priority.
          </p>
          <CircleArrowLink href="/signals" label="Open Signals" className="mt-8" />
        </div>
        <div className="space-y-8 lg:col-span-8">
          <MorningNote tone="light" />
          <AlertList alerts={alerts} tone="light" limit={5} />
          <p className="text-[0.66rem] leading-relaxed text-muted">
            Goldman Sachs data © Goldman Sachs. Forecasts are GIR&apos;s, not Amador&apos;s. Informational only; not investment
            advice.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function BriefingsPage() {
  return (
    <>
      <PageHero
        eyebrow="Briefings & Alerts"
        title={
          <>
            Our research, <em className="italic">on your schedule.</em>
          </>
        }
        intro="Choose exactly what reaches your inbox: a morning brief, a weekly memo, or event-driven alerts from Amador Signals. No noise, no tips, and one-click unsubscribe."
      />

      <Suspense fallback={null}>
        <LatestAlerts />
      </Suspense>

      <section>
        <div className="container-x py-20 md:py-28">
          <SectionHeader eyebrow="The briefings" title="Seven products. Pick any." />
          <div className="mt-14 grid gap-px bg-line md:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((p, i) => (
              <Reveal key={p.name} delay={(i % 3) * 60} className="flex flex-col bg-paper p-8">
                <p.icon className="h-6 w-6 text-brass" aria-hidden />
                <p className="mt-6 font-serif text-2xl">{p.name}</p>
                <p className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted">{p.cadence}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="alerts" className="scroll-mt-28 border-t border-line">
        <div className="container-x grid gap-14 py-20 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-brass">Subscribe</p>
            <h2 className="display mt-5 text-5xl">Set your briefings.</h2>
            <p className="mt-5 leading-relaxed text-muted">
              Free while in beta. Add a watchlist to have your tickers flagged in insider and options alerts.
            </p>
          </div>
          <div className="lg:col-span-8">
            <SubscribeForm defaultTopics={["daily-brief", "weekly-memo", "insider-alerts"]} />
          </div>
        </div>
      </section>
    </>
  );
}
