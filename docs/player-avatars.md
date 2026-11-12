# Player profile photos

Registration uploads go to **Supabase Storage**.

## One-time setup

1. Supabase dashboard → **Storage** → bucket **`player-avatars`** (public). The app will try to create this bucket automatically on first upload when using the secret key.
3. Ensure `apps/web/.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SECRET_KEY` (service role / secret key for server uploads)

The Next.js route `POST /api/register` uploads the file, then sends the public HTTPS URL to Spring (`players.avatar_url` via Flyway **V7**).

Restart **`gradlew bootRun`** after pulling V7 so Hibernate validates the new column.
