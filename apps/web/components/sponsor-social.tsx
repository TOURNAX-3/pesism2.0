import type { SponsorItem } from '@/lib/sponsors';

export function SponsorSocialLinks({ sponsor }: { sponsor: SponsorItem }) {
  const raw = [
    sponsor.instagramUrl ? { href: sponsor.instagramUrl, label: 'IG', title: 'Stalk on Instagram' } : null,
    sponsor.telegramUrl ? { href: sponsor.telegramUrl, label: 'TG', title: 'Hop in on Telegram' } : null,
    sponsor.productUrl ? { href: sponsor.productUrl, label: 'Drop', title: 'Grab the offer' } : null,
  ].filter(Boolean) as { href: string; label: string; title: string }[];

  const seen = new Set<string>();
  const links = raw.filter((l) => {
    const k = l.href.trim().toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  if (!links.length) return null;

  return (
    <ul className="sponsor-social">
      {links.map((l) => (
        <li key={l.label}>
          <a className="sponsor-social__chip" href={l.href} target="_blank" rel="noopener noreferrer" title={l.title}>
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  );
}