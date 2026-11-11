-- TOURNAX initial schema (Supabase / Postgres)
-- Standings and top scorers are NOT stored: they are computed from matches
-- (packages/core computeStandings / topScorers), so they can never drift.

create extension if not exists "pgcrypto";

create type tournament_format as enum ('league', 'league_knockout', 'knockout');
create type tournament_status as enum ('draft', 'registration', 'league', 'knockout', 'finished');
create type match_stage as enum ('league', 'quarter_final', 'semi_final', 'third_place', 'final');
create type match_status as enum ('scheduled', 'pending_confirmation', 'confirmed', 'disputed', 'resolved', 'forfeit');
create type claim_status as enum ('pending', 'confirmed', 'disputed', 'expired', 'superseded');

-- People ---------------------------------------------------------------
create table players (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  wa_number     text not null unique,          -- digits only, e.g. 919876543210 (bot identity)
  efootball_id  text,
  city          text,
  platform      text,
  is_admin      boolean not null default false,
  created_at    timestamptz not null default now()
);

-- Tournaments ----------------------------------------------------------
create table tournaments (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,             -- e.g. 'TOURNAX Season 3'
  season             int not null,
  format             tournament_format not null default 'league_knockout',
  status             tournament_status not null default 'draft',
  points_win         int not null default 3,
  points_draw        int not null default 1,
  points_loss        int not null default 0,
  knockout_qualifiers int not null default 4,   -- top N from the league go through
  double_round       boolean not null default false,
  registration_closes_at timestamptz,
  created_at         timestamptz not null default now()
);

create table tournament_players (
  tournament_id uuid not null references tournaments(id) on delete cascade,
  player_id     uuid not null references players(id) on delete cascade,
  approved      boolean not null default false,
  seed          int,
  joined_at     timestamptz not null default now(),
  primary key (tournament_id, player_id)
);

create table matchdays (
  id            uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references tournaments(id) on delete cascade,
  number        int not null,
  stage         match_stage not null default 'league',
  opens_at      timestamptz,
  deadline      timestamptz,
  unique (tournament_id, number)
);

create table matches (
  id            uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references tournaments(id) on delete cascade,
  matchday_id   uuid not null references matchdays(id) on delete cascade,
  stage         match_stage not null default 'league',
  home_id       uuid not null references players(id),
  away_id       uuid not null references players(id),
  home_goals    int check (home_goals >= 0),
  away_goals    int check (away_goals >= 0),
  home_pens     int,
  away_pens     int,
  status        match_status not null default 'scheduled',
  updated_at    timestamptz not null default now(),
  check (home_id <> away_id)
);
create index on matches (tournament_id, status);
create index on matches (home_id);
create index on matches (away_id);

-- Result reporting -----------------------------------------------------
-- One row per "!r" report. Confirmation by the opponent (bot reaction or website button)
-- copies the score onto the match and sets it to confirmed.
create table result_claims (
  id              uuid primary key default gen_random_uuid(),
  match_id        uuid not null references matches(id) on delete cascade,
  reported_by     uuid not null references players(id),
  home_goals      int not null check (home_goals >= 0),
  away_goals      int not null check (away_goals >= 0),
  screenshot_url  text,
  status          claim_status not null default 'pending',
  confirmed_by    uuid references players(id),
  bot_message_id  text,                          -- WhatsApp id of the bot's "react to confirm" message
  expires_at      timestamptz,                   -- after this, goes to the admin dispute queue
  created_at      timestamptz not null default now()
);
create index on result_claims (bot_message_id);

-- Messages the bot should post to the group (results, table, reminders)
create table bot_outbox (
  id          uuid primary key default gen_random_uuid(),
  group_jid   text not null,
  body        text not null,
  image_url   text,
  sent_at     timestamptz,
  error       text,
  created_at  timestamptz not null default now()
);

-- Every admin change, for "who changed my result" questions
create table audit_log (
  id          bigserial primary key,
  actor_id    uuid references players(id),
  action      text not null,
  entity      text not null,
  entity_id   uuid,
  before      jsonb,
  after       jsonb,
  created_at  timestamptz not null default now()
);

-- Row level security ---------------------------------------------------
-- Public pages read tournaments, matches and player names.
-- All writes go through server actions / the bot using the service role key.
alter table players            enable row level security;
alter table tournaments        enable row level security;
alter table tournament_players enable row level security;
alter table matchdays          enable row level security;
alter table matches            enable row level security;
alter table result_claims      enable row level security;
alter table bot_outbox         enable row level security;
alter table audit_log          enable row level security;

create policy "public read tournaments" on tournaments for select using (true);
create policy "public read matchdays"   on matchdays   for select using (true);
create policy "public read matches"     on matches     for select using (true);
create policy "public read entrants"    on tournament_players for select using (approved);

-- Players are public by name only: expose a view without phone numbers.
create view public_players as select id, name, efootball_id, city from players;
grant select on public_players to anon, authenticated;
