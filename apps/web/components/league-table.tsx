import type { StandingRow } from '@tournax/core';

export function LeagueTable({
  rows,
  qualifiers,
  playerNames,
}: {
  rows: StandingRow[];
  qualifiers: number;
  playerNames: Record<string, string>;
}) {
  return (
    <div className="table-wrap">
      <table className="ltable">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Player</th>
            <th scope="col">P</th>
            <th scope="col">W</th>
            <th scope="col">D</th>
            <th scope="col">L</th>
            <th scope="col">GF</th>
            <th scope="col">GA</th>
            <th scope="col">GD</th>
            <th scope="col">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr className={i < qualifiers ? 'is-q' : ''} key={row.playerId}>
              <td>{i + 1}</td>
              <td>{playerNames[row.playerId] ?? row.playerId}</td>
              <td>{row.played}</td>
              <td>{row.won}</td>
              <td>{row.drawn}</td>
              <td>{row.lost}</td>
              <td>{row.goalsFor}</td>
              <td>{row.goalsAgainst}</td>
              <td>{row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff < 0 ? `−${Math.abs(row.goalDiff)}` : '0'}</td>
              <td>{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
