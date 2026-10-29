"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import type { Lang } from "@/lib/i18n";
import { Check, Field, FormMessage, Honeypot, SUBMIT_MESSAGES, SelectField, TextArea, formToObject, useSubmit } from "./fields";

const COPY = {
  en: {
    topics: [
      { value: "general", label: "General inquiry" },
      { value: "advisory", label: "Advisory & consultations" },
      { value: "fund", label: "Nautilus Fund" },
      { value: "media", label: "Media & speaking" },
      { value: "research", label: "Research collaboration" },
      { value: "careers", label: "Careers" },
    ],
    received: "Message received.",
    reply: "We reply to most inquiries within one business day.",
    name: "Name",
    email: "Email",
    topic: "Topic",
    message: "Message",
    consent1: "I accept the",
    privacy: "privacy notice",
    privacyHref: "/legal/privacy",
    consent2: ". Please don't send account numbers or other sensitive financial details through this form.",
    sending: "Sending…",
    send: "Send message",
  },
  es: {
    topics: [
      { value: "general", label: "Consulta general" },
      { value: "advisory", label: "Asesoría y consultas" },
      { value: "fund", label: "Fondo Nautilus" },
      { value: "media", label: "Medios y conferencias" },
      { value: "research", label: "Colaboración en investigación" },
      { value: "careers", label: "Carreras" },
    ],
    received: "Mensaje recibido.",
    reply: "Respondemos la mayoría de las consultas en un día hábil.",
    name: "Nombre",
    email: "Correo electrónico",
    topic: "Tema",
    message: "Mensaje",
    consent1: "Acepto el",
    privacy: "aviso de privacidad",
    privacyHref: "/es/legal/privacidad",
    consent2: ". Por favor no envíe números de cuenta ni otros datos financieros sensibles por este formulario.",
    sending: "Enviando…",
    send: "Enviar mensaje",
  },
} as const;

export function ContactForm({ lang = "en" }: { lang?: Lang }) {
  const t = COPY[lang];
  const { state, submit } = useSubmit("/api/contact", SUBMIT_MESSAGES[lang]);
  const fe = state.fieldErrors ?? {};

  if (state.status === "success") {
    return (
      <div className="flex items-start gap-4 border border-line p-6" role="status">
        <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-up" aria-hidden />
        <div>
          <p className="font-serif text-2xl font-light">{t.received}</p>
          <p className="mt-2 text-sm text-muted">{t.reply}</p>
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
      <Field label={t.name} name="name" required autoComplete="name" error={fe.name} />
      <Field label={t.email} name="email" type="email" required autoComplete="email" error={fe.email} />
      <SelectField label={t.topic} name="topic" options={[...t.topics]} defaultValue="general" className="sm:col-span-2" />
      <TextArea label={t.message} name="message" required rows={6} error={fe.message} className="sm:col-span-2" />
      <div className="sm:col-span-2">
        <Check name="consent" error={fe.consent}>
          {t.consent1}{" "}
          <Link href={t.privacyHref} className="underline underline-offset-2">
            {t.privacy}
          </Link>
          {t.consent2}
        </Check>
      </div>
      <div className="flex flex-col gap-4 sm:col-span-2">
        <FormMessage state={state} />
        <button type="submit" disabled={state.status === "submitting"} className={buttonClass("solid", "self-start")}>
          {state.status === "submitting" ? t.sending : t.send}
        </button>
      </div>
    </form>
  );
}
