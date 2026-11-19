ALTER TABLE sponsors
    ADD COLUMN IF NOT EXISTS instagram_url TEXT,
    ADD COLUMN IF NOT EXISTS telegram_url TEXT,
    ADD COLUMN IF NOT EXISTS product_image_urls JSONB NOT NULL DEFAULT '[]'::jsonb;