import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchMatchDetail } from '@/lib/season-competition';
import { isCountedMatch } from '@/lib/matchday-status';
import { MATCH_STAT_ROWS } from '@/lib/match-stat-fields';
import { fallbackPaletteFor } from '@/lib/crest';
import { Side, footerLine, matchStatusChip } from '@/components/match-card';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const match = await fetchMatchDetail(id);
  if (!match) return { title: 'Match · TOURNAX Season 3' };
  return { title: `${match.home.teamName ?? match.home.playerName} vs ${match.away.teamName ?? match.away.playerName} · TOURNAX Season 3` };
}

export const dynamic = 'force-dynamic';

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const match = await fetchMatchDetail(id);
  if (!match) notFound();

  const hasScore = match.homeGoals != null && match.awayGoals != null;
  const counted = hasScore && isCountedMatch({ status: match.status, homeGoals: match.homeGoals, awayGoals: match.awayGoals });
  const homeWon = counted && (match.homeGoals as number) > (match.awayGoals as number);
  const awayWon = counted && (match.awayGoals as number) > (match.homeGoals as number);
  const chip = matchStatusChip(match.status);
  const foot = footerLine({ id: match.id, status: match.status, homeGoals: match.homeGoals, awayGoals: match.awayGoals, index: 0, deadline: null }, match.home, match.away);
  const statRows = MATCH_STAT_ROWS.filter(
    (row) => match.stats && (match.stats[row.key] != null || match.stats[row.awayKey] != null),
  );

  const tint = {
    '--home-tint': match.home.teamName ? `${fallbackPaletteFor(match.home.teamName)[0]}2e` : undefined,
    '--away-tint': match.away.teamName ? `${fallbackPaletteFor(match.away.teamName)[0]}2e` : undefined,
  } as CSSProperties;

  return (
    <section className="section" style={{ paddingTop: 'calc(var(--header-h) + 2rem)' }}>
      <div className="container" style={{ maxWidth: '44rem' }}>
        <div className="match-card card card--tint" style={tint} data-status={match.status}>
          <div className="card__head">
            <span className="match-card__label">Matchday {match.matchday}</span>
            <span className={`pill ${chip.className}`}>{chip.label}</span>
          </div>

          <div className="match-card__body">
            <Side side={match.home} muted={awayWon} role="home" size={88} />
            <div className="match-card__center">
              {hasScore ? (
                <span className="match-card__score" style={{ opacity: counted ? 1 : 0.7 }}>
                  <span style={{ color: awayWon ? 'var(--muted-2)' : 'var(--color-ink)' }}>{match.homeGoals}</span>
                  <span className="match-card__score-dash">&ndash;</span>
                  <span style={{ color: homeWon ? 'var(--muted-2)' : 'var(--color-ink)' }}>{match.awayGoals}</span>
                </span>
              ) : (
                <span className="match-card__vs">VS</span>
              )}
            </div>
            <Side side={match.away} muted={homeWon} role="away" size={88} />
          </div>

          {foot ? (
            <div className="card__foot">
              <span className="match-card__foot-text">{foot}</span>
            </div>
          ) : null}
        </div>

        {statRows.length ? (
          <div className="panel card--tint" style={{ ...tint, marginTop: '1.5rem' }}>
            <div className="panel__head">
              <h3>Match stats</h3>
            </div>
            <div className="stat-sheet">
              {statRows.map((row) => {
                const homeVal = match.stats?.[row.key] ?? null;
                const awayVal = match.stats?.[row.awayKey] ?? null;
                const homeLeads =
                  homeVal != null && awayVal != null && homeVal !== awayVal
                    ? row.lowerIsBetter
                      ? homeVal < awayVal
                      : homeVal > awayVal
                    : false;
                const awayLeads =
                  homeVal != null && awayVal != null && homeVal !== awayVal
                    ? row.lowerIsBetter
                      ? awayVal < homeVal
                      : awayVal > homeVal
                    : false;
                return (
                  <div className="stat-row" key={row.label}>
                    <span className="stat-row__value stat-row__value--home">
                      <span className={homeLeads ? 'stat-row__pill' : undefined}>{homeVal ?? '—'}</span>
                    </span>
                    <span className="stat-row__label">{row.label}</span>
                    <span className="stat-row__value stat-row__value--away">
                      <span className={awayLeads ? 'stat-row__pill' : undefined}>{awayVal ?? '—'}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
