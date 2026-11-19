'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { SPONSOR_GALLERY_ROTATE_MS } from '@/lib/sponsor-limits';

type Props = {
  urls: string[];
  alt: string;
  productUrl?: string | null;
  /** Compact reel for partner cards */
  variant?: 'featured' | 'card';
  /** Side-by-side sponsor poster — no duplicate header row */
  layout?: 'default' | 'hero';
};

export function SponsorProductShowcase({
  urls,
  alt,
  productUrl,
  variant = 'featured',
  layout = 'default',
}: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = urls.length;

  const go = useCallback(
    (next: number) => {
      if (!count) return;
      setActive(((next % count) + count) % count);
    },
    [count],
  );

  useEffect(() => {
    setActive(0);
  }, [urls.join('|')]);

  useEffect(() => {
    if (count <= 1 || paused || variant !== 'featured') return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % count);
    }, SPONSOR_GALLERY_ROTATE_MS);
    return () => window.clearInterval(id);
  }, [count, paused, variant]);

  if (!count) return null;

  if (variant === 'card') {
    return (
      <div className="sponsor-reel" data-reveal>
        <p className="sponsor-reel__label">The drop</p>
        <ul className="sponsor-reel__track" aria-label={`${alt} product shots`}>
          {urls.map((src, i) => (
            <li key={src}>
              <Image
                src={src}
                alt={`${alt} ${i + 1}`}
                width={200}
                height={200}
                className="sponsor-reel__img"
                unoptimized
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const hero = layout === 'hero';

  return (
    <div
      className={`sponsor-showcase${hero ? ' sponsor-showcase--hero' : ''}`}
      data-reveal
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
    >
      {!hero ? (
        <div className="sponsor-showcase__head">
          <p className="sponsor-showcase__label">The drop</p>
          {productUrl ? (
            <Link className="sponsor-showcase__cta" href={productUrl} target="_blank" rel="noopener noreferrer">
              Grab the offer
            </Link>
          ) : null}
        </div>
      ) : (
        <p className="sponsor-showcase__hero-label">The collection</p>
      )}

      <div className="sponsor-showcase__stage" aria-live="polite" aria-atomic="true">
        <div className="sponsor-showcase__glow" aria-hidden="true" />
        <div className="sponsor-showcase__frame">
          {urls.map((src, i) => (
            <figure
              key={src}
              className={`sponsor-showcase__slide${i === active ? ' is-active' : ''}`}
              aria-hidden={i !== active}
            >
              <Image
                src={src}
                alt={i === active ? `${alt} — product highlight` : ''}
                fill
                sizes="(max-width: 720px) 100vw, min(640px, 90vw)"
                className="sponsor-showcase__photo"
                unoptimized
                priority={i === 0}
              />
            </figure>
          ))}
        </div>

        {count > 1 ? (
          <>
            <div className="sponsor-showcase__progress" aria-hidden="true">
              {urls.map((src, i) => (
                <span key={`${src}-${i === active ? active : 'off'}`} className={i === active ? 'is-on' : ''} />
              ))}
            </div>
            <div className="sponsor-showcase__pick" role="tablist" aria-label="Product gallery">
              {urls.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-controls={`sponsor-slide-${i}`}
                  className={`sponsor-showcase__thumb${i === active ? ' is-active' : ''}`}
                  onClick={() => go(i)}
                >
                  <Image src={src} alt="" width={96} height={96} className="sponsor-showcase__thumb-img" unoptimized />
                  <span className="sponsor-showcase__thumb-ring" aria-hidden="true" />
                </button>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}