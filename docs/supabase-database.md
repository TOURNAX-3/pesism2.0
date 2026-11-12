# Supabase database for TournaX

Registration and admin data live in **Supabase Postgres**. The Spring API is the write path; Flyway applies the schema.

## Credentials (two different things)

| What you have | Used for |
|---------------|----------|
| `sb_publishable_…` / `sb_secret_…` | Supabase **HTTP API** (Next.js `@supabase/supabase-js`) |
| **Database password** | JDBC from Spring (`SUPABASE_DB_PASSWORD`) |

The `sb_secret_` key is **not** the database password.

## One-time setup

1. Supabase → **Project Settings → Database** → copy your **database password** (or reset it).
2. `apps/backend/.env`:
   ```env
   SUPABASE_PROJECT_REF=xjnovjmixytuxopzzrhd
   SUPABASE_DB_PASSWORD=your-db-password
   ADMIN_API_KEY=dev-admin-change-me
   ```
3. Start API (runs Flyway `V1`–`V5` on that database):
   ```bash
   cd apps/backend
   .\gradlew.bat bootRun
   ```
4. `apps/web/.env.local` — same `ADMIN_API_KEY`, `TOURNAX_API_URL=http://localhost:8080`, Supabase URL/keys (already set).

## ddl-auto

Keep **`spring.jpa.hibernate.ddl-auto=validate`**. Schema changes go in `apps/backend/src/main/resources/db/migration/` as new `V6__…sql` files. Do **not** use `update` with Flyway.

## Admin UI

- Login: http://localhost:3000/admin/login (`ADMIN_PASSWORD`, default `tournax-dev`)
- Console: http://localhost:3000/admin
