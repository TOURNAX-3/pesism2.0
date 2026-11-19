import type { Metadata } from 'next';
import Link from 'next/link';
import {
  fetchMatchHighlights,
  matchHighlightDescription,
  matchHighlightLabel,
  matchHighlightTitle,
} from '@/lib/match-highlights';

export const metadata: Metadata = {
  title: 'Match highlights · TOURNAX Season 3',
  description: 'Short highlight reels from selected league and knockout fixtures.',
};

export const dynamic = 'force-dynamic';

export default async function HighlightsPage() {
  const highlights = await fetchMatchHighlights();
  const clipCount = highlights.reduce((n, h) => n + h.videoUrls.length, 0);

  return (
    <section className="section highlights-page" style={{ paddingTop: 'calc(var(--header-h) + 2rem)' }}>
      <div className="container highlights-page__wrap">
        <header className="section__head">
          <p className="matchday__eyebrow">Selected matches</p>
          <h1 className="h2">Match highlights</h1>
          <p className="lead">
            Hand-picked clips from the season. Left vs right on fixtures still means Home vs Away — same as the table
            and share posters.
          </p>
        </header>

        {highlights.length === 0 ? (
          <div className="panel competition-soon" data-reveal>
            <p className="competition-soon__text">No highlights published yet. Check back after the next big fixture.</p>
          </div>
        ) : (
          <ul className="highlights-grid" data-stagger>
            {highlights.map((item) => (
              <li key={item.matchId} className="highlights-card panel" data-reveal>
                <p className="highlights-card__label">{matchHighlightLabel(item)}</p>
                <h2 className="highlights-card__title">{matchHighlightTitle(item)}</h2>
                <p className="highlights-card__desc">{matchHighlightDescription(item)}</p>
                <div className="highlights-card__videos" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {item.videoUrls.map((src, idx) => (
                    <div key={`${item.matchId}-${idx}`} className="highlights-card__video-wrap">
                      <video
                        className="highlights-card__video"
                        src={src}
                        controls
                        playsInline
                        preload="metadata"
                      />
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}

        {clipCount > 0 ? (
          <p className="text-sm text-muted-foreground" style={{ marginTop: '1rem' }}>
            {clipCount} clip{clipCount === 1 ? '' : 's'} published.
          </p>
        ) : null}

        <p className="highlights-page__back">
          <Link href="/#highlights">← Back to home</Link>
        </p>
      </div>
    </section>
  );
}