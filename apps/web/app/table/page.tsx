import type { Metadata } from 'next';
import { computeStandings, topScorers } from '@tournax/core';
import { LeagueTable } from '@/components/league-table';
import { TopScorers } from '@/components/top-scorers';
import { KNOCKOUT_QUALIFIERS, MATCHES, PLAYER_IDS } from '@/lib/seed';

export const metadata: Metadata = { title: 'Standings · TOURNAX Season 3' };

export default function TablePage() {
  const table = computeStandings(PLAYER_IDS, MATCHES);
  const scorers = topScorers(PLAYER_IDS, MATCHES);

  return (
    <section className="section standings" style={{ paddingTop: 'calc(var(--header-h) + 2rem)' }}>
      <div className="container">
        <div className="section__head">
          <h2 className="h2">Full table.</h2>
          <p className="lead">
            Points, goal difference, goals scored, then head to head (in that order). Only confirmed, resolved and forfeit matches count.
          </p>
        </div>

        <div className="standings__grid">
          <div className="panel">
            <div className="panel__head">
              <h3>League table</h3>
              <span className="chip">Seed data</span>
            </div>
            <LeagueTable rows={table} qualifiers={KNOCKOUT_QUALIFIERS} />
            <p className="panel__foot">Top {KNOCKOUT_QUALIFIERS} qualify for the knockout rounds.</p>
          </div>

          <div className="panel">
            <div className="panel__head">
              <h3>Top scorers</h3>
              <span className="chip">Seed data</span>
            </div>
            <TopScorers scorers={scorers} />
          </div>
        </div>
      </div>
    </section>
  );
}
