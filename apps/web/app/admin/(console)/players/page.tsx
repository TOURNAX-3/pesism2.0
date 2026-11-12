import { listRegistrations, type AdminRegistration } from '@/lib/tournax-api';
import { AdminPlayerActions } from '@/components/admin-player-actions';
import { AdminPlayerAvatar } from '@/components/admin-player-avatar';
import { AdminApiStatus } from '@/components/admin-api-status';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
        <Card>
          <CardContent>
            <p className="admin-muted">No registrations yet.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Gaming</TableHead>
                  <TableHead>eFootball</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead aria-label="Actions" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.playerId}>
                    <TableCell>
                      <AdminPlayerAvatar
                        playerId={row.playerId}
                        name={row.name}
                        avatarUrl={row.avatarUrl ?? null}
                      />
                    </TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.gamingUsername}</TableCell>
                    <TableCell>{row.efootballUsername ?? '—'}</TableCell>
                    <TableCell>{row.city}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell className="admin-mono">{row.waNumber}</TableCell>
                    <TableCell>
                      <Badge variant={row.approved ? 'default' : 'secondary'}>
                        {row.approved ? 'Approved' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <AdminPlayerActions playerId={row.playerId} approved={row.approved} name={row.name} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
}
