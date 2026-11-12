CREATE TYPE match_stage AS ENUM ('league', 'quarter_final', 'semi_final', 'third_place', 'grand_final');
CREATE TYPE match_status AS ENUM (
    'scheduled',
    'pending_confirmation',
    'confirmed',
    'disputed',
    'resolved',
    'forfeit'
);

CREATE TABLE matchdays (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID NOT NULL REFERENCES tournaments (id) ON DELETE CASCADE,
    number        INT NOT NULL,
    stage         match_stage NOT NULL DEFAULT 'league',
    UNIQUE (tournament_id, number)
);

CREATE TABLE matches (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID NOT NULL REFERENCES tournaments (id) ON DELETE CASCADE,
    matchday_id   UUID NOT NULL REFERENCES matchdays (id) ON DELETE CASCADE,
    stage         match_stage NOT NULL DEFAULT 'league',
    home_id       UUID NOT NULL REFERENCES players (id),
    away_id       UUID NOT NULL REFERENCES players (id),
    home_goals    INT CHECK (home_goals >= 0),
    away_goals    INT CHECK (away_goals >= 0),
    status        match_status NOT NULL DEFAULT 'scheduled',
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (home_id <> away_id)
);

CREATE INDEX matches_tournament_status_idx ON matches (tournament_id, status);
CREATE INDEX matches_home_id_idx ON matches (home_id);
CREATE INDEX matches_away_id_idx ON matches (away_id);

-- Post-match stats from the in-game score sheet (optional, per match)
CREATE TABLE match_stats (
    match_id                 UUID PRIMARY KEY REFERENCES matches (id) ON DELETE CASCADE,
    home_possession_pct      SMALLINT CHECK (home_possession_pct BETWEEN 0 AND 100),
    away_possession_pct      SMALLINT CHECK (away_possession_pct BETWEEN 0 AND 100),
    home_shots               INT CHECK (home_shots >= 0),
    away_shots               INT CHECK (away_shots >= 0),
    home_shots_on_target     INT CHECK (home_shots_on_target >= 0),
    away_shots_on_target     INT CHECK (away_shots_on_target >= 0),
    home_fouls               INT CHECK (home_fouls >= 0),
    away_fouls               INT CHECK (away_fouls >= 0),
    home_offsides            INT CHECK (home_offsides >= 0),
    away_offsides            INT CHECK (away_offsides >= 0),
    home_corner_kicks        INT CHECK (home_corner_kicks >= 0),
    away_corner_kicks        INT CHECK (away_corner_kicks >= 0),
    home_free_kicks          INT CHECK (home_free_kicks >= 0),
    away_free_kicks          INT CHECK (away_free_kicks >= 0),
    home_passes              INT CHECK (home_passes >= 0),
    away_passes                INT CHECK (away_passes >= 0),
    home_successful_passes     INT CHECK (home_successful_passes >= 0),
    away_successful_passes     INT CHECK (away_successful_passes >= 0),
    home_crosses               INT CHECK (home_crosses >= 0),
    away_crosses               INT CHECK (away_crosses >= 0),
    home_interceptions         INT CHECK (home_interceptions >= 0),
    away_interceptions         INT CHECK (away_interceptions >= 0),
    home_tackles               INT CHECK (home_tackles >= 0),
    away_tackles               INT CHECK (away_tackles >= 0),
    home_saves                 INT CHECK (home_saves >= 0),
    away_saves                 INT CHECK (away_saves >= 0)
);

CREATE TABLE audit_log (
    id         BIGSERIAL PRIMARY KEY,
    action     TEXT NOT NULL,
    entity     TEXT NOT NULL,
    entity_id  UUID,
    before     JSONB,
    after      JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
