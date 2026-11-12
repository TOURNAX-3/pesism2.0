-- Season 3 registration: Thu 12 Nov 2026 11:00 PM IST → Sat 15 Nov 2026 8:00 PM IST
-- Cap is a soft limit for sign-ups; league fixtures are scheduled from the approved squad size.

UPDATE tournaments
SET
    status = 'registration',
    max_players = 16,
    registration_opens_at = TIMESTAMPTZ '2026-11-12 17:30:00+00',
    registration_closes_at = TIMESTAMPTZ '2026-11-15 14:30:00+00'
WHERE season = 3;
