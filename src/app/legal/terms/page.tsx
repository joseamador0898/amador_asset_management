import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";
import { site } from "@/lib/site";
import { JsonLd, pageGraph } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms for using the Amador Asset Management website, including Amador Signals data, research content, consultations and briefings.",
  alternates: { canonical: "/legal/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="October 19, 2026" current="/legal/terms">
      <JsonLd data={pageGraph("WebPage", "Terms of Use", "/legal/terms")} />
      <p>
        By using this website you agree to these terms. If you do not agree, please do not use the site.
      </p>

      <h2>Informational use only</h2>
      <p>
        The site and its content are provided for general information and education. They are not advice and not an offer or
        solicitation. Please read our <Link href="/legal/disclosures">Important Disclosures</Link>.
      </p>

      <h2>Permitted use</h2>
      <p>
        You may view and share links to the content for personal, non-commercial purposes. You may not scrape, copy, resell or
        redistribute data displayed on Amador Signals, which is licensed from or attributable to third parties, or use the site
        in a way that disrupts it or infringes others&apos; rights.
      </p>

      <h2>Intellectual property</h2>
      <p>
        Text, graphics, research and design on this site are owned by {site.name} or its licensors. Third-party names, marks and
        data belong to their owners.
      </p>

      <h2>No warranties</h2>
      <p>
        The site is provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; We do not warrant that content or data is
        accurate, complete, timely or uninterrupted, and we may change or remove content at any time.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {site.name} is not liable for any loss arising from use of, or reliance on, the
        site or its content, including any investment decision.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of the State of Illinois, without regard to conflict-of-laws rules, except where
        your local law requires otherwise.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? <Link href="/contact">Contact us</Link>.
      </p>
    </LegalPage>
  );
}
