import { normalizeSkillTag, PLAYER_SKILL_TAG_LABELS } from '@/lib/player-skill-tag';

type Placement = 'inline' | 'media';

export function PlayerSkillTagBadge({
  tag,
  className,
  placement = 'inline',
  size = 'md',
}: {
  tag: string | null | undefined;
  className?: string;
  placement?: Placement;
  size?: 'sm' | 'md' | 'lg';
}) {
  const variant = normalizeSkillTag(tag);
  if (!variant) return null;
  return (
    <span
      className={[
        'player-skill-tag',
        `player-skill-tag--${variant}`,
        `player-skill-tag--${placement}`,
        `player-skill-tag--size-${size}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={`Skill tier: ${PLAYER_SKILL_TAG_LABELS[variant]}`}
    >
      <span className="player-skill-tag__label">{PLAYER_SKILL_TAG_LABELS[variant]}</span>
    </span>
  );
}