-- Core schema aligned with supabase/migrations/0001_init.sql (extended for web registration)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE tournament_format AS ENUM ('league', 'league_knockout', 'knockout');
CREATE TYPE tournament_status AS ENUM ('draft', 'registration', 'league', 'knockout', 'finished');

CREATE TABLE players (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    wa_number       TEXT NOT NULL,
    email           TEXT NOT NULL,
    gaming_username TEXT NOT NULL,
    efootball_id    TEXT,
    city            TEXT,
    is_admin        BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT players_wa_number_digits CHECK (wa_number ~ '^[0-9]+$'),
    CONSTRAINT players_wa_number_unique UNIQUE (wa_number),
    CONSTRAINT players_email_unique UNIQUE (email)
);

CREATE TABLE tournaments (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                    TEXT NOT NULL,
    season                  INT NOT NULL,
    format                  tournament_format NOT NULL DEFAULT 'league_knockout',
    status                  tournament_status NOT NULL DEFAULT 'draft',
    points_win              INT NOT NULL DEFAULT 3,
    points_draw             INT NOT NULL DEFAULT 1,
    points_loss             INT NOT NULL DEFAULT 0,
    knockout_qualifiers     INT NOT NULL DEFAULT 4,
    double_round            BOOLEAN NOT NULL DEFAULT FALSE,
    max_players             INT,
    registration_opens_at   TIMESTAMPTZ,
    registration_closes_at  TIMESTAMPTZ,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE tournament_players (
    tournament_id UUID NOT NULL REFERENCES tournaments (id) ON DELETE CASCADE,
    player_id     UUID NOT NULL REFERENCES players (id) ON DELETE CASCADE,
    approved      BOOLEAN NOT NULL DEFAULT FALSE,
    seed          INT,
    joined_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (tournament_id, player_id)
);

CREATE INDEX tournament_players_tournament_idx ON tournament_players (tournament_id);

-- Season 3 placeholder (registration window set by admin / env seed)
INSERT INTO tournaments (
    id,
    name,
    season,
    status,
    max_players,
    registration_opens_at,
    registration_closes_at
) VALUES (
    'a0000000-0000-4000-8000-000000000003',
    'TOURNAX Season 3',
    3,
    'registration',
    10,
    NOW() - INTERVAL '1 day',
    NOW() + INTERVAL '30 days'
);
