import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/Section";
import { ContactForm } from "@/components/forms/ContactForm";
import { site } from "@/lib/site";
import { JsonLd, pageGraph } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Contact Amador Asset Management",
  description: `Contact ${site.name}: advisory, the Nautilus Fund, media, research collaborations and careers.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={pageGraph("ContactPage", "Contact", "/contact")} />
      <PageHero eyebrow="Contact" title="Start a conversation." intro="Tell us what you're working on. We read every message and reply to most within one business day." />
      <section>
        <div className="container-x grid gap-16 py-16 md:py-24 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <aside className="space-y-10 lg:col-span-4 lg:col-start-9">
            <div className="border-t border-ink pt-6">
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted">Office</p>
              <p className="mt-3 font-serif text-2xl">{site.location}</p>
              {site.email && (
                <a href={`mailto:${site.email}`} className="link-underline mt-2 inline-block">
                  {site.email}
                </a>
              )}
            </div>
            <div className="border-t border-ink pt-6">
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted">Prefer to talk?</p>
              <p className="mt-3 leading-relaxed text-muted">
                <Link href="/book" className="text-ink underline underline-offset-2">
                  Book a consultation
                </Link>{" "}
                and choose a time directly.
              </p>
            </div>
            <div className="border-t border-ink pt-6">
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted">Investors</p>
              <p className="mt-3 leading-relaxed text-muted">
                Interested in the Nautilus Fund?{" "}
                <Link href="/fund#register" className="text-ink underline underline-offset-2">
                  Register your interest
                </Link>
                .
              </p>
            </div>
            <div className="border-t border-ink pt-6">
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted">Looking for something else?</p>
              <p className="mt-3 leading-relaxed text-muted">
                Our research lives in{" "}
                <Link href="/insights" className="text-ink underline underline-offset-2">
                  Insights
                </Link>
                , the live market dashboard is{" "}
                <Link href="/signals" className="text-ink underline underline-offset-2">
                  Amador Signals
                </Link>
                , and email{" "}
                <Link href="/briefings" className="text-ink underline underline-offset-2">
                  briefings and alerts
                </Link>{" "}
                need no conversation at all. Media, speaking and research collaborations are welcome through the form.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
