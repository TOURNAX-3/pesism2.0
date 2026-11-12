'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { updateMatchAction } from '@/app/admin/actions';
import type { AdminMatchDetail, MatchStatsInput } from '@/lib/tournax-api';
import { MatchStatsFields } from '@/components/match-stats-fields';

function statMapFromDetail(stats: MatchStatsInput | null | undefined): MatchStatsInput {
  return stats ? { ...stats } : {};
}

export function AdminEditMatchForm({ match }: { match: AdminMatchDetail }) {
  const router = useRouter();
  const [homeGoals, setHomeGoals] = useState(String(match.homeGoals));
  const [awayGoals, setAwayGoals] = useState(String(match.awayGoals));
  const [stats, setStats] = useState<MatchStatsInput>(() => statMapFromDetail(match.stats));
  const [includeStats, setIncludeStats] = useState(match.stats != null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function setStat(key: keyof MatchStatsInput, value: string) {
    setStats((prev) => {
      const next = { ...prev };
      if (value === '') {
        delete next[key];
      } else {
        next[key] = Number(value);
      }
      return next;
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setBusy(true);
    try {
      await updateMatchAction(match.id, {
        homeGoals: Number(homeGoals),
        awayGoals: Number(awayGoals),
        stats: includeStats ? stats : undefined,
      });
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save changes');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <p className="admin-muted">
        MD{match.matchday} · {match.homeName} vs {match.awayName}
      </p>

      <div className="admin-form__row">
        <label>
          {match.homeName} goals
          <input
            type="number"
            min={0}
            required
            value={homeGoals}
            onChange={(e) => setHomeGoals(e.target.value)}
          />
        </label>
        <label>
          {match.awayName} goals
          <input
            type="number"
            min={0}
            required
            value={awayGoals}
            onChange={(e) => setAwayGoals(e.target.value)}
          />
        </label>
      </div>

      <label className="admin-check">
        <input type="checkbox" checked={includeStats} onChange={(e) => setIncludeStats(e.target.checked)} />
        Include / edit score sheet stats
      </label>

      {includeStats ? (
        <MatchStatsFields stats={stats} onChange={setStat} homeLabel={match.homeName} awayLabel={match.awayName} />
      ) : (
        <p className="admin-muted">Unchecking removes stored stats for this match.</p>
      )}

      {saved ? <p className="admin-muted" style={{ color: '#7dffb0' }}>Saved.</p> : null}
      {error ? <p className="admin-login-error">{error}</p> : null}

      <div className="admin-registration-actions">
        <button type="submit" className="admin-btn" disabled={busy}>
          {busy ? 'Saving…' : 'Save changes'}
        </button>
        <Link href="/admin/fixtures" className="admin-btn admin-btn--ghost">
          Back to results
        </Link>
      </div>
    </form>
  );
}
