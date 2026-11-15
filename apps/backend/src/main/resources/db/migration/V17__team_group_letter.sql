ALTER TABLE tournament_players
  ADD COLUMN group_letter CHAR(1) CHECK (group_letter IN ('A', 'B'));
