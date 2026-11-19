import Link from 'next/link';
import Image from 'next/image';
import { fetchBannerSponsor } from '@/lib/sponsors';

export async function SponsorTicker() {
  const sponsor = await fetchBannerSponsor();
  if (!sponsor) return null;

  const line = sponsor.tagline?.trim() || `${sponsor.name} is in the building. Peep the drop.`;
  const href = `/sponsors#sponsor-${sponsor.id}`;

  return (
    <aside className="sponsor-ticker" aria-label="Season sponsor">
      <div className="sponsor-ticker__label">In the build</div>
      <div className="sponsor-ticker__track-wrap">
        <div className="sponsor-ticker__track">
          {[0, 1].map((dup) => (
            <span key={dup} className="sponsor-ticker__segment" aria-hidden={dup === 1}>
              {sponsor.logoUrl ? (
                <Image src={sponsor.logoUrl} alt="" width={28} height={28} className="sponsor-ticker__logo" unoptimized />
              ) : null}
              <strong className="sponsor-ticker__name">{sponsor.name}</strong>
              <span className="sponsor-ticker__sep">◆</span>
              <span>{line}</span>
              <Link className="sponsor-ticker__link" href={href}>
                See the drop
              </Link>
              {sponsor.instagramUrl ? (
                <Link className="sponsor-ticker__link sponsor-ticker__link--muted" href={sponsor.instagramUrl} target="_blank" rel="noopener noreferrer">
                  IG
                </Link>
              ) : null}
              {sponsor.telegramUrl ? (
                <Link className="sponsor-ticker__link sponsor-ticker__link--muted" href={sponsor.telegramUrl} target="_blank" rel="noopener noreferrer">
                  TG
                </Link>
              ) : null}
              <span className="sponsor-ticker__dot" aria-hidden="true">
                ◆
              </span>
            </span>
          ))}
        </div>
      </div>
      <Link className="sponsor-ticker__more" href="/sponsors">
        Partners
      </Link>
    </aside>
  );
}