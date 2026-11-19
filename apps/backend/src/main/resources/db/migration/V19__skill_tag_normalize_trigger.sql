-- Supabase table editor / raw SQL often uses title case (e.g. Legend). Store lowercase only.

CREATE OR REPLACE FUNCTION normalize_players_skill_tag()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.skill_tag IS NOT NULL THEN
        NEW.skill_tag := lower(trim(NEW.skill_tag));
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS players_skill_tag_normalize ON players;

CREATE TRIGGER players_skill_tag_normalize
    BEFORE INSERT OR UPDATE OF skill_tag ON players
    FOR EACH ROW
    EXECUTE FUNCTION normalize_players_skill_tag();