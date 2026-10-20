import type { Metadata } from "next";
import Link from "next/link";
import { Nautilus } from "@/components/art/Nautilus";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/Section";
import { FundGate } from "@/components/fund/FundGate";
import { FundInterestForm } from "@/components/forms/FundInterestForm";
import { fund, site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${fund.name}: our forthcoming flagship`,
  description: `${fund.name} (${fund.status.toLowerCase()}): a risk-balanced, all-season multi-asset strategy from ${site.name}. ${fund.taglineEs} ${fund.taglineEn}`,
  alternates: { canonical: "/fund" },
};

const ENVIRONMENTS = [
  { title: "Rising growth", assets: ["Equities", "Corporate credit", "Commodities", "Emerging-market assets"] },
  { title: "Falling growth", assets: ["Nominal government bonds", "Inflation-linked bonds", "High-quality duration"] },
  { title: "Rising inflation", assets: ["Inflation-linked bonds", "Commodities & gold", "Real assets"] },
  { title: "Falling inflation", assets: ["Equities", "Nominal government bonds"] },
];

const PILLARS = [
  {
    title: "Risk-balanced core",
    body: "Capital is allocated so that no single economic season dominates portfolio risk: equity-like, rate-like and inflation-sensitive exposures each carry a deliberate share.",
  },
  {
    title: "Hierarchical allocation",
    body: "Within each sleeve, weights follow how assets actually cluster by correlation, building on our published research into hierarchical risk parity and its learnable extension, DHRP.",
  },
  {
    title: "Drawdown discipline",
    body: "Volatility targeting, exposure limits and pre-committed rebalancing rules are designed to keep the portfolio steady when markets are not.",
  },
  {
    title: "Liquid & transparent",
    body: "The strategy is intended to use liquid, exchange-traded instruments, with regular letters that explain positioning, risk and mistakes in plain language.",
  },
];

const TERMS = [
  ["Vehicle", `${fund.legalName} (anticipated Delaware limited partnership)`],
  ["Strategy", "Multi-asset, risk-balanced, all-season"],
  ["Investment manager", `${site.name}; regulatory status to be confirmed before launch`],
  ["Eligible investors", "Accredited investors and other eligible investors only"],
  ["Minimum investment", "To be announced"],
  ["Fees", "To be announced"],
  ["Liquidity", "To be announced"],
  ["Service providers", "Administrator, auditor and counsel to be appointed"],
  ["Reporting", "Monthly letters and quarterly reports (anticipated)"],
];

const TIMELINE = [
  { phase: "Research & design", status: "Underway", body: "Strategy research, risk framework and the DHRP-8 benchmark." },
  { phase: "Formation", status: "Next", body: "Fund entity, offering documents, service providers and compliance program." },
  { phase: "First close", status: "Planned", body: "Initial capital from founding investors who register interest." },
  { phase: "Launch & reporting", status: "Planned", body: "Trading begins; monthly letters and quarterly investor reporting." },
];

const FAQ = [
  {
    q: "Is the fund open for investment?",
    a: "Not yet. The fund is in preparation. Registering interest is non-binding and lets us contact you when offering materials are available to eligible investors.",
  },
  {
    q: "Who will be able to invest?",
    a: "Only investors who meet the applicable eligibility requirements, such as accredited investors in the United States, through definitive offering documents. Requirements differ by jurisdiction.",
  },
  {
    q: "How does the fund relate to Amador Signals and Insights?",
    a: "Signals and Insights are public research and data products. They are not a record of the fund's positions, and nothing published there is a recommendation.",
  },
  {
    q: "Will you show backtests or projected returns?",
    a: "Not on this website. Any performance information will be provided only as permitted by applicable regulations, with the methodology and limitations disclosed.",
  },
];

export default function FundPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-sea text-paper">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(201,169,110,0.18),transparent_55%)]" aria-hidden />
        <div className="container-x relative grid gap-10 pb-16 pt-14 md:pb-24 md:pt-20 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="eyebrow text-brass-light">The flagship fund · {fund.status}</p>
            <h1 className="display mt-6 text-6xl md:text-8xl">{fund.name}</h1>
            <p className="mt-8 font-serif text-3xl font-light italic">{fund.taglineEs}</p>
            <p className="mt-1 font-serif text-2xl font-light text-paper/60">{fund.taglineEn}</p>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-paper/75">
              A risk-balanced, all-season multi-asset strategy in preparation: designed to hold its course across growth and
              inflation regimes rather than to win any single forecast.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="#register" variant="light">
                Register interest
              </ButtonLink>
              <ButtonLink href="/book" variant="outline-light">
                Speak with us
              </ButtonLink>
            </div>
          </div>
          <div className="lg:col-span-5">
            <Nautilus className="mx-auto w-full max-w-[460px] text-paper/85" />
          </div>
        </div>
      </section>

      <FundGate>
        {/* Why the name */}
        <section className="border-b border-line">
          <div className="container-x grid gap-12 py-20 md:py-28 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow text-brass">Why “Nautilus”</p>
              <p className="mt-6 font-serif text-xl italic text-muted">The same word in English and in Spanish.</p>
            </div>
            <Reveal className="space-y-6 text-lg leading-relaxed text-ink/80 lg:col-span-8">
              <p className="display text-3xl leading-snug text-ink md:text-4xl">
                The chambered nautilus does not outswim the storm. It adjusts the balance of its chambers and holds its depth.
              </p>
              <p>
                Its lineage has crossed roughly half a billion years of ocean, through ice ages and mass extinctions. The animal
                regulates its buoyancy by moving fluid in and out of sealed chambers, and its shell grows as a logarithmic spiral:
                each new chamber larger than the last, built on everything before it.
              </p>
              <p>
                That is the portfolio we are building: balanced across every economic season, rebalanced with discipline, and
                compounding chamber by chamber. In Spanish we say it simply: <em>firme en mar fuerte</em>, steady in rough seas.
              </p>
            </Reveal>
          </div>
        </section>

        {/* All-season design */}
        <section className="bg-paper-2">
          <div className="container-x py-20 md:py-28">
            <SectionHeader
              eyebrow="All-season by design"
              title="Balance the risk, not the dollars."
              intro="Markets move between environments of rising or falling growth and rising or falling inflation. Different assets have tended to do well in each. A traditional 60/40 portfolio concentrates most of its risk in equities, and so in a single environment. Our aim is to spread risk deliberately across all four."
            />
            <div className="mt-14 grid gap-px bg-line md:grid-cols-2 lg:grid-cols-4">
              {ENVIRONMENTS.map((e, i) => (
                <Reveal key={e.title} delay={i * 70} className="bg-paper p-8">
                  <p className="font-mono text-xs text-sea">{String(i + 1).padStart(2, "0")}</p>
                  <p className="mt-5 font-serif text-2xl">{e.title}</p>
                  <ul className="mt-5 space-y-2 text-sm text-muted">
                    {e.assets.map((a) => (
                      <li key={a} className="flex gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brass" aria-hidden /> {a}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
            <p className="mt-6 text-xs text-muted">
              Stylized historical tendencies for illustration, not predictions. Relationships between asset classes change, as
              2022 showed when stocks and bonds fell together. See{" "}
              <Link href="/insights/four-seasons-of-the-economy" className="underline underline-offset-2">
                Four Economic Seasons
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Pillars */}
        <section>
          <div className="container-x py-20 md:py-28">
            <SectionHeader eyebrow="Strategy (anticipated)" title="Four design commitments." />
            <div className="mt-14 grid gap-10 md:grid-cols-2">
              {PILLARS.map((p, i) => (
                <Reveal key={p.title} delay={i * 60} className="border-t border-ink pt-6">
                  <p className="font-mono text-sm text-brass">{String(i + 1).padStart(2, "0")}</p>
                  <p className="mt-4 font-serif text-3xl font-light">{p.title}</p>
                  <p className="mt-3 max-w-lg leading-relaxed text-muted">{p.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Terms and timeline */}
        <section className="border-t border-line bg-paper-2">
          <div className="container-x grid gap-16 py-20 md:py-28 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="eyebrow text-brass">Indicative terms</p>
              <h2 className="display mt-5 text-4xl">Key facts</h2>
              <dl className="mt-10 border-t border-ink">
                {TERMS.map(([k, v]) => (
                  <div key={k} className="grid gap-2 border-b border-line py-4 sm:grid-cols-3">
                    <dt className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted">{k}</dt>
                    <dd className="sm:col-span-2">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-xs text-muted">All terms are indicative, subject to change and to the final offering documents.</p>
            </div>
            <div className="lg:col-span-5">
              <p className="eyebrow text-brass">Road to launch</p>
              <h2 className="display mt-5 text-4xl">Timeline</h2>
              <ol className="mt-10 space-y-8 border-l border-ink/30 pl-8">
                {TIMELINE.map((t) => (
                  <li key={t.phase} className="relative">
                    <span className="absolute -left-[37px] top-1.5 h-3 w-3 rounded-full border-2 border-paper-2 bg-sea" aria-hidden />
                    <p className="flex items-center gap-3">
                      <span className="font-serif text-2xl">{t.phase}</span>
                      <span className="border border-ink/20 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-muted">{t.status}</span>
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{t.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-line">
          <div className="container-x grid gap-12 py-20 md:py-28 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow text-brass">Questions</p>
              <h2 className="display mt-5 text-4xl">Investor FAQ</h2>
            </div>
            <div className="divide-y divide-line border-y border-line lg:col-span-8">
              {FAQ.map((f) => (
                <details key={f.q} className="group py-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-serif text-xl">
                    {f.q}
                    <span className="text-2xl font-light text-brass transition-transform group-open:rotate-45" aria-hidden>
                      +
                    </span>
                  </summary>
                  <p className="mt-4 max-w-2xl leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </FundGate>

      {/* Register */}
      <section id="register" className="scroll-mt-28 bg-ink text-paper">
        <div className="container-x grid gap-14 py-20 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-brass-light">Investor portal · pre-launch</p>
            <h2 className="display mt-5 text-5xl">Register your interest.</h2>
            <p className="mt-6 leading-relaxed text-paper/65">
              Founding investors will hear first about offering documents, the first close and investor events. Registering is
              non-binding. A full investor portal opens at launch.
            </p>
          </div>
          <div className="lg:col-span-7">
            <FundInterestForm />
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper">
        <div className="container-x py-10 text-xs leading-relaxed text-muted">
          <p>
            <strong className="font-semibold text-ink">Important information.</strong> The {fund.legalName} has not been formed or
            registered, and no offering has commenced. This page is for informational purposes only and is not an offer to sell
            or a solicitation of an offer to buy any security, which may be made only through definitive offering documents to
            eligible investors, where permitted by law. Strategy descriptions reflect current intentions and may change. Investing
            involves risk, including the possible loss of principal; risk-balanced and leveraged strategies carry specific risks,
            including correlation breakdowns and liquidity risk. See{" "}
            <Link href="/legal/disclosures" className="underline underline-offset-2">
              Important Disclosures
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
