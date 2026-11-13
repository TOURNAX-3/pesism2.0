import { fetchSeasonCompetition, type SeasonCompetition } from '@/lib/season-competition';
import { getAdminDashboard } from '@/lib/tournax-api';
import { isCountedMatch, matchdayChipsByNumber } from '@/lib/matchday-status';
import { computeLastSeasonRecap, type LastSeasonRecap } from '@/lib/last-season';
import { groupByMatchday } from './fixtures-panels';
import { SplitHeading } from './split-heading';
import { Button } from './ui/button';

/**
 * One section, two modes, driven by the tournament's own status (already modelled by the
 * backend's `tournament_status` enum — league/knockout reads as "live", everything else falls
 * back to the last-season recap). No new backend field needed.
 */
export async function MatchdaySection() {
  const competition = await fetchSeasonCompetition();

  let status: string | null = null;
  try {
    status = (await getAdminDashboard()).status;
  } catch {
    status = null;
  }

  const isLive = (status === 'league' || status === 'knockout') && !!competition;
  if (isLive && competition) {
    return <LiveMatchday competition={competition} />;
  }

  let recap: LastSeasonRecap | null = null;
  if (competition) {
    const previousSeason = competition.season - 1;
    const previous = previousSeason > 0 ? await fetchSeasonCompetition(previousSeason) : null;
    recap = previous ? computeLastSeasonRecap(previous) : null;
  }
  return <LastSeason recap={recap} />;
}

function LiveMatchday({ competition }: { competition: SeasonCompetition }) {
  const matchdays = groupByMatchday(competition);

  if (!matchdays.length) {
    return (
      <section className="section matchday" id="matchday" aria-labelledby="matchday-title">
        <div className="container">
          <div className="section__head">
            <p className="matchday__eyebrow">Matchday · Live</p>
            <SplitHeading id="matchday-title" lines={['No hiding', 'this week.']} />
          </div>
          <div className="panel" data-reveal>
            <div className="competition-soon">
              <p className="competition-soon__text">Nobody&rsquo;s played yet. Somebody&rsquo;s scared.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const chips = matchdayChipsByNumber(matchdays);
  const totalMatchdays = matchdays[matchdays.length - 1][0];
  const inProgress = matchdays.find(([md]) => chips.get(md)?.label === 'In progress');
  const [currentMatchday, matches] = inProgress ?? matchdays[matchdays.length - 1];
  const nobodyPlayed = matches.every((m) => !isCountedMatch(m));
  const allDone = matches.every(isCountedMatch);

  return (
    <section className="section matchday" id="matchday" aria-labelledby="matchday-title">
      <div className="container">
        <div className="section__head">
          <p className="matchday__eyebrow">
            Matchday {currentMatchday} of {totalMatchdays} · Live
          </p>
          <SplitHeading id="matchday-title" lines={['No hiding', 'this week.']} />
        </div>

        <div className="panel" data-reveal>
          <div className="panel__head">
            <h3>Matchday {currentMatchday}</h3>
            <span className="chip chip--live">Live</span>
          </div>
          <ul className="fixture-list matchday__list">
            {matches.map((match) => {
              const played = isCountedMatch(match);
              return (
                <li className="fixture-row" key={match.id}>
                  <span className="fixture-row__side fixture-row__side--home">
                    <a href={`/players/${match.homeId}`}>{competition.playerNames[match.homeId] ?? match.homeId}</a>
                  </span>
                  <span className="fixture-row__score">
                    {played ? `${match.homeGoals} – ${match.awayGoals}` : 'vs'}
                  </span>
                  <span className="fixture-row__side">
                    <a href={`/players/${match.awayId}`}>{competition.playerNames[match.awayId] ?? match.awayId}</a>
                  </span>
                </li>
              );
            })}
          </ul>
          {allDone ? (
            <p className="panel__foot">Matchday done. Table updated. Some of you should be quiet now.</p>
          ) : nobodyPlayed ? (
            <p className="panel__foot">Nobody&rsquo;s played yet. Somebody&rsquo;s scared.</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function LastSeason({ recap }: { recap: LastSeasonRecap | null }) {
  return (
    <section className="section matchday" id="matchday" aria-labelledby="matchday-title">
      <div className="container">
        <div className="section__head">
          <p className="matchday__eyebrow">PESISM 2.0 · Final whistle</p>
          <SplitHeading
            id="matchday-title"
            lines={recap ? [recap.champion, 'took the crown.'] : ['The crown is', 'still unclaimed.']}
          />
          {recap ? (
            <p className="lead" data-reveal>
              {recap.totalMatches} matches. {recap.totalGoals} goals. One name on the trophy. Next season, someone
              takes it off them.
            </p>
          ) : null}
        </div>

        {recap ? (
          <div className="matchday__stats" data-stagger>
            <div className="matchday__stat card" data-reveal>
              <span className="matchday__stat-label">Champion</span>
              <strong>{recap.champion}</strong>
            </div>
            <div className="matchday__stat card" data-reveal>
              <span className="matchday__stat-label">Top scorer</span>
              <strong>
                {recap.topScorer.name} · {recap.topScorer.goals}
              </strong>
            </div>
            <div className="matchday__stat card" data-reveal>
              <span className="matchday__stat-label">Biggest win</span>
              <strong>
                {recap.biggestWin.winner} {recap.biggestWin.winnerGoals}-{recap.biggestWin.loserGoals}{' '}
                {recap.biggestWin.loser}
              </strong>
            </div>
            <div className="matchday__stat card" data-reveal>
              <span className="matchday__stat-label">Most draws (we see you)</span>
              <strong>
                {recap.mostDraws.name} · {recap.mostDraws.draws}
              </strong>
            </div>
          </div>
        ) : null}

        <div className="matchday__cta" data-reveal>
          {recap ? <p>Think you can dethrone them?</p> : null}
          <Button className="btn btn--primary" type="button" data-open-register>
            Register for PESISM 2.0
          </Button>
        </div>
      </div>
    </section>
  );
}
