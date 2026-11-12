'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { recordMatchAction } from '@/app/admin/actions';
import type { AdminMatchRow, MatchStatsInput } from '@/lib/tournax-api';
import { MatchStatsFields } from '@/components/match-stats-fields';

export function AdminRecordMatchForm({ scheduled }: { scheduled: AdminMatchRow[] }) {
  const router = useRouter();
  const unplayed = useMemo(() => scheduled.filter((m) => m.status === 'scheduled'), [scheduled]);

  const [matchId, setMatchId] = useState('');
  const [homeGoals, setHomeGoals] = useState('0');
  const [awayGoals, setAwayGoals] = useState('0');
  const [stats, setStats] = useState<MatchStatsInput>({});
  const [includeStats, setIncludeStats] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const selected = unplayed.find((m) => m.id === matchId);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(null);
    if (!selected) {
      setError('Pick a scheduled fixture from the list.');
      return;
    }
    setBusy(true);
    try {
      const row = await recordMatchAction({
        matchId: selected.id,
        matchday: selected.matchday,
        homePlayerId: selected.homePlayerId,
        awayPlayerId: selected.awayPlayerId,
        homeGoals: Number(homeGoals),
        awayGoals: Number(awayGoals),
        stats: includeStats ? stats : undefined,
      });
      setSaved(`Saved: MD${row.matchday} ${row.homeName} ${row.homeGoals}–${row.awayGoals} ${row.awayName}`);
      router.refresh();
      setMatchId('');
      setHomeGoals('0');
      setAwayGoals('0');
      setStats({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save result');
    } finally {
      setBusy(false);
    }
  }

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

  if (!unplayed.length) {
    return (
      <p className="admin-muted">
        No unplayed fixtures. Add pairings under <a href="/admin/schedule">Fixtures</a> first, then enter scores here.
      </p>
    );
  }

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <label>
        Scheduled fixture
        <select required value={matchId} onChange={(e) => setMatchId(e.target.value)}>
          <option value="">Select a fixture…</option>
          {unplayed.map((m) => (
            <option key={m.id} value={m.id}>
              MD{m.matchday}: {m.homeName} vs {m.awayName}
            </option>
          ))}
        </select>
      </label>

      <div className="admin-form__row">
        <label>
          Home goals{selected ? ` (${selected.homeName})` : ''}
          <input type="number" min={0} required value={homeGoals} onChange={(e) => setHomeGoals(e.target.value)} />
        </label>
        <label>
          Away goals{selected ? ` (${selected.awayName})` : ''}
          <input type="number" min={0} required value={awayGoals} onChange={(e) => setAwayGoals(e.target.value)} />
        </label>
      </div>

      <label className="admin-check">
        <input type="checkbox" checked={includeStats} onChange={(e) => setIncludeStats(e.target.checked)} />
        Include in-game score sheet stats
      </label>

      {includeStats ? (
        <MatchStatsFields
          stats={stats}
          onChange={setStat}
          homeLabel={selected?.homeName}
          awayLabel={selected?.awayName}
        />
      ) : null}

      {saved ? <p className="admin-muted" style={{ color: '#7dffb0' }}>{saved}</p> : null}
      {error ? <p className="admin-login-error">{error}</p> : null}

      <button type="submit" className="admin-btn" disabled={busy || !matchId}>
        {busy ? 'Saving…' : 'Save result'}
      </button>
    </form>
  );
}
