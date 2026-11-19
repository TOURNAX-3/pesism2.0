ALTER TABLE matches
  ADD COLUMN IF NOT EXISTS highlight_video_url_1 text,
  ADD COLUMN IF NOT EXISTS highlight_video_url_2 text;

COMMENT ON COLUMN matches.highlight_video_url_1 IS 'Public HTTPS URL to an mp4 or stream for match highlight reel 1';
COMMENT ON COLUMN matches.highlight_video_url_2 IS 'Optional second highlight URL for the same fixture';