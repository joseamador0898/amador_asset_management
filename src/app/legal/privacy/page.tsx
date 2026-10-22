import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description: "How Amador Asset Management collects and uses information: forms, cookie-free analytics, Google AdSense advertising cookies and your opt-outs, service providers, retention and your rights.",
  alternates: { canonical: "/legal/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Notice" updated="October 22, 2026" current="/legal/privacy">
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
          your browser&apos;s local storage, as is the anonymous identifier described under Analytics. Our own analytics use no
          cookies. If ads are shown, Google and its partners may set advertising cookies, as described under Advertising.
        </li>
      </ul>

      <h2>Analytics</h2>
      <p>
        We measure visits with Microsoft Azure Application Insights to learn which pages are read and how fast they load. It
        is set up to collect as little as possible:
      </p>
      <ul>
        <li>No cookies. A random identifier kept in your browser&apos;s local storage, renewed at least every 395 days, lets us
          count returning visitors without knowing who they are.</li>
        <li>Pages are recorded as templates (for example, /insights/:slug), never as full addresses, search terms or anything
          you type. Of the site that sent you, only its domain is kept.</li>
        <li>Browser, operating system, device type and an approximate location (country, region and city) that Microsoft
          derives from your IP address, which is not kept in full.</li>
        <li>Analytics data is deleted after 30 days.</li>
      </ul>
      <p>
        If your browser sends Do Not Track or Global Privacy Control, nothing is recorded. You can also turn analytics off in
        your browser at any time by visiting{" "}
        {/* A full page load on purpose: the analytics script reads the opt-out from the address when a page loads. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/?noanalytics=1">amadoram.com/?noanalytics=1</a>.
      </p>

      <h2>Advertising</h2>
      <p>
        We may show ads served by Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on
        your prior visits to this website or other websites. Google&apos;s use of advertising cookies enables it and its
        partners to serve ads to you based on your visits to this site and/or other sites on the internet.
      </p>
      <ul>
        <li>
          You can opt out of personalized advertising in Google&apos;s{" "}
          <a href="https://adssettings.google.com" rel="noopener noreferrer">Ads Settings</a>, and opt out of some third-party
          vendors&apos; use of cookies for personalized advertising at{" "}
          <a href="https://www.aboutads.info/choices/" rel="noopener noreferrer">aboutads.info</a>.
        </li>
        <li>
          Visitors in the European Economic Area, the United Kingdom and Switzerland are asked for consent through a
          Google-certified consent management platform before personalized ads are shown.
        </li>
        <li>
          To learn how Google uses information from sites that use its services, see{" "}
          <a href="https://policies.google.com/technologies/partner-sites" rel="noopener noreferrer">
            How Google uses information from sites or apps that use our services
          </a>
          .
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
        We use service providers to host the site, measure visits, send email, manage subscriber lists, schedule meetings and
        route form submissions to our team (for example, Microsoft Azure for hosting and analytics, Google for advertising,
        an email-delivery service, a scheduling tool and workflow automation). They process information on our behalf under their own security and privacy commitments.
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
