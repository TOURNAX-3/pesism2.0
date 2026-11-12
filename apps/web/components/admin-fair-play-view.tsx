import type { FairPlayRow } from '@/lib/tournax-api';
import { CompetitionComingSoon } from './competition-coming-soon';

export function AdminFairPlayView({ rows }: { rows: FairPlayRow[] }) {
  return (
    <div className="admin-card" style={{ marginTop: '1.25rem' }}>
      <h3 className="admin-standings-title">Fair play (admin only)</h3>
      <p className="admin-muted" style={{ marginBottom: '1rem' }}>
        Totals from match score sheets (fouls and offsides). Not shown on the public site yet — publish when you are ready.
      </p>
      {!rows.length ? (
        <CompetitionComingSoon label="Record results with in-game stats under Results → include score sheet stats." />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Matches logged</th>
                <th>Fouls</th>
                <th>Offsides</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.playerId}>
                  <td>{i + 1}</td>
                  <td>{row.playerName}</td>
                  <td>{row.matchesWithStats}</td>
                  <td className="admin-mono">{row.fouls}</td>
                  <td className="admin-mono">{row.offsides}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
