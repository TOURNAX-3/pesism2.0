import { Cta } from '@/components/cta';
import { Format } from '@/components/format';
import { Hero } from '@/components/hero';
import { MatchdaySection } from '@/components/matchday-section';
import { PlayersCarousel } from '@/components/players-carousel';
import { QuoteDivider } from '@/components/quote-divider';
import { StandingsSection } from '@/components/standings-section';

export default function Home() {
  return (
    <>
      <Hero />
      <MatchdaySection />
      <Format />
      <QuoteDivider text="The table is the only opinion that matters." />
      <StandingsSection />
      <PlayersCarousel />
      <Cta />
    </>
  );
}
