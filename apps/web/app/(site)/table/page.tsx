import type { Metadata } from 'next';
import { computeStandings, rankGroup, topScorers, type StandingRow } from '@tournax/core';
import { fetchSeasonCompetition, type SeasonCompetition } from '@/lib/season-competition';
import { CompetitionComingSoon } from '@/components/competition-coming-soon';
import { LeagueTable } from '@/components/league-table';
import { TopScorers } from '@/components/top-scorers';
import { ShareImageActions } from '@/components/share-image-actions';
import { latestCompletedMatchday } from '@/lib/matchday-status';
import { getGroupTablesData, getMatchdayTableData, posterVersion } from '@/lib/share/data';

export const metadata: Metadata = { title: 'Standings · TOURNAX Season 3' };

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

export default async function TablePage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  const tab = view === 'overall' ? 'overall' : 'groups';

  const competition = await fetchSeasonCompetition();
  const shareMd = competition ? latestCompletedMatchday(competition.matches) : null;
  const tableData = shareMd ? await getMatchdayTableData(shareMd, false) : null;
  const groupTablesData = shareMd ? await getGroupTablesData(shareMd, false) : null;

  const live = competition?.hasResults === true;
  const playerNames = competition?.playerNames ?? {};
  const playerCrests = Object.fromEntries(
    (competition?.players ?? []).map((p) => [p.id, { teamName: p.teamName, crestUrl: p.crestUrl }]),
  );
  const qualifiers = competition?.knockoutQualifiers ?? 8;

  const groupA = competition && live && tab === 'groups' ? groupStandings(competition, 'A') : [];
  const groupB = competition && live && tab === 'groups' ? groupStandings(competition, 'B') : [];

  const overallRows =
    competition && live && tab === 'overall'
      ? computeStandings(competition.players.map((p) => p.id), competition.matches, competition.points)
      : [];
  const overallScorers =
    competition && live && tab === 'overall' ? topScorers(competition.players.map((p) => p.id), competition.matches) : [];

  return (
    <section className="section standings" style={{ paddingTop: 'calc(var(--header-h) + 2rem)' }}>
      <div className="container">
        <div className="section__head">
          <h2 className="h2">Full table.</h2>
          <p className="lead">
            Points, goals scored, goals conceded, then head to head (in that order). Only confirmed, resolved and forfeit matches count.
          </p>
          <div className="share-actions-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {tab === 'overall' && tableData && shareMd ? (
              <ShareImageActions
                imageUrl={`/api/share/matchday/${shareMd}/table?v=${posterVersion(tableData)}`}
                caption={`Table after Matchday ${String(shareMd).padStart(2, '0')}. Numbers don't do banter. tournax.auradev.in/table`}
                filename={`matchday-${shareMd}-table.png`}
              />
            ) : null}
            {tab === 'groups' && groupTablesData && shareMd ? (
              <ShareImageActions
                imageUrl={`/api/share/matchday/${shareMd}/table/groups?v=${posterVersion(groupTablesData)}`}
                caption={`The tables after Matchday ${String(shareMd).padStart(2, '0')}. Group A & Group B. tournax.auradev.in/table`}
                filename={`matchday-${shareMd}-groups.png`}
              />
            ) : null}
          </div>
        </div>

        <nav className="matchday-tabs" aria-label="Standings view">
          <a href="?view=groups" aria-current={tab === 'groups' ? 'page' : undefined}>
            Groups
          </a>
          <a href="?view=overall" aria-current={tab === 'overall' ? 'page' : undefined}>
            Overall
          </a>
        </nav>

        {tab === 'groups' ? (
          live ? (
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
          )
        ) : (
          <div className="group-tables">
            <div className="card" data-reveal>
              <div className="card__head">
                <h3>Overall table</h3>
                {live ? <span className="pill pill--live">Live</span> : <span className="pill pill--muted">Coming soon</span>}
              </div>
              {live ? (
                <LeagueTable
                  rows={overallRows}
                  qualifiers={overallRows.length}
                  playerNames={playerNames}
                  playerCrests={playerCrests}
                />
              ) : (
                <CompetitionComingSoon label="The table goes live once the first results are in." />
              )}
              <div className="card__foot">
                <span>For awards only, doesn&rsquo;t decide qualification</span>
              </div>
            </div>

            <div className="card" data-reveal>
              <div className="card__head">
                <h3>Golden Boot race</h3>
                {live ? <span className="pill pill--live">Live</span> : <span className="pill pill--muted">Coming soon</span>}
              </div>
              {live ? (
                <TopScorers scorers={overallScorers} playerNames={playerNames} playerCrests={playerCrests} />
              ) : (
                <CompetitionComingSoon label="No goals yet. The strikers are warming up." />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
