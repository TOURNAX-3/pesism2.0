import type { Match, PlayerId, PointsRule, StandingRow } from './types.ts';

const COUNTS_IN_TABLE = new Set(['confirmed', 'resolved', 'forfeit']);

export const DEFAULT_POINTS: PointsRule = { win: 3, draw: 1, loss: 0 };

/**
 * League table from matches. Only confirmed, resolved and forfeit matches count.
 * Tiebreakers, in order: points, goal difference, goals scored,
 * head to head points between the tied players, then player id for a stable order.
 * The table is always derived, never stored, so it cannot drift out of sync.
 */
export function computeStandings(
  players: PlayerId[],
  matches: Match[],
  points: PointsRule = DEFAULT_POINTS,
): StandingRow[] {
  const rows = new Map<PlayerId, StandingRow>();
  for (const id of players) {
    rows.set(id, { playerId: id, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, form: [] });
  }

  const counted = matches
    .filter(m => COUNTS_IN_TABLE.has(m.status) && m.homeGoals !== null && m.awayGoals !== null)
    .sort((a, b) => a.matchday - b.matchday);

  for (const m of counted) {
    const home = rows.get(m.homeId);
    const away = rows.get(m.awayId);
    if (!home || !away) continue;
    apply(home, m.homeGoals!, m.awayGoals!, points);
    apply(away, m.awayGoals!, m.homeGoals!, points);
  }

  const table = [...rows.values()];
  table.sort((a, b) =>
    b.points - a.points ||
    b.goalDiff - a.goalDiff ||
    b.goalsFor - a.goalsFor ||
    headToHead(b.playerId, a.playerId, counted, points) ||
    a.playerId.localeCompare(b.playerId),
  );
  return table;
}

function apply(row: StandingRow, scored: number, conceded: number, points: PointsRule) {
  row.played++;
  row.goalsFor += scored;
  row.goalsAgainst += conceded;
  row.goalDiff = row.goalsFor - row.goalsAgainst;
  if (scored > conceded) { row.won++; row.points += points.win; row.form.push('W'); }
  else if (scored === conceded) { row.drawn++; row.points += points.draw; row.form.push('D'); }
  else { row.lost++; row.points += points.loss; row.form.push('L'); }
  if (row.form.length > 5) row.form.shift();
}

/** Positive when `a` took more points than `b` in their direct matches. */
function headToHead(a: PlayerId, b: PlayerId, matches: Match[], points: PointsRule): number {
  let pa = 0, pb = 0;
  for (const m of matches) {
    const isAB = m.homeId === a && m.awayId === b;
    const isBA = m.homeId === b && m.awayId === a;
    if (!isAB && !isBA) continue;
    const ga = isAB ? m.homeGoals! : m.awayGoals!;
    const gb = isAB ? m.awayGoals! : m.homeGoals!;
    if (ga > gb) pa += points.win; else if (ga < gb) pb += points.win; else { pa += points.draw; pb += points.draw; }
  }
  return pa - pb;
}

/**
 * Top scorer leaderboard: total goals each participant scored in counted matches.
 * Assumption to confirm with the organiser: "top scorer" means the participant, not an in game footballer.
 */
export function topScorers(players: PlayerId[], matches: Match[]): Array<{ playerId: PlayerId; goals: number }> {
  const goals = new Map(players.map(p => [p, 0]));
  for (const m of matches) {
    if (!COUNTS_IN_TABLE.has(m.status) || m.homeGoals === null || m.awayGoals === null) continue;
    if (goals.has(m.homeId)) goals.set(m.homeId, goals.get(m.homeId)! + m.homeGoals);
    if (goals.has(m.awayId)) goals.set(m.awayId, goals.get(m.awayId)! + m.awayGoals);
  }
  return [...goals.entries()]
    .map(([playerId, g]) => ({ playerId, goals: g }))
    .sort((a, b) => b.goals - a.goals || a.playerId.localeCompare(b.playerId));
}
