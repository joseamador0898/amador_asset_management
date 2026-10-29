import type { Metadata } from "next";
import { Monogram } from "@/components/brand/Logo";
import { ButtonLink, CircleArrowLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { PageHero, SectionHeader } from "@/components/ui/Section";
import { fund, site } from "@/lib/site";
import { JsonLd, pageGraph } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "About Amador Asset Management: the firm",
  description: `${site.name} is an independent investment firm built on research, risk discipline and transparency.`,
  alternates: { canonical: "/firm" },
};

const VALUES = [
  { title: "Risk before return", body: "We start every decision with what can go wrong and how much it can cost. Return is what is left after survival." },
  { title: "Evidence over narrative", body: "We test across many seeds, regimes and costs, and we publish limitations and negative results alongside the wins." },
  { title: "Transparency", body: "Methods, sources and delays are stated. When we are wrong, we say so in writing." },
  { title: "Alignment", body: "We intend to invest alongside our clients and to keep incentives simple enough to explain in a sentence." },
  { title: "Independence", body: "No product shelf to fill and no house view to defend. Our only mandate is the quality of the decision." },
  { title: "Patience", body: "Compounding rewards staying in the game. We would rather be steady for decades than brilliant for a quarter." },
];

const HOW = [
  { step: "Research", body: "Form falsifiable hypotheses, test them out of sample and across regimes, and publish what we learn." },
  { step: "Construct", body: "Allocate risk, not dollars, across economic seasons and correlation clusters." },
  { step: "Control", body: "Size positions to survive bad outcomes; pre-commit to limits, rebalancing and exit rules." },
  { step: "Report", body: "Explain positioning, risk and mistakes to clients in plain language, on a regular cadence." },
];

export default function FirmPage() {
  return (
    <>
      <JsonLd data={pageGraph("AboutPage", "The firm", "/firm")} />
      <PageHero
        eyebrow="The firm"
        title={
          <>
            An independent firm, <em className="italic">built on evidence.</em>
          </>
        }
        intro={`${site.name} researches, builds and explains portfolios designed to endure. We combine academic-grade methods with practical risk discipline, and we do our thinking in public.`}
      />

      <section className="border-b border-line">
        <div className="container-x grid gap-12 py-20 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-brass">Our name</p>
          </div>
          <Reveal className="space-y-6 text-lg leading-relaxed text-ink/80 lg:col-span-8">
            <p className="display text-3xl leading-snug text-ink md:text-[2.6rem]">
              In Spanish, <em>amador</em> means one who loves. We love the craft: the patient, unglamorous work of building
              portfolios that hold up.
            </p>
            <p>
              We put a family name on the door because accountability should be personal. Every piece of research we publish,
              every signal we show and every portfolio we manage carries that name, and the responsibility that comes with it.
            </p>
            <p>
              Our flagship, the {fund.name}, takes its name from a creature that has survived every storm the ocean has produced.
              Its motto is ours too: <em>{fund.taglineEs}</em> {fund.taglineEn}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper-2">
        <div className="container-x py-20 md:py-28">
          <SectionHeader eyebrow="Leadership" title="Founder" />
          <div className="mt-14 grid gap-10 border-t border-ink pt-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="grid aspect-[4/5] max-w-sm place-items-center bg-ink text-paper">
                <Monogram className="h-28 w-28" horizon="var(--color-brass-light)" />
              </div>
            </div>
            <div className="md:col-span-8">
              <p className="font-serif text-4xl font-light">{site.founder.name}</p>
              <p className="mt-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-brass">{site.founder.role}</p>
              <div className="mt-8 max-w-2xl space-y-5 leading-relaxed text-ink/80">
                <p>
                  Jose Luis leads the firm&apos;s research and portfolio design. His work focuses on portfolio construction,
                  machine learning for allocation and the information content of markets, including prediction markets.
                </p>
                <p>
                  He is the author of research on Differentiable Hierarchical Risk Parity (DHRP), a learnable extension of
                  hierarchical risk parity evaluated across eight asset universes with ten-seed error bars, and an honest
                  account of where AI text signals did not help.
                </p>
                {/* TODO: add education, professional background and credentials here. */}
              </div>
              <div className="mt-10 flex flex-wrap gap-6">
                <CircleArrowLink href="/insights/deep-hrp-learnable-risk-parity" label="Read the DHRP research" />
                <CircleArrowLink href="/book" label="Book a conversation" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container-x py-20 md:py-28">
          <SectionHeader eyebrow="Values" title="What we will not compromise." />
          <div className="mt-14 grid gap-px bg-line md:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={(i % 3) * 70} className="bg-paper p-8 md:p-10">
                <p className="font-mono text-sm text-brass">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-6 font-serif text-3xl font-light">{v.title}</p>
                <p className="mt-3 leading-relaxed text-muted">{v.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="grain bg-ink text-paper">
        <div className="container-x py-20 md:py-28">
          <SectionHeader eyebrow="How we work" title="Four steps, every time." tone="light" />
          <ol className="mt-14 grid gap-10 md:grid-cols-4">
            {HOW.map((h, i) => (
              <Reveal as="li" key={h.step} delay={i * 80} className="border-t border-brass-light/60 pt-6">
                <p className="font-mono text-sm text-brass-light">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-4 font-serif text-3xl font-light">{h.step}</p>
                <p className="mt-3 text-sm leading-relaxed text-paper/60">{h.body}</p>
              </Reveal>
            ))}
          </ol>
          <div className="mt-16 flex flex-wrap gap-3">
            <ButtonLink href="/approach" variant="light">
              Our approach in depth
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline-light">
              Contact us
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
