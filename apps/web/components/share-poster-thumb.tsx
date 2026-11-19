'use client';

import { useEffect, useRef, useState } from 'react';

/** Renders heavy `/api/share/*` PNGs only when scrolled near — avoids parallel ImageResponse storms on /admin/share. */
export function SharePosterThumb({ src, alt }: { src: string; alt: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: '120px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={hostRef} className="share-poster-thumb">
      {!load ? (
        <span className="text-sm text-muted-foreground">Scroll to load preview…</span>
      ) : failed ? (
        <span className="px-4 text-center text-sm text-muted-foreground">
          Preview failed — use Download or open the poster link in a new tab.
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          style={{ transform: 'scale(0.98)' }}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}