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
2. `apps/backend/.env` — paste **Session pooler** host from Supabase **Connect** (do not guess `aws-0` vs `aws-1`):
   ```env
   DATABASE_URL=jdbc:postgresql://PASTE_POOLER_HOST:5432/postgres?sslmode=require&prepareThreshold=0
   DATABASE_USER=postgres.YOUR_PROJECT_REF
   DATABASE_PASSWORD=your-db-password
   ADMIN_API_KEY=dev-admin-change-me
   ```
   Keep the password out of `DATABASE_URL` (special characters like `@` break JDBC URLs). Do **not** add `options=reference%3D…` when `DATABASE_USER` is already `postgres.<ref>` (that doubles the ref and breaks auth).
3. Start API (Flyway applies new migrations on startup). If you see **checksum mismatch** for a version already applied (e.g. after editing a migration file), run once: `.\gradlew.bat flywayRepair` in `apps/backend` (uses the same `.env` as `bootRun`).
   ```bash
   cd apps/backend
   .\gradlew.bat bootRun
   ```
4. `apps/web/.env.local` — same `ADMIN_API_KEY`, `TOURNAX_API_URL=http://localhost:8080`, Supabase URL/keys (already set).

## Railway (shared session pooler)

Railway is IPv4-only toward Supabase — use **Session pooler** from the Supabase **Connect** dialog, not the direct `db.<ref>.supabase.co` host.

| Variable | Rule |
|----------|------|
| `DATABASE_URL` | JDBC host only: `jdbc:postgresql://<pooler-host>:5432/postgres?sslmode=require&prepareThreshold=0` — `<pooler-host>` from Connect → Session pooler. |
| `DATABASE_USER` | **`postgres.<ref>`** (e.g. `postgres.xjnovjmixytuxopzzrhd`). Plain `postgres` causes **`ENOIDENTIFIER` no tenant identifier**. |
| `DATABASE_PASSWORD` | Database password (not `sb_secret_`). Keep out of the URL. |

**Local dev:** direct `db.<ref>.supabase.co` works only if your network can reach Supabase over **IPv6**. If `bootRun` fails with `SocketTimeoutException: Connect timed out`, use the same **session pooler** settings as Railway (`postgres.<ref>` user + `options=reference%3D<ref>` in the JDBC URL).

## ddl-auto

Keep **`spring.jpa.hibernate.ddl-auto=validate`**. Schema changes go in `apps/backend/src/main/resources/db/migration/` as new `V6__…sql` files. Do **not** use `update` with Flyway.

## `EMAXCONNSESSION` / max clients reached (pool_size: 15)

The **Session pooler** allows only a handful of simultaneous Postgres clients for the project (often **15** total, shared by API, dashboard SQL, bots, etc.).

**If `bootRun` fails with** `FATAL: (EMAXCONNSESSION) max clients reached in session mode`:

1. Stop **every** old API: close extra terminals, end `java.exe` for TournaX, wait ~30s.
2. On Windows: `netstat -ano | findstr :8080` → `Stop-Process -Id <pid> -Force` if something is still listening.
3. Do **not** run two `bootRun` at once. Avoid leaving Supabase SQL editor tabs running heavy sessions.
4. `apps/backend` uses **`DATABASE_POOL_SIZE` default 3** in `application.yml` (override only if you know you need more on a bigger plan).
5. Retry: `cd apps/backend` → `.\gradlew.bat bootRun` — Flyway should finish V22+ if pending.

For **high traffic production**, use Supabase **transaction** pooler on port **6543** where documented, or upgrade pool size — still keep Hikari small per instance.

## Admin UI

- Login: http://localhost:3000/admin/login (`ADMIN_PASSWORD`, default `tournax-dev`)
- Console: http://localhost:3000/admin
