"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight, Languages } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { chrome, counterpart, HREFLANG, navFor, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

// Routes whose first section is dark, so the header blends into it.
const DARK_ROUTES = ["/", "/signals", "/fund", "/es", "/es/senales", "/es/fondo"];

export function Header({ lang = "en", pairs = {} }: { lang?: Lang; pairs?: Record<string, string> }) {
  const pathname = usePathname();
  const t = chrome[lang];
  const nav = navFor(lang);
  const other: Lang = lang === "en" ? "es" : "en";
  const switchHref = counterpart(pathname, lang, pairs);
  // The menu belongs to the page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (value: boolean) => setOpenOn(value ? pathname : null);
  const [scrolled, setScrolled] = useState(false);
  const dark = DARK_ROUTES.includes(pathname) && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    const frame = window.requestAnimationFrame(onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  // The other language's version of this page: a plain <a>, since the two trees have different layouts.
  const languageSwitch = (className: string) => (
    <a href={switchHref} hrefLang={HREFLANG[other]} lang={HREFLANG[other]} title={t.switchTitle} className={cn("inline-flex items-center gap-1.5", className)}>
      <Languages className="h-3.5 w-3.5" aria-hidden />
      {t.switchLabel}
    </a>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-500",
        dark ? "bg-ink text-paper" : "border-b border-line bg-paper/95 text-ink backdrop-blur-md",
      )}
    >
      {/* Utility bar */}
      <div className={cn("hidden border-b md:block", dark ? "border-line-dark" : "border-line")}>
        <div className="container-x flex h-9 items-center justify-between text-[0.66rem] font-semibold uppercase tracking-[0.18em]">
          <p className={cn("flex items-center gap-2", dark ? "text-paper/55" : "text-muted")}>
            <span className="inline-block h-1.5 w-1.5 animate-pulse-dot rounded-full bg-up" aria-hidden />
            {t.status}
          </p>
          <nav aria-label={t.utilityLabel} className="flex items-center gap-6">
            {nav.utility.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn("transition-colors", dark ? "text-paper/70 hover:text-paper" : "text-muted hover:text-ink")}
              >
                {item.label}
              </Link>
            ))}
            {languageSwitch(cn("transition-colors", dark ? "text-paper/70 hover:text-paper" : "text-muted hover:text-ink"))}
          </nav>
        </div>
      </div>

      {/* Main bar */}
      <div className="container-x flex h-[72px] items-center justify-between gap-6">
        <Logo tone={dark ? "light" : "dark"} href={t.home} homeLabel={t.homeLabel} />

        <nav aria-label={t.mainLabel} className="hidden items-center gap-7 xl:flex">
          {nav.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "relative whitespace-nowrap py-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition-colors",
                dark ? "text-paper/80 hover:text-paper" : "text-ink/75 hover:text-ink",
                isActive(item.href) && (dark ? "text-paper" : "text-ink"),
                "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-brass after:transition-transform after:duration-500",
                isActive(item.href) ? "after:scale-x-100" : "hover:after:scale-x-100",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={t.ctaHref}
            className={cn(
              "hidden items-center gap-2 px-5 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] transition-colors sm:inline-flex",
              dark ? "bg-paper text-ink hover:bg-brass-light" : "bg-ink text-paper hover:bg-ink-3",
            )}
          >
            {t.cta}
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t.menuOpen}
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center xl:hidden"
          >
            <Menu className="h-6 w-6" aria-hidden />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-[60] flex flex-col bg-ink text-paper transition-opacity duration-300 xl:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        role="dialog"
        aria-modal="true"
        aria-label={t.menuLabel}
        hidden={!open}
      >
        <div className="container-x flex h-[72px] items-center justify-between">
          <Logo tone="light" href={t.home} homeLabel={t.homeLabel} />
          <button type="button" onClick={() => setOpen(false)} aria-label={t.menuClose} className="grid h-10 w-10 place-items-center">
            <X className="h-6 w-6" aria-hidden />
          </button>
        </div>
        <nav aria-label={t.mobileLabel} className="container-x flex flex-1 flex-col justify-center gap-1 overflow-y-auto pb-10">
          {nav.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-baseline justify-between border-b border-line-dark py-4"
            >
              <span className="font-serif text-3xl font-light">{item.label}</span>
              <span className="text-xs text-paper/50">{item.description}</span>
            </Link>
          ))}
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold uppercase tracking-[0.18em] text-paper/70">
            {nav.utility.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            {languageSwitch("")}
          </div>
          <Link href={t.ctaHref} className="mt-8 inline-flex items-center justify-between bg-brass px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-ink">
            {t.cta} <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </nav>
      </div>
    </header>
  );
}
