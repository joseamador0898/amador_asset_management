import type { Metadata } from "next";
import { routeAlternates } from "@/lib/i18n";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Dendrogram } from "@/components/art/Dendrogram";
import { Nautilus } from "@/components/art/Nautilus";
import { ButtonLink, CircleArrowLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/Section";
import { ArticleCard } from "@/components/insights/ArticleCard";
import { TickerTape } from "@/components/signals/TickerTape";
import { MacroGrid } from "@/components/signals/MacroGrid";
import { Predictions } from "@/components/signals/Predictions";
import { SourceBadge } from "@/components/signals/Panel";
import { AlertList } from "@/components/signals/AlertList";
import { WorldMarketsLive } from "@/components/signals/WorldMarketsLive";
import { getAllArticles } from "@/lib/insights";
import { getGsMacro, getLiveBoard, getMacro, getPredictions, getQuotes } from "@/lib/signals";
import { buildGsAlerts } from "@/lib/signals/alerts";
import { fund } from "@/lib/site";
import { studioLive } from "@/content/studio";

export const metadata: Metadata = { alternates: routeAlternates("en", "/") };

const ALL_SERVICES = [
  {
    n: "01",
    title: fund.name,
    body: "Our forthcoming flagship: a risk-balanced, all-season multi-asset portfolio built to hold its course in rough seas.",
    href: "/fund",
    cta: "Explore the fund",
  },
  {
    n: "02",
    title: "Advisory & consultations",
    body: "Portfolio reviews, allocation frameworks and research consultations, one structured conversation at a time.",
    href: "/book",
    cta: "Book a consultation",
  },
  {
    n: "03",
    title: "Research & Insights",
    body: "Frameworks, papers and memos, including our Deep HRP research on learnable hierarchical risk parity.",
    href: "/insights",
    cta: "Read the research",
  },
  {
    n: "04",
    title: "Signals & Alerts",
    body: "A live market terminal and email alerts: Goldman Sachs macro indicators, real-time world markets, unusual options activity, insider buying and prediction-market odds.",
    href: "/signals",
    cta: "Open Signals",
  },
  {
    n: "05",
    title: "Studio",
    body: "Short explainers, market clips and long-form conversations on how disciplined investors think.",
    href: "/studio",
    cta: "Watch & listen",
  },
];
const SERVICES = ALL_SERVICES.filter((s) => s.href !== "/studio" || studioLive);
const COUNT_WORDS = ["", "one", "two", "three", "four", "five", "six"];

const PRINCIPLES = [
  { title: "Risk before return", body: "We size for the storm, not the forecast. Every position starts with what it can lose." },
  { title: "Evidence over narrative", body: "Ten seeds, not one lucky run. We publish methods, limitations and negative results." },
  { title: "Diversify risk, not tickers", body: "Correlations cluster. We build around how assets actually move together, especially under stress." },
  { title: "Patience compounds", body: "Like a nautilus adding chambers, durable wealth is built one disciplined layer at a time." },
];

const FACTS = [
  { value: "8", label: "asset universes in our DHRP-8 research benchmark" },
  { value: "10", label: "seeds per model: our minimum evidence standard" },
  { value: "7", label: "live data sources powering Amador Signals" },
  { value: "1", label: `flagship in preparation: the ${fund.shortName}` },
];

async function HomeTape() {
  return <TickerTape feed={await getQuotes()} />;
}

async function SignalsPreview() {
  const [gs, macro, predictions, board] = await Promise.all([getGsMacro(), getMacro(), getPredictions(), getLiveBoard()]);
  const alerts = gs ? buildGsAlerts(gs.data) : [];
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {/* Goldman Sachs indicators first when the licensed feed is on; FRED otherwise. */}
      <div className="term-panel overflow-hidden lg:col-span-2">
        <div className="flex items-center justify-between border-b border-term-line px-5 py-3.5">
          <p className="text-sm font-semibold text-paper">{gs ? "Goldman Sachs macro lens" : "Macro dashboard"}</p>
          <SourceBadge source={gs ? gs.source : macro.source} />
        </div>
        {gs ? (
          <MacroGrid series={gs.data.tiles} gridClassName="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" />
        ) : (
          <MacroGrid series={macro.data} limit={8} />
        )}
      </div>
      <div className="term-panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-term-line px-5 py-3.5">
          <p className="text-sm font-semibold text-paper">{alerts.length ? "Signal alerts" : "Prediction markets"}</p>
          <SourceBadge source={gs && alerts.length ? gs.source : predictions.source} />
        </div>
        {alerts.length ? <AlertList alerts={alerts} limit={3} /> : <Predictions markets={predictions.data} limit={3} />}
      </div>
      <div className="term-panel overflow-hidden lg:col-span-3">
        <div className="flex items-center justify-between border-b border-term-line px-5 py-3.5">
          <p className="text-sm font-semibold text-paper">World markets</p>
          <SourceBadge source={{ provider: "Alpaca Markets", live: board.live, asOf: board.asOf }} />
        </div>
        <WorldMarketsLive initial={board} compact />
      </div>
    </div>
  );
}

