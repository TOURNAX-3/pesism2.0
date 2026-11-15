import { computeStandings, rankGroup, topScorers, type StandingRow } from '@tournax/core';
import { fetchSeasonCompetition, type SeasonCompetition } from '@/lib/season-competition';
import { CompetitionComingSoon } from './competition-coming-soon';
import { LeagueTable } from './league-table';
import { SplitHeading } from './split-heading';
import { TopScorers } from './top-scorers';

/**
 * A group's standings: every group member's stats are aggregated from ALL of their matches
 * (including cross-group ones), but only that group's players are listed, ranked with the
 * group-stage tie-break order (rankGroup), not the league's own tie-break order.
 */
function groupStandings(competition: SeasonCompetition, letter: 'A' | 'B'): StandingRow[] {
  const groupIds = new Set(competition.players.filter((p) => p.groupLetter === letter).map((p) => p.id));
  const allIds = competition.players.map((p) => p.id);
  const allRows = computeStandings(allIds, competition.matches, competition.points);
  const rows = allRows.filter((r) => groupIds.has(r.playerId));
  return rankGroup(rows, competition.matches, competition.points);
}

export async function StandingsSection() {
  const competition = await fetchSeasonCompetition();
  const live = competition?.hasResults === true;
  const playerNames = competition?.playerNames ?? {};
  const playerCrests = Object.fromEntries(
    (competition?.players ?? []).map((p) => [p.id, { teamName: p.teamName, crestUrl: p.crestUrl }]),
  );
  const qualifiers = competition?.knockoutQualifiers ?? 8;
  const groupA = competition && live ? groupStandings(competition, 'A') : [];
  const groupB = competition && live ? groupStandings(competition, 'B') : [];
  const scorers = competition && live ? topScorers(competition.players.map((p) => p.id), competition.matches) : [];
  const scorersShown = scorers.slice(0, 5);

  return (
    <section className="section standings" id="standings" aria-labelledby="standings-title">
      <div className="container">
        <div className="section__head section__head--split">
          <SplitHeading id="standings-title" lines={['The table', 'doesn’t lie.']} />
          <p className="lead" data-reveal>
            Updated after every confirmed result. Both players agree, or the admin settles it.
          </p>
        </div>

        {live ? (
          <div className="group-tables">
            <div className="card" data-reveal>
              <LeagueTable
                rows={groupA}
                qualifiers={qualifiers}
                playerNames={playerNames}
                playerCrests={playerCrests}
                group="A"
                markers="group"
              />
              <div className="card__foot">
                <a href="/table">See the full table &rarr;</a>
              </div>
            </div>
            <div className="card" data-reveal>
              <LeagueTable
                rows={groupB}
                qualifiers={qualifiers}
                playerNames={playerNames}
                playerCrests={playerCrests}
                group="B"
                markers="group"
              />
              <div className="card__foot">
                <a href="/table">See the full table &rarr;</a>
              </div>
            </div>
          </div>
        ) : (
          <div className="card" data-reveal>
            <div className="card__head">
              <h3>League table</h3>
              <span className="pill pill--muted">Coming soon</span>
            </div>
            <CompetitionComingSoon label="The table goes live once the first results are in." />
          </div>
        )}

        <div className="card" style={{ marginTop: '1.25rem' }} data-reveal>
          <div className="card__head">
            <h3>Golden Boot race</h3>
            {live ? <span className="pill pill--live">Live</span> : <span className="pill pill--muted">Coming soon</span>}
          </div>
          {live ? (
            <TopScorers scorers={scorersShown} playerNames={playerNames} playerCrests={playerCrests} />
          ) : (
            <CompetitionComingSoon label="No goals yet. The strikers are warming up." />
          )}
        </div>
      </div>
    </section>
  );
}
