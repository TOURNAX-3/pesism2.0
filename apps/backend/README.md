# TournaX API (Spring Boot)

**Gradle project — do not use `mvn spring-boot:run`.** Use:

```powershell
cd apps/backend
.\gradlew.bat bootRun
```

Or from repo root: `npm run api`

`bootRun` loads `apps/backend/.env` automatically.

## Stack

- Java 21, Spring Boot 3.4
- PostgreSQL (Supabase) + Flyway
- Layered packages: `domain` → `application` → `web`

## Database (Supabase)

Set `SUPABASE_DB_PASSWORD` in `apps/backend/.env` (database password from Supabase dashboard, **not** `sb_secret_`).

See [docs/supabase-database.md](../../docs/supabase-database.md).

Health: `GET http://localhost:8080/api/v1/health`

## Registration API

| Method | Path |
|--------|------|
| `GET` | `/api/v1/seasons/{season}/registration` |
| `POST` | `/api/v1/seasons/{season}/registration` |

Duplicates: unique phone, email, gaming name; admin removes junk at `/admin/players`.
