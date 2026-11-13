-- Hold form data + OTP until email is verified; no player row until then.

CREATE TABLE registration_intents (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id   UUID NOT NULL REFERENCES tournaments (id) ON DELETE CASCADE,
    email           TEXT NOT NULL,
    wa_number       TEXT NOT NULL,
    payload         JSONB NOT NULL,
    code_hash       TEXT NOT NULL,
    expires_at      TIMESTAMPTZ NOT NULL,
    attempt_count   INT NOT NULL DEFAULT 0,
    last_sent_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX registration_intents_tournament_email_uq
    ON registration_intents (tournament_id, lower(email));

CREATE INDEX registration_intents_tournament_created_idx
    ON registration_intents (tournament_id, created_at DESC);
