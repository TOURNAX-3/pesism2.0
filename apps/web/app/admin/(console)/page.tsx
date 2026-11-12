import { getAdminDashboard } from '@/lib/tournax-api';
import { AdminRegistrationActions } from '@/components/admin-registration-actions';
import { AdminApiStatus } from '@/components/admin-api-status';

export const dynamic = 'force-dynamic';

function formatInstant(iso: string | null) {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
}

export default async function AdminOverviewPage() {
  let dashboard;
  let error: string | null = null;
  try {
    dashboard = await getAdminDashboard();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Could not reach API';
  }

  if (error || !dashboard) {
    return <AdminApiStatus error={error ?? 'Unknown error'} />;
  }

  return (
    <>
      <header className="admin-page-head">
        <div>
          <p className="admin-eyebrow">Season {dashboard.season}</p>
          <h2>{dashboard.name}</h2>
        </div>
        <AdminRegistrationActions registrationOpen={dashboard.registrationOpen} />
      </header>

      <div className="admin-stat-grid">
        <div className="admin-stat">
          <span className="admin-muted">Registered</span>
          <strong>{dashboard.totalRegistrations}</strong>
        </div>
        <div className="admin-stat">
          <span className="admin-muted">Approved</span>
          <strong>{dashboard.approvedCount}</strong>
        </div>
        <div className="admin-stat">
          <span className="admin-muted">Pending</span>
          <strong>{dashboard.pendingCount}</strong>
        </div>
        <div className="admin-stat">
          <span className="admin-muted">Slots</span>
          <strong>
            {dashboard.maxPlayers != null
              ? `${dashboard.totalRegistrations} / ${dashboard.maxPlayers}`
              : dashboard.totalRegistrations}
          </strong>
        </div>
      </div>

      <div className="admin-card">
        <h3>Registration window</h3>
        <dl className="admin-dl">
          <dt>Status</dt>
          <dd>{dashboard.registrationOpen ? 'Open' : 'Closed'}</dd>
          <dt>Phase</dt>
          <dd>{dashboard.status}</dd>
          <dt>Opens</dt>
          <dd>{formatInstant(dashboard.registrationOpensAt)}</dd>
          <dt>Closes</dt>
          <dd>{formatInstant(dashboard.registrationClosesAt)}</dd>
        </dl>
        {!dashboard.registrationOpen ? (
          <p className="admin-muted" style={{ marginTop: '0.75rem' }}>
            Closing registration switches the tournament to the <strong>league</strong> phase. Use{' '}
            <strong>Reopen registration</strong> above to accept new sign-ups again (extends the window by 30 days).
          </p>
        ) : null}
      </div>
    </>
  );
}
