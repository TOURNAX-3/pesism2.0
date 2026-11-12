import { fetchSeasonCompetition } from '@/lib/season-competition';
import { FixturesPanels } from './fixtures-panels';
import { SplitHeading } from './split-heading';

export async function FixturesSection() {
  const competition = await fetchSeasonCompetition();

  return (
    <section className="section fixtures-home" id="fixtures" aria-labelledby="fixtures-title">
      <div className="container">
        <div className="section__head section__head--split">
          <SplitHeading id="fixtures-title" lines={['Who plays', 'who.']} />
          <p className="lead" data-reveal>
            Official matchday sheets with deadlines. Unplayed games show as vs until a result is confirmed.
          </p>
        </div>

        <FixturesPanels competition={competition} />

        {competition && competition.matches.length > 0 ? (
          <p className="panel__foot" style={{ marginTop: '1.25rem' }}>
            <a href="/fixtures">Full fixtures page</a>
          </p>
        ) : null}
      </div>
    </section>
  );
}
