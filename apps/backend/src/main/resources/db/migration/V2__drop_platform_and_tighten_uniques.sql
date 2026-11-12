ALTER TABLE players DROP COLUMN IF EXISTS platform;

ALTER TABLE players
    ADD CONSTRAINT players_gaming_username_unique UNIQUE (gaming_username);
