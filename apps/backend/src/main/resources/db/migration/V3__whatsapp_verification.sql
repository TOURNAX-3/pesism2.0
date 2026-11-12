-- Prove WhatsApp ownership before a registration counts toward slots / approval.

ALTER TABLE players
    ADD COLUMN IF NOT EXISTS wa_verified_at TIMESTAMPTZ;

CREATE TABLE wa_verification_challenges (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id    UUID NOT NULL REFERENCES players (id) ON DELETE CASCADE,
    code_hash    TEXT NOT NULL,
    expires_at   TIMESTAMPTZ NOT NULL,
    attempt_count INT NOT NULL DEFAULT 0,
    last_sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX wa_verification_challenges_player_idx ON wa_verification_challenges (player_id, created_at DESC);

-- Messages for the WhatsApp bot to deliver (OTP and future notifications).
CREATE TABLE bot_outbox (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_wa   TEXT NOT NULL,
    body           TEXT NOT NULL,
    sent_at        TIMESTAMPTZ,
    last_error     TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX bot_outbox_pending_idx ON bot_outbox (created_at) WHERE sent_at IS NULL;
