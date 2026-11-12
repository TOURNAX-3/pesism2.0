import Link from 'next/link';
import { AdminApiStatus } from '@/components/admin-api-status';
import { AdminRecordMatchForm } from '@/components/admin-record-match-form';
import { listAdminFixtures, listAdminMatches } from '@/lib/tournax-api';

export const dynamic = 'force-dynamic';

export default async function AdminResultsPage() {
  let error: string | null = null;
  let fixtures = [] as Awaited<ReturnType<typeof listAdminFixtures>>;
  let matches = [] as Awaited<ReturnType<typeof listAdminMatches>>;

  try {
    fixtures = await listAdminFixtures();
    matches = await listAdminMatches();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Could not load results';
  }

  return (
    <>
      <header className="admin-page-head">
        <div>
          <p className="admin-eyebrow">League results</p>
          <h2>Record a match</h2>
        </div>
      </header>

      {error ? (
        <AdminApiStatus error={error} />
      ) : (
        <>
          <div className="admin-card admin-card--form">
            <p className="admin-muted">
              Pick a fixture that already exists under <Link href="/admin/schedule" className="admin-link">Fixtures</Link>.
              You cannot enter a score for a pairing that was not scheduled. Results count in the table immediately (admin
              resolved).
            </p>
            <AdminRecordMatchForm scheduled={fixtures} />
          </div>

          <header className="admin-page-head" style={{ marginTop: '2rem' }}>
            <div>
              <p className="admin-eyebrow">Recorded</p>
              <h2>Recent results</h2>
            </div>
          </header>

          {!matches.length ? (
            <div className="admin-card">
              <p className="admin-muted">No results yet.</p>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>MD</th>
                    <th>Home</th>
                    <th>Score</th>
                    <th>Away</th>
                    <th>Stats</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {matches.map((m) => (
                    <tr key={m.id}>
                      <td>{m.matchday}</td>
                      <td>{m.homeName}</td>
                      <td className="admin-mono">
                        {m.homeGoals !== null && m.awayGoals !== null ? `${m.homeGoals}–${m.awayGoals}` : '—'}
                      </td>
                      <td>{m.awayName}</td>
                      <td>{m.hasStats ? 'Yes' : '—'}</td>
                      <td>
                        <Link href={`/admin/fixtures/${m.id}`} className="admin-link">
                          View / edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </>
  );
}
