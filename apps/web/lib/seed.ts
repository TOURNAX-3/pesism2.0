import type { Match, PlayerId } from '@tournax/core';
import { roundRobin } from '@tournax/core';

export interface SeedPlayer {
  id: PlayerId;
  name: string;
  tag: string;
  city: string;
  platform: 'PlayStation' | 'Xbox' | 'PC';
}

export const KNOCKOUT_QUALIFIERS = 8;

export const PLAYERS: SeedPlayer[] = [
  { id: 'arjun', name: 'Arjun Menon', tag: 'ArjunFC', city: 'Kochi', platform: 'PlayStation' },
  { id: 'rahul', name: 'Rahul Verma', tag: 'R_Verma10', city: 'Delhi', platform: 'PlayStation' },
  { id: 'sameer', name: 'Sameer Khan', tag: 'SK_Maestro', city: 'Mumbai', platform: 'PC' },
  { id: 'faiz', name: 'Faiz Rahman', tag: 'FaizTheWall', city: 'Bengaluru', platform: 'PlayStation' },
  { id: 'nikhil', name: 'Nikhil Rao', tag: 'NikTiki', city: 'Hyderabad', platform: 'Xbox' },
  { id: 'imran', name: 'Imran Sheikh', tag: 'ImranCurler', city: 'Kozhikode', platform: 'PC' },
  { id: 'vivek', name: 'Vivek Nair', tag: 'VNair_07', city: 'Chennai', platform: 'PlayStation' },
  { id: 'kiran', name: 'Kiran Das', tag: 'KDasStrike', city: 'Kolkata', platform: 'PC' },
];

export const PLAYER_IDS: PlayerId[] = PLAYERS.map(p => p.id);

export function getPlayer(id: PlayerId): SeedPlayer | undefined {
  return PLAYERS.find(p => p.id === id);
}

// Deterministic, varied scorelines for the played matchdays below.
// Not meant to reproduce any particular table shape, just plausible results
// for computeStandings/topScorers to run on until Season 3 kicks off for real.
const SCORELINES: Array<[number, number]> = [
  [3, 1], [2, 0], [1, 1], [0, 2], [2, 1], [1, 0], [3, 2], [0, 0],
  [1, 2], [4, 1], [2, 2], [1, 0], [0, 1], [3, 0], [2, 1], [1, 3],
  [2, 0], [1, 1], [0, 0], [3, 1], [1, 2], [2, 3], [1, 0], [2, 2],
];

const MATCHDAYS = roundRobin(PLAYER_IDS);
const PLAYED_MATCHDAYS = 6;

let scoreIndex = 0;

export const MATCHES: Match[] = MATCHDAYS.flatMap((day, dayIndex) => {
  const matchday = dayIndex + 1;
  const played = matchday <= PLAYED_MATCHDAYS;
  return day.map((pairing, i): Match => {
    const [homeGoals, awayGoals] = played ? SCORELINES[scoreIndex++ % SCORELINES.length] : [null, null];
    return {
      id: `md${matchday}-${i}`,
      matchday,
      homeId: pairing.home,
      awayId: pairing.away,
      homeGoals,
      awayGoals,
      status: played ? 'confirmed' : 'scheduled',
    };
  });
});
