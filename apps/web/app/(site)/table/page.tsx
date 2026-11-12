import type { Metadata } from 'next';
import { fetchSeasonCompetition } from '@/lib/season-competition';
import { StandingsPanels } from '@/components/standings-panels';

export const metadata: Metadata = { title: 'Standings · TOURNAX Season 3' };

export default async function TablePage() {
  const competition = await fetchSeasonCompetition();

  return (
    <section className="section standings" style={{ paddingTop: 'calc(var(--header-h) + 2rem)' }}>
      <div className="container">
        <div className="section__head">
          <h2 className="h2">Full table.</h2>
          <p className="lead">
            Points, goal difference, goals scored, then head to head (in that order). Only confirmed, resolved and forfeit matches count.
          </p>
        </div>

        <StandingsPanels competition={competition} />
      </div>
    </section>
  );
}
