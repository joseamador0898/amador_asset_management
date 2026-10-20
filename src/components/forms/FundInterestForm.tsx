"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { INVESTOR_STATUSES } from "@/lib/forms/schemas";
import { buttonClass } from "@/components/ui/Button";
import { fund } from "@/lib/site";
import { Check, Field, FormMessage, Honeypot, SelectField, TextArea, formToObject, useSubmit } from "./fields";

const TICKETS = [
  { value: "undisclosed", label: "Prefer not to say" },
  { value: "lt-100k", label: "Under $100K" },
  { value: "100k-500k", label: "$100K – $500K" },
  { value: "500k-1m", label: "$500K – $1M" },
  { value: "1m-5m", label: "$1M – $5M" },
  { value: "gt-5m", label: "Over $5M" },
];

export function FundInterestForm() {
  const { state, submit } = useSubmit("/api/fund-interest");
  const fe = state.fieldErrors ?? {};

  if (state.status === "success") {
    return (
      <div className="flex items-start gap-4 border border-line-dark p-6 text-paper" role="status">
        <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-up" aria-hidden />
        <div>
          <p className="font-serif text-2xl font-light">Thank you. You&apos;re on the {fund.shortName} interest list.</p>
          <p className="mt-2 text-sm text-paper/60">
            We&apos;ll reach out when offering materials are available to eligible investors. Registering interest creates no
            obligation for you or for us.
          </p>
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
      <Field tone="dark" label="Full name" name="name" required autoComplete="name" error={fe.name} />
      <Field tone="dark" label="Email" name="email" type="email" required autoComplete="email" error={fe.email} />
      <Field tone="dark" label="Country of residence" name="country" required autoComplete="country-name" error={fe.country} />
      <SelectField
        tone="dark"
        label="Investor status"
        name="status"
        required
        options={INVESTOR_STATUSES.map((s) => ({ value: s.id, label: s.label }))}
        defaultValue="accredited-individual"
      />
      <SelectField tone="dark" label="Indicative interest (optional)" name="ticket" options={TICKETS} defaultValue="undisclosed" className="sm:col-span-2" />
      <TextArea tone="dark" label="Anything we should know? (optional)" name="message" rows={3} className="sm:col-span-2" />
      <div className="space-y-4 sm:col-span-2">
        <Check tone="dark" name="attestation" error={fe.attestation}>
          I understand this is a non-binding expression of interest, not an offer or a commitment, and that any investment
          in the {fund.legalName} will be available only to eligible investors through definitive offering documents.
        </Check>
        <Check tone="dark" name="consent" error={fe.consent}>
          I accept the{" "}
          <Link href="/legal/privacy" className="underline underline-offset-2">
            privacy notice
          </Link>
          .
        </Check>
      </div>
      <div className="flex flex-col gap-4 sm:col-span-2">
        <FormMessage state={state} tone="dark" />
        <button type="submit" disabled={state.status === "submitting"} className={buttonClass("brass", "self-start")}>
          {state.status === "submitting" ? "Submitting…" : "Register interest"}
        </button>
      </div>
    </form>
  );
}
