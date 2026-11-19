import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { SponsorFeaturedSpotlight } from '@/components/sponsor-featured-spotlight';
import { SponsorProductShowcase } from '@/components/sponsor-product-showcase';
import { SponsorSocialLinks } from '@/components/sponsor-social';
import { fetchSponsors } from '@/lib/sponsors';

export const metadata: Metadata = {
  title: 'Pitch partners · TOURNAX Season 3',
  description: 'Sponsors, drops, and group-chat energy for the TOURNAX room.',
};

export const dynamic = 'force-dynamic';

export default async function SponsorsPage() {
  const sponsors = await fetchSponsors();
  const featured = sponsors.find((s) => s.bannerActive) ?? sponsors[0] ?? null;
  const rest = featured ? sponsors.filter((s) => s.id !== featured.id) : sponsors;

  return (
    <section className="section sponsors-page" style={{ paddingTop: 'calc(var(--header-h) + 2rem)' }}>
      <div className="container sponsors-page__wrap">
        <header className="section__head">
          <p className="matchday__eyebrow">Loot &amp; backing</p>
          <h1 className="h2">Pitch partners</h1>
          <p className="lead">The brands keeping the room loud — drops, logos, and links straight to their lane. No corporate brochure vibes.</p>
        </header>

        {sponsors.length === 0 ? (
          <div className="panel competition-soon" data-reveal>
            <p className="competition-soon__text">Partner slots warming up. First shout goes here when admin flips the switch.</p>
          </div>
        ) : (
          <>
            {featured ? <SponsorFeaturedSpotlight sponsor={featured} /> : null}

            {rest.length > 0 ? (
              <ul className="sponsors-grid" data-stagger>
                {rest.map((s) => (
                  <li key={s.id} id={`sponsor-${s.id}`} className="sponsors-card panel" data-reveal>
                    <div className="sponsors-card__head">
                      {s.logoUrl ? (
                        <Image src={s.logoUrl} alt="" width={56} height={56} className="sponsors-card__logo" unoptimized />
                      ) : null}
                      <h3 className="sponsors-card__title">{s.name}</h3>
                    </div>
                    {s.tagline ? <p className="sponsors-card__tag">{s.tagline}</p> : null}
                    {s.description ? <p className="sponsors-card__desc">{s.description}</p> : null}
                    {(s.productImageUrls?.length ?? 0) > 0 ? (
                      <SponsorProductShowcase urls={s.productImageUrls} alt={s.name} variant="card" />
                    ) : null}
                    <SponsorSocialLinks sponsor={s} />
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        )}

        <p className="sponsors-page__back">
          <Link href="/">← Back to the pitch</Link>
        </p>
      </div>
    </section>
  );
}