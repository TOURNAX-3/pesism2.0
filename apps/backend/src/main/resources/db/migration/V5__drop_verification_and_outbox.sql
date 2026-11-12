DROP TABLE IF EXISTS email_verification_challenges;
DROP TABLE IF EXISTS wa_verification_challenges;
DROP TABLE IF EXISTS bot_outbox;

ALTER TABLE players DROP COLUMN IF EXISTS wa_verified_at;
ALTER TABLE players DROP COLUMN IF EXISTS email_verified_at;
