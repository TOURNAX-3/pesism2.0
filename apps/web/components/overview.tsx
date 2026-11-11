import { Icon, UseIcon } from './icon';
import { SplitHeading } from './split-heading';

const CARDS = [
  {
    title: 'Competitive matches',
    body: 'Real opponents, real pressure. No friendlies, every match is for points.',
    icon: '<path d="M6.5 8h11a4 4 0 0 1 3.9 4.9l-1 4.3a2.4 2.4 0 0 1-4.2 1l-1.6-2.2H9.4l-1.6 2.2a2.4 2.4 0 0 1-4.2-1l-1-4.3A4 4 0 0 1 6.5 8z"/><path d="M7.5 11v3M6 12.5h3"/><circle cx="16" cy="11.5" r=".9" fill="currentColor"/><circle cx="17.8" cy="13.4" r=".9" fill="currentColor"/>',
  },
  {
    title: 'League standings',
    body: 'A live table that updates after every confirmed result. Nowhere to hide.',
    icon: '<path d="M4 20V10m6 10V4m6 16v-7m4 7H2"/>',
  },
  {
    title: 'Official fixtures',
    body: 'Every matchday published with deadlines, so everyone knows who they face and when.',
    icon: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4m8-4v4M7.5 14h3m3 0h3m-9 3.5h3"/>',
  },
  {
    title: 'Top scorer leaderboard',
    body: 'Goals get counted too. The deadliest finisher of the season earns bragging rights.',
    icon: '<circle cx="12" cy="12" r="9"/><path d="m12 7.5 4 2.9-1.5 4.7h-5L8 10.4z"/>',
  },
] as const;

export function Overview() {
  return (
    <section className="section overview" id="overview" aria-labelledby="overview-title">
      <div className="container">
        <div className="section__head section__head--split">
          <SplitHeading id="overview-title" lines={['Every defeat will', 'be remembered.']} />
          <p className="lead" data-reveal>
            We&rsquo;re bringing the competition back, and this time things are about to get even more intense. Who&rsquo;s ready to step up, represent their skills and fight for the crown?
          </p>
        </div>

        <div className="overview__cards" data-stagger>
          {CARDS.map(card => (
            <article className="ov-card" data-reveal key={card.title}>
              <div className="ov-card__icon" aria-hidden="true">
                <Icon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" html={card.icon} />
              </div>
              <div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </div>
            </article>
          ))}
          <article className="ov-card" data-reveal>
            <div className="ov-card__icon" aria-hidden="true">
              <UseIcon id="i-trophy" viewBox="0 0 24 24" />
            </div>
            <div>
              <h3>Knockout rounds &amp; grand final</h3>
              <p>The top of the table goes through. Then it&rsquo;s win or go home, all the way to the crown.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
