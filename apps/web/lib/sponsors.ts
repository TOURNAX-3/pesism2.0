const API_BASE = process.env.TOURNAX_API_URL?.replace(/\/$/, '') ?? 'http://localhost:8080';
const CURRENT_SEASON = 3;

export type SponsorItem = {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  productUrl: string | null;
  logoUrl: string | null;
  instagramUrl: string | null;
  telegramUrl: string | null;
  productImageUrls: string[];
  bannerActive: boolean;
};

export async function fetchSponsors(season = CURRENT_SEASON): Promise<SponsorItem[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/seasons/${season}/sponsors`, { cache: 'no-store' });
    if (!res.ok) return [];
    return (await res.json()) as SponsorItem[];
  } catch {
    return [];
  }
}

export async function fetchBannerSponsor(season = CURRENT_SEASON): Promise<SponsorItem | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/seasons/${season}/sponsors/banner`, { cache: 'no-store' });
    if (res.status === 204 || res.status === 404) return null;
    if (!res.ok) return null;
    return (await res.json()) as SponsorItem;
  } catch {
    return null;
  }
}