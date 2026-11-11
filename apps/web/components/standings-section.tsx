import { computeStandings, topScorers } from '@tournax/core';
import { KNOCKOUT_QUALIFIERS, MATCHES, PLAYER_IDS } from '@/lib/seed';
import { LeagueTable } from './league-table';
import { SplitHeading } from './split-heading';
import { TopScorers } from './top-scorers';

export function StandingsSection() {
  const table = computeStandings(PLAYER_IDS, MATCHES);
  const scorers = topScorers(PLAYER_IDS, MATCHES).slice(0, 5);

  return (
    <section className="section standings" id="standings" aria-labelledby="standings-title">
      <div className="container">
        <div className="section__head section__head--split">
          <SplitHeading id="standings-title" lines={['Talk is cheap.', 'The table isn’t.']} />
          <p className="lead" data-reveal>
            Results are confirmed by both players, then the table and the top scorer race update on their own. Seed data below until Season 3 kicks off.
          </p>
        </div>

        <div className="standings__grid">
          <div className="panel" data-reveal>
            <div className="panel__head">
              <h3>League table</h3>
              <span className="chip">Seed data</span>
            </div>
            <LeagueTable rows={table} qualifiers={KNOCKOUT_QUALIFIERS} />
            <p className="panel__foot">
              Top {KNOCKOUT_QUALIFIERS} qualify for the knockout rounds. <a href="/table">See the full table</a>
            </p>
          </div>

          <div className="panel" data-reveal>
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
