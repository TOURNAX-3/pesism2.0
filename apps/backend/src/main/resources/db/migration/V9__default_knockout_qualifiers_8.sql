ALTER TABLE tournaments ALTER COLUMN knockout_qualifiers SET DEFAULT 8;
UPDATE tournaments SET knockout_qualifiers = 8 WHERE knockout_qualifiers = 4;
