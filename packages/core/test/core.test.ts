import { test } from 'node:test';
import assert from 'node:assert/strict';
import { roundRobin, computeStandings, rankGroup, topScorers, parseScoreCommand, normaliseNumber, type Match, type StandingRow } from '../src/index.ts';

test('round robin: everyone meets everyone exactly once', () => {
  const players = ['a', 'b', 'c', 'd', 'e', 'f'];
  const days = roundRobin(players);
  assert.equal(days.length, 5);
  const seen = new Set<string>();
  for (const day of days) {
    const inDay = new Set<string>();
    for (const { home, away } of day) {
      assert.ok(!inDay.has(home) && !inDay.has(away), 'nobody plays twice in a matchday');
      inDay.add(home); inDay.add(away);
      seen.add([home, away].sort().join('-'));
    }
  }
  assert.equal(seen.size, 15);
});

test('round robin: odd count gives one bye per matchday', () => {
  const days = roundRobin(['a', 'b', 'c', 'd', 'e']);
  assert.equal(days.length, 5);
  for (const day of days) assert.equal(day.length, 2);
});

test('round robin: double round mirrors home and away', () => {
  const days = roundRobin(['a', 'b', 'c', 'd'], { doubleRound: true });
  assert.equal(days.length, 6);
  assert.deepEqual(days[3]![0], { home: days[0]![0]!.away, away: days[0]![0]!.home });
});

const m = (id: string, md: number, h: string, a: string, hg: number | null, ag: number | null, status: Match['status'] = 'confirmed'): Match =>
  ({ id, matchday: md, homeId: h, awayId: a, homeGoals: hg, awayGoals: ag, status });

test('standings: points, goal difference and ignored statuses', () => {
  const table = computeStandings(['a', 'b', 'c'], [
    m('1', 1, 'a', 'b', 3, 1),
    m('2', 2, 'b', 'c', 2, 2),
    m('3', 3, 'c', 'a', 0, 1),
    m('4', 4, 'a', 'c', 9, 0, 'pending_confirmation'), // must not count
  ]);
  assert.deepEqual(table.map(r => r.playerId), ['a', 'b', 'c']);
  assert.equal(table[0]!.points, 6);
  assert.equal(table[0]!.goalDiff, 3);
  assert.deepEqual(table[0]!.form, ['W', 'W']);
});

test('standings: goals scored ranks above goal difference', () => {
  const table = computeStandings(['a', 'b', 'c'], [
    m('1', 1, 'a', 'c', 6, 5),
    m('2', 2, 'b', 'c', 2, 0),
    m('3', 3, 'a', 'b', 1, 1),
  ]);
  const a = table.find((r) => r.playerId === 'a')!;
  const b = table.find((r) => r.playerId === 'b')!;
  assert.equal(a.points, b.points);
  assert.ok(a.goalsFor > b.goalsFor);
  assert.ok(a.goalDiff < b.goalDiff);
  assert.ok(table.findIndex((r) => r.playerId === 'a') < table.findIndex((r) => r.playerId === 'b'));
});

test('standings: fewer goals conceded after goals scored', () => {
  const table = computeStandings(['a', 'b', 'c'], [
    m('1', 1, 'a', 'c', 3, 1),
    m('2', 2, 'b', 'c', 3, 2),
    m('3', 3, 'a', 'b', 0, 0),
  ]);
  assert.equal(table[0]!.playerId, 'a');
  assert.equal(table[0]!.goalsFor, 3);
  assert.equal(table[0]!.goalsAgainst, 1);
});

test('standings: head to head breaks a full tie', () => {
  // a and b: same points, GD and GF. a beat b directly.
  const table = computeStandings(['a', 'b', 'c', 'd'], [
    m('1', 1, 'a', 'b', 2, 1),
    m('2', 2, 'b', 'c', 2, 1),
    m('3', 3, 'c', 'a', 2, 1),
    m('4', 4, 'd', 'a', 0, 1),
    m('5', 5, 'd', 'b', 0, 1),
  ]);
  const a = table.findIndex(r => r.playerId === 'a');
  const b = table.findIndex(r => r.playerId === 'b');
  assert.equal(table[a]!.points, table[b]!.points);
  assert.ok(a < b);
});

test('rankGroup: goals conceded outranks goal difference (group tie-break differs from the league order)', () => {
  // Same points for both. a has the worse goal difference (+2 vs +3) but more goals scored
  // (5 vs 4) and rankGroup checks goals scored before conceded/goal-difference, so a ranks first —
  // the opposite of what computeStandings's points/goalDiff/goalsFor order would produce.
  const rows: StandingRow[] = [
    { playerId: 'a', played: 2, won: 1, drawn: 1, lost: 0, goalsFor: 5, goalsAgainst: 3, goalDiff: 2, points: 4, form: [] },
    { playerId: 'b', played: 2, won: 1, drawn: 1, lost: 0, goalsFor: 4, goalsAgainst: 1, goalDiff: 3, points: 4, form: [] },
  ];
  const ranked = rankGroup(rows, []);
  assert.deepEqual(ranked.map(r => r.playerId), ['a', 'b']);
});

test('rankGroup: head-to-head points tied, falls through to head-to-head goal difference', () => {
  // Equal points, goals for and goals against overall. Across their own two meetings a and b
  // split the points evenly (one win each), so head-to-head points also tie — the decider is
  // head-to-head goal difference: a is +2 (won 3-0, lost 0-1), b is -2.
  const rows: StandingRow[] = [
    { playerId: 'a', played: 2, won: 1, drawn: 0, lost: 1, goalsFor: 4, goalsAgainst: 2, goalDiff: 2, points: 3, form: [] },
    { playerId: 'b', played: 2, won: 1, drawn: 0, lost: 1, goalsFor: 4, goalsAgainst: 2, goalDiff: 2, points: 3, form: [] },
  ];
  const matches = [m('1', 1, 'a', 'b', 3, 0), m('2', 2, 'b', 'a', 1, 0)];
  const ranked = rankGroup(rows, matches);
  assert.deepEqual(ranked.map(r => r.playerId), ['a', 'b']);
});

test('top scorers counts goals from counted matches only', () => {
  const list = topScorers(['a', 'b'], [m('1', 1, 'a', 'b', 4, 2), m('2', 2, 'b', 'a', 3, 0, 'disputed')]);
  assert.deepEqual(list, [{ playerId: 'a', goals: 4 }, { playerId: 'b', goals: 2 }]);
});

test('score command parsing', () => {
  assert.deepEqual(parseScoreCommand('!r 3-1 @919876543210'), { senderGoals: 3, opponentGoals: 1 });
  assert.deepEqual(parseScoreCommand('!R 0–0'), { senderGoals: 0, opponentGoals: 0 });
  assert.deepEqual(parseScoreCommand('  !r 10:9 @x'), { senderGoals: 10, opponentGoals: 9 });
  assert.equal(parseScoreCommand('!r three-one'), null);
  assert.equal(parseScoreCommand('good game, 3-1'), null);
  assert.equal(parseScoreCommand('!r 3-1abc'), null);
});

test('number normalisation', () => {
  assert.equal(normaliseNumber('919876543210@s.whatsapp.net'), '919876543210');
  assert.equal(normaliseNumber('919876543210:12@s.whatsapp.net'), '919876543210');
  assert.equal(normaliseNumber('+91 98765 43210'), '919876543210');
});
