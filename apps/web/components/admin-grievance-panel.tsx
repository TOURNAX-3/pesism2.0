'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { addGrievanceCommentAction, updateGrievanceStatusAction } from '@/app/admin/actions';
import type { GrievanceDetail, GrievanceStatus } from '@/lib/tournax-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

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
      <Card>
        <CardContent>
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
        </CardContent>
      </Card>

      <Card style={{ marginTop: '1.25rem' }}>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="admin-form__row">
            <Label>
              Committee decision
              <Select value={status} onValueChange={(v) => setStatus(v as GrievanceStatus)} disabled={busy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Label>
          </div>
          <Button type="button" disabled={busy || status === grievance.status} onClick={saveStatus}>
            Update status
          </Button>
        </CardContent>
      </Card>

      <Card style={{ marginTop: '1.25rem' }}>
        <CardHeader>
          <CardTitle>Admin comments</CardTitle>
        </CardHeader>
        <CardContent>
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

          <form onSubmit={postComment} style={{ marginTop: '1rem', display: 'grid', gap: '0.6rem' }}>
            <Label htmlFor="grievance-comment">Add comment (visible to admins only for now)</Label>
            <Textarea
              id="grievance-comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={busy}
            />
            <Button type="submit" variant="ghost" disabled={busy || !comment.trim()}>
              {busy ? 'Saving…' : 'Post comment'}
            </Button>
          </form>
          {error ? <p className="admin-login-error">{error}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
