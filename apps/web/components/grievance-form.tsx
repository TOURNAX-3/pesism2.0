'use client';

import { useState } from 'react';
import type { GrievanceCategory } from '@/lib/tournax-api';
import { Button } from '@/components/ui/button';

const CATEGORIES: { value: GrievanceCategory; label: string }[] = [
  { value: 'committee', label: 'Game committee' },
  { value: 'admin', label: 'Tournament admin' },
  { value: 'opponent', label: 'Opponent / fair play' },
  { value: 'scheduling', label: 'Fixtures / scheduling' },
  { value: 'other', label: 'Other' },
];

export function GrievanceForm() {
  const [waNumber, setWaNumber] = useState('');
  const [category, setCategory] = useState<GrievanceCategory>('committee');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setDone(null);
    setBusy(true);
    try {
      const digits = waNumber.replace(/\D/g, '');
      const res = await fetch('/api/grievance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          waNumber: digits,
          category,
          subject,
          message,
          website: '',
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) {
        throw new Error(data.message ?? 'Could not submit.');
      }
      setDone(data.message ?? 'Submitted. The committee will review your grievance.');
      setSubject('');
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form grievance-form" onSubmit={onSubmit} noValidate>
      <p className="form__fine field--full" style={{ maxWidth: 'none', marginBottom: '0.5rem' }}>
        Approved Season 3 players only. Use the same WhatsApp number you registered with.
      </p>
      <div className="field">
        <label htmlFor="g-wa">WhatsApp number</label>
        <input
          id="g-wa"
          type="tel"
          inputMode="tel"
          required
          value={waNumber}
          onChange={(e) => setWaNumber(e.target.value)}
          placeholder="9188296027"
        />
      </div>
      <div className="field">
        <label htmlFor="g-cat">Issue is about</label>
        <select id="g-cat" required value={category} onChange={(e) => setCategory(e.target.value as GrievanceCategory)}>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div className="field field--full">
        <label htmlFor="g-subject">Subject</label>
        <input
          id="g-subject"
          type="text"
          required
          maxLength={200}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Short summary"
        />
      </div>
      <div className="field field--full">
        <label htmlFor="g-msg">Details</label>
        <textarea id="g-msg" required rows={6} maxLength={4000} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="What happened? What outcome do you want?" />
      </div>
      <input className="sr-only" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {done ? <p className="field--full" style={{ color: 'var(--color-success, #7dffb0)' }}>{done}</p> : null}
      {error ? <p className="field--full admin-login-error" style={{ margin: 0 }}>{error}</p> : null}
      <div className="form__foot field--full">
        <Button className="btn btn--primary" type="submit" disabled={busy}>
          {busy ? 'Sending…' : 'Submit grievance'}
        </Button>
      </div>
    </form>
  );
}
