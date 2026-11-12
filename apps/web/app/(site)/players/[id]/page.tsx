import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { computeStandings } from '@tournax/core';
import { avatarSvg } from '@/lib/avatar';
import { fetchSeasonCompetition } from '@/lib/season-competition';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const competition = await fetchSeasonCompetition();
  const player = competition?.players.find((p) => p.id === id);
  return { title: player ? `${player.name} · TOURNAX Season 3` : 'Player · TOURNAX Season 3' };
}

export default async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const competition = await fetchSeasonCompetition();
  if (!competition) notFound();
  const player = competition.players.find((p) => p.id === id);
  if (!player) notFound();

  const table = computeStandings(
    competition.players.map((p) => p.id),
    competition.matches,
    competition.points,
  );
  const rank = table.findIndex((row) => row.playerId === player.id);
  const row = rank >= 0 ? table[rank] : null;
  const matches = competition.matches
    .filter((m) => m.homeId === player.id || m.awayId === player.id)
    .sort((a, b) => a.matchday - b.matchday);

  const idx = competition.players.findIndex((p) => p.id === player.id);

  return (
    <section className="section players" style={{ paddingTop: 'calc(var(--header-h) + 2rem)' }}>
      <div className="container" style={{ display: 'grid', gap: '2.5rem' }}>
        <div className="player-head">
          <div className="player">
            <div className="player__media">
              {player.avatarUrl ? (
                <Image src={player.avatarUrl} alt="" width={400} height={420} className="player__photo" unoptimized />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: avatarSvg(player.name, idx) }} />
              )}
            </div>
          </div>
          <div>
            <h1 className="h2">{player.name}</h1>
            <p className="lead" style={{ marginTop: '0.75rem' }}>
              {rank >= 0 ? (
                <>
                  Table position #{rank + 1}, playing as @{player.gamingUsername}
                  {player.city ? ` from ${player.city}` : ''}.
                </>
              ) : (
                <>@{player.gamingUsername}{player.city ? ` · ${player.city}` : ''}.</>
              )}
            </p>
          </div>
        </div>

        {row ? (
          <div className="panel">
            <div className="panel__head">
              <h3>Season stats</h3>
            </div>
            <dl className="player__stats" style={{ padding: '1.5rem' }}>
              <div>
                <dt>Played</dt>
                <dd>{row.played}</dd>
              </div>
              <div>
                <dt>Wins</dt>
                <dd>{row.won}</dd>
              </div>
              <div>
                <dt>Points</dt>
                <dd>{row.points}</dd>
              </div>
            </dl>
          </div>
        ) : null}

        {matches.length > 0 ? (
          <div className="panel">
            <div className="panel__head">
              <h3>Results</h3>
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: '1rem 1.75rem 1.5rem' }}>
              {matches.map((m) => {
                const home = m.homeId === player.id;
                const gf = home ? m.homeGoals : m.awayGoals;
                const ga = home ? m.awayGoals : m.homeGoals;
                const names = competition.playerNames;
                const oppId = home ? m.awayId : m.homeId;
                return (
                  <li key={m.id} style={{ padding: '0.5rem 0', borderTop: '1px solid var(--line)' }}>
                    MD{m.matchday}: {gf ?? '–'}–{ga ?? '–'} vs {names[oppId] ?? oppId}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
