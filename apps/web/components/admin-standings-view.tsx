import { computeStandings, topScorers } from '@tournax/core';
import type { SeasonCompetition } from '@/lib/season-competition';
import { CompetitionComingSoon } from './competition-coming-soon';
import { LeagueTable } from './league-table';

export function AdminStandingsView({ competition }: { competition: SeasonCompetition }) {
  const live = competition.hasResults;
  const playerIds = competition.players.map((p) => p.id);
  const names = competition.playerNames;
  const table = live ? computeStandings(playerIds, competition.matches, competition.points) : [];
  const scorers = live ? topScorers(playerIds, competition.matches) : [];
  const q = competition.knockoutQualifiers;

  return (
    <div className="admin-standings-grid">
      <div className="admin-card">
        <h3 className="admin-standings-title">League table</h3>
        {live ? (
          <div className="admin-table-wrap admin-table-wrap--standings">
            <LeagueTable rows={table} qualifiers={q} playerNames={names} />
          </div>
        ) : (
          <CompetitionComingSoon label="Record a result under Results to populate the table." />
        )}
        <p className="admin-muted" style={{ padding: '0.75rem 0 0', margin: 0 }}>
          Top {q} qualify for knockouts. Tie-breakers: points, goal difference, goals scored, head to head.
        </p>
      </div>

      <div className="admin-card">
        <h3 className="admin-standings-title">Top scorers</h3>
        {live ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Player</th>
                  <th>Goals</th>
                </tr>
              </thead>
              <tbody>
                {scorers.map((s, i) => (
                  <tr key={s.playerId}>
                    <td>{i + 1}</td>
                    <td>{names[s.playerId] ?? s.playerId}</td>
                    <td className="admin-mono">{s.goals}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <CompetitionComingSoon label="Scorers appear after the first counted result." />
        )}
      </div>
    </div>
  );
}
