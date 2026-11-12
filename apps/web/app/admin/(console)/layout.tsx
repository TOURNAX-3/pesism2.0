import Link from 'next/link';
import { AdminNav } from '@/components/admin-nav';
import { LiveCompetitionRefresh } from '@/components/live-competition-refresh';
import { logoutAction } from '../login/actions';

export default function AdminConsoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <Link href="/admin" className="admin-brand" title="TOURNAX admin">
          TOURNAX <span>admin</span>
        </Link>
        <AdminNav />
        <form action={logoutAction}>
          <button type="submit" className="admin-btn admin-btn--ghost">
            Log out
          </button>
        </form>
      </header>
      <div className="admin-main">{children}</div>
      <LiveCompetitionRefresh />
    </div>
  );
}
