"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const KEY = "amador-fund-ack-v1";

const TYPES = [
  { id: "accredited", label: "Accredited investor", detail: "Individual meeting SEC accredited-investor criteria" },
  { id: "institution", label: "Institution or family office", detail: "Pension, endowment, foundation, family office" },
  { id: "professional", label: "Financial professional", detail: "RIA, consultant, wealth manager, private bank" },
  { id: "other", label: "None of the above", detail: "General visitor" },
] as const;

/**
 * Investor-type acknowledgement before fund details are shown (a common
 * practice for private-fund websites). Stored only in this browser.
 */
function readStored() {
  try {
    return window.localStorage.getItem(KEY) === "yes";
  } catch {
    return false;
  }
}
const subscribe = () => () => {};

export function FundGate({ children }: { children: ReactNode }) {
  // null on the server (unknown), then the stored acknowledgement in the browser.
  const stored = useSyncExternalStore<boolean | null>(subscribe, readStored, () => null);
  const [confirmed, setConfirmed] = useState(false);
  const [type, setType] = useState<string | null>(null);
  const [agree, setAgree] = useState(false);
  const ack = confirmed || stored;

  if (ack) return <>{children}</>;

  const confirm = () => {
    try {
      window.localStorage.setItem(KEY, "yes");
    } catch {
      /* storage unavailable: acknowledgement lasts for this visit only */
    }
    setConfirmed(true);
  };

  return (
    <section className="bg-paper" aria-labelledby="gate-title">
      <div className="container-x py-16 md:py-24">
        <div className="mx-auto max-w-4xl border border-line bg-white p-8 md:p-12">
          <ShieldCheck className="h-7 w-7 text-sea" aria-hidden />
          <h2 id="gate-title" className="display mt-6 text-4xl md:text-5xl">
            Before you continue
          </h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted">
            The following pages describe a private investment fund in preparation. Information is provided for eligible
            investors and their advisers and is not an offer to sell, or a solicitation of an offer to buy, any security.
          </p>

          {ack === null ? (
            <div className="mt-10 h-40 animate-pulse bg-paper-2" aria-hidden />
          ) : (
            <>
              <fieldset className="mt-10">
                <legend className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted">Select your investor type</legend>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {TYPES.map((t) => (
                    <label
                      key={t.id}
                      className={cn("flex cursor-pointer gap-3 border p-5 transition-colors", type === t.id ? "border-ink" : "border-line hover:border-ink/50")}
                    >
                      <input type="radio" name="investor-type" value={t.id} checked={type === t.id} onChange={() => setType(t.id)} className="mt-1 accent-[var(--color-sea)]" />
                      <span>
                        <span className="block font-semibold">{t.label}</span>
                        <span className="mt-0.5 block text-sm text-muted">{t.detail}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {type === "other" ? (
                <div className="mt-8 border-l-2 border-brass bg-paper-2 p-5 text-sm leading-relaxed">
                  Fund details are limited to eligible investors. You can still explore our{" "}
                  <Link href="/insights" className="underline underline-offset-2">
                    research
                  </Link>
                  ,{" "}
                  <Link href="/signals" className="underline underline-offset-2">
                    Signals
                  </Link>{" "}
                  and{" "}
                  <Link href="/briefings" className="underline underline-offset-2">
                    briefings
                  </Link>
                  .
                </div>
              ) : (
                <label className="mt-8 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink/80">
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-4 w-4 accent-[var(--color-sea)]" />
                  <span>
                    I confirm the investor type above, and I have read and accept the{" "}
                    <Link href="/legal/disclosures" className="underline underline-offset-2">
                      Important Disclosures
                    </Link>{" "}
                    and{" "}
                    <Link href="/legal/terms" className="underline underline-offset-2">
                      Terms of Use
                    </Link>
                    .
                  </span>
                </label>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" disabled={!type || type === "other" || !agree} onClick={confirm} className={buttonClass("solid")}>
                  Continue to fund details
                </button>
                <Link href="/" className={buttonClass("outline")}>
                  Return home
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
