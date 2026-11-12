import Link from 'next/link';
import { AdminApiStatus } from '@/components/admin-api-status';
import { listAdminGrievances, type GrievanceStatus } from '@/lib/tournax-api';
import { Badge, type badgeVariants } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { VariantProps } from 'class-variance-authority';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<GrievanceStatus, string> = {
  open: 'Open',
  in_review: 'In review',
  resolved: 'Resolved',
  rejected: 'Rejected',
};

const STATUS_VARIANT: Record<GrievanceStatus, NonNullable<VariantProps<typeof badgeVariants>['variant']>> = {
  open: 'outline',
  in_review: 'secondary',
  resolved: 'success',
  rejected: 'destructive',
};

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
        <Card>
          <CardContent>
            <p className="admin-muted">No grievances yet. Players file from the public Grievances page.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>When</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead aria-label="Actions" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell className="admin-mono">{new Date(g.createdAt).toLocaleDateString('en-IN')}</TableCell>
                    <TableCell>{g.playerName}</TableCell>
                    <TableCell>{g.category}</TableCell>
                    <TableCell>{g.subject}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[g.status]}>{STATUS_LABEL[g.status]}</Badge>
                    </TableCell>
                    <TableCell>{g.commentCount}</TableCell>
                    <TableCell>
                      <Link href={`/admin/grievances/${g.id}`} className="admin-link">
                        Review
                      </Link>
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
