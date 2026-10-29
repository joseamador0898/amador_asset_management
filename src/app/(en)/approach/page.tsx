import type { Metadata } from "next";
import { routeAlternates } from "@/lib/i18n";
import Link from "next/link";
import { Dendrogram } from "@/components/art/Dendrogram";
import { ButtonLink, CircleArrowLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero, SectionHeader } from "@/components/ui/Section";
import { JsonLd, pageGraph } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Our approach: process over prediction",
  description:
    "How Amador researches, builds and risk-manages portfolios: all-season risk balance, hierarchical allocation and an evidence standard that reports failures.",
  alternates: routeAlternates("en", "/approach"),
};

const PROCESS = [
  {
    title: "Research",
    lead: "Falsifiable ideas, tested out of sample.",
    points: ["Every hypothesis states what would prove it wrong", "Train, validate and test on separate periods with purge gaps", "Ten seeds for any model with randomness", "Transaction costs and turnover included from day one"],
  },
  {
    title: "Construct",
    lead: "Allocate risk, not dollars.",
    points: ["Balance risk across growth and inflation regimes", "Cluster assets by correlation; budget risk down the hierarchy", "Prefer robust estimators to fragile optimizers", "Liquidity sized to the worst week, not the average one"],
  },
  {
    title: "Control",
    lead: "Survive first, then compound.",
    points: ["Volatility targets and exposure limits", "Fractional sizing: Kelly is a ceiling, never a target", "Pre-committed rebalancing and drawdown reviews", "Stress tests on historical and hypothetical shocks"],
  },
  {
    title: "Review",
    lead: "Write it down, especially the mistakes.",
    points: ["Post-mortems on every closed decision", "Regular letters explaining positioning and risk", "Public research, including negative results", "Model changes logged and re-validated"],
  },
];

const STANDARD = [
  { k: "Probabilistic Sharpe ratio", v: "Is the Sharpe ratio likely positive, given skew, fat tails and a short sample?" },
  { k: "Deflated Sharpe ratio", v: "Does it survive after accounting for how many strategies were tried?" },
  { k: "Probability of backtest overfitting", v: "Does the in-sample winner keep winning out of sample?" },
  { k: "Paired tests vs. baselines", v: "Is it better than simple alternatives, not just better than zero?" },
  { k: "Multi-seed error bars", v: "Would a different random seed have told a different story?" },
  { k: "Cost sensitivity", v: "At what trading cost does the edge disappear?" },
];

export default function ApproachPage() {
  return (
    <>
      <JsonLd data={pageGraph("WebPage", "Our approach", "/approach")} />
      <PageHero
        eyebrow="Approach"
        title={
          <>
            Process over <em className="italic">prediction.</em>
          </>
        }
        intro="We cannot know which season comes next. We can build portfolios that do not need to know, and hold ourselves to an evidence standard strict enough to catch our own mistakes."
      />

      <section>
        <div className="container-x py-20 md:py-28">
          <SectionHeader eyebrow="The investment process" title="Research, construct, control, review." />
          <div className="mt-14 grid gap-px bg-line md:grid-cols-2">
            {PROCESS.map((p, i) => (
              <Reveal key={p.title} delay={(i % 2) * 80} className="bg-paper p-8 md:p-12">
                <p className="font-mono text-sm text-brass">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-6 font-serif text-4xl font-light">{p.title}</p>
                <p className="mt-2 text-lg text-muted">{p.lead}</p>
                <ul className="mt-6 space-y-3 text-[0.95rem]">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex gap-3">
                      <span className="mt-2.5 h-px w-4 shrink-0 bg-brass" aria-hidden />
                      {pt}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="grain bg-ink text-paper">
        <div className="container-x grid gap-14 py-20 md:py-28 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <p className="eyebrow text-brass-light">Our research</p>
            <h2 className="display mt-6 text-5xl">Hierarchies, made learnable.</h2>
            <p className="mt-6 leading-relaxed text-paper/65">
              Hierarchical risk parity groups assets by how they move together and splits risk down that tree, avoiding the
              fragile matrix inversion behind classic mean-variance optimization. Our DHRP research makes the hierarchy
              differentiable, so it can be trained end to end, then tests it across eight asset universes with ten seeds,
              publishing where it works and where it does not.
            </p>
            <div className="mt-10 flex flex-wrap gap-6">
              <CircleArrowLink href="/insights/deep-hrp-learnable-risk-parity" label="Deep HRP" tone="light" />
              <CircleArrowLink href="/insights/hierarchical-risk-parity-explained" label="HRP explained" tone="light" />
            </div>
          </div>
          <div className="lg:col-span-7">
            <Dendrogram className="w-full text-paper/80" />
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="container-x grid gap-12 py-20 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-brass">Evidence standard</p>
            <h2 className="display mt-5 text-4xl md:text-5xl">Six questions every backtest must answer.</h2>
            <p className="mt-5 leading-relaxed text-muted">
              Most backtests are flattering by construction. These tests are how we try to be less flattering to ourselves.
            </p>
            <Link href="/insights/read-a-backtest-like-a-skeptic" className="link-underline mt-6 inline-block text-sm font-semibold">
              How to read a backtest like a skeptic →
            </Link>
          </div>
          <dl className="divide-y divide-line border-y border-ink lg:col-span-8">
            {STANDARD.map((s) => (
              <div key={s.k} className="grid gap-2 py-6 md:grid-cols-5">
                <dt className="font-serif text-xl md:col-span-2">{s.k}</dt>
                <dd className="text-muted md:col-span-3">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section>
        <div className="container-x flex flex-col gap-8 py-20 md:flex-row md:items-center md:justify-between">
          <p className="display max-w-2xl text-4xl">See the approach applied to your portfolio.</p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/book">Book a portfolio review</ButtonLink>
            <ButtonLink href="/fund" variant="outline">
              The Nautilus Fund
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
