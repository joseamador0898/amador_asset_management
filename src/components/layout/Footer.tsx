import Link from "next/link";
import { cacheLife } from "next/cache";
import { Logo } from "@/components/brand/Logo";
import { footerNav, site, fund } from "@/lib/site";
import { ButtonLink } from "@/components/ui/Button";

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  const socials = site.socials.filter((s) => s.href);
  return (
    <footer className="grain bg-ink text-paper">
      {/* Briefings band */}
      <div className="border-b border-line-dark">
        <div className="container-x flex flex-col gap-8 py-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow text-brass-light">Briefings &amp; Alerts</p>
            <p className="display mt-5 text-3xl md:text-4xl">Research, signals and fund updates, delivered when they matter.</p>
          </div>
          <ButtonLink href="/briefings" variant="brass">
            Choose your briefings
          </ButtonLink>
        </div>
      </div>

      <div className="container-x grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo tone="light" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-paper/60">
            Independent research, disciplined risk, and the forthcoming {fund.name}. {site.location}.
          </p>
          {site.email && (
            <a href={`mailto:${site.email}`} className="link-underline mt-4 inline-block text-sm text-paper/80">
              {site.email}
            </a>
          )}
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 md:col-span-8">
          {footerNav.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-brass-light">{col.title}</p>
              <ul className="mt-5 space-y-3 text-sm text-paper/70">
                {col.items.map((item) => (
                  <li key={item.href + item.label}>
                    <Link href={item.href} className="link-underline hover:text-paper">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-line-dark">
        <div className="container-x space-y-6 py-10 text-[0.72rem] leading-relaxed text-paper/60">
          <p>
            {site.name} publishes research, data and educational content for informational purposes only. Nothing on this
            website is investment, legal or tax advice, or an offer to sell or a solicitation of an offer to buy any
            security, including interests in the {fund.legalName}. Any such offer will be made only through definitive
            offering documents to eligible investors where permitted by law. Advisory services, where offered, are provided
            only after applicable registration requirements are met. Past performance, including hypothetical or backtested
            results, does not guarantee future results; all investing involves risk, including loss of principal. Market data
            may be delayed or sourced from third parties and is provided without warranty. See{" "}
            <Link href="/legal/disclosures" className="underline underline-offset-2 hover:text-paper">
              Important Disclosures
            </Link>
            .
          </p>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p>
              © <CopyrightYear /> {site.legalName}. All rights reserved.
            </p>
            {socials.length > 0 && (
              <ul className="flex flex-wrap gap-5 uppercase tracking-[0.18em]">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-paper">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
