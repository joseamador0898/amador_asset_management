import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { fund, site } from "@/lib/site";
import { JsonLd, pageGraph } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Important Disclosures",
  description: "Amador Asset Management disclosures: educational content, not investment advice; third-party data; research limits; the Nautilus Fund is pre-launch.",
  alternates: { canonical: "/legal/disclosures" },
};

export default function DisclosuresPage() {
  return (
    <LegalPage title="Important Disclosures" updated="October 19, 2026" current="/legal/disclosures">
      <JsonLd data={pageGraph("WebPage", "Important Disclosures", "/legal/disclosures")} />
      <h2>No offer or advice</h2>
      <p>
        The content of this website, including research, articles, videos, briefings, alerts and the Amador Signals dashboard,
        is provided by {site.name} (&ldquo;Amador&rdquo;) for informational and educational purposes only. It is not investment,
        legal, tax or accounting advice, does not take into account any person&apos;s objectives, financial situation or needs,
        and is not a recommendation to buy, sell or hold any security or to adopt any strategy.
      </p>
      <p>
        Nothing on this website is an offer to sell, or a solicitation of an offer to buy, any security or investment product.
        Advisory services, where offered, are provided only under a written agreement and only after Amador has satisfied the
        registration requirements applicable to it or qualified for an exemption. Any registration does not imply a certain
        level of skill or training.
      </p>

      <h2>The {fund.name}</h2>
      <p>
        The {fund.legalName} has not been formed and no offering has commenced. Descriptions of its strategy, terms and
        timeline are preliminary, reflect current intentions and may change. If an offering is made, it will be made only to
        eligible investors (for example, accredited investors in the United States) through a confidential private placement
        memorandum and related documents, which will contain important information about risks, fees and conflicts of
        interest. Registering interest is non-binding and does not reserve an allocation.
      </p>

      <h2>Research, backtests and hypothetical results</h2>
      <p>
        Research published on this website, including the Differentiable Hierarchical Risk Parity (DHRP) research, reports
        hypothetical and backtested results. Hypothetical performance has inherent limitations: it is prepared with the benefit
        of hindsight, does not reflect actual trading or the impact of material economic and market factors on decision
        making, and may not reflect all fees, costs and frictions. No representation is made that any account will or is likely
        to achieve results similar to those shown. Research results are not the performance of any fund or account managed by
        Amador.
      </p>

      <h2>Market data and third-party content</h2>
      <p>
        Amador Signals displays data from third parties, which may include Alpaca Markets (IEX feed), FRED® (Federal Reserve
        Bank of St. Louis), Cboe delayed quotes, SEC EDGAR filings, Polymarket and, where licensed, Unusual Whales and Goldman
        Sachs Global Investment Research (via Marquee). Data may be
        delayed, incomplete or inaccurate and is provided &ldquo;as is&rdquo; without warranty. Options premium figures are
        estimates. If a provider is unavailable, the affected panel shows sample data and is labeled &ldquo;Sample&rdquo;.
        Trademarks and data remain the property of their respective owners, and their appearance does not imply endorsement.
      </p>
      <p>
        Some summaries, such as the Signals &ldquo;Morning Note,&rdquo; are generated automatically by an AI model from the data
        displayed and may contain errors.
      </p>

      <h2>Prediction markets</h2>
      <p>
        Prediction-market prices are shown as information about crowd-implied probabilities. Amador does not facilitate trading
        in event contracts. The legality and availability of prediction markets vary by jurisdiction.
      </p>

      <h2>Risks</h2>
      <p>
        All investing involves risk, including the possible loss of principal. Risk-balanced, leveraged, derivatives and
        multi-asset strategies are subject to model risk, correlation breakdowns (assets that usually diversify each other can
        fall together), liquidity risk, leverage risk, counterparty risk and the risk that historical relationships do not
        persist. Digital assets are highly volatile and may be subject to additional regulatory and custody risks.
      </p>

      <h2>Opinions and forward-looking statements</h2>
      <p>
        Opinions are as of the date of publication and may change without notice. Forward-looking statements are subject to
        uncertainties, and actual outcomes may differ materially. Amador, its personnel or affiliates may hold positions in
        instruments discussed and may trade them without notice.
      </p>

      <h2>Links</h2>
      <p>Links to third-party websites are provided for convenience; Amador is not responsible for their content.</p>
    </LegalPage>
  );
}
