import type { MatchStatsInput } from '@/lib/tournax-api';

export const MATCH_STAT_ROWS: Array<{
  key: keyof MatchStatsInput;
  awayKey: keyof MatchStatsInput;
  label: string;
}> = [
  { key: 'homePossessionPct', awayKey: 'awayPossessionPct', label: 'Possession %' },
  { key: 'homeShots', awayKey: 'awayShots', label: 'Shots' },
  { key: 'homeShotsOnTarget', awayKey: 'awayShotsOnTarget', label: 'Shots on target' },
  { key: 'homeFouls', awayKey: 'awayFouls', label: 'Fouls' },
  { key: 'homeOffsides', awayKey: 'awayOffsides', label: 'Offsides' },
  { key: 'homeCornerKicks', awayKey: 'awayCornerKicks', label: 'Corner kicks' },
  { key: 'homeFreeKicks', awayKey: 'awayFreeKicks', label: 'Free kicks' },
  { key: 'homePasses', awayKey: 'awayPasses', label: 'Passes' },
  { key: 'homeSuccessfulPasses', awayKey: 'awaySuccessfulPasses', label: 'Successful passes' },
  { key: 'homeCrosses', awayKey: 'awayCrosses', label: 'Crosses' },
  { key: 'homeInterceptions', awayKey: 'awayInterceptions', label: 'Interceptions' },
  { key: 'homeTackles', awayKey: 'awayTackles', label: 'Tackles' },
  { key: 'homeSaves', awayKey: 'awaySaves', label: 'Saves' },
];
