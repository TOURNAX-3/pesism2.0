import { AdminApiStatus } from '@/components/admin-api-status';
import { AdminPageHead } from '@/components/admin-page-head';
import { AdminSponsors } from '@/components/admin-sponsors';
import { Card, CardContent } from '@/components/ui/card';
import { listAdminSponsors } from '@/lib/tournax-api';

export const dynamic = 'force-dynamic';

export default async function AdminSponsorsPage() {
  let error: string | null = null;
  let sponsors: Awaited<ReturnType<typeof listAdminSponsors>> = [];
  try {
    sponsors = await listAdminSponsors();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Could not load sponsors';
  }

  return (
    <>
      <AdminPageHead eyebrow="Community" title="Sponsors" />
      {error ? (
        <AdminApiStatus error={error} />
      ) : (
        <Card>
          <CardContent>
            <AdminSponsors sponsors={sponsors} />
          </CardContent>
        </Card>
      )}
    </>
  );
}