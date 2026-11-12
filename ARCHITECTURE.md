# TOURNAX — Architecture

A living reference for how the pieces fit together. `CLAUDE.md` has the rules and conventions;
this doc has the shape of the system. Update it when the shape changes.

## System overview

```
┌──────────────────┐        inserts rows         ┌──────────────────┐
│   apps/web        │ ───────────────────────────▶ │   bot_outbox      │
│   Next.js site     │                              │   (Supabase table)│
│   + admin panel     │ ◀─────────────────────────── │                    │
└────────┬──────────┘        reads/writes           └─────────┬──────────┘
         │                                                      │ polled by
         │ reads/writes                                        ▼
         ▼                                            ┌──────────────────┐
┌──────────────────┐                                  │   apps/bot         │
│  Supabase Postgres │ ◀──────────────────────────────│   Baileys WhatsApp │
│  (RLS on every table)│        writes results         │   always-on process│
└──────────────────┘                                  └──────────────────┘
         ▲
         │ imports (no I/O, pure functions)
┌──────────────────┐
│  packages/core      │  standings, fixtures, top scorers, `!r` command parsing
└──────────────────┘
```

The web app and the bot **never call each other directly**. The web app writes a row to
`bot_outbox`; the bot polls that table and sends the WhatsApp message. This keeps the site fully
functional (admin entry + "Share to WhatsApp" link) even if the bot process is down.

All tournament math — standings, tiebreakers, top scorers, round-robin fixture generation, `!r`
score-command parsing — lives in `packages/core`, is pure (no I/O), and is unit tested. Both the
web app and the bot import it; neither reimplements it.

## Repo layout

```
apps/web        Next.js 16 (App Router, TypeScript): public site + admin panel
apps/bot        Node + Baileys WhatsApp bot (always-on process)
packages/core   Pure TS tournament logic shared by web and bot. No I/O. Fully tested.
supabase/       SQL migrations (Postgres on Supabase)
design/         landing.html — the original static design draft (no longer the color source of truth)
docs/           roadmap.md (phases/checklist), whatsapp-bot.md (bot command spec)
.claude/skills  project-scoped Claude Code skills (design/review tooling, checked in on purpose)
```

## Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Web | Next.js 16, App Router, TypeScript strict | Server components by default, server actions for mutations |
| Styling | Plain CSS custom properties (no Tailwind/CSS-in-JS) | `tokens.css` + `globals.css`, see Design system below |
| Database | Supabase Postgres | RLS on every table; service role key only on the server/bot, never shipped to the browser |
| Bot | Node + Baileys | WhatsApp Web protocol client; persists login in `apps/bot/auth/` (gitignored) |
| Shared logic | `packages/core`, plain TypeScript | `node:test` via `tsx`, no framework |
| Hosting (planned) | Vercel (web), Supabase (db), Railway or a small VM (bot) | All free-tier |

## Data model (Supabase, `supabase/migrations/0001_init.sql`)

```
players            — one row per WhatsApp number (identity = digits-only phone number)
tournaments         — a season; holds points_rule, knockout_qualifiers, deadlines
tournament_players  — join table; pending → approved per tournament
matchdays           — groups matches into rounds
matches             — homeId/awayId, scores, status
result_claims        — a reported score awaiting the opponent's confirmation
bot_outbox           — outbound WhatsApp messages the bot has not sent yet
audit_log            — every admin override, append-only
```

Match status lifecycle (`packages/core/src/types.ts`):

```
scheduled → pending_confirmation → confirmed        (normal path: both players agree)
                                 → disputed → resolved  (👎 or 12h timeout → admin decides)
                        (admin can also directly set) → forfeit
```

**Only `confirmed`, `resolved` and `forfeit` matches count** toward standings/top scorers.
Standings are **always computed from `matches`**, never stored — `computeStandings()` and
`topScorers()` in `packages/core` are the only place this math happens.

Identity is the WhatsApp number (digits only). Phone numbers are never exposed publicly — reads
go through a `public_players` view (see the migration) that strips them.

## Frontend architecture (`apps/web`)

- **Pages** (all in `app/`): `/` (landing), `/table` (standings + top scorers), `/fixtures`
  (matchday-by-matchday schedule and scores), `/players/[id]` (profile + match history).
- **Data today**: `lib/seed.ts` — a local, typed seed dataset shaped exactly like the real
  Supabase rows (`Match`, `PlayerId`, etc. from `@tournax/core`), run through the same
  `computeStandings`/`topScorers` functions the real backend will use. Swapping `seed.ts` for a
  Supabase query is the only change `/table`, `/fixtures` and `/players/[id]` should need in
  Phase 2 — they already don't know or care where the data comes from.
