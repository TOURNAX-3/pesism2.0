/**
 * TOURNAX WhatsApp bot (skeleton).
 *
 * Runs on a spare WhatsApp number added to the tournament group. It:
 *   1. reads "!r 3-1 @opponent" from a player and records a pending result
 *   2. waits for the opponent to react 👍 (confirm) or 👎 (dispute)
 *   3. posts confirmed results and the table back to the group
 *
 * Uses Baileys, an unofficial WhatsApp Web client. This is against WhatsApp's terms:
 * use a dedicated SIM, never a personal number, and keep message volume low.
 * See docs/whatsapp-bot.md for the full spec. Everything marked TODO is Phase 3.
 */
import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys';
import { normaliseNumber, parseScoreCommand } from '@tournax/core';

const GROUP_JID = process.env.WA_GROUP_JID ?? '';

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState('auth'); // gitignored
  const sock = makeWASocket({ auth: state, printQRInTerminal: true });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'open') console.log('[bot] connected');
    if (connection === 'close') {
      const code = (lastDisconnect?.error as { output?: { statusCode?: number } } | undefined)?.output?.statusCode;
      if (code !== DisconnectReason.loggedOut) start();
      else console.error('[bot] logged out: delete apps/bot/auth and scan the QR again');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    for (const msg of messages) {
      const chat = msg.key.remoteJid ?? '';
      if (!chat.endsWith('@g.us')) continue;
      if (!GROUP_JID) { console.log('[bot] seen group', chat, '(set WA_GROUP_JID to this)'); continue; }
      if (chat !== GROUP_JID || msg.key.fromMe) continue;

      // Reactions confirm or dispute a pending result
      const reaction = msg.message?.reactionMessage;
      if (reaction) {
        // TODO: look up result_claims by bot_message_id = reaction.key?.id,
        // check the reactor is the opponent, then set status confirmed (👍) or disputed (👎).
        continue;
      }

      const text = msg.message?.conversation ?? msg.message?.extendedTextMessage?.text ?? '';
      const cmd = parseScoreCommand(text);
      if (!cmd) continue;

      const sender = normaliseNumber(msg.key.participant ?? '');
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid ?? [];
      const opponent = mentioned[0] ? normaliseNumber(mentioned[0]) : null;

      if (!opponent) {
        await sock.sendMessage(GROUP_JID, { text: 'Tag your opponent: !r 3-1 @name' }, { quoted: msg });
        continue;
      }

      // TODO: find the open match between sender and opponent in the current matchday,
      // insert a result_claim, and store this reply's message id for the reaction lookup.
      const reply = await sock.sendMessage(
        GROUP_JID,
        { text: `⚽ ${cmd.senderGoals}–${cmd.opponentGoals} reported. @${opponent} react 👍 to confirm or 👎 to dispute.`, mentions: [`${opponent}@s.whatsapp.net`] },
        { quoted: msg },
      );
      console.log('[bot] claim', { sender, opponent, ...cmd, botMessageId: reply?.key.id });
    }
  });

  // TODO: poll bot_outbox every few seconds and send pending messages (confirmed results, table, reminders).
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});
