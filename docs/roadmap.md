# Roadmap

Tick items off as they ship. Keep each phase shippable on its own.

## Phase 0: Scaffold ✅
- [x] npm workspaces monorepo (web, bot, core)
- [x] Core logic with tests: round robin fixtures, standings with tiebreakers, top scorers, `!r` parser
- [x] Supabase schema draft
- [x] Static landing design at `design/landing.html`

## Phase 1: Public site (static data)
- [x] Unslop `design/landing.html` into a TOURNAX-specific direction (WhatsApp result-flow hero moment, quieted glow/wash layer, removed invented sponsors/testimonials/teaser)
- [x] Port `design/landing.html` into Next.js components (split into sections under `apps/web/components`)
- [x] Keep Lenis smooth scroll, spring reveals, loader, menu overlay, modal (ported in `components/site-interactions.tsx`)
- [x] Pages: `/` landing, `/table`, `/fixtures`, `/players/[id]`
- [x] Data from a local `seed.ts` until Supabase is wired; standings/top scorers computed via `@tournax/core`, never hardcoded

## Phase 2: Supabase + admin
- [ ] Supabase project, run `supabase/migrations/0001_init.sql`
- [ ] Registration form writes to `players` + `tournament_players` (pending approval)
- [ ] Admin auth (start simple: Supabase magic link for admins only)
- [ ] Admin: create tournament, approve players, generate league fixtures, set deadlines
- [ ] Admin: enter / edit results, dispute queue, forfeit, audit log
- [ ] Public table and top scorers computed with `@tournax/core`

## Phase 3: WhatsApp bot
- [ ] Baileys login on the spare number, persist `auth/`
- [ ] `!r` → result_claims, reaction confirm / dispute, timeout to disputed
- [ ] `bot_outbox` sender
- [ ] Deploy to an always on host

## Phase 4: Knockouts and extras
- [ ] Knockout bracket from top N of the league, two legs optional, penalties
- [ ] Bracket page
- [ ] `!table`, `!fixtures`, deadline reminders
- [ ] Shareable result / table images (OG image route)
- [ ] Player login with WhatsApp OTP, "My matches" confirm / dispute buttons
- [ ] Season archive and hall of fame
