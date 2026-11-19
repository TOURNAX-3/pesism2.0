export const PLAYER_SKILL_TAGS = ['beginner', 'professional', 'superstar', 'legend'] as const;

export type PlayerSkillTag = (typeof PLAYER_SKILL_TAGS)[number];

export const PLAYER_SKILL_TAG_LABELS: Record<PlayerSkillTag, string> = {
  beginner: 'Beginner',
  professional: 'Professional',
  superstar: 'Superstar',
  legend: 'Legend',
};

export function isPlayerSkillTag(value: string | null | undefined): value is PlayerSkillTag {
  return value != null && PLAYER_SKILL_TAGS.includes(value as PlayerSkillTag);
}

/** DB / imports may use title case — badges and admin read paths normalize here. */
export function normalizeSkillTag(value: string | null | undefined): PlayerSkillTag | null {
  if (value == null || !value.trim()) return null;
  const v = value.trim().toLowerCase();
  return isPlayerSkillTag(v) ? v : null;
}