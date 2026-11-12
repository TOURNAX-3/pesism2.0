-- Registration proof via email (free SMTP / Resend). WhatsApp stays for the group bot later.

ALTER TABLE players
    ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMPTZ;

CREATE TABLE email_verification_challenges (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id     UUID NOT NULL REFERENCES players (id) ON DELETE CASCADE,
    code_hash     TEXT NOT NULL,
    expires_at    TIMESTAMPTZ NOT NULL,
    attempt_count INT NOT NULL DEFAULT 0,
    last_sent_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX email_verification_challenges_player_idx ON email_verification_challenges (player_id, created_at DESC);
