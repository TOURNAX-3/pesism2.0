import type { Metadata } from 'next';
import { FixturesPanels } from '@/components/fixtures-panels';
import { fetchSeasonCompetition } from '@/lib/season-competition';

export const metadata: Metadata = { title: 'Fixtures · TOURNAX Season 3' };

export default async function FixturesPage() {
  const competition = await fetchSeasonCompetition();

  return (
    <section className="section" style={{ paddingTop: 'calc(var(--header-h) + 2rem)' }}>
      <div className="container">
        <div className="section__head">
          <h2 className="h2">Who plays who.</h2>
          <p className="lead">
            Every matchday of the league stage, in order. Scores appear once results are confirmed.
          </p>
        </div>

        <FixturesPanels competition={competition} />
      </div>
    </section>
  );
}
