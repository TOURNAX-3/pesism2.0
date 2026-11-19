import Image from 'next/image';
import Link from 'next/link';
import type { SponsorItem } from '@/lib/sponsors';
import { SponsorProductShowcase } from '@/components/sponsor-product-showcase';
import { SponsorSocialLinks } from '@/components/sponsor-social';

function sponsorStory(sponsor: SponsorItem): string {
  if (sponsor.description?.trim()) return sponsor.description.trim();
  const bits = [
    `${sponsor.name} is in the TOURNAX rotation this season.`,
    sponsor.tagline?.trim() ? sponsor.tagline.trim() : null,
    'Scroll the shots, tap through to their lane, and show love in the group.',
  ].filter(Boolean);
  return bits.join(' ');
}

export function SponsorFeaturedSpotlight({ sponsor }: { sponsor: SponsorItem }) {
  const story = sponsorStory(sponsor);
  const shots = sponsor.productImageUrls ?? [];

  return (
    <article
      id={`sponsor-${sponsor.id}`}
      className="sponsors-spotlight panel sponsors-featured--spotlight"
      data-reveal
    >
      <div className="sponsors-spotlight__brand">
        <p className="sponsors-spotlight__eyebrow">
          {sponsor.bannerActive ? 'Live on the home ticker' : 'Headline partner'}
          <span className="sponsors-spotlight__season">Season 3</span>
        </p>

        <div className="sponsors-spotlight__identity">
          {sponsor.logoUrl ? (
            <Image
              src={sponsor.logoUrl}
              alt=""
              width={88}
              height={88}
              className="sponsors-spotlight__logo"
              unoptimized
            />
          ) : (
            <div className="sponsors-spotlight__logo-fallback" aria-hidden="true">
              {sponsor.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <h2 className="sponsors-spotlight__title">{sponsor.name}</h2>
        </div>

        {sponsor.tagline ? (
          <p className="sponsors-spotlight__pull">&ldquo;{sponsor.tagline}&rdquo;</p>
        ) : null}

        <div className="sponsors-spotlight__story">
          <p className="sponsors-spotlight__story-label">Why they&apos;re here</p>
          <p className="sponsors-spotlight__body">{story}</p>
        </div>

        <div className="sponsors-spotlight__actions">
          <SponsorSocialLinks sponsor={sponsor} />
          {sponsor.productUrl ? (
            <Link className="btn btn--primary sponsors-spotlight__shop" href={sponsor.productUrl} target="_blank" rel="noopener noreferrer">
              Shop the drop
            </Link>
          ) : null}
        </div>

      </div>

      {shots.length > 0 ? (
        <div className="sponsors-spotlight__visual">
          <SponsorProductShowcase
            urls={shots}
            alt={sponsor.name}
            productUrl={sponsor.productUrl}
            variant="featured"
            layout="hero"
          />
        </div>
      ) : (
        <div className="sponsors-spotlight__visual sponsors-spotlight__visual--empty" aria-hidden="true">
          <p className="sponsors-spotlight__empty-copy">Product shots land here when the partner uploads them.</p>
        </div>
      )}
    </article>
  );
}