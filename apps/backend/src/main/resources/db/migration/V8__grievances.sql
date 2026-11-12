CREATE TYPE grievance_status AS ENUM ('open', 'in_review', 'resolved', 'rejected');
CREATE TYPE grievance_category AS ENUM ('committee', 'admin', 'opponent', 'scheduling', 'other');

CREATE TABLE grievances (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id   UUID NOT NULL REFERENCES tournaments (id) ON DELETE CASCADE,
    player_id       UUID NOT NULL REFERENCES players (id) ON DELETE CASCADE,
    category        grievance_category NOT NULL,
    subject         TEXT NOT NULL,
    message         TEXT NOT NULL,
    status          grievance_status NOT NULL DEFAULT 'open',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX grievances_tournament_status_idx ON grievances (tournament_id, status, created_at DESC);

CREATE TABLE grievance_comments (
    id            BIGSERIAL PRIMARY KEY,
    grievance_id  UUID NOT NULL REFERENCES grievances (id) ON DELETE CASCADE,
    body          TEXT NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX grievance_comments_grievance_idx ON grievance_comments (grievance_id, created_at);
