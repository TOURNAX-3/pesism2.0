import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AdminApiStatus } from '@/components/admin-api-status';
import { AdminEditMatchForm } from '@/components/admin-edit-match-form';
import { getAdminMatch } from '@/lib/tournax-api';

export const dynamic = 'force-dynamic';

export default async function AdminEditMatchPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await params;
  let match;
  let error: string | null = null;
  try {
    match = await getAdminMatch(matchId);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Could not load match';
  }

  if (error?.includes('not found') || error?.includes('404')) {
    notFound();
  }

  return (
    <>
      <header className="admin-page-head">
        <div>
          <p className="admin-eyebrow">
            <Link href="/admin/fixtures">Results</Link> / Edit
          </p>
          <h2>
            {match ? `${match.homeName} ${match.homeGoals}–${match.awayGoals} ${match.awayName}` : 'Edit result'}
          </h2>
        </div>
      </header>

      {error || !match ? (
        <AdminApiStatus error={error ?? 'Match not found'} />
      ) : (
        <div className="admin-card admin-card--form">
          <AdminEditMatchForm match={match} />
        </div>
      )}
    </>
  );
}
