import Link from 'next/link';
import { AdminApiStatus } from '@/components/admin-api-status';
import { listAdminGrievances, type GrievanceStatus } from '@/lib/tournax-api';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<GrievanceStatus, string> = {
  open: 'Open',
  in_review: 'In review',
  resolved: 'Resolved',
  rejected: 'Rejected',
};

function pillClass(status: GrievanceStatus) {
  if (status === 'resolved') return 'admin-pill admin-pill--ok';
  if (status === 'rejected') return 'admin-pill admin-pill--danger';
  if (status === 'in_review') return 'admin-pill admin-pill--wait';
  return 'admin-pill';
}

export default async function AdminGrievancesPage() {
  let rows: Awaited<ReturnType<typeof listAdminGrievances>> = [];
  let error: string | null = null;
  try {
    rows = await listAdminGrievances();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Could not load grievances';
  }

  return (
    <>
      <header className="admin-page-head">
        <div>
          <p className="admin-eyebrow">Member issues</p>
          <h2>Grievances</h2>
        </div>
      </header>

      {error ? (
        <AdminApiStatus error={error} />
      ) : !rows.length ? (
        <div className="admin-card">
          <p className="admin-muted">No grievances yet. Players file from the public Grievances page.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Player</th>
                <th>Category</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Notes</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {rows.map((g) => (
                <tr key={g.id}>
                  <td className="admin-mono">{new Date(g.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>{g.playerName}</td>
                  <td>{g.category}</td>
                  <td>{g.subject}</td>
                  <td>
                    <span className={pillClass(g.status)}>{STATUS_LABEL[g.status]}</span>
                  </td>
                  <td>{g.commentCount}</td>
                  <td>
                    <Link href={`/admin/grievances/${g.id}`} className="admin-link">
                      Review
                    </Link>
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
