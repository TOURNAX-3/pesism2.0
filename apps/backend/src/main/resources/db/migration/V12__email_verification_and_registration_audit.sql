-- Email proof for registration (no WhatsApp bot). Append-only registration audit.

ALTER TABLE players
    ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMPTZ;

CREATE TABLE email_verification_challenges (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id     UUID NOT NULL REFERENCES players (id) ON DELETE CASCADE,
    tournament_id UUID NOT NULL REFERENCES tournaments (id) ON DELETE CASCADE,
    code_hash     TEXT NOT NULL,
    expires_at    TIMESTAMPTZ NOT NULL,
    attempt_count INT NOT NULL DEFAULT 0,
    last_sent_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX email_verification_challenges_player_idx
    ON email_verification_challenges (player_id, created_at DESC);

CREATE TABLE registration_audit_events (
    id              BIGSERIAL PRIMARY KEY,
    tournament_id   UUID REFERENCES tournaments (id) ON DELETE SET NULL,
    player_id       UUID REFERENCES players (id) ON DELETE SET NULL,
    event_type      TEXT NOT NULL,
    email           TEXT,
    ip_address      TEXT,
    ip_country      TEXT,
    ip_region       TEXT,
    ip_city         TEXT,
    user_agent      TEXT,
    referer         TEXT,
    accept_language TEXT,
    form_city       TEXT,
    detail          TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX registration_audit_events_tournament_created_idx
    ON registration_audit_events (tournament_id, created_at DESC);

CREATE INDEX registration_audit_events_player_idx
    ON registration_audit_events (player_id, created_at DESC);

CREATE INDEX registration_audit_events_ip_created_idx
    ON registration_audit_events (ip_address, created_at DESC);
