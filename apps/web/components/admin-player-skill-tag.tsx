'use client';

import { useEffect, useState, useTransition } from 'react';
import { updatePlayerSkillTagAction } from '@/app/admin/actions';
import { PlayerSkillTagBadge } from '@/components/player-skill-tag';
import { normalizeSkillTag, PLAYER_SKILL_TAGS, PLAYER_SKILL_TAG_LABELS, type PlayerSkillTag } from '@/lib/player-skill-tag';

export function AdminPlayerSkillTag({
  playerId,
  skillTag,
}: {
  playerId: string;
  skillTag: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState(normalizeSkillTag(skillTag) ?? '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setValue(normalizeSkillTag(skillTag) ?? '');
  }, [skillTag]);

  function onChange(next: string) {
    setValue(next);
    setError(null);
    startTransition(async () => {
      try {
        await updatePlayerSkillTagAction(playerId, next === '' ? null : next);
      } catch (e) {
        setValue(normalizeSkillTag(skillTag) ?? '');
        setError(e instanceof Error ? e.message : 'Could not save tag — is the API running?');
      }
    });
  }

  const preview = normalizeSkillTag(value);

  return (
    <div className="admin-skill-tag-cell">
      {preview ? <PlayerSkillTagBadge tag={preview} size="sm" className="admin-skill-tag-preview" /> : null}
      <select
        className="admin-skill-tag-select"
        name="skillTag"
        value={value}
        disabled={pending}
        aria-label="Player skill tag"
        aria-invalid={error ? true : undefined}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">No tag</option>
        {PLAYER_SKILL_TAGS.map((tag) => (
          <option key={tag} value={tag}>
            {PLAYER_SKILL_TAG_LABELS[tag satisfies PlayerSkillTag]}
          </option>
        ))}
      </select>
      {error ? <span className="admin-skill-tag-error">{error}</span> : null}
    </div>
  );
}