'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { addGrievanceCommentAction, updateGrievanceStatusAction } from '@/app/admin/actions';
import type { GrievanceDetail, GrievanceStatus } from '@/lib/tournax-api';

const STATUS: { value: GrievanceStatus; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'in_review', label: 'In review' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'rejected', label: 'Rejected' },
];

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

export function AdminGrievancePanel({ grievance }: { grievance: GrievanceDetail }) {
  const router = useRouter();
  const [status, setStatus] = useState<GrievanceStatus>(grievance.status);
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStatus(grievance.status);
  }, [grievance.status]);

  async function saveStatus() {
    setBusy(true);
    setError(null);
    try {
      await updateGrievanceStatusAction(grievance.id, status);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update status');
    } finally {
      setBusy(false);
    }
  }

  async function postComment(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await addGrievanceCommentAction(grievance.id, comment.trim());
      setComment('');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add comment');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-grievance">
      <div className="admin-card">
        <p className="admin-muted">
          <strong>{grievance.playerName}</strong> · {grievance.playerEmail} · {grievance.playerWaNumber}
        </p>
        <p className="admin-muted" style={{ marginTop: '0.5rem' }}>
          Filed {formatWhen(grievance.createdAt)} · Category: {grievance.category}
        </p>
        <h3 className="admin-standings-title" style={{ marginTop: '1.25rem' }}>
          {grievance.subject}
        </h3>
        <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.55 }}>{grievance.message}</p>
      </div>

      <div className="admin-card admin-card--form" style={{ marginTop: '1.25rem' }}>
        <h3 className="admin-standings-title" style={{ marginTop: 0 }}>
          Status
        </h3>
        <div className="admin-form__row">
          <label>
            Committee decision
            <select value={status} onChange={(e) => setStatus(e.target.value as GrievanceStatus)} disabled={busy}>
              {STATUS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button type="button" className="admin-btn" disabled={busy || status === grievance.status} onClick={saveStatus}>
          Update status
        </button>
      </div>

      <div className="admin-card" style={{ marginTop: '1.25rem' }}>
        <h3 className="admin-standings-title" style={{ marginTop: 0 }}>
          Admin comments
        </h3>
        {grievance.comments.length ? (
          <ul className="admin-grievance__thread">
            {grievance.comments.map((c) => (
              <li key={c.id}>
                <time className="admin-muted" dateTime={c.createdAt}>
                  {formatWhen(c.createdAt)}
                </time>
                <p>{c.body}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="admin-muted">No committee notes yet.</p>
        )}

        <form className="admin-form" onSubmit={postComment} style={{ marginTop: '1rem' }}>
          <label>
            Add comment (visible to admins only for now)
            <textarea rows={4} value={comment} onChange={(e) => setComment(e.target.value)} disabled={busy} />
          </label>
          <button type="submit" className="admin-btn admin-btn--ghost" disabled={busy || !comment.trim()}>
            {busy ? 'Saving…' : 'Post comment'}
          </button>
        </form>
        {error ? <p className="admin-login-error">{error}</p> : null}
      </div>
    </div>
  );
}
