import type { Metadata } from 'next';
import { loginAction } from './actions';
import '../admin.css';

export const metadata: Metadata = {
  title: 'Admin login · TOURNAX',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = params.next ?? '/admin';
  const showError = params.error === '1';

  return (
    <div className="admin-shell admin-shell--center">
      <form className="admin-card admin-login" action={loginAction}>
        <p className="admin-eyebrow">Staff only</p>
        <h1>TOURNAX admin</h1>
        <p className="admin-muted">Not linked from the public site.</p>
        {showError ? <p className="admin-login-error">Wrong password.</p> : null}
        <input type="hidden" name="next" value={next} />
        <label className="admin-field">
          <span>Password</span>
          <input type="password" name="password" required autoComplete="current-password" />
        </label>
        <button type="submit" className="admin-btn admin-btn--primary">
          Sign in
        </button>
        <p className="admin-muted" style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
          Default dev password: <code>tournax-dev</code> (set <code>ADMIN_PASSWORD</code> in <code>.env.local</code>)
        </p>
      </form>
    </div>
  );
}

