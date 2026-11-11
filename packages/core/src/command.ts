/**
 * Parses the WhatsApp score command.
 *
 *   !r 3-1 @opponent
 *
 * The score is always from the sender's point of view (sender goals first).
 * The opponent is NOT read from the text: WhatsApp gives mentions as phone numbers
 * in the message metadata, and the bot passes those in separately.
 * Accepts "-", "–", ":" or "x" between the numbers, and optional spaces.
 */
export interface ScoreCommand {
  senderGoals: number;
  opponentGoals: number;
}

const SCORE_RE = /^!r\s+(\d{1,2})\s*[-–:x]\s*(\d{1,2})(?:\s|$)/i;

export function parseScoreCommand(text: string): ScoreCommand | null {
  const m = SCORE_RE.exec(text.trim());
  if (!m) return null;
  return { senderGoals: Number(m[1]), opponentGoals: Number(m[2]) };
}

/** Normalises a WhatsApp JID or a typed number to digits only, e.g. "919876543210". */
export function normaliseNumber(input: string): string {
  return input.split('@')[0]!.split(':')[0]!.replace(/\D/g, '');
}
