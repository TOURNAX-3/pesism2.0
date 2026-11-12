import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AdminApiStatus } from '@/components/admin-api-status';
import { AdminGrievancePanel } from '@/components/admin-grievance-panel';
import { getAdminGrievance } from '@/lib/tournax-api';

export const dynamic = 'force-dynamic';

export default async function AdminGrievanceDetailPage({
  params,
}: {
  params: Promise<{ grievanceId: string }>;
}) {
  const { grievanceId } = await params;
  let grievance;
  let error: string | null = null;
  try {
    grievance = await getAdminGrievance(grievanceId);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Could not load grievance';
  }

  if (error?.toLowerCase().includes('not found')) {
    notFound();
  }

  return (
    <>
      <header className="admin-page-head">
        <div>
          <p className="admin-eyebrow">
            <Link href="/admin/grievances">Grievances</Link> / Review
          </p>
          <h2>{grievance?.subject ?? 'Grievance'}</h2>
        </div>
      </header>

      {error || !grievance ? (
        <AdminApiStatus error={error ?? 'Grievance not found'} />
      ) : (
        <AdminGrievancePanel grievance={grievance} />
      )}
    </>
  );
}
