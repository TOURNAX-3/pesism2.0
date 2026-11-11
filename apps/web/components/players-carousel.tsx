import { computeStandings } from '@tournax/core';
import { MATCHES, PLAYER_IDS, PLAYERS } from '@/lib/seed';
import { avatarSvg } from '@/lib/avatar';
import { SplitHeading } from './split-heading';
import { UseIcon } from './icon';

export function PlayersCarousel() {
  const table = computeStandings(PLAYER_IDS, MATCHES);

  return (
    <section className="section players" id="players" aria-labelledby="players-title">
      <div className="container">
        <div className="section__head section__head--split">
          <SplitHeading id="players-title" lines={['Built to', 'compete.']} />
          <p className="lead" data-reveal>Meet the players this season. Rankings update after every matchday.</p>
        </div>

        <div className="carousel" data-reveal aria-roledescription="carousel" aria-label="Featured players">
          <div className="carousel__viewport">
            <div className="carousel__track" aria-live="off">
              {table.map((row, i) => {
                const player = PLAYERS.find(p => p.id === row.playerId);
                if (!player) return null;
                const rate = row.played > 0 ? Math.round((row.won / row.played) * 100) : 0;
                return (
                  <article className="player" role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${table.length}`} key={player.id}>
                    <div className="player__media">
                      <div dangerouslySetInnerHTML={{ __html: avatarSvg(player.name, i) }} />
                      <span className="player__rank">
                        #<span>{i + 1}</span>
                      </span>
                      <span className="player__city">
                        <UseIcon id="i-pin" />
                        {player.city}, IN
                      </span>
                    </div>
                    <div className="player__body">
                      <div>
                        <h3 className="player__name"><a href={`/players/${player.id}`}>{player.name}</a></h3>
                        <p className="player__tag">@{player.tag}</p>
                      </div>
                      <dl className="player__stats">
                        <div><dt>Wins</dt><dd>{row.won}</dd></div>
                        <div><dt>Played</dt><dd>{row.played}</dd></div>
                        <div><dt>Win %</dt><dd>{rate}</dd></div>
                      </dl>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
          <div className="carousel__controls">
            <div className="dots" role="group" aria-label="Choose slide"></div>
            <div className="arrows">
              <button className="arrow-btn arrow-btn--prev" type="button" aria-label="Previous players">
                <UseIcon id="i-arrow-l" />
              </button>
              <button className="arrow-btn arrow-btn--next" type="button" aria-label="Next players">
                <UseIcon id="i-arrow-r" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
