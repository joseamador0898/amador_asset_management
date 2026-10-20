"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { BRIEFING_TOPICS } from "@/lib/forms/schemas";
import { buttonClass } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Check, Field, FormMessage, Honeypot, formToObject, useSubmit } from "./fields";

export function SubscribeForm({
  tone = "light",
  defaultTopics = ["daily-brief", "weekly-memo"],
  compact = false,
}: {
  tone?: "light" | "dark";
  defaultTopics?: string[];
  compact?: boolean;
}) {
  const { state, submit } = useSubmit("/api/subscribe");
  const fe = state.fieldErrors ?? {};
  const dark = tone === "dark";

  if (state.status === "success") {
    return (
      <div className={cn("flex items-start gap-4 border p-6", dark ? "border-line-dark text-paper" : "border-line text-ink")} role="status">
        <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-up" aria-hidden />
        <div>
          <p className="font-serif text-2xl font-light">You&apos;re on the list.</p>
          <p className={cn("mt-2 text-sm", dark ? "text-paper/60" : "text-muted")}>
            Look out for a confirmation email. You can change preferences or unsubscribe anytime.
          </p>
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
        await submit(formToObject(e.currentTarget));
      }}
    >
      <Honeypot />
      {!compact && (
        <fieldset>
          <legend className={cn("mb-4 text-[0.66rem] font-semibold uppercase tracking-[0.16em]", dark ? "text-paper/60" : "text-muted")}>
            Choose your briefings
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {BRIEFING_TOPICS.map((t) => (
              <label
                key={t.id}
                className={cn(
                  "group flex cursor-pointer gap-3 border p-4 transition-colors has-[:checked]:border-brass",
                  dark ? "border-line-dark hover:border-paper/40 has-[:checked]:bg-paper/5" : "border-line hover:border-ink/40 has-[:checked]:bg-white",
                )}
              >
                <input type="checkbox" name="topics" value={t.id} data-multi defaultChecked={defaultTopics.includes(t.id)} className="mt-1 h-4 w-4 accent-[var(--color-brass)]" />
                <span>
                  <span className={cn("block text-sm font-semibold", dark ? "text-paper" : "text-ink")}>{t.label}</span>
                  <span className={cn("mt-0.5 block text-xs leading-relaxed", dark ? "text-paper/50" : "text-muted")}>{t.description}</span>
                </span>
              </label>
            ))}
          </div>
          {fe.topics && <p className="mt-2 text-xs text-down">{fe.topics}</p>}
        </fieldset>
      )}
      {compact &&
        defaultTopics.map((t) => <input key={t} type="checkbox" name="topics" value={t} data-multi defaultChecked hidden readOnly />)}

      <div className={cn("grid gap-6", compact ? "sm:grid-cols-[1fr_auto] sm:items-end" : "sm:grid-cols-2")}>
        {!compact && <Field label="First name" name="name" autoComplete="given-name" tone={tone} error={fe.name} />}
        <Field label="Email" name="email" type="email" required autoComplete="email" tone={tone} error={fe.email} />
        {!compact && (
          <Field
            label="Watchlist (optional)"
            name="watchlist"
            placeholder="e.g. NVDA, TLT, GLD"
            tone={tone}
            className="sm:col-span-2"
            hint="Tickers you'd like flagged in insider and options alerts."
          />
        )}
        {compact && (
          <button type="submit" disabled={state.status === "submitting"} className={buttonClass(dark ? "brass" : "solid")}>
            {state.status === "submitting" ? "Subscribing…" : "Subscribe"}
          </button>
        )}
      </div>

      <Check name="consent" tone={tone} error={fe.consent}>
        I agree to receive these emails and accept the{" "}
        <Link href="/legal/privacy" className="underline underline-offset-2">
          privacy notice
        </Link>
        . Briefings are informational, not investment advice.
      </Check>

      <FormMessage state={state} tone={tone} />
      {!compact && (
        <button type="submit" disabled={state.status === "submitting"} className={buttonClass(dark ? "brass" : "solid")}>
          {state.status === "submitting" ? "Subscribing…" : "Subscribe to briefings"}
        </button>
      )}
    </form>
  );
}
