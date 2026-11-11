import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { computeStandings } from '@tournax/core';
import { avatarSvg } from '@/lib/avatar';
import { getPlayer, MATCHES, PLAYER_IDS, PLAYERS } from '@/lib/seed';

export function generateStaticParams() {
  return PLAYERS.map(p => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const player = getPlayer(id);
  return { title: player ? `${player.name} · TOURNAX Season 3` : 'Player · TOURNAX Season 3' };
}

export default async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const player = getPlayer(id);
  if (!player) notFound();

  const table = computeStandings(PLAYER_IDS, MATCHES);
  const rank = table.findIndex(row => row.playerId === player.id);
  const row = table[rank];
  const matches = MATCHES.filter(m => m.homeId === player.id || m.awayId === player.id).sort((a, b) => a.matchday - b.matchday);

  return (
    <section className="section players" style={{ paddingTop: 'calc(var(--header-h) + 2rem)' }}>
      <div className="container" style={{ display: 'grid', gap: '2.5rem' }}>
        <div className="player-head">
          <div className="player">
            <div className="player__media" dangerouslySetInnerHTML={{ __html: avatarSvg(player.name, PLAYER_IDS.indexOf(player.id)) }} />
          </div>
          <div>
            <h1 className="h2">{player.name}</h1>
            <p className="lead" style={{ marginTop: '0.75rem' }}>
              Currently #{rank + 1} in the table, playing as @{player.tag} for {player.city} on {player.platform}.
            </p>
          </div>
        </div>

        {row && (
          <dl className="hero__info" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
            <div className="info card"><dt className="info__label">Played</dt><dd className="info__value">{row.played}</dd></div>
            <div className="info card"><dt className="info__label">Record</dt><dd className="info__value">{row.won}-{row.drawn}-{row.lost}</dd></div>
            <div className="info card"><dt className="info__label">Goal diff</dt><dd className="info__value">{row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}</dd></div>
            <div className="info card"><dt className="info__label">Points</dt><dd className="info__value">{row.points}</dd></div>
          </dl>
        )}

        <div className="panel">
          <div className="panel__head">
            <h3>Matches</h3>
            <span className="chip">Seed data</span>
          </div>
          <ul className="player-matches">
            {matches.map(match => {
              const opponentId = match.homeId === player.id ? match.awayId : match.homeId;
              const opponent = getPlayer(opponentId);
              const isHome = match.homeId === player.id;
              const played = match.homeGoals !== null && match.awayGoals !== null;
              return (
                <li className="player-match" key={match.id}>
                  <span className="player-match__who">Matchday {match.matchday} vs {opponent?.name ?? opponentId}</span>
                  <span className="player-match__score">
                    {played ? `${isHome ? match.homeGoals : match.awayGoals} – ${isHome ? match.awayGoals : match.homeGoals}` : 'Scheduled'}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
