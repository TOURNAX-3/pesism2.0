import Link from 'next/link';
import { AdminApiStatus } from '@/components/admin-api-status';
import { AdminScheduleMatchForm } from '@/components/admin-schedule-match-form';
import { listAdminFixtures, listRegistrations } from '@/lib/tournax-api';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const dynamic = 'force-dynamic';

function formatScore(home: number | null, away: number | null, status: string) {
  if (home !== null && away !== null && status !== 'scheduled') {
    return `${home}–${away}`;
  }
  return 'vs';
}

export default async function AdminSchedulePage() {
  let error: string | null = null;
  let approved: Awaited<ReturnType<typeof listRegistrations>> = [];
  let fixtures: Awaited<ReturnType<typeof listAdminFixtures>> = [];

  try {
    const rows = await listRegistrations();
    approved = rows.filter((r) => r.approved);
    fixtures = await listAdminFixtures();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Could not load fixtures';
  }

  const scheduled = fixtures.filter((f) => f.status === 'scheduled');

  return (
    <>
      <header className="admin-page-head">
        <div>
          <p className="admin-eyebrow">League stage</p>
          <h2>Fixtures</h2>
        </div>
      </header>

      {error ? (
        <AdminApiStatus error={error} />
      ) : (
        <>
          <div className="admin-card admin-card--form">
            <h3 className="admin-standings-title" style={{ marginTop: 0 }}>
              Add a fixture
            </h3>
            <p className="admin-muted">Pick matchday, home, and away. Published rows show on the public fixtures page.</p>
            <AdminScheduleMatchForm approved={approved} />
          </div>

          <header className="admin-page-head" style={{ marginTop: '2rem' }}>
            <div>
              <p className="admin-eyebrow">Published</p>
              <h2>League schedule</h2>
            </div>
            <Link href="/fixtures" className="admin-link" target="_blank" rel="noopener noreferrer">
              View public page
            </Link>
          </header>

          {!fixtures.length ? (
            <Card>
              <CardContent>
                <p className="admin-muted">No league fixtures yet. Add one above, then record scores under Results.</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>MD</TableHead>
                      <TableHead>Home</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Away</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead aria-label="Actions" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fixtures.map((f) => (
                      <TableRow key={f.id}>
                        <TableCell>{f.matchday}</TableCell>
                        <TableCell>{f.homeName}</TableCell>
                        <TableCell className="admin-mono">{formatScore(f.homeGoals, f.awayGoals, f.status)}</TableCell>
                        <TableCell>{f.awayName}</TableCell>
                        <TableCell>
                          <Badge variant={f.status === 'scheduled' ? 'secondary' : 'default'}>{f.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {f.status !== 'scheduled' ? (
                            <Link href={`/admin/fixtures/${f.id}`} className="admin-link">
                              Edit
                            </Link>
                          ) : (
                            <Link href="/admin/fixtures" className="admin-link">
                              Enter result
                            </Link>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {scheduled.length > 0 ? (
            <p className="admin-muted" style={{ marginTop: '1rem' }}>
              {scheduled.length} unplayed. Scores:{' '}
              <Link href="/admin/fixtures" className="admin-link">
                Results
              </Link>{' '}
              (same matchday and players).
            </p>
          ) : null}
        </>
      )}
    </>
  );
}
