import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="grain bg-ink text-paper">
      <div className="container-x flex min-h-[60vh] flex-col justify-center py-24">
        <p className="eyebrow text-brass-light">404</p>
        <h1 className="display mt-6 text-6xl md:text-7xl">Off the chart.</h1>
        <p className="mt-6 max-w-lg text-paper/65">The page you were looking for has moved or never existed. Even the best models miss sometimes.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/" variant="light">
            Back home
          </ButtonLink>
          <ButtonLink href="/insights" variant="outline-light">
            Read insights
          </ButtonLink>
        </div>
        <p className="mt-10 text-sm text-paper/40">
          Looking for live data? Try <Link href="/signals" className="underline underline-offset-2">Signals</Link>.
        </p>
      </div>
    </section>
  );
}
