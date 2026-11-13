import { listRegistrationAudit, type RegistrationAuditRow } from '@/lib/tournax-api';
import { AdminApiStatus } from '@/components/admin-api-status';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const dynamic = 'force-dynamic';

function formatWhen(iso: string) {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'short',
      timeStyle: 'medium',
      timeZone: 'Asia/Kolkata',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function location(row: RegistrationAuditRow) {
  const parts = [row.ipCity, row.ipRegion, row.ipCountry].filter(Boolean);
  return parts.length ? parts.join(', ') : '—';
}

function shortUa(ua: string | null) {
  if (!ua) return '—';
  return ua.length > 48 ? `${ua.slice(0, 48)}…` : ua;
}

export default async function AdminRegistrationAuditPage() {
  let rows: RegistrationAuditRow[] | null = null;
  let error: string | null = null;
  try {
    rows = await listRegistrationAudit();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Could not load audit log';
  }

  return (
    <>
      <header className="admin-page-head">
        <div>
          <p className="admin-eyebrow">Sign-ups</p>
          <h2>Registration audit</h2>
        </div>
      </header>

      <p className="admin-muted" style={{ marginBottom: '1rem', maxWidth: '42rem' }}>
        Append-only log of OTP send, verify attempts, and completed sign-ups. IP and geo come from the browser
        request (Vercel adds country/city in production; local tests may show only IP).
      </p>

      {error ? (
        <AdminApiStatus error={error} />
      ) : !rows?.length ? (
        <Card>
          <CardContent>
            <p className="admin-muted">No audit events yet.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="admin-table-scroll">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>When (IST)</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Form city</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Geo</TableHead>
                  <TableHead>Referer</TableHead>
                  <TableHead>UA</TableHead>
                  <TableHead>Detail</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="admin-mono admin-nowrap">{formatWhen(row.createdAt)}</TableCell>
                    <TableCell>{row.eventType}</TableCell>
                    <TableCell>{row.email ?? '—'}</TableCell>
                    <TableCell>{row.formCity ?? '—'}</TableCell>
                    <TableCell className="admin-mono">{row.ipAddress ?? '—'}</TableCell>
                    <TableCell>{location(row)}</TableCell>
                    <TableCell className="admin-table-truncate" title={row.referer ?? undefined}>
                      {row.referer ?? '—'}
                    </TableCell>
                    <TableCell className="admin-table-truncate" title={row.userAgent ?? undefined}>
                      {shortUa(row.userAgent)}
                    </TableCell>
                    <TableCell className="admin-table-truncate" title={row.detail ?? undefined}>
                      {row.detail ?? '—'}
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
