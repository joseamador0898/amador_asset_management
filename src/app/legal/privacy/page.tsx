import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy Notice", alternates: { canonical: "/legal/privacy" } };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Notice" updated="October 19, 2026" current="/legal/privacy">
      <p>
        This notice explains how {site.name} (&ldquo;Amador&rdquo;, &ldquo;we&rdquo;) collects and uses personal information
        through this website.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Information you give us</strong> in forms: name, email address and, depending on the form, phone number,
          company, country, investor status, indicative interest, consultation preferences, message content and briefing
          preferences (including any watchlist).
        </li>
        <li>
          <strong>Technical information</strong> processed by our hosting provider to deliver and secure the site, such as IP
          address, browser type and request logs.
        </li>
        <li>
          <strong>Browser storage:</strong> if you acknowledge the investor notice on the fund page, that choice is stored in
          your browser&apos;s local storage. We do not use advertising cookies or cross-site tracking.
        </li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To respond to inquiries, schedule consultations and deliver the briefings and alerts you request.</li>
        <li>To contact prospective investors about the fund, where you have registered interest.</li>
        <li>To operate, secure and improve the website, and to comply with legal and regulatory obligations.</li>
      </ul>
      <p>We do not sell personal information.</p>

      <h2>Service providers</h2>
      <p>
        We use service providers to host the site, send email, manage subscriber lists, schedule meetings and route form
        submissions to our team (for example, a hosting platform, an email-delivery service, a scheduling tool and workflow
        automation). They process information on our behalf under their own security and privacy commitments.
      </p>
      <p>
        Embedded videos load from YouTube&apos;s privacy-enhanced domain only after you press play, at which point YouTube&apos;s
        privacy policy applies.
      </p>

      <h2>Retention and your choices</h2>
      <p>
        We keep information for as long as needed for the purposes above or as required by law. Every briefing email includes
        a way to unsubscribe. You may ask us to access, correct or delete your information, subject to legal requirements, by{" "}
        <Link href="/contact">contacting us</Link>. Depending on where you live (for example, California or the European
        Economic Area), you may have additional rights.
      </p>

      <h2>Security</h2>
      <p>
        We use reasonable safeguards, but no transmission over the internet is completely secure. Please do not send account
        numbers, passwords or government identifiers through website forms.
      </p>

      <h2>Children</h2>
      <p>This website is not directed to children under 16, and we do not knowingly collect their information.</p>

      <h2>Changes</h2>
      <p>We may update this notice and will revise the date above when we do.</p>
    </LegalPage>
  );
}
