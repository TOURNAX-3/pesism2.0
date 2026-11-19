import { SponsorProductShowcase } from '@/components/sponsor-product-showcase';

/** @deprecated Use SponsorProductShowcase — kept for imports. */
export function SponsorProductStrip({
  urls,
  alt,
  productUrl,
}: {
  urls: string[];
  alt: string;
  productUrl?: string | null;
}) {
  return <SponsorProductShowcase urls={urls} alt={alt} productUrl={productUrl} variant="featured" />;
}