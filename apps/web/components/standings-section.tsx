import { fetchSeasonCompetition } from '@/lib/season-competition';
import { SplitHeading } from './split-heading';
import { StandingsPanels } from './standings-panels';

export async function StandingsSection() {
  const competition = await fetchSeasonCompetition();

  return (
    <section className="section standings" id="standings" aria-labelledby="standings-title">
      <div className="container">
        <div className="section__head section__head--split">
          <SplitHeading id="standings-title" lines={['Talk is cheap.', 'The table isn’t.']} />
          <p className="lead" data-reveal>
            Results land here after they are confirmed. Until the season starts playing, you will see coming soon instead of placeholder numbers.
          </p>
        </div>

        <StandingsPanels competition={competition} scorersLimit={5} showFootLink />
      </div>
    </section>
  );
}
