# TOURNAX

Website, admin panel and WhatsApp score bot for the TOURNAX eFootball tournament.

> Season 3 is on the horizon. Every win counts. Every goal matters. Every defeat will be remembered.

## Stack
- **Web**: Next.js + TypeScript (`apps/web`), deployed on Vercel
- **Database**: Supabase Postgres (`supabase/migrations`)
- **Bot**: Node + Baileys WhatsApp bot (`apps/bot`), always on host
- **Core**: shared tournament logic with tests (`packages/core`)

## Getting started
```bash
npm install
npm test        # core logic tests
npm run dev     # http://localhost:3000
```
The site (`/`, `/table`, `/fixtures`, `/players/[id]`) is a real Next.js app under `apps/web`.
`design/landing.html` is kept as the original static design reference only.

Copy `.env.example` to `apps/web/.env.local` and `apps/bot/.env` when you connect Supabase and the bot.

## Docs
- `CLAUDE.md`: project brief and rules (read by Claude Code)
- `ARCHITECTURE.md`: how the pieces fit together — data flow, data model, frontend structure, design system
- `docs/roadmap.md`: phases and checklist
- `docs/whatsapp-bot.md`: bot commands and confirmation flow

---
eFootball™ is a trademark of KONAMI. TOURNAX is an independent community tournament and is not affiliated with KONAMI.
