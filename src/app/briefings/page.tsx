import type { Metadata } from "next";
import { BellRing, CalendarClock, FileText, LineChart, Newspaper, Scale, Waves } from "lucide-react";
import { PageHero, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { SubscribeForm } from "@/components/forms/SubscribeForm";
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
  { icon: Scale, name: "Macro & Prediction Markets", cadence: "Around FOMC, CPI and jobs", body: "The data, consensus and what prediction markets imply, before and after each major release." },
  { icon: LineChart, name: "Research Papers", cadence: "When published", body: "New Amador research, like our Deep HRP work, with a plain-language summary and the full paper." },
  { icon: CalendarClock, name: `${fund.shortName} Updates`, cadence: "Milestones only", body: "Launch timeline, investor events and offering availability, for eligible investors who opt in." },
];

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

      <section className="bg-paper-2">
        <div className="container-x grid gap-14 py-20 md:py-28 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <p className="eyebrow text-brass">Preview</p>
            <h2 className="display mt-5 text-4xl md:text-5xl">What a Daily Brief looks like.</h2>
            <p className="mt-5 leading-relaxed text-muted">
              Short, sourced and skimmable in two minutes. The example on the right shows the format with placeholder figures.
            </p>
          </div>
          <div className="lg:col-span-7">
            <article className="border border-line bg-white shadow-[0_30px_60px_-40px_rgba(10,14,22,0.45)]" aria-label="Sample Daily Brief (format example)">
              <header className="flex items-center justify-between bg-ink px-6 py-4 text-paper">
                <p className="font-serif text-lg tracking-[0.2em]">AMADOR · DAILY BRIEF</p>
                <p className="font-mono text-[0.62rem] uppercase tracking-wider text-paper/50">Format example</p>
              </header>
              <div className="space-y-6 p-6 text-sm leading-relaxed md:p-8">
                <div>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-brass">The open</p>
                  <p className="mt-2 font-serif text-xl">Futures [up/down] [x]% as yields [rise/fall] ahead of [event]; dollar [firmer/softer].</p>
                </div>
                <ul className="space-y-2 border-y border-line py-4 font-mono text-xs">
                  <li className="flex justify-between"><span>S&amp;P 500 futures</span><span>[level] · [±x.x%]</span></li>
                  <li className="flex justify-between"><span>US 10-year yield</span><span>[x.xx%] · [±x bp]</span></li>
                  <li className="flex justify-between"><span>WTI crude</span><span>[$xx.xx] · [±x.x%]</span></li>
                  <li className="flex justify-between"><span>Bitcoin</span><span>[$xxx,xxx] · [±x.x%]</span></li>
                </ul>
                <div>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-brass">Signals</p>
                  <p className="mt-2">Largest unusual options trade, notable insider purchases, and the prediction-market odds for the next FOMC decision.</p>
                </div>
                <div>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-brass">One chart</p>
                  <div className="mt-3 h-24 bg-[linear-gradient(180deg,transparent,rgba(168,131,74,0.12))] [mask-image:linear-gradient(90deg,#000,#000)]">
                    <svg viewBox="0 0 400 96" className="h-full w-full" aria-hidden>
                      <path d="M0 70 C 60 60, 90 30, 150 42 S 240 80, 300 40 S 370 18, 400 22" fill="none" stroke="var(--color-brass)" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
                <p className="text-[0.66rem] text-muted">Informational only; not investment advice.</p>
              </div>
            </article>
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
