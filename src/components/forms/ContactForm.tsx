"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import { Check, Field, FormMessage, Honeypot, SelectField, TextArea, formToObject, useSubmit } from "./fields";

const TOPICS = [
  { value: "general", label: "General inquiry" },
  { value: "advisory", label: "Advisory & consultations" },
  { value: "fund", label: "Nautilus Fund" },
  { value: "media", label: "Media & speaking" },
  { value: "research", label: "Research collaboration" },
  { value: "careers", label: "Careers" },
];

export function ContactForm() {
  const { state, submit } = useSubmit("/api/contact");
  const fe = state.fieldErrors ?? {};

  if (state.status === "success") {
    return (
      <div className="flex items-start gap-4 border border-line p-6" role="status">
        <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-up" aria-hidden />
        <div>
          <p className="font-serif text-2xl font-light">Message received.</p>
          <p className="mt-2 text-sm text-muted">We reply to most inquiries within one business day.</p>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="relative grid gap-7 sm:grid-cols-2"
      onSubmit={async (e) => {
        e.preventDefault();
        await submit(formToObject(e.currentTarget));
      }}
    >
      <Honeypot />
      <Field label="Name" name="name" required autoComplete="name" error={fe.name} />
      <Field label="Email" name="email" type="email" required autoComplete="email" error={fe.email} />
      <SelectField label="Topic" name="topic" options={TOPICS} defaultValue="general" className="sm:col-span-2" />
      <TextArea label="Message" name="message" required rows={6} error={fe.message} className="sm:col-span-2" />
      <div className="sm:col-span-2">
        <Check name="consent" error={fe.consent}>
          I accept the{" "}
          <Link href="/legal/privacy" className="underline underline-offset-2">
            privacy notice
          </Link>
          . Please don&apos;t send account numbers or other sensitive financial details through this form.
        </Check>
      </div>
      <div className="flex flex-col gap-4 sm:col-span-2">
        <FormMessage state={state} />
        <button type="submit" disabled={state.status === "submitting"} className={buttonClass("solid", "self-start")}>
          {state.status === "submitting" ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
