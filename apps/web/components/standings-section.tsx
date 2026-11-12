import { fetchSeasonCompetition } from '@/lib/season-competition';
import { SplitHeading } from './split-heading';
import { StandingsPanels } from './standings-panels';

export async function StandingsSection() {
  const competition = await fetchSeasonCompetition();

  return (
    <section className="section standings" id="standings" aria-labelledby="standings-title">
      <div className="container">
        <div className="section__head section__head--split">
          <SplitHeading id="standings-title" lines={['The table', 'doesn’t lie.']} />
          <p className="lead" data-reveal>
            Updated after every confirmed result. Both players agree, or the admin settles it.
          </p>
        </div>

        <StandingsPanels competition={competition} scorersLimit={5} showFootLink />
      </div>
    </section>
  );
}
