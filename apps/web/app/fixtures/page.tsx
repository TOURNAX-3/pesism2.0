import type { Metadata } from 'next';
import { getPlayer, MATCHES } from '@/lib/seed';

export const metadata: Metadata = { title: 'Fixtures · TOURNAX Season 3' };

function groupByMatchday() {
  const days = new Map<number, typeof MATCHES>();
  for (const match of MATCHES) {
    const list = days.get(match.matchday) ?? [];
    list.push(match);
    days.set(match.matchday, list);
  }
  return [...days.entries()].sort((a, b) => a[0] - b[0]);
}

export default function FixturesPage() {
  const matchdays = groupByMatchday();

  return (
    <section className="section" style={{ paddingTop: 'calc(var(--header-h) + 2rem)' }}>
      <div className="container">
        <div className="section__head">
          <h2 className="h2">Who plays who.</h2>
          <p className="lead">Every matchday of the league stage, in order. Scores appear once both players confirm a result.</p>
        </div>

        <div className="fixtures">
          {matchdays.map(([matchday, matches]) => (
            <div className="panel fixture-day" key={matchday}>
              <div className="panel__head">
                <h3>Matchday {matchday}</h3>
                <span className="chip">{matches[0]?.status === 'scheduled' ? 'Upcoming' : 'Played'}</span>
              </div>
              <ul className="fixture-list">
                {matches.map(match => {
                  const home = getPlayer(match.homeId);
                  const away = getPlayer(match.awayId);
                  const played = match.homeGoals !== null && match.awayGoals !== null;
                  return (
                    <li className="fixture-row" key={match.id}>
                      <span className="fixture-row__side fixture-row__side--home">
                        <a href={`/players/${match.homeId}`}>{home?.name ?? match.homeId}</a>
                      </span>
                      <span className="fixture-row__score">
                        {played ? `${match.homeGoals} – ${match.awayGoals}` : 'vs'}
                      </span>
                      <span className="fixture-row__side">
                        <a href={`/players/${match.awayId}`}>{away?.name ?? match.awayId}</a>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
