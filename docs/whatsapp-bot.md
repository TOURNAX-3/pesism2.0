# WhatsApp bot spec

## Why unofficial
Meta's official Groups API only works for Official Business Accounts, caps groups at 8 people,
and can't join an existing group. So the bot uses **Baileys** (WhatsApp Web protocol) on a
**dedicated spare number** added to the group like a normal member.

Risk: against WhatsApp's terms, the number can be banned. Mitigations:
- never use a personal number
- keep volume low (a few messages a day), no bulk messaging
- the website must keep working without the bot (admin enters scores, "Share to WhatsApp" button)

## Commands (group only)
| Message | Who | Effect |
|---|---|---|
| `!r 3-1 @opponent` | player | Report a score, sender's goals first. Bot replies asking the opponent to react. |
| `!r 3-1 @home @away` | admin | Saves directly as `confirmed`, no reaction needed. |
| `!table` | anyone | Bot replies with top of the table (Phase 4). |
| `!fixtures` | anyone | Bot replies with the sender's open fixtures (Phase 4). |

The opponent comes from WhatsApp **mention metadata** (phone numbers), never from the text.
Numbers are matched to `players.wa_number` (digits only, see `normaliseNumber`).

## Confirmation flow (both players must agree)
1. Player posts `!r 3-1 @opp` → find the open match between them (current matchday first).
   - No open match → reply "No open match between you two."
   - Sender not registered → reply with the registration link.
2. Insert `result_claims` (status `pending`, `expires_at = now + CONFIRM_TIMEOUT_HOURS`),
   set the match to `pending_confirmation`, send the reply and store its id as `bot_message_id`.
3. Opponent reacts on the bot's reply:
   - 👍 → claim `confirmed`, copy score to the match, match `confirmed`, queue a result post in `bot_outbox`.
   - 👎 → claim `disputed`, match `disputed`, admin sees it in the dispute queue.
   - Reactions from anyone else are ignored.
4. No reaction before `expires_at` → claim `expired`, match `disputed`.
5. A new `!r` for the same match supersedes the older pending claim.

The website's "My matches" page offers the same Confirm / Dispute buttons as a backup.

## Posting
The bot polls `bot_outbox` (unsent rows) every few seconds and sends them, then sets `sent_at`.
The website never talks to WhatsApp directly, it only inserts outbox rows.

Result post format:
```
✅ FT · Matchday 4
Adhil 3–1 Arjun

📊 1. Adhil 10  2. Rahul 9  3. Sameer 8
```

## Hosting
Must be always on: Railway, Render, Fly.io or a small VM. Not Vercel / serverless.
The `apps/bot/auth/` folder holds the login session. It is gitignored and must persist between restarts.
