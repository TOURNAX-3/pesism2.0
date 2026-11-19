CREATE TABLE sponsors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    product_url TEXT,
    logo_url TEXT,
    banner_active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX sponsors_tournament_id_idx ON sponsors (tournament_id);

-- At most one home ticker sponsor per tournament.
CREATE UNIQUE INDEX sponsors_one_banner_per_tournament
    ON sponsors (tournament_id)
    WHERE banner_active = TRUE;