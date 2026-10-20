import type { Metadata } from "next";
import { Lock, MessagesSquare, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/ui/Section";
import { BookingFlow } from "@/components/booking/BookingFlow";

export const metadata: Metadata = {
  title: "Book a consultation",
  description: "Schedule a discovery call, portfolio review, Nautilus Fund introduction or media conversation with Amador Asset Management.",
  alternates: { canonical: "/book" },
};

const calLink = process.env.NEXT_PUBLIC_CALCOM_LINK; // e.g. "amador/discovery" for a live Cal.com calendar

export default function BookPage() {
  return (
    <>
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
    </>
  );
}
