import { listRegistrations, type AdminRegistration } from '@/lib/tournax-api';
import { AdminPlayerActions } from '@/components/admin-player-actions';
import { AdminPlayerAvatar } from '@/components/admin-player-avatar';
import { AdminApiStatus } from '@/components/admin-api-status';

export const dynamic = 'force-dynamic';

export default async function AdminPlayersPage() {
  let rows: AdminRegistration[] | null = null;
  let error: string | null = null;
  try {
    rows = await listRegistrations();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Could not load players';
  }

  return (
    <>
      <header className="admin-page-head">
        <div>
          <p className="admin-eyebrow">Roster</p>
          <h2>Players &amp; registrations</h2>
        </div>
      </header>

      {error ? (
        <AdminApiStatus error={error} />
      ) : !rows?.length ? (
        <div className="admin-card">
          <p className="admin-muted">No registrations yet.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Gaming</th>
                <th>eFootball</th>
                <th>City</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.playerId}>
                  <td>
                    <AdminPlayerAvatar
                      playerId={row.playerId}
                      name={row.name}
                      avatarUrl={row.avatarUrl ?? null}
                    />
                  </td>
                  <td>{row.name}</td>
                  <td>{row.gamingUsername}</td>
                  <td>{row.efootballUsername ?? '—'}</td>
                  <td>{row.city}</td>
                  <td>{row.email}</td>
                  <td className="admin-mono">{row.waNumber}</td>
                  <td>
                    <span className={row.approved ? 'admin-pill admin-pill--ok' : 'admin-pill admin-pill--wait'}>
                      {row.approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="admin-actions">
                    <AdminPlayerActions playerId={row.playerId} approved={row.approved} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