export default function HomePage() {
  const articles = getAllArticles().slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="grain relative overflow-hidden bg-ink text-paper">
        <div className="container-x grid gap-12 pb-16 pt-14 md:pb-24 md:pt-20 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="eyebrow text-brass-light">Independent investment research & management</p>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="display mt-7 text-[3.1rem] sm:text-7xl xl:text-[5.6rem]">
                Built for every season of the market.
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-paper/70">
                Amador Asset Management pairs rigorous portfolio research with disciplined risk management, and shares the
                work openly: live market signals, published frameworks, and the forthcoming {fund.name}.
              </p>
            </Reveal>
            <Reveal delay={240} className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/fund" variant="brass">
                Explore the {fund.shortName}
              </ButtonLink>
              <ButtonLink href="/book" variant="outline-light">
                Book a consultation
              </ButtonLink>
            </Reveal>
            <Reveal delay={300}>
              <p className="mt-6 text-sm text-paper/60">
                <Link href="/es" hrefLang="es" lang="es-MX" className="underline underline-offset-4 hover:text-paper">
                  Lea el sitio en español
                </Link>
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-6">
            <figure className="relative">
              <Dendrogram className="w-full text-paper/80" />
              <figcaption className="mt-4 flex items-center justify-between border-t border-line-dark pt-4 font-mono text-[0.62rem] uppercase tracking-wider text-paper/60">
                <span>How sixteen markets cluster by correlation</span>
                <span>Illustrative</span>
              </figcaption>
            </figure>
          </div>
        </div>
        <div className="border-t border-line-dark">
          <dl className="container-x grid grid-cols-2 gap-y-8 py-10 md:grid-cols-4">
            {FACTS.map((f) => (
              <div key={f.label} className="pr-6">
                <dt className="sr-only">{f.label}</dt>
                <dd>
                  <span className="display block text-5xl text-paper">{f.value}</span>
                  <span className="mt-2 block max-w-[14rem] text-xs leading-relaxed text-paper/50">{f.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Suspense fallback={<div className="h-10 bg-term" aria-hidden />}>
        <HomeTape />
      </Suspense>

      {/* Statement */}
      <section className="border-b border-line">
        <div className="container-x grid gap-10 py-20 md:py-28 lg:grid-cols-12">
          <Reveal className="lg:col-span-3">
            <p className="eyebrow text-brass">About the firm</p>
          </Reveal>
          <Reveal className="lg:col-span-9" delay={80}>
            <p className="display text-[2rem] leading-[1.15] sm:text-[2.6rem] md:text-[3.1rem]">
              We believe durable returns come from disciplined process, honest evidence, and portfolios built to withstand
              conditions no forecast can see. <span className="text-muted">So we research in the open, size for the storm,
              and let patience do the compounding.</span>
            </p>
            <CircleArrowLink href="/firm" label="Who we are" className="mt-10" />
          </Reveal>
        </div>
      </section>

      {/* What we do */}
      <section>
        <div className="container-x py-20 md:py-28">
          <SectionHeader eyebrow="What we do" title={`One firm, ${COUNT_WORDS[SERVICES.length]} ways to work with us.`} />
          <ol className="mt-14 border-t border-ink">
            {SERVICES.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 60} className="border-b border-line">
                <Link href={s.href} className="group grid gap-4 py-8 md:grid-cols-12 md:items-baseline md:py-10">
                  <span className="font-mono text-sm text-brass md:col-span-1">{s.n}</span>
                  <span className="font-serif text-3xl font-light transition-transform duration-500 group-hover:translate-x-1 md:col-span-4 md:text-4xl">{s.title}</span>
                  <span className="text-[0.98rem] leading-relaxed text-muted md:col-span-5">{s.body}</span>
                  <span className="flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-ink md:col-span-2 md:justify-end">
                    {s.cta} <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Insights */}
      {articles.length > 0 && (
        <section className="bg-paper-2">
          <div className="container-x py-20 md:py-28">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionHeader eyebrow="Latest insights" title="Research you can check." />
              <CircleArrowLink href="/insights" label="All insights" />
            </div>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {articles.map((a, i) => (
                <Reveal key={a.slug} delay={i * 80}>
                  <ArticleCard article={a} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fund teaser */}
      <section className="relative overflow-hidden bg-sea text-paper">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,169,110,0.16),transparent_55%)]" aria-hidden />
        <div className="container-x relative grid gap-12 py-20 md:py-28 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="eyebrow text-brass-light">The flagship · {fund.status}</p>
              <h2 className="display mt-6 text-5xl md:text-7xl">{fund.name}</h2>
              <p className="mt-6 font-serif text-2xl font-light italic text-paper/85">
                {fund.taglineEs} <span className="not-italic text-paper/55">· {fund.taglineEn}</span>
              </p>
              <p className="mt-8 max-w-lg leading-relaxed text-paper/70">
                The chambered nautilus has crossed hundreds of millions of years of ocean by balancing its chambers, holding its
                depth while storms pass overhead. Our flagship is designed around the same idea: balance risk across every
                economic season, rebalance with discipline, and compound layer by layer.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink href="/fund" variant="light">
                  Discover the fund
                </ButtonLink>
                <ButtonLink href="/fund#register" variant="outline-light">
                  Register interest
                </ButtonLink>
              </div>
              <p className="mt-8 max-w-lg text-[0.7rem] leading-relaxed text-paper/60">
                Pre-launch. Not an offer to sell or a solicitation of an offer to buy any security. Any offering will be made
                only to eligible investors through definitive offering documents.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-6">
            <Nautilus className="mx-auto w-full max-w-[520px] text-paper/85" />
          </div>
        </div>
      </section>

      {/* Signals preview */}
      <section className="bg-term text-paper">
        <div className="container-x py-20 md:py-28">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeader
              eyebrow="Amador Signals"
              tone="light"
              title="The market, on one screen."
              intro="Goldman Sachs macro indicators and alerts, live world markets, options flow, insider filings and prediction-market odds, each with its source and its delay."
            />
            <ButtonLink href="/signals" variant="light">
              Open the terminal
            </ButtonLink>
          </div>
          <div className="mt-12">
            <Suspense fallback={<div className="term-panel h-80 animate-pulse" aria-hidden />}>
              <SignalsPreview />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-b border-line">
        <div className="container-x py-20 md:py-28">
          <SectionHeader eyebrow="Principles" title="How we make decisions." />
          <div className="mt-14 grid gap-px bg-line md:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.title} delay={i * 70} className="bg-paper p-8">
                <p className="font-mono text-sm text-brass">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-6 font-serif text-2xl">{p.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Book CTA */}
      <section className="bg-paper">
        <div className="container-x py-20 md:py-24">
          <div className="grid gap-10 bg-brass p-10 md:grid-cols-12 md:items-center md:p-14">
            <div className="md:col-span-8">
              <p className="eyebrow text-ink">Consultations</p>
              <p className="display mt-5 text-4xl text-ink md:text-5xl">A second opinion on your portfolio, from first principles.</p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <ButtonLink href="/book" variant="solid">
                Choose a time
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
