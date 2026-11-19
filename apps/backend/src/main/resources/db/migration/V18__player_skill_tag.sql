-- Optional public profile badge: beginner | professional | superstar | legend (admin-set).

ALTER TABLE players
    ADD COLUMN IF NOT EXISTS skill_tag TEXT;

ALTER TABLE players
    DROP CONSTRAINT IF EXISTS players_skill_tag_check;

ALTER TABLE players
    ADD CONSTRAINT players_skill_tag_check
    CHECK (skill_tag IS NULL OR skill_tag IN ('beginner', 'professional', 'superstar', 'legend'));