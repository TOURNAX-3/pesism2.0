import { computeStandings, topScorers } from '@tournax/core';
import type { SeasonCompetition } from './season-competition';
import { isCountedMatch } from './matchday-status';

export type LastSeasonRecap = {
  champion: string;
  topScorer: { name: string; goals: number };
  biggestWin: { winner: string; loser: string; winnerGoals: number; loserGoals: number };
  mostDraws: { name: string; draws: number };
  totalMatches: number;
  totalGoals: number;
};

/** Derives a last-season recap purely from real match data — never fabricated. Returns null if there's nothing to recap. */
export function computeLastSeasonRecap(competition: SeasonCompetition): LastSeasonRecap | null {
  const playerIds = competition.players.map((p) => p.id);
  const names = competition.playerNames;
  const counted = competition.matches.filter(isCountedMatch);
  if (!counted.length) return null;

  const table = computeStandings(playerIds, competition.matches, competition.points);
  const scorers = topScorers(playerIds, competition.matches);
  if (!table.length || !scorers.length) return null;

  let biggest = counted[0];
  let biggestMargin = -1;
  for (const m of counted) {
    const margin = Math.abs((m.homeGoals ?? 0) - (m.awayGoals ?? 0));
    if (margin > biggestMargin) {
      biggestMargin = margin;
      biggest = m;
    }
  }
  const homeWon = (biggest.homeGoals ?? 0) >= (biggest.awayGoals ?? 0);

  const mostDrawsRow = [...table].sort((a, b) => b.drawn - a.drawn)[0];
  const totalGoals = counted.reduce((n, m) => n + (m.homeGoals ?? 0) + (m.awayGoals ?? 0), 0);

  return {
    champion: names[table[0].playerId] ?? table[0].playerId,
    topScorer: { name: names[scorers[0].playerId] ?? scorers[0].playerId, goals: scorers[0].goals },
    biggestWin: {
      winner: names[homeWon ? biggest.homeId : biggest.awayId] ?? '',
      loser: names[homeWon ? biggest.awayId : biggest.homeId] ?? '',
      winnerGoals: Math.max(biggest.homeGoals ?? 0, biggest.awayGoals ?? 0),
      loserGoals: Math.min(biggest.homeGoals ?? 0, biggest.awayGoals ?? 0),
    },
    mostDraws: { name: names[mostDrawsRow.playerId] ?? mostDrawsRow.playerId, draws: mostDrawsRow.drawn },
    totalMatches: counted.length,
    totalGoals,
  };
}
