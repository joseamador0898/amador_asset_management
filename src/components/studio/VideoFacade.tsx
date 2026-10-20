"use client";

import { useState } from "react";
import { Play } from "lucide-react";

/**
 * Click-to-load YouTube player (privacy-enhanced domain). Nothing from YouTube
 * loads until the visitor presses play.
 */
export function VideoFacade({ youtubeId, title }: { youtubeId: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  if (playing) {
    return (
      <iframe
        className="aspect-video w-full"
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }
  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative block aspect-video w-full overflow-hidden bg-ink bg-cover bg-center"
      style={{ backgroundImage: `url(https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg)` }}
      aria-label={`Play video: ${title}`}
    >
      <span className="absolute inset-0 bg-ink/40 transition-colors group-hover:bg-ink/25" />
      <span className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-paper/60 bg-ink/40 text-paper backdrop-blur transition-transform group-hover:scale-105">
        <Play className="ml-1 h-7 w-7" aria-hidden />
      </span>
    </button>
  );
}
