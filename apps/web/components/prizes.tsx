import { Icon } from './icon';
import { SplitHeading } from './split-heading';

const MEDAL_GOLD =
  '<path d="M38 16h44v30a22 22 0 0 1-44 0z" fill="url(#g-gold)"/><path d="M38 24H24a14 14 0 0 0 16 20M82 24h14a14 14 0 0 1-16 20" fill="none" stroke="url(#g-gold)" stroke-width="6" stroke-linecap="round"/><path d="M54 66h12l2 18H52z" fill="url(#g-gold)"/><rect x="40" y="84" width="40" height="10" rx="3" fill="url(#g-gold)"/><rect x="34" y="94" width="52" height="12" rx="3" fill="#A86F12"/><path d="m60 26 3.2 6.6 7.2 1-5.2 5.1 1.2 7.2-6.4-3.4-6.4 3.4 1.2-7.2-5.2-5.1 7.2-1z" fill="#FFF7DA"/>';

function medalSilverBronze(ribbon: string, textFill: string, place: string) {
  return `<path d="M26 4h10l8 24H34zM54 4H44l-8 24h10z" fill="${ribbon}"/><circle cx="40" cy="50" r="24" fill="url(#g-${place === '2' ? 'silver' : 'bronze'})"/><circle cx="40" cy="50" r="17" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2"/><text x="40" y="57" text-anchor="middle" font-family="Onest,sans-serif" font-weight="800" font-size="20" fill="${textFill}">${place}</text>`;
}

const PRIZES = [
  { place: '1st place', title: 'Champion', amount: '₹25,000', modifier: 'prize--1', medal: MEDAL_GOLD, viewBox: '0 0 120 120' },
  { place: '2nd place', title: 'Runner-up', amount: '₹15,000', modifier: 'prize--2', medal: medalSilverBronze('#3B4560', '#3B4560', '2'), viewBox: '0 0 80 80' },
  { place: '3rd place', title: 'Third place', amount: '₹10,000', modifier: 'prize--3', medal: medalSilverBronze('#4A2A16', '#4A2A16', '3'), viewBox: '0 0 80 80' },
] as const;

export function Prizes() {
  return (
    <section className="section prizes" id="prizes" aria-labelledby="prizes-title">
      <div className="container" style={{ position: 'relative' }}>
        <div className="section__head">
          <SplitHeading id="prizes-title" lines={['Play to win.', 'Win to be remembered.']} />
        </div>

        <div className="pool" data-reveal>
          <p className="pool__amount" aria-label="₹50,000">₹50,000</p>
          <p className="pool__label">Total prize pool</p>
        </div>

        <div className="podium" data-stagger>
          {PRIZES.map(prize => (
            <article className={`prize ${prize.modifier}`} data-reveal key={prize.place}>
              <span className="prize__place">{prize.place}</span>
              <Icon className="prize__medal" viewBox={prize.viewBox} html={prize.medal} />
              <p className="prize__amount" aria-label={prize.amount}>{prize.amount}</p>
              <span className="prize__title">{prize.title}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
