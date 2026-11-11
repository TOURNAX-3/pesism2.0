import type { CSSProperties } from 'react';
import { getPlayer } from '@/lib/seed';

export function TopScorers({ scorers }: { scorers: Array<{ playerId: string; goals: number }> }) {
  const top = Math.max(1, ...scorers.map(s => s.goals));
  return (
    <ol className="scorers" data-split>
      {scorers.map((s, i) => (
        <li className="scorer" key={s.playerId}>
          <span className="scorer__pos">{String(i + 1).padStart(2, '0')}</span>
          <span className="scorer__name">{getPlayer(s.playerId)?.name ?? s.playerId}</span>
          <span className="scorer__goals">
            {s.goals}
            <small>GLS</small>
          </span>
          <span className="scorer__bar" aria-hidden="true">
            <i style={{ '--w': (s.goals / top).toFixed(3) } as CSSProperties} />
          </span>
        </li>
      ))}
    </ol>
  );
}
