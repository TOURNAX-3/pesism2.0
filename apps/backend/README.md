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

Set `DATABASE_URL`, `DATABASE_USER`, and `DATABASE_PASSWORD` in `apps/backend/.env` (host-only JDBC URL; password separate).

See [docs/supabase-database.md](../../docs/supabase-database.md).

## Railway

**If you see “No start command detected” / Railpack / npm workspace:** the service root is wrong. Railway is building the **monorepo root** as Node. Fix:

1. Service → **Settings** → **Root Directory** → `apps/backend` → save and redeploy.
2. **Builder** should use the **`Dockerfile`** here (`railway.toml` sets this). Do not deploy only the repo root.
3. **Deploy → Start command**: leave **empty** so Docker `ENTRYPOINT` runs `java -jar /app/app.jar`. A custom command like `java -jar build/libs/*.jar` fails at runtime (no `build/` folder in the image) and prints the `java` help text.

Then:

1. **Variables → Raw Editor**: paste from [`railway.variables.example.json`](./railway.variables.example.json) and replace placeholders.
2. Config files: [`railway.toml`](./railway.toml), [`railway.json`](./railway.json), [`Dockerfile`](./Dockerfile).

Set **`DATABASE_URL`** (host only, no credentials), **`DATABASE_USER`** (`postgres.<ref>` on pooler), **`DATABASE_PASSWORD`**. See `railway.variables.example.json`.

`PORT` is injected by Railway automatically.

Health: `GET http://localhost:8080/api/v1/health`

## Registration API

| Method | Path |
|--------|------|
| `GET` | `/api/v1/seasons/{season}/registration` |
| `POST` | `/api/v1/seasons/{season}/registration` |
| `POST` | `/api/v1/seasons/{season}/registration/{playerId}/verify` |
| `POST` | `/api/v1/seasons/{season}/registration/{playerId}/verify/resend` |

Duplicates: unique phone, email, gaming name; admin removes junk at `/admin/players`. New sign-ups must pass **email OTP** before they count toward `max_players` or can be approved.

## Email OTP (Brevo → DB → register)

Flow:

1. **Send verification code** — form saved in `registration_intents` (OTP hash in Postgres). **No player row yet.**
2. User gets the 6-digit code in their inbox (Brevo SMTP).
3. **Verify & finish** — API checks the code against `registration_intents`, then creates `players` + `tournament_players`.

**Recommended — [Brevo](https://www.brevo.com)** (~300 emails/day on free tier). Copy [`.env.example`](./.env.example):

1. Brevo → **SMTP & API** → create **SMTP key** (`xsmtpsib-…`).
2. **Senders** → verify the from address (often your Brevo login email while testing).
3. `apps/backend/.env`:

```env
BREVO_SMTP_LOGIN=you@gmail.com
BREVO_SMTP_KEY=xsmtpsib-your-key
MAIL_FROM=TOURNAX <you@gmail.com>
```

4. Restart `npm run api`.

Alternatives: `RESEND_API_KEY` (HTTP) or `MAIL_ENABLED=true` with any SMTP host.  
Dev console-only: `MAIL_DELIVERY=console` and omit Brevo/Resend keys.
