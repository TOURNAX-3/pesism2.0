export type PlayerId = string;

export type MatchStatus =
  | 'scheduled'            // fixture drawn, not played yet
  | 'pending_confirmation' // one player reported, waiting for the opponent
  | 'confirmed'            // both players agreed, counts in the table
  | 'disputed'             // opponent rejected, or no answer before the timeout
  | 'resolved'             // admin decided the score, counts in the table
  | 'forfeit';             // admin awarded the match, counts in the table

export interface Match {
  id: string;
  matchday: number;
  homeId: PlayerId;
  awayId: PlayerId;
  homeGoals: number | null;
  awayGoals: number | null;
  status: MatchStatus;
}

export interface StandingRow {
  playerId: PlayerId;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  form: Array<'W' | 'D' | 'L'>; // most recent last
}

export interface PointsRule {
  win: number;
  draw: number;
  loss: number;
}
