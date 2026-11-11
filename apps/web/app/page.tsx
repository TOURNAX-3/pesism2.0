import { Cta } from '@/components/cta';
import { Format } from '@/components/format';
import { Hero } from '@/components/hero';
import { Overview } from '@/components/overview';
import { PlayersCarousel } from '@/components/players-carousel';
import { Prizes } from '@/components/prizes';
import { Schedule } from '@/components/schedule';
import { StandingsSection } from '@/components/standings-section';

export default function Home() {
  return (
    <>
      <Hero />
      <Overview />
      <Format />
      <StandingsSection />
      <Schedule />
      <Prizes />
      <PlayersCarousel />
      <Cta />
    </>
  );
}
