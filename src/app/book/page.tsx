import type { Metadata } from "next";
import Link from "next/link";
import { Lock, MessagesSquare, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/ui/Section";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { JsonLd, pageGraph } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Book a consultation",
  description: "Schedule a discovery call, portfolio review, Nautilus Fund introduction or media conversation with Amador Asset Management.",
  alternates: { canonical: "/book" },
};

const calLink = process.env.NEXT_PUBLIC_CALCOM_LINK; // e.g. "amador/discovery" for a live Cal.com calendar

export default function BookPage() {
  return (
    <>
      <JsonLd data={pageGraph("WebPage", "Book a consultation", "/book")} />
      <PageHero
        eyebrow="Consultations"
        title={
          <>
            Let&apos;s talk about <em className="italic">your portfolio.</em>
          </>
        }
        intro="Pick a conversation and a time that suits you. Every request is confirmed personally by email within one business day."
      />
      <section className="bg-paper-2">
        <div className="container-x grid gap-12 py-16 md:py-24 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {calLink ? (
              <iframe
                src={`https://cal.com/${calLink}?embed=true&theme=light`}
                title="Schedule with Amador Asset Management"
                className="h-[720px] w-full border border-line bg-white"
              />
            ) : (
              <BookingFlow />
            )}
          </div>
          <aside className="space-y-10 lg:col-span-4">
            {[
              { icon: MessagesSquare, title: "What to expect", body: "A structured conversation: your goals, constraints and current allocation, and how we would think about them. You'll leave with notes either way." },
              { icon: Lock, title: "Confidential", body: "We treat what you share as confidential. Please don't send account numbers or passwords through any form." },
              { icon: ShieldCheck, title: "No obligation", body: "Consultations are informational. Any advisory engagement requires a written agreement and applicable registrations." },
            ].map((b) => (
              <div key={b.title} className="border-t border-ink pt-6">
                <b.icon className="h-5 w-5 text-brass" aria-hidden />
                <p className="mt-4 font-serif text-2xl">{b.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{b.body}</p>
              </div>
            ))}
          </aside>
        </div>
      </section>

      {/* What to read first: gives the page substance beyond the form, and links the consultation to the work behind it. */}
      <section className="border-t border-line bg-paper">
        <div className="container-x grid gap-10 py-16 md:py-20 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-brass">Before we talk</p>
            <h2 className="display mt-5 text-4xl">How we think, in three reads.</h2>
            <p className="mt-5 leading-relaxed text-muted">
              A consultation goes further when you have seen our process first. These three pages cover most of the questions
              people bring to a first conversation.
            </p>
          </div>
          <ul className="grid gap-px bg-line sm:grid-cols-3 lg:col-span-8">
            {[
              { href: "/approach", title: "Our approach", body: "Research, construct, control, review: how we build portfolios and what we hold them to." },
              { href: "/insights/the-amador-framework", title: "The Amador Framework", body: "The five questions we ask before any position earns capital, from what would prove it wrong to how to size it." },
              { href: "/insights/the-arithmetic-of-drawdowns", title: "Drawdown math", body: "Why losses hurt more than gains help, and why sizing starts from the drawdown you can survive." },
            ].map((r) => (
              <li key={r.href} className="bg-paper-2 p-6">
                <Link href={r.href} className="link-underline font-serif text-xl text-ink">
                  {r.title}
                </Link>
                <p className="mt-3 text-sm leading-relaxed text-muted">{r.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
