import type { CSSProperties } from 'react';

export function TopScorers({
  scorers,
  playerNames,
}: {
  scorers: Array<{ playerId: string; goals: number }>;
  playerNames: Record<string, string>;
}) {
  const top = Math.max(1, ...scorers.map(s => s.goals));
  return (
    <ol className="scorers" data-split>
      {scorers.map((s, i) => (
        <li className="scorer" key={s.playerId}>
          <span className="scorer__pos">{String(i + 1).padStart(2, '0')}</span>
          <span className="scorer__name">{playerNames[s.playerId] ?? s.playerId}</span>
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
