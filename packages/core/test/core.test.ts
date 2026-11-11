import { test } from 'node:test';
import assert from 'node:assert/strict';
import { roundRobin, computeStandings, topScorers, parseScoreCommand, normaliseNumber, type Match } from '../src/index.ts';

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
  assert.deepEqual(table.map(r => r.playerId), ['a', 'c', 'b']);
  assert.equal(table[0]!.points, 6);
  assert.equal(table[0]!.goalDiff, 3);
  assert.deepEqual(table[0]!.form, ['W', 'W']);
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
