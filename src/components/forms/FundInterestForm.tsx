"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { INVESTOR_STATUSES, INVESTOR_STATUSES_ES } from "@/lib/forms/schemas";
import { buttonClass } from "@/components/ui/Button";
import type { Lang } from "@/lib/i18n";
import { fund } from "@/lib/site";
import { Check, Field, FormMessage, Honeypot, SUBMIT_MESSAGES, SelectField, TextArea, formToObject, useSubmit } from "./fields";

const COPY = {
  en: {
    tickets: [
      { value: "undisclosed", label: "Prefer not to say" },
      { value: "lt-100k", label: "Under $100K" },
      { value: "100k-500k", label: "$100K – $500K" },
      { value: "500k-1m", label: "$500K – $1M" },
      { value: "1m-5m", label: "$1M – $5M" },
      { value: "gt-5m", label: "Over $5M" },
    ],
    thanks: `Thank you. You're on the ${fund.shortName} interest list.`,
    next: "We'll reach out when offering materials are available to eligible investors. Registering interest creates no obligation for you or for us.",
    name: "Full name",
    email: "Email",
    country: "Country of residence",
    status: "Investor status",
    ticket: "Indicative interest (optional)",
    message: "Anything we should know? (optional)",
    attestation: `I understand this is a non-binding expression of interest, not an offer or a commitment, and that any investment in the ${fund.legalName} will be available only to eligible investors through definitive offering documents.`,
    consent1: "I accept the",
    privacy: "privacy notice",
    privacyHref: "/legal/privacy",
    submitting: "Submitting…",
    submit: "Register interest",
  },
  es: {
    tickets: [
      { value: "undisclosed", label: "Prefiero no decirlo" },
      { value: "lt-100k", label: "Menos de US$100K" },
      { value: "100k-500k", label: "US$100K – US$500K" },
      { value: "500k-1m", label: "US$500K – US$1M" },
      { value: "1m-5m", label: "US$1M – US$5M" },
      { value: "gt-5m", label: "Más de US$5M" },
    ],
    thanks: `Gracias. Ya está en la lista de interés del ${fund.shortName}.`,
    next: "Nos pondremos en contacto cuando los materiales de oferta estén disponibles para inversionistas elegibles. Registrar interés no crea obligación alguna para usted ni para nosotros.",
    name: "Nombre completo",
    email: "Correo electrónico",
    country: "País de residencia",
    status: "Perfil de inversionista",
    ticket: "Interés indicativo (opcional)",
    message: "¿Algo que debamos saber? (opcional)",
    attestation: `Entiendo que esta es una expresión de interés no vinculante, no una oferta ni un compromiso, y que cualquier inversión en ${fund.legalName} estará disponible únicamente para inversionistas elegibles mediante documentos de oferta definitivos.`,
    consent1: "Acepto el",
    privacy: "aviso de privacidad",
    privacyHref: "/es/legal/privacidad",
    submitting: "Enviando…",
    submit: "Registrar interés",
  },
} as const;

export function FundInterestForm({ lang = "en" }: { lang?: Lang }) {
  const t = COPY[lang];
  const { state, submit } = useSubmit("/api/fund-interest", SUBMIT_MESSAGES[lang]);
  const fe = state.fieldErrors ?? {};

  if (state.status === "success") {
    return (
      <div className="flex items-start gap-4 border border-line-dark p-6 text-paper" role="status">
        <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-up" aria-hidden />
        <div>
          <p className="font-serif text-2xl font-light">{t.thanks}</p>
          <p className="mt-2 text-sm text-paper/60">{t.next}</p>
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
        await submit({ ...formToObject(e.currentTarget), lang });
      }}
    >
      <Honeypot />
      <Field tone="dark" label={t.name} name="name" required autoComplete="name" error={fe.name} />
      <Field tone="dark" label={t.email} name="email" type="email" required autoComplete="email" error={fe.email} />
      <Field tone="dark" label={t.country} name="country" required autoComplete="country-name" error={fe.country} />
      <SelectField
        tone="dark"
        label={t.status}
        name="status"
        required
        options={INVESTOR_STATUSES.map((s) => ({ value: s.id, label: lang === "es" ? (INVESTOR_STATUSES_ES[s.id] ?? s.label) : s.label }))}
        defaultValue="accredited-individual"
      />
      <SelectField tone="dark" label={t.ticket} name="ticket" options={[...t.tickets]} defaultValue="undisclosed" className="sm:col-span-2" />
      <TextArea tone="dark" label={t.message} name="message" rows={3} className="sm:col-span-2" />
      <div className="space-y-4 sm:col-span-2">
        <Check tone="dark" name="attestation" error={fe.attestation}>
          {t.attestation}
        </Check>
        <Check tone="dark" name="consent" error={fe.consent}>
          {t.consent1}{" "}
          <Link href={t.privacyHref} className="underline underline-offset-2">
            {t.privacy}
          </Link>
          .
        </Check>
      </div>
      <div className="flex flex-col gap-4 sm:col-span-2">
        <FormMessage state={state} tone="dark" />
        <button type="submit" disabled={state.status === "submitting"} className={buttonClass("brass", "self-start")}>
          {state.status === "submitting" ? t.submitting : t.submit}
        </button>
      </div>
    </form>
  );
}
