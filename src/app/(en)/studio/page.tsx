import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mic, Play } from "lucide-react";
import { PageHero, SectionHeader } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { VideoFacade } from "@/components/studio/VideoFacade";
import { ArticleCover } from "@/components/insights/ArticleCover";
import { SubscribeForm } from "@/components/forms/SubscribeForm";
import { clips, featuredVideo, podcast, series, studioLive } from "@/content/studio";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Studio: clips, explainers and the Amador Memo",
  description: "Short explainers, market clips, long-form research videos and The Amador Memo podcast, in English and Spanish.",
  alternates: { canonical: "/studio" },
};

const covers = ["waves", "rings", "bars", "grid", "nautilus", "dendrogram"] as const;

export default function StudioPage() {
  // Until a video or clip is published, Studio is a 404: no "Coming soon" pages for crawlers or ad reviewers.
  if (!studioLive) notFound();
  return (
    <>
      <PageHero
        tone="dark"
        eyebrow="Studio"
        title={
          <>
            Markets, explained <em className="italic">in minutes.</em>
          </>
        }
        intro="Frameworks in sixty seconds, the day's flow decoded, our research translated into portfolio decisions, and building the Nautilus Fund in public. In English y en español."
      />

      {/* Featured */}
      <section className="bg-ink pb-20 text-paper md:pb-28">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              {featuredVideo.status === "published" && featuredVideo.youtubeId ? (
                <VideoFacade youtubeId={featuredVideo.youtubeId} title={featuredVideo.title} />
              ) : (
                <div className="relative aspect-video overflow-hidden border border-line-dark">
                  <ArticleCover theme="dendrogram" className="absolute inset-0" />
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="grid h-20 w-20 place-items-center rounded-full border border-paper/50 bg-ink/50 backdrop-blur">
                      <Play className="ml-1 h-7 w-7" aria-hidden />
                    </span>
                  </div>
                  <span className="absolute left-4 top-4 bg-brass px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-ink">Premiere soon</span>
                </div>
              )}
            </div>
            <div className="lg:col-span-4">
              <p className="eyebrow text-brass-light">{featuredVideo.series}</p>
              <h2 className="display mt-5 text-4xl">{featuredVideo.title}</h2>
              <p className="mt-4 text-paper/60">
                {featuredVideo.duration} · {featuredVideo.platform}
              </p>
              <ButtonLink href="/insights/deep-hrp-learnable-risk-parity" variant="outline-light" className="mt-8">
                Read the article
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Series */}
      <section className="border-b border-line">
        <div className="container-x py-20 md:py-28">
          <SectionHeader eyebrow="Series" title="Five shows, one standard." intro="Short when it can be, long when it must be. Every claim sourced, every caveat said out loud." />
          <div className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-5">
            {series.map((s, i) => (
              <Reveal key={s.name} delay={i * 60} className="bg-paper p-7">
                <p className="font-mono text-xs text-brass">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-5 font-serif text-2xl leading-tight">{s.name}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{s.description}</p>
                <p className="mt-5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-ink/60">{s.format}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Clips */}
      <section className="bg-paper-2">
        <div className="container-x py-20 md:py-28">
          <SectionHeader eyebrow="Clips" title="Latest clips" />
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {clips.map((c, i) => {
              const href = c.youtubeId ? `https://www.youtube.com/shorts/${c.youtubeId}` : c.url;
              const card = (
                <>
                  <div className="relative aspect-[9/16] overflow-hidden">
                    <ArticleCover theme={covers[i % covers.length]} className="absolute inset-0" />
                    <span className="absolute left-3 top-3 bg-ink/70 px-2 py-1 font-mono text-[0.58rem] uppercase tracking-wider text-paper backdrop-blur">
                      {c.platform}
                      {c.language === "ES" && " · ES"}
                    </span>
                    <span className="absolute bottom-3 right-3 font-mono text-[0.62rem] text-paper/80">{c.duration}</span>
                    {c.status === "coming-soon" && (
                      <span className="absolute inset-x-3 bottom-10 text-center text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-brass-light">
                        Coming soon
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted">{c.series}</p>
                  <p className="mt-1 font-serif text-lg leading-snug">{c.title}</p>
                </>
              );
              return href && c.status === "published" ? (
                <a key={c.id} href={href} target="_blank" rel="noopener noreferrer" className="group block">
                  {card}
                </a>
              ) : (
                <div key={c.id} className={cn("block", c.status === "coming-soon" && "opacity-95")}>
                  {card}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Podcast */}
      <section className="border-y border-line">
        <div className="container-x grid gap-12 py-20 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-brass">Podcast</p>
            <h2 className="display mt-5 text-5xl">{podcast.name}</h2>
            <p className="mt-5 leading-relaxed text-muted">{podcast.description}</p>
          </div>
          <ol className="divide-y divide-line border-y border-line lg:col-span-7">
            {podcast.episodes.map((e) => (
              <li key={e.n} className="flex items-center justify-between gap-6 py-6">
                <div className="flex items-center gap-5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-ink/20">
                    <Mic className="h-5 w-5 text-brass" aria-hidden />
                  </span>
                  <div>
                    <p className="font-mono text-xs text-muted">Episode {String(e.n).padStart(2, "0")}</p>
                    <p className="font-serif text-2xl">{e.title}</p>
                  </div>
                </div>
                <span className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted">Coming soon</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Media + subscribe */}
      <section>
        <div className="container-x grid gap-14 py-20 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-brass">Media & speaking</p>
            <h2 className="display mt-5 text-4xl">Interviews, panels and collaborations.</h2>
            <p className="mt-5 leading-relaxed text-muted">
              We speak about portfolio construction, risk, machine learning in finance and prediction markets, in English and
              Spanish.
            </p>
            <ButtonLink href="/book" className="mt-8">
              Request a conversation
            </ButtonLink>
          </div>
          <div className="lg:col-span-7">
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted">Get new episodes and clips</p>
            <div className="mt-6">
              <SubscribeForm compact defaultTopics={["weekly-memo"]} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