- **Components** (`components/*.tsx`): one component per landing section, in page order —
  `hero`, `matchday-section` (mode-driven: live matchday fixtures or a last-season recap, derived
  from the tournament's own status, no dedicated DB flag needed), `format`, `quote-divider`
  (a single banter-line section divider), `standings-section`, `players-carousel`, `cta`, `footer`,
  plus header/menu/modal chrome. Server components by default; nothing is a client component except
  what truly needs interactivity.
- **`site-interactions.tsx`** (~540 lines) is the one client component that owns *all* imperative,
  vanilla-JS-style behavior in one place, ported close to 1:1 from the original static design so
  the motion/timing stays exactly as designed:
  - Lenis smooth scroll (lazy-loaded, degrades to native scroll if it fails to load)
  - A tiny spring-physics engine driving the reveal-on-scroll animations (`data-reveal`,
    `data-split`), run off one shared `requestAnimationFrame` loop (`ticks` set)
  - The intro loader (with a rotating status line), the fullscreen menu, the registration modal,
    the players carousel, the header's scrolled-state and active-nav-link spy
  - Every effect is written to be inert with JS disabled or `prefers-reduced-motion: reduce` set —
    content is visible by default; motion is opt-in once a script confirms it can run
- **Icons**: a single inline `<svg><defs>` sprite (`icon-sprite.tsx`) holds the brand gradient and
  reusable `<symbol>`s (including the emblem mark used as the wordmark and the loader mark); the
  hero's trophy is a plain `next/image` (`public/hero/trophy.png`), not an SVG symbol; one-off
  icons are inline path strings via the `Icon` component.

## Design system

Brand v2 ("athletic-poster"): deep purple-black, mustard yellow + violet accents, wine-magenta tag
chips, oversized uppercase display type, spring reveals. Full detail and the exact hex/oklch values
are in `apps/web/app/tokens.css` (brand tokens) — that file plus `globals.css`'s "legacy aliases"
block are the single source of truth for every color and font in the app; nothing past that block
uses a literal value.

- **Display/headline font**: Furore (`apps/web/app/fonts/furore/Furore.otf`), a caps-only
  industrial sans. Loaded via `next/font/local`, exposed as `--font-headline`. **License note**:
  it's a freeware release by Jovanny Lemonad with no formal license grant (see
  `apps/web/app/fonts/furore/LICENSE.txt`) — fine for this non-commercial community tournament,
  but revisit if TOURNAX ever needs airtight commercial licensing.
- **Body/UI font**: Onest (Google Font via `next/font/google`).
- **Status color is deliberately separate from the brand accent**: `--color-success` (green) is
  used only for "confirmed"/"open" states; the brand's mustard yellow is never reused for status,
  so the two meanings don't collide visually.
- A dedicated `landing-page-design` Claude Code skill (checked into `.claude/skills/`) carries the
  spacing/states/accessibility/copy rules; brand choices above override that skill's defaults
  where they conflict (e.g. Onest instead of Geist, uppercase headings).

## What's next (Phase 2 — backend)

See `docs/roadmap.md` for the full checklist. In short, the site currently runs entirely on
`lib/seed.ts`; the next phase wires up the real backend:

1. Run `supabase/migrations/0001_init.sql` against a real Supabase project.
2. Registration form → writes to `players` + `tournament_players` (pending admin approval).
3. Admin auth (Supabase magic link, admins only) + an admin panel: approve players, generate
   league fixtures, enter/override results, resolve the dispute queue — every admin write lands in
   `audit_log`.
4. Swap `lib/seed.ts` reads for real Supabase queries in `/table`, `/fixtures`, `/players/[id]`.
   `computeStandings`/`topScorers` stay exactly as they are — only the data source changes.
5. Then Phase 3 (the WhatsApp bot itself) and Phase 4 (knockouts, bracket, OG images, player login).

## Open decisions (ask the organiser)

- Top scorer: participant's total goals (current assumption) or in-game footballer goals?
- Knockouts: resolved — top 8 (`knockout_qualifiers`, default 8), single matches, quarter-finals →
  semi-finals → final.
- What's the "something big" surprise, and should a section stay hidden until it's announced?
- Real tournament dates and slot count are still placeholders on the landing page. Entry is
  confirmed free — no entry fee, no prize pool; the tournament doesn't generate money and the
  public site makes no mention of prize money.
