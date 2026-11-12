import type { Match, MatchStatus } from '@tournax/core';

const COUNTED = new Set<MatchStatus>(['confirmed', 'resolved', 'forfeit']);

export function isCountedMatch(
  match: Pick<Match, 'status' | 'homeGoals' | 'awayGoals'>,
): boolean {
  return COUNTED.has(match.status) && match.homeGoals !== null && match.awayGoals !== null;
}

export type MatchdayChip = {
  label: 'Scheduled' | 'In progress' | 'Completed';
  className: string;
};

/**
 * First matchday that is not fully played is the active round ("In progress"),
 * even before any score is in. Earlier days "Completed"; later days "Scheduled".
 */
export function matchdayChipsByNumber(
  matchdays: Array<[number, Match[]]>,
): Map<number, MatchdayChip> {
  const sorted = [...matchdays].sort((a, b) => a[0] - b[0]);
  const currentMd =
    sorted.find(([, matches]) => matches.length > 0 && !matches.every(isCountedMatch))?.[0] ?? null;

  const out = new Map<number, MatchdayChip>();
  for (const [md, matches] of sorted) {
    if (!matches.length) {
      out.set(md, { label: 'Scheduled', className: 'chip' });
      continue;
    }
    if (matches.every(isCountedMatch)) {
      out.set(md, { label: 'Completed', className: 'chip chip--done' });
    } else if (md === currentMd) {
      out.set(md, { label: 'In progress', className: 'chip chip--live' });
    } else {
      out.set(md, { label: 'Scheduled', className: 'chip' });
    }
  }
  return out;
}
