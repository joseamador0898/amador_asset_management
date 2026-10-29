"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { BRIEFING_TOPICS, BRIEFING_TOPICS_ES } from "@/lib/forms/schemas";
import { buttonClass } from "@/components/ui/Button";
import type { Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Check, Field, FormMessage, Honeypot, SUBMIT_MESSAGES, formToObject, useSubmit } from "./fields";

const COPY = {
  en: {
    onList: "You're on the list.",
    confirm: "Look out for a confirmation email. You can change preferences or unsubscribe anytime.",
    choose: "Choose your briefings",
    firstName: "First name",
    email: "Email",
    watchlist: "Watchlist (optional)",
    watchlistPlaceholder: "e.g. NVDA, TLT, GLD",
    watchlistHint: "Tickers you'd like flagged in insider and options alerts.",
    subscribing: "Subscribing…",
    subscribe: "Subscribe",
    subscribeLong: "Subscribe to briefings",
    consent1: "I agree to receive these emails and accept the",
    privacy: "privacy notice",
    privacyHref: "/legal/privacy",
    consent2: ". Briefings are informational, not investment advice.",
  },
  es: {
    onList: "Ya está en la lista.",
    confirm: "Revise su correo para la confirmación. Puede cambiar sus preferencias o darse de baja cuando quiera.",
    choose: "Elija sus boletines",
    firstName: "Nombre",
    email: "Correo electrónico",
    watchlist: "Lista de seguimiento (opcional)",
    watchlistPlaceholder: "p. ej. NVDA, TLT, GLD",
    watchlistHint: "Tickers que quiere ver señalados en las alertas de insiders y opciones.",
    subscribing: "Suscribiendo…",
    subscribe: "Suscribirme",
    subscribeLong: "Suscribirme a los boletines",
    consent1: "Acepto recibir estos correos y el",
    privacy: "aviso de privacidad",
    privacyHref: "/es/legal/privacidad",
    consent2: ". Los boletines son informativos, no asesoría de inversión.",
  },
} as const;

export function SubscribeForm({
  tone = "light",
  defaultTopics = ["daily-brief", "weekly-memo"],
  compact = false,
  lang = "en",
}: {
  tone?: "light" | "dark";
  defaultTopics?: string[];
  compact?: boolean;
  lang?: Lang;
}) {
  const t = COPY[lang];
  const messages = lang === "es" ? { ...SUBMIT_MESSAGES.es, fields: { ...SUBMIT_MESSAGES.es.fields, consent: "Confirme que acepta recibir estos correos." } } : SUBMIT_MESSAGES.en;
  const { state, submit } = useSubmit("/api/subscribe", messages);
  const fe = state.fieldErrors ?? {};
  const dark = tone === "dark";
  const topicCopy = (id: string, label: string, description: string) => (lang === "es" ? (BRIEFING_TOPICS_ES[id] ?? { label, description }) : { label, description });

  if (state.status === "success") {
    return (
      <div className={cn("flex items-start gap-4 border p-6", dark ? "border-line-dark text-paper" : "border-line text-ink")} role="status">
        <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-up" aria-hidden />
        <div>
          <p className="font-serif text-2xl font-light">{t.onList}</p>
          <p className={cn("mt-2 text-sm", dark ? "text-paper/60" : "text-muted")}>{t.confirm}</p>
        </div>
      </div>
    );
  }

  return (
    <form
      className="relative space-y-8"
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        await submit({ ...formToObject(e.currentTarget), lang });
      }}
    >
      <Honeypot />
      {!compact && (
        <fieldset>
          <legend className={cn("mb-4 text-[0.66rem] font-semibold uppercase tracking-[0.16em]", dark ? "text-paper/60" : "text-muted")}>{t.choose}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {BRIEFING_TOPICS.map((topic) => {
              const c = topicCopy(topic.id, topic.label, topic.description);
              return (
                <label
                  key={topic.id}
                  className={cn(
                    "group flex cursor-pointer gap-3 border p-4 transition-colors has-[:checked]:border-brass",
                    dark ? "border-line-dark hover:border-paper/40 has-[:checked]:bg-paper/5" : "border-line hover:border-ink/40 has-[:checked]:bg-white",
                  )}
                >
                  <input type="checkbox" name="topics" value={topic.id} data-multi defaultChecked={defaultTopics.includes(topic.id)} className="mt-1 h-4 w-4 accent-[var(--color-brass)]" />
                  <span>
                    <span className={cn("block text-sm font-semibold", dark ? "text-paper" : "text-ink")}>{c.label}</span>
                    <span className={cn("mt-0.5 block text-xs leading-relaxed", dark ? "text-paper/50" : "text-muted")}>{c.description}</span>
                  </span>
                </label>
              );
            })}
          </div>
          {fe.topics && <p className="mt-2 text-xs text-down">{fe.topics}</p>}
        </fieldset>
      )}
      {compact &&
        defaultTopics.map((topic) => <input key={topic} type="checkbox" name="topics" value={topic} data-multi defaultChecked hidden readOnly />)}

      <div className={cn("grid gap-6", compact ? "sm:grid-cols-[1fr_auto] sm:items-end" : "sm:grid-cols-2")}>
        {!compact && <Field label={t.firstName} name="name" autoComplete="given-name" tone={tone} error={fe.name} />}
        <Field label={t.email} name="email" type="email" required autoComplete="email" tone={tone} error={fe.email} />
        {!compact && (
          <Field label={t.watchlist} name="watchlist" placeholder={t.watchlistPlaceholder} tone={tone} className="sm:col-span-2" hint={t.watchlistHint} />
        )}
        {compact && (
          <button type="submit" disabled={state.status === "submitting"} className={buttonClass(dark ? "brass" : "solid")}>
            {state.status === "submitting" ? t.subscribing : t.subscribe}
          </button>
        )}
      </div>

      <Check name="consent" tone={tone} error={fe.consent}>
        {t.consent1}{" "}
        <Link href={t.privacyHref} className="underline underline-offset-2">
          {t.privacy}
        </Link>
        {t.consent2}
      </Check>

      <FormMessage state={state} tone={tone} />
      {!compact && (
        <button type="submit" disabled={state.status === "submitting"} className={buttonClass(dark ? "brass" : "solid")}>
          {state.status === "submitting" ? t.subscribing : t.subscribeLong}
        </button>
      )}
    </form>
  );
}
