# Deploy Next.js on Vercel (monorepo)

## Fix: `NEXT_OUTPUT_DIR_MISSING` — `.next` not found at /vercel/path0/.next

Vercel is using the **repository root**, but the Next app lives in **`apps/web`**, so the build writes `.next` under `apps/web/.next` while Vercel looks at the root.

### Required project settings

In Vercel → **Project → Settings → General**:

| Setting | Value |
|---------|--------|
| **Root Directory** | `apps/web` |
| **Framework Preset** | Next.js |
| **Build Command** | `npm run build` (default, or use `apps/web/vercel.json`) |
| **Install Command** | `cd ../.. && npm install` (default if `vercel.json` is present) |
| **Output Directory** | **Leave empty** (do not set `.next` manually) |

Save, then **Redeploy**.

### Environment variables (Production)

Set in Vercel → **Settings → Environment Variables** (see root `.env.example` / `apps/web/.env.example`):

- `TOURNAX_API_URL` — your Railway API URL (no trailing slash)
- `ADMIN_API_KEY` — same as Railway
- `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`

Railway API env vars are documented in `apps/backend/railway.variables.example.json`.

### What not to do

- Do not deploy the repo root as a Next.js app without **Root Directory = `apps/web`**.
- Do not set **Output Directory** to `.next` at the repo root when the app is in `apps/web`.
