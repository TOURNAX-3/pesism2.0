import Link from 'next/link';
import { fetchMatchHighlights } from '@/lib/match-highlights';

export async function HighlightsCallout() {
  const highlights = await fetchMatchHighlights();
  const clipCount = highlights.reduce((n, h) => n + h.videoUrls.length, 0);

  return (
    <section className="section highlights-callout" id="highlights" aria-labelledby="highlights-callout-title">
      <div className="container">
        <div className="highlights-callout__inner panel" data-reveal>
          <div>
            <p className="matchday__eyebrow">Selected matches</p>
            <h2 className="highlights-callout__title" id="highlights-callout-title">
              Watch the highlights.
            </h2>
            <p className="highlights-callout__text">
              Short reels from the biggest fixtures — goals, drama and the moments the group chat argued about for hours.
              {clipCount > 0 ? ` ${clipCount} clip${clipCount === 1 ? '' : 's'} live.` : ''}
            </p>
          </div>
          <Link className="btn btn--primary" href="/highlights">
            Match highlights
          </Link>
        </div>
      </div>
    </section>
  );
}